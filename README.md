# FiltR

### HireFlow-AI Candidate Screening & Interview Intelligence Agent

> **Turn resumes and interviews into structured hiring intelligence.**

HireFlow is an AI-powered recruitment intelligence platform designed to reduce repetitive hiring work while keeping human decision-making at the center.

Recruiters can upload a **job description and candidate resumes**, extract relevant candidate information, map experience against role requirements, identify areas that need validation, and generate personalized interview questions.

After the interview, HireFlow can analyze interview notes, connect evidence back to job requirements, identify unanswered areas, and generate a standardized evaluation report.

---

## Problem

Recruiters often have to review large numbers of resumes while trying to determine whether each candidate actually matches the requirements of a role.

Important information can be scattered across:

* Resumes
* Projects
* Skills
* Work experience
* Application forms
* Interview notes

This makes candidate comparison repetitive and inconsistent.

Interviewers also spend significant time preparing questions and reviewing notes instead of focusing on the actual conversation.

**HireFlow brings these steps into one AI-assisted workflow.**

---

## Solution

HireFlow creates a structured candidate intelligence pipeline:

```text
Job Description
       ↓
Requirement Extraction
       ↓
Candidate Resume Upload
       ↓
Candidate Information Extraction
       ↓
Requirement ↔ Candidate Mapping
       ↓
Missing / Unclear Information
       ↓
Candidate Summary
       ↓
Personalized Interview Questions
       ↓
Interview Notes
       ↓
Evidence Validation
       ↓
Interview Evaluation Report
```

The system assists recruiters with organization and analysis while leaving the final hiring decision to humans.

---

## Core Features

### 1. Job Description Analysis

Upload a job description and extract:

* Required skills
* Preferred skills
* Experience requirements
* Education requirements
* Role responsibilities
* Key qualifications

---

### 2. AI Resume Screening

Upload candidate resumes and extract:

* Technical skills
* Soft skills
* Education
* Work experience
* Projects
* Certifications
* Achievements
* Relevant technologies

---

### 3. Requirement Mapping

HireFlow maps candidate evidence against specific job requirements.

Example:

```text
Requirement:
3+ years Python experience

Candidate Evidence:
Python — 4 years
FastAPI — 2 years
ML Projects — 3 projects

Status:
Supported
```

The system can also identify:

```text
Unclear:
Leadership experience

Missing:
Cloud deployment experience
```

---

### 4. Candidate Intelligence

Generate structured candidate profiles containing:

* Candidate overview
* Relevant experience
* Relevant projects
* Skills
* Qualifications
* Requirement coverage
* Missing information
* Areas requiring validation

---

### 5. Personalized Interview Questions

Instead of generating generic interview questions, HireFlow creates questions based on the candidate's actual background.

Example:

> Candidate claims experience building a recommendation system.

HireFlow can generate:

```text
Can you explain the recommendation system you built?

Follow-up:
What metric did you use to evaluate the model?

Validation:
How did you handle cold-start users?
```

---

### 6. Interview Intelligence

After an interview, recruiters can provide interview notes.

HireFlow can:

* Summarize the conversation
* Map answers to job requirements
* Identify evidence
* Identify unanswered requirements
* Highlight areas requiring follow-up
* Generate a standardized evaluation report

---

### 7. Natural Language Candidate Search

Recruiters can query the candidate pool using natural language.

Examples:

```text
Show candidates with Python and FastAPI experience.

Which candidates have machine learning projects?

Find candidates with React experience and internship experience.

Which candidates still have unclear cloud experience?
```

---

### 8. Evidence & Audit Trail

Every generated insight should be traceable back to the candidate information that produced it.

```text
Insight
   ↓
Candidate Evidence
   ↓
Resume / Interview Note
   ↓
Source Reference
```

This improves transparency and allows recruiters to verify AI-generated insights.

---

## MVP

The Hackathon MVP focuses on the core hiring workflow:

```text
Upload JD
   ↓
Upload Resumes
   ↓
AI Extraction
   ↓
Candidate ↔ Requirement Matching
   ↓
Candidate Summary
   ↓
Personalized Interview Question
```

