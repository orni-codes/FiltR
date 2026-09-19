import secrets
import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion
from app.models.interview_response import InterviewResponse
from app.models.application import Application
from app.models.candidate import Candidate
from app.models.job import Job

from app.services.interview import (
    generate_initial_question,
    analyze_answer,
    generate_next_question,
    generate_interview_report
)


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


class AnswerSubmit(BaseModel):
    question_id: int
    answer_text: str
    transcript: Optional[str] = None
    recording_url: Optional[str] = None
    duration_seconds: Optional[int] = None


def _get_job_requirements(job: Optional[Job]) -> dict:
    if not job or not job.requirements:
        return {"description": job.description if job else ""}
    try:
        return json.loads(job.requirements)
    except Exception:
        return {"description": job.description}


def _get_candidate_profile(candidate: Optional[Candidate]) -> dict:
    if not candidate:
        return {}
    skills = []
    experience = []
    projects = []
    if candidate.skills:
        try:
            skills = json.loads(candidate.skills)
        except Exception:
            skills = [candidate.skills]
    if candidate.experience:
        try:
            experience = json.loads(candidate.experience)
        except Exception:
            experience = [candidate.experience]
    if candidate.projects:
        try:
            projects = json.loads(candidate.projects)
        except Exception:
            projects = [candidate.projects]

    return {
        "name": candidate.name,
        "email": candidate.email,
        "skills": skills,
        "experience": experience,
        "projects": projects,
        "resume_text": candidate.resume_text
    }


def _gather_previous_qa(interview_id: int, db: Session) -> list:
    questions = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.interview_id == interview_id)
        .order_by(InterviewQuestion.question_number.asc())
        .all()
    )
    qa_list = []
    for q in questions:
        resp = (
            db.query(InterviewResponse)
            .filter(InterviewResponse.question_id == q.id)
            .first()
        )
        if resp:
            qa_list.append({
                "question_number": q.question_number,
                "question": q.question_text,
                "question_type": q.question_type,
                "answer": resp.answer_text,
                "duration_seconds": resp.duration_seconds
            })
    return qa_list


def _finalize_interview(
    interview: Interview,
    application: Optional[Application],
    job: Optional[Job],
    candidate: Optional[Candidate],
    db: Session
) -> dict:
    job_title = job.title if job and job.title else "Job Position"
    job_requirements = _get_job_requirements(job)
    candidate_profile = _get_candidate_profile(candidate)

    qas = _gather_previous_qa(interview.id, db)

    # Compile interview transcript
    transcript_lines = []
    for qa in qas:
        q_num = qa.get("question_number", "")
        q_text = qa.get("question", "")
        a_text = qa.get("answer", "")
        transcript_lines.append(f"Q{q_num}: {q_text}\nA: {a_text}\n")

    interview.transcript = "\n".join(transcript_lines)

    # Generate final report
    report = generate_interview_report(
        job_title=job_title,
        job_requirements=job_requirements,
        candidate_profile=candidate_profile,
        qas=qas
    )

    interview.report = json.dumps(report)
    interview.status = "completed"
    interview.completed_at = datetime.now(timezone.utc)

    # Update application pipeline_status without modifying match_status
    if application:
        application.pipeline_status = "interview_completed"

    try:
        db.commit()
        db.refresh(interview)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error while completing interview: {str(e)}"
        )

    return report


# =========================================================
# 1. CREATE INTERVIEW
# =========================================================
@router.post("/applications/{application_id}")
def create_interview(
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

    # Check whether an active interview already exists
    existing = (
        db.query(Interview)
        .filter(
            Interview.application_id == application_id,
            Interview.status.in_(["created", "in_progress"])
        )
        .first()
    )

    if existing:
        return {
            "message": "Active interview already exists",
            "interview_id": existing.id,
            "application_id": existing.application_id,
            "interview_token": existing.interview_token,
            "status": existing.status
        }

    interview_token = secrets.token_urlsafe(32)

    interview = Interview(
        application_id=application_id,
        interview_token=interview_token,
        status="created"
    )

    try:
        db.add(interview)
        db.commit()
        db.refresh(interview)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create interview: {str(e)}"
        )

    return {
        "message": "Interview created",
        "interview_id": interview.id,
        "application_id": interview.application_id,
        "interview_token": interview.interview_token,
        "status": interview.status
    }


