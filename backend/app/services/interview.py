import json
from app.services.ai import generate_json


def generate_initial_question(
    job_requirements: dict,
    candidate_profile: dict
) -> dict:
    """
    Generate the first interview question based on job requirements and candidate profile.
    Target: Professional introduction and overview of relevant experience.
    """
    prompt = f"""
You are an AI recruitment interview assistant conducting a professional job interview.

JOB REQUIREMENTS:
{json.dumps(job_requirements, indent=2)}

CANDIDATE PROFILE:
{json.dumps(candidate_profile, indent=2)}

TASK:
Generate the FIRST interview question for this candidate (Question 1 of 5).
This must be a welcoming, professional introductory question asking the candidate to introduce themselves and highlight their background and projects most relevant to the key requirements of this role.

ETHICAL RULES:
1. Focus strictly on job-relevant skills, experience, and projects.
2. Never ask about personal life, personality traits, emotions, or protected attributes.
3. Do not make hiring decisions or assumptions.

Return ONLY valid JSON in exactly this structure:
{{
    "question_text": "string",
    "question_type": "introduction"
}}
"""
    try:
        result = generate_json(prompt)
        if isinstance(result, dict) and "question_text" in result:
            return {
                "question_text": result.get("question_text", "").strip(),
                "question_type": result.get("question_type", "introduction")
            }
    except Exception as e:
        print(f"Initial question generation fallback triggered: {e}")

    # Fallback
    cand_name = candidate_profile.get("name", "there")
    return {
        "question_text": f"Could you introduce yourself and walk us through your professional background and the projects most relevant to this role?",
        "question_type": "introduction"
    }


def analyze_answer(
    question_text: str,
    answer_text: str,
    job_requirements: dict,
    candidate_profile: dict
) -> dict:
    """
    Analyze the candidate's answer against job requirements and candidate profile.
    Extracts evidence, verified skills, and decides whether an adaptive follow-up is needed.
    """
    prompt = f"""
You are a recruitment intelligence assistant analyzing a candidate's interview answer.

JOB REQUIREMENTS:
{json.dumps(job_requirements, indent=2)}

CANDIDATE PROFILE:
{json.dumps(candidate_profile, indent=2)}

QUESTION ASKED:
{question_text}

CANDIDATE ANSWER:
{answer_text}

TASK:
Analyze the candidate's answer.
Determine what evidence was presented, what skills or requirements were demonstrated, what areas remain unclear or need validation, and whether a focused follow-up question is needed.

RULES:
1. Only evaluate verifiable evidence explicitly present in the candidate's answer or profile.
2. Never invent qualifications, experience, or skills.
3. Never evaluate personality, emotions, tone, facial expressions, or truthfulness.
4. Do NOT make a hiring or rejection decision.
5. If the candidate gave a high-level answer that lacked technical depth or implementation details for a key requirement, set 'follow_up_needed' to true.

Return ONLY valid JSON in exactly this structure:
{{
    "evidence": [
        "Candidate described using React hooks in their project."
    ],
    "skills_demonstrated": [
        "React"
    ],
    "requirements_addressed": [
        "React experience"
    ],
    "needs_validation": [
        "Depth of production React experience"
    ],
    "follow_up_needed": true,
    "follow_up_reason": "Candidate mentioned React but did not explain how state management was handled."
}}
"""
    try:
        result = generate_json(prompt)
        if isinstance(result, dict):
            return {
                "evidence": result.get("evidence", []),
                "skills_demonstrated": result.get("skills_demonstrated", []),
                "requirements_addressed": result.get("requirements_addressed", []),
                "needs_validation": result.get("needs_validation", []),
                "follow_up_needed": bool(result.get("follow_up_needed", False)),
                "follow_up_reason": result.get("follow_up_reason", "")
            }
    except Exception as e:
        print(f"Answer analysis fallback triggered: {e}")

    # Fallback
    return {
        "evidence": [answer_text[:200] if answer_text else "Answer provided"],
        "skills_demonstrated": [],
        "requirements_addressed": [],
        "needs_validation": ["Detailed automated analysis unavailable"],
        "follow_up_needed": False,
        "follow_up_reason": ""
    }


