import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.application import Application

from app.services.matching import match_candidate_to_job


router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)


@router.post("/applications/{application_id}")
def match_application(
    application_id: int,
    db: Session = Depends(get_db)
):

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    job = (
        db.query(Job)
        .filter(Job.id == application.job_id)
        .first()
    )

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == application.candidate_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    if not job.requirements:
        raise HTTPException(
            status_code=400,
            detail="Job requirements have not been extracted"
        )

    if not candidate.skills:
        raise HTTPException(
            status_code=400,
            detail="Candidate profile has not been extracted"
        )

    job_requirements = json.loads(
        job.requirements
    )

    candidate_profile = {
        "name": candidate.name,
        "email": candidate.email,
        "skills": json.loads(candidate.skills or "[]"),
        "experience": json.loads(candidate.experience or "[]"),
        "projects": json.loads(candidate.projects or "[]")
    }

    result = match_candidate_to_job(
        job_requirements,
        candidate_profile
    )

    application.match_status = result.get(
        "match_status",
        "needs_validation"
    )

    db.commit()
    db.refresh(application)

    return {
        "application_id": application.id,
        "job_id": job.id,
        "candidate_id": candidate.id,
        "match_status": application.match_status,
        "matching": result
    }


@router.post("/jobs/{job_id}/run")
def run_job_matching(
    job_id: int,
    db: Session = Depends(get_db)
):
    # 1. Find the Job
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

    # 2. Check whether job.requirements exists
    if not job.requirements:
        raise HTTPException(
            status_code=400,
            detail="Job requirements have not been extracted"
        )

    # 3. Parse job.requirements
    try:
        job_requirements = json.loads(job.requirements)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid job requirements format"
        )

    # 4. Find all Applications belonging to this job
    applications = (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .all()
    )

    # 5. If there are no applications, return early
    if not applications:
        return {
            "message": "No candidates found for this job",
            "job_id": job_id,
            "total_candidates": 0,
            "results": []
        }

    results = []
    processed = 0
    skipped = 0
    failed = 0

    # 6. For every Application
    for application in applications:
        candidate = (
            db.query(Candidate)
            .filter(Candidate.id == application.candidate_id)
            .first()
        )

        # Check candidate exists
        if not candidate:
            results.append({
                "application_id": application.id,
                "candidate_id": application.candidate_id,
                "status": "skipped",
                "reason": "Candidate not found"
            })
            skipped += 1
            continue

        # 7. Check if candidate.skills is empty/null
        if not candidate.skills or not candidate.skills.strip():
            results.append({
                "application_id": application.id,
                "candidate_id": candidate.id,
                "status": "skipped",
                "reason": "Candidate profile has not been extracted"
            })
            skipped += 1
            continue

        # 8-11. Build profile, call matching service, update application
        try:
            candidate_profile = {
                "name": candidate.name,
                "email": candidate.email,
                "skills": json.loads(candidate.skills or "[]"),
                "experience": json.loads(candidate.experience or "[]"),
                "projects": json.loads(candidate.projects or "[]")
            }

            # 9. Call existing matching service
            result = match_candidate_to_job(
                job_requirements,
                candidate_profile
            )

            # 10. Save match_status
            application.match_status = result.get(
                "match_status",
                "needs_validation"
            )

            # 11. Add to results
            results.append({
                "application_id": application.id,
                "candidate_id": candidate.id,
                "status": "matched",
                "match_status": application.match_status,
                "matching": result
            })
            processed += 1

        except Exception as e:
            # 12. Handle per-candidate error without exposing secrets
            err_msg = str(e)
            try:
                from app.config import settings
                if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in err_msg:
                    err_msg = err_msg.replace(settings.GEMINI_API_KEY, "[REDACTED]")
            except Exception:
                pass

            results.append({
                "application_id": application.id,
                "candidate_id": candidate.id,
                "status": "error",
                "reason": f"Matching failed: {err_msg}"
            })
            failed += 1
            continue

    # 13. Commit successful database updates
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database commit failed"
        )

    # FINAL RESPONSE FORMAT
    return {
        "message": "Matching completed",
        "job_id": job_id,
        "total_candidates": len(applications),
        "processed": processed,
        "skipped": skipped,
        "failed": failed,
        "results": results
    }