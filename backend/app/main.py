from fastapi import FastAPI

from app.database import Base, engine

# Import models so SQLAlchemy knows about all tables
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.application import Application
from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion
from app.models.interview_response import InterviewResponse

# Import routers
from app.routers.jobs import router as jobs_router
from app.routers.candidates import router as candidates_router
from app.routers.matching import router as matching_router
from app.routers.applications import router as applications_router
from app.routers.interviews import router as interviews_router



# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="FiltR API",
    description="AI-powered recruitment intelligence platform",
    version="1.0.0"
)


# Register routers
app.include_router(jobs_router)
app.include_router(candidates_router)
app.include_router(matching_router)
app.include_router(applications_router)
app.include_router(interviews_router)


@app.get("/")
def root():
    return {
        "message": "FiltR API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }