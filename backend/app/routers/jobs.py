import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db

from app.models.job import Job
from app.models.candidate import Candidate
from app.models.application import Application

from app.services.extraction import extract_job_requirements
router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


class JobCreate(BaseModel):
    title: str
    description: str


@router.post("/")
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db)
):

    job = Job(
        title=job_data.title,
        description=job_data.description
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return {
        "message": "Job created successfully",
        "job_id": job.id
    }


@router.get("/")
def get_jobs(db: Session = Depends(get_db)):

    return db.query(Job).all()


@router.post("/{job_id}/extract")
def extract_requirements(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    try:

        result = extract_job_requirements(
            job.description
        )

        job.requirements = json.dumps(result)

        db.commit()
        db.refresh(job)

        return {
            "message": "Job requirements extracted",
            "job_id": job.id,
            "requirements": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/{job_id}/dashboard")
def get_job_dashboard(
    job_id: int,
    db: Session = Depends(get_db)
):
    # Find job
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

    # Get applications for this job
    applications = (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .all()
    )

    candidates = []

    matched = 0
    unmatched = 0
    needs_validation = 0
    pending = 0

    for application in applications:

        candidate = (
            db.query(Candidate)
            .filter(
                Candidate.id == application.candidate_id
            )
            .first()
        )

        if not candidate:
            continue

        # Count AI match statuses
        if application.match_status == "matched":
            matched += 1

        elif application.match_status == "unmatched":
            unmatched += 1

        elif application.match_status == "needs_validation":
            needs_validation += 1

        else:
            pending += 1

        candidates.append({
            "application_id": application.id,
            "candidate_id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "match_status": application.match_status,
            "pipeline_status": application.pipeline_status
        })

    return {
        "job": {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements
        },

        "stats": {
            "total": len(candidates),
            "matched": matched,
            "unmatched": unmatched,
            "needs_validation": needs_validation,
            "pending": pending
        },

        "candidates": candidates
    }