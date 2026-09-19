from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=True)

    email = Column(String(255), nullable=True)

    resume_text = Column(Text, nullable=True)

    skills = Column(Text, nullable=True)

    experience = Column(Text, nullable=True)

    projects = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )