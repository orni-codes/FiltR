import os
import json

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException
)

from sqlalchemy.orm import Session
from pypdf import PdfReader

from app.database import get_db
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.application import Application

from app.services.extraction import extract_candidate_profile


router = APIRouter(
    tags=["Candidates"]
)


# =========================================================
# 1. UPLOAD CANDIDATE RESUME FOR A SPECIFIC JOB
# =========================================================

@router.post("/jobs/{job_id}/candidates/upload")
async def upload_candidate_for_job(
    job_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Check whether the job exists
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Only PDF resumes are supported
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported"
        )

    # Read uploaded file
    contents = await file.read()

    temp_path = f"temp_{file.filename}"

    try:

        # Save temporarily
        with open(temp_path, "wb") as f:
            f.write(contents)

        # Read PDF
        reader = PdfReader(temp_path)

        resume_text = ""

        for page in reader.pages:

            text = page.extract_text()

            if text:
                resume_text += text + "\n"

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Could not read PDF: {str(e)}"
        )

    finally:

        # Delete temporary PDF
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # Make sure text was extracted
    if not resume_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Could not extract text from resume"
        )

    # -----------------------------------------------------
    # Create candidate
    # -----------------------------------------------------

    candidate = Candidate(
        resume_text=resume_text
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    # -----------------------------------------------------
    # Create application
    #
    # This connects THIS candidate to THIS job.
    # -----------------------------------------------------

    application = Application(
        job_id=job_id,
        candidate_id=candidate.id,
        match_status="pending",
        pipeline_status="screening"
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Candidate added to job successfully",
        "job_id": job_id,
        "candidate_id": candidate.id,
        "application_id": application.id,
        "filename": file.filename,
        "text_length": len(resume_text)
    }


# =========================================================
# 2. GET ALL CANDIDATES FOR A SPECIFIC JOB
# =========================================================

@router.get("/jobs/{job_id}/candidates")
def get_job_candidates(
    job_id: int,
    db: Session = Depends(get_db)
):

    # Check whether job exists
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Get applications belonging ONLY to this job
    applications = (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .all()
    )

    candidates = []

    for application in applications:

        candidate = (
            db.query(Candidate)
            .filter(
                Candidate.id == application.candidate_id
            )
            .first()
        )

        if candidate:

            candidates.append({
                "application_id": application.id,
                "candidate_id": candidate.id,
                "name": candidate.name,
                "email": candidate.email,
                "match_status": application.match_status,
                "pipeline_status": application.pipeline_status
            })

    return {
        "job_id": job_id,
        "candidates": candidates
    }


# =========================================================
# 3. EXTRACT CANDIDATE PROFILE USING GEMINI
# =========================================================

@router.post("/candidates/{candidate_id}/extract")
def extract_candidate(
    candidate_id: int,
    db: Session = Depends(get_db)
):

    # Find candidate
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    # Make sure resume exists
    if not candidate.resume_text:

        raise HTTPException(
            status_code=400,
            detail="Candidate has no resume text"
        )

    try:

        # Send resume to Gemini
        result = extract_candidate_profile(
            candidate.resume_text
        )

        # Save extracted information
        candidate.name = result.get("name")
        candidate.email = result.get("email")

        candidate.skills = json.dumps(
            result.get("skills", [])
        )

        candidate.experience = json.dumps(
            result.get("experience", [])
        )

        candidate.projects = json.dumps(
            result.get("projects", [])
        )

        db.commit()
        db.refresh(candidate)

        return {
            "message": "Candidate profile extracted",
            "candidate_id": candidate.id,
            "profile": result
        }

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Candidate extraction failed: {str(e)}"
        )