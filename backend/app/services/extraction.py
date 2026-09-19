from app.services.ai import generate_json


def extract_job_requirements(job_description: str):

    prompt = f"""
You are a recruitment information extraction system.

Analyze the following job description.

Extract the important hiring requirements.

Return ONLY valid JSON in exactly this structure:

{{
    "role": "string",
    "experience": "string",
    "skills": [],
    "technical_requirements": [],
    "responsibilities": []
}}

Rules:
- Only extract information that is actually present.
- Do not invent skills or experience.
- Keep skills concise.
- Return valid JSON only.

JOB DESCRIPTION:

{job_description}
"""

    return generate_json(prompt)


def extract_candidate_profile(resume_text: str):

    prompt = f"""
You are a recruitment information extraction system.

Analyze the following candidate resume.

Extract only information supported by the resume.

Return ONLY valid JSON in exactly this structure:

{{
    "name": "string",
    "email": "string",
    "skills": [],
    "experience": [],
    "projects": [],
    "education": []
}}

Rules:
- Do not invent information.
- If something is not present, return an empty string or empty array.
- Return valid JSON only.

RESUME:

{resume_text}
"""

    return generate_json(prompt)