# =========================================================
# 2. GET INTERVIEW BY TOKEN (CANDIDATE VIEW)
# =========================================================
@router.get("/token/{interview_token}")
def get_interview_by_token(
    interview_token: str,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.interview_token == interview_token)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    application = (
        db.query(Application)
        .filter(Application.id == interview.application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == application.candidate_id)
        .first()
    )

    job = (
        db.query(Job)
        .filter(Job.id == application.job_id)
        .first()
    )

    return {
        "interview_id": interview.id,
        "status": interview.status,
        "candidate": {
            "name": candidate.name if candidate and candidate.name else "Candidate"
        },
        "job": {
            "title": job.title if job and job.title else "Job Position"
        },
        "question_count": 5
    }


# =========================================================
# 3. START INTERVIEW
# =========================================================
@router.post("/{interview_id}/start")
def start_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Interview already completed"
        )

    if interview.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Interview has been cancelled"
        )

    # If first question already exists, return it
    existing_question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id,
            InterviewQuestion.question_number == 1
        )
        .first()
    )

    if existing_question:
        if interview.status != "in_progress":
            interview.status = "in_progress"
            if not interview.started_at:
                interview.started_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(interview)

        return {
            "interview_id": interview.id,
            "status": interview.status,
            "question": {
                "id": existing_question.id,
                "question_number": existing_question.question_number,
                "question_text": existing_question.question_text
            }
        }

    # Generate initial question via AI service
    application = (
        db.query(Application)
        .filter(Application.id == interview.application_id)
        .first()
    )
    job = db.query(Job).filter(Job.id == application.job_id).first() if application else None
    candidate = db.query(Candidate).filter(Candidate.id == application.candidate_id).first() if application else None

    job_requirements = _get_job_requirements(job)
    candidate_profile = _get_candidate_profile(candidate)

    q_data = generate_initial_question(job_requirements, candidate_profile)

    question = InterviewQuestion(
        interview_id=interview.id,
        question_number=1,
        question_text=q_data.get("question_text", "Could you introduce yourself and describe your relevant background?"),
        question_type=q_data.get("question_type", "introduction")
    )

    interview.status = "in_progress"
    interview.started_at = datetime.now(timezone.utc)

    try:
        db.add(question)
        db.commit()
        db.refresh(question)
        db.refresh(interview)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start interview: {str(e)}"
        )

    return {
        "interview_id": interview.id,
        "status": "in_progress",
        "question": {
            "id": question.id,
            "question_number": question.question_number,
            "question_text": question.question_text
        }
    }


