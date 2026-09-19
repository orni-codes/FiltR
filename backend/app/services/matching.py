from app.services.ai import generate_json


def match_candidate_to_job(
    job_requirements: dict,
    candidate_profile: dict
):

    prompt = f"""
You are a recruitment matching assistant.

Compare the candidate against the job requirements.

IMPORTANT:
You are NOT making a hiring decision.

Your job is only to determine whether the candidate's
resume provides sufficient evidence for the stated requirements.

Return ONLY valid JSON in exactly this structure:

{{
    "match_status": "matched",
    "matched": [],
    "missing": [],
    "needs_validation": [],
    "evidence": []
}}

Possible match_status values:

"matched"
"unmatched"
"needs_validation"

Rules:

1. Only use evidence present in the candidate profile.
2. Never invent skills, experience or qualifications.
3. A requirement should be "matched" only when the resume
   provides reasonable evidence for it.
4. Put unclear or insufficiently demonstrated requirements
   into "needs_validation".
5. Put requirements with no supporting evidence into "missing".
6. Do not make hiring or rejection decisions.
7. Keep evidence specific.

JOB REQUIREMENTS:

{job_requirements}

CANDIDATE PROFILE:

{candidate_profile}
"""

    return generate_json(prompt)