def generate_next_question(
    job_requirements: dict,
    candidate_profile: dict,
    previous_qa: list,
    question_number: int,
    last_analysis: dict
) -> dict:
    """
    Generate question #N (2 to 5) adapting to previous answers and missing evidence.
    """
    prompt = f"""
You are an AI recruitment interview assistant conducting a professional job interview.

JOB REQUIREMENTS:
{json.dumps(job_requirements, indent=2)}

CANDIDATE PROFILE:
{json.dumps(candidate_profile, indent=2)}

PREVIOUS QUESTIONS AND ANSWERS:
{json.dumps(previous_qa, indent=2)}

LAST ANSWER ANALYSIS:
{json.dumps(last_analysis, indent=2)}

CURRENT QUESTION NUMBER: {question_number} of 5

TASK:
Generate question #{question_number} for this interview.

ADAPTIVE RULES:
1. If 'follow_up_needed' is true in the last answer analysis, generate a focused follow-up question probing the specifics, architecture, trade-offs, or implementation of what the candidate just discussed.
2. Otherwise, progress to an unexplored key technical requirement, specific project experience from their resume, or a realistic job scenario.
3. Target structure:
   - Question 2: Core technical requirement
   - Question 3: Deep dive into project experience or architecture
   - Question 4: Technical follow-up or edge-case handling
   - Question 5: Job-specific scenario or practical problem solving
4. Do NOT repeat previous questions.
5. Do NOT ask about personality, emotions, or personal life.
6. Keep the question concise, specific, and clear.

Allowed question_type values:
"technical", "project", "follow_up", "scenario", "experience"

Return ONLY valid JSON in exactly this structure:
{{
    "question_text": "string",
    "question_type": "technical"
}}
"""
    try:
        result = generate_json(prompt)
        if isinstance(result, dict) and "question_text" in result:
            return {
                "question_text": result.get("question_text", "").strip(),
                "question_type": result.get("question_type", "technical")
            }
    except Exception as e:
        print(f"Next question generation fallback triggered: {e}")

    # Fallbacks by question number
    fallbacks = {
        2: ("Could you discuss a core technical project you built, explaining the architectural choices and key technologies used?", "project"),
        3: ("What was the most challenging technical problem you encountered in that work, and how did you diagnose and solve it?", "technical"),
        4: ("How do you approach code quality, testing, and debugging to ensure reliability in production systems?", "technical"),
        5: ("Can you share an experience where you had to adapt to evolving technical requirements or tight deadlines?", "scenario")
    }
    q_text, q_type = fallbacks.get(question_number, ("Can you tell us more about your relevant technical experience?", "technical"))
    return {
        "question_text": q_text,
        "question_type": q_type
    }


def generate_interview_report(
    job_title: str,
    job_requirements: dict,
    candidate_profile: dict,
    qas: list
) -> dict:
    """
    Generate an objective, evidence-based final interview report for the recruiter.
    Does NOT make hiring decisions, assign scores, or evaluate personality.
    """
    prompt = f"""
You are a recruitment intelligence assistant generating a structured, evidence-based interview report for a recruiter.

JOB TITLE: {job_title}

JOB REQUIREMENTS:
{json.dumps(job_requirements, indent=2)}

CANDIDATE PROFILE:
{json.dumps(candidate_profile, indent=2)}

INTERVIEW QUESTIONS & ANSWERS:
{json.dumps(qas, indent=2)}

TASK:
Synthesize the interview evidence into an objective, factual report for the recruiter.

IMPORTANT COMPLIANCE AND ETHICAL RULES:
- Do NOT provide an overall score, percentage, grade, or ranking.
- Do NOT provide a hire or reject recommendation.
- Do NOT evaluate personality, tone, emotions, or psychological traits.
- Focus strictly on job-relevant skills, technical concepts, demonstrated project experience, and direct quotes/evidence from answers.
- Highlight specific areas where evidence was incomplete or where recruiter follow-up is recommended.

Return ONLY valid JSON in exactly this structure:
{{
    "summary": "Objective synthesis of the candidate's demonstrated qualifications and interview discussion.",
    "requirements_evidence": [
        {{
            "requirement": "Requirement name",
            "evidence": "Specific evidence from candidate answers",
            "status": "demonstrated"
        }}
    ],
    "technical_topics": [
        {{
            "topic": "Topic name",
            "evidence": "Summary of candidate's explanation"
        }}
    ],
    "projects_discussed": [
        {{
            "project": "Project name",
            "evidence": "What candidate described doing"
        }}
    ],
    "areas_needing_validation": [
        "Specific claim or skill the recruiter should manually verify"
    ],
    "questions_and_answers": [
        {{
            "question": "Question text",
            "answer": "Candidate answer",
            "evidence": "Evidence observed"
        }}
    ]
}}
"""
    try:
        result = generate_json(prompt)
        if isinstance(result, dict) and "summary" in result:
            return result
    except Exception as e:
        print(f"Report generation fallback triggered: {e}")

    # Fallback report structure
    qa_list = []
    for item in qas:
        qa_list.append({
            "question": item.get("question", ""),
            "answer": item.get("answer", ""),
            "evidence": item.get("answer", "")[:150]
        })

    return {
        "summary": f"Interview completed for {candidate_profile.get('name', 'Candidate')} applying for {job_title}. 5 questions answered.",
        "requirements_evidence": [
            {
                "requirement": "Role competencies",
                "evidence": "Candidate provided responses across technical and project topics.",
                "status": "demonstrated"
            }
        ],
        "technical_topics": [
            {
                "topic": "Technical Background",
                "evidence": "Discussed in interview answers."
            }
        ],
        "projects_discussed": [
            {
                "project": "General Experience",
                "evidence": "Discussed in interview answers."
            }
        ],
        "areas_needing_validation": [
            "Review candidate transcript answers for depth of production experience."
        ],
        "questions_and_answers": qa_list
    }