# =========================================================
# 4. SUBMIT ANSWER
# =========================================================
@router.post("/{interview_id}/answer")
def submit_answer(
    interview_id: int,
    payload: AnswerSubmit,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Interview already completed"
        )

    if interview.status != "in_progress":
        raise HTTPException(
            status_code=400,
            detail="Interview is not in progress"
        )

    question = (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.id == payload.question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    if question.interview_id != interview.id:
        raise HTTPException(
            status_code=400,
            detail="Question does not belong to this interview"
        )

    # Check for duplicate answer
    existing_response = (
        db.query(InterviewResponse)
        .filter(InterviewResponse.question_id == question.id)
        .first()
    )

    if existing_response:
        raise HTTPException(
            status_code=400,
            detail="Answer already submitted for this question"
        )

    response = InterviewResponse(
        question_id=question.id,
        interview_id=interview.id,
        answer_text=payload.answer_text,
        transcript=payload.transcript or payload.answer_text,
        recording_url=payload.recording_url,
        duration_seconds=payload.duration_seconds
    )

    try:
        db.add(response)
        db.commit()
        db.refresh(response)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save answer: {str(e)}"
        )

    # Context for AI
    application = (
        db.query(Application)
        .filter(Application.id == interview.application_id)
        .first()
    )
    job = db.query(Job).filter(Job.id == application.job_id).first() if application else None
    candidate = db.query(Candidate).filter(Candidate.id == application.candidate_id).first() if application else None

    job_requirements = _get_job_requirements(job)
    candidate_profile = _get_candidate_profile(candidate)

    # Analyze answer
    analysis = analyze_answer(
        question_text=question.question_text,
        answer_text=payload.answer_text,
        job_requirements=job_requirements,
        candidate_profile=candidate_profile
    )

    # If this was question 5, complete the interview
    if question.question_number >= 5:
        _finalize_interview(interview, application, job, candidate, db)
        return {
            "interview_id": interview.id,
            "response_saved": True,
            "next_question": None,
            "completed": True
        }

    # Otherwise generate the next question
    previous_qa = _gather_previous_qa(interview.id, db)
    next_q_number = question.question_number + 1

    next_q_data = generate_next_question(
        job_requirements=job_requirements,
        candidate_profile=candidate_profile,
        previous_qa=previous_qa,
        question_number=next_q_number,
        last_analysis=analysis
    )

    next_question = InterviewQuestion(
        interview_id=interview.id,
        question_number=next_q_number,
        question_text=next_q_data.get("question_text", f"Could you elaborate on your experience relevant to this role?"),
        question_type=next_q_data.get("question_type", "technical")
    )

    try:
        db.add(next_question)
        db.commit()
        db.refresh(next_question)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save next question: {str(e)}"
        )

    return {
        "interview_id": interview.id,
        "response_saved": True,
        "next_question": {
            "id": next_question.id,
            "question_number": next_question.question_number,
            "question_text": next_question.question_text
        },
        "completed": False
    }


# =========================================================
# 5. COMPLETE INTERVIEW (EXPLICIT RECRUITER / TIMEOUT ENDPOINT)
# =========================================================
@router.post("/{interview_id}/complete")
def complete_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.status == "completed" and interview.report:
        try:
            report_data = json.loads(interview.report)
        except Exception:
            report_data = {"summary": "Interview completed"}
        return {
            "message": "Interview already completed",
            "interview_id": interview.id,
            "status": "completed",
            "report": report_data
        }

    application = (
        db.query(Application)
        .filter(Application.id == interview.application_id)
        .first()
    )
    job = db.query(Job).filter(Job.id == application.job_id).first() if application else None
    candidate = db.query(Candidate).filter(Candidate.id == application.candidate_id).first() if application else None

    report = _finalize_interview(interview, application, job, candidate, db)

    return {
        "message": "Interview completed successfully",
        "interview_id": interview.id,
        "status": "completed",
        "report": report
    }


# =========================================================
# 6. GET INTERVIEW REPORT (RECRUITER ACCESS)
# =========================================================
@router.get("/{interview_id}/report")
def get_interview_report(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if not interview.report:
        return {
            "interview_id": interview.id,
            "status": interview.status,
            "report": None,
            "message": "Report has not been generated yet. Interview must be completed."
        }

    try:
        report_data = json.loads(interview.report)
    except Exception:
        report_data = {"summary": interview.report}

    return {
        "interview_id": interview.id,
        "status": interview.status,
        "report": report_data
    }


# =========================================================
# 7. GET INTERVIEW DETAILS
# =========================================================
@router.get("/{interview_id}")
def get_interview_details(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    qas = _gather_previous_qa(interview.id, db)

    return {
        "interview_id": interview.id,
        "application_id": interview.application_id,
        "status": interview.status,
        "interview_token": interview.interview_token,
        "started_at": interview.started_at,
        "completed_at": interview.completed_at,
        "qa_count": len(qas),
        "transcript": interview.transcript,
        "report": json.loads(interview.report) if interview.report else None
    }
