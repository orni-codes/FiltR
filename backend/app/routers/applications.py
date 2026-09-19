from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.application import Application


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


ALLOWED_PIPELINE_STATUSES = {
    "screening",
    "shortlisted",
    "interview",
    "interview_completed",
    "review",
    "selected",
    "rejected"
}


class PipelineStatusUpdate(BaseModel):
    pipeline_status: str


@router.patch("/{application_id}/status")
def update_pipeline_status(
    application_id: int,
    status_update: PipelineStatusUpdate,
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

    if status_update.pipeline_status not in ALLOWED_PIPELINE_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Invalid pipeline status"
        )

    application.pipeline_status = status_update.pipeline_status

    db.commit()
    db.refresh(application)

    return {
        "message": "Application status updated",
        "application_id": application.id,
        "job_id": application.job_id,
        "candidate_id": application.candidate_id,
        "match_status": application.match_status,
        "pipeline_status": application.pipeline_status
    }
