# FiltR

FiltR is an evidence-first AI interview workspace for recruiters and candidates.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Product flow

Recruiter: Jobs → JD → Candidates → Interview → Evidence → Report

Candidate: Interview link → Device check → Video interview → Adaptive follow-up → Complete

The current frontend uses deterministic mock services so the UI can be demonstrated without a backend. The service layer is structured for a later FastAPI/Gemini integration.
