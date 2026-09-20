import type { Candidate, CandidateReport, Interview, Job, JobRequirement } from "@/types/filtr";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function resolveApiBase(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
  if (configured?.startsWith("http")) return configured;
  if (typeof window === "undefined") {
    const serverUrl = (import.meta.env.VITE_API_SERVER_URL as string | undefined)?.replace(/\/$/, "");
    return serverUrl || "http://127.0.0.1:8000";
  }
  return configured || "/api";
}

const API_BASE = resolveApiBase();

function detailMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((item) => (typeof item === "string" ? item : item?.msg || JSON.stringify(item)))
      .join("; ");
  }
  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new ApiError(0, "FiltR API is unavailable. Start the FastAPI backend and try again.");
  }
  if (!response.ok) {
    let message = `API request failed (${response.status})`;
    try {
      const body = await response.json();
      message = detailMessage(body.detail, message);
    } catch {}
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

const initials = (name = "Candidate") => name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
const parseRequirements = (raw: unknown): JobRequirement[] => {
  if (!raw) return [];
  let value: any = raw;
  if (typeof raw === "string") {
    try { value = JSON.parse(raw); } catch { return []; }
  }
  const list = Array.isArray(value) ? value : value.requirements || value.skills || value.criteria || [];
  return list.map((item: any, index: number) => ({
    id: String(item.id || item.name || `req-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: item.name || item.requirement || item.skill || `Requirement ${index + 1}`,
    type: item.type === "Preferred" ? "Preferred" : "Required",
    coverage: item.coverage || "1 question",
    status: item.status === "Partial" || item.status === "Needs validation" ? item.status : "Validated",
  }));
};

export async function getJobsFromApi(): Promise<Job[]> {
  const jobs = await request<any[]>("/jobs/");
  const dashboards = await Promise.all(jobs.map(async (job) => {
    try { return await getJobDashboard(String(job.id)); } catch { return null; }
  }));
  return jobs.map((job, index) => {
    const dashboard = dashboards[index];
    const requirements = parseRequirements(dashboard?.job?.requirements || job.requirements);
    const candidates = dashboard?.candidates || [];
    const completed = candidates.filter((c: any) => c.pipeline_status === "interview_completed").length;
    return {
      id: String(job.id), title: job.title, location: "—", workMode: "—", experience: "—", employmentType: "—",
      description: job.description || "", requiredSkills: requirements.filter(r => r.type === "Required").map(r => r.name),
      preferredSkills: requirements.filter(r => r.type === "Preferred").map(r => r.name), requirements,
      candidateCount: candidates.length, interviewCount: completed, activity: "Synced from API", status: "Active",
    } satisfies Job;
  });
}

export async function getJobDashboard(jobId: string): Promise<any> {
  return request(`/jobs/${jobId}/dashboard`);
}

export function mapJobFromDashboard(dashboard: any, fallbackId?: string): Job {
  const job = dashboard?.job || {};
  const requirements = parseRequirements(job.requirements);
  const candidates = dashboard?.candidates || [];
  const completed = candidates.filter((c: any) => c.pipeline_status === "interview_completed").length;
  return {
    id: String(job.id ?? fallbackId),
    title: job.title,
    location: "—",
    workMode: "—",
    experience: "—",
    employmentType: "—",
    description: job.description || "",
    requiredSkills: requirements.filter((r) => r.type === "Required").map((r) => r.name),
    preferredSkills: requirements.filter((r) => r.type === "Preferred").map((r) => r.name),
    requirements,
    candidateCount: candidates.length,
    interviewCount: completed,
    activity: "Synced from API",
    status: "Active",
  } satisfies Job;
}

export async function createJob(title: string, description: string) {
  return request<{ job_id: number }>("/jobs/", { method: "POST", body: JSON.stringify({ title, description }) });
}

export async function extractJobRequirements(jobId: string) {
  return request<any>(`/jobs/${jobId}/extract`, { method: "POST" });
}

export async function uploadCandidate(jobId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<{ candidate_id: number; application_id: number; job_id: number }>(`/jobs/${jobId}/candidates/upload`, { method: "POST", body: form });
}

export async function extractCandidate(candidateId: string) {
  return request<any>(`/candidates/${candidateId}/extract`, { method: "POST" });
}

export async function matchApplication(applicationId: string) {
  return request<any>(`/matching/applications/${applicationId}`, { method: "POST" });
}

export async function updateApplicationStatus(applicationId: string, pipeline_status: string) {
  return request<any>(`/applications/${applicationId}/status`, { method: "PATCH", body: JSON.stringify({ pipeline_status }) });
}

export async function createInterview(applicationId: string) {
  return request<{ interview_id: number; interview_token: string; status: string }>(`/interviews/applications/${applicationId}`, { method: "POST" });
}

export async function getInterviewByToken(token: string) {
  return request<any>(`/interviews/token/${encodeURIComponent(token)}`);
}

export async function startInterview(interviewId: string) {
  return request<any>(`/interviews/${interviewId}/start`, { method: "POST" });
}

export async function submitInterviewAnswer(interviewId: string, payload: { question_id: number; answer_text: string; transcript?: string; duration_seconds?: number }) {
  return request<any>(`/interviews/${interviewId}/answer`, { method: "POST", body: JSON.stringify(payload) });
}

export async function completeInterview(interviewId: string) {
  return request<any>(`/interviews/${interviewId}/complete`, { method: "POST" });
}

export async function getInterviewDetails(interviewId: string) {
  return request<any>(`/interviews/${interviewId}`);
}

export async function getInterviewReport(interviewId: string) {
  return request<any>(`/interviews/${interviewId}/report`);
}

export function mapCandidate(raw: any, jobId: string): Candidate {
  const statusMap: Record<string, Candidate["interviewStatus"]> = {
    interview_completed: "Completed", interview: "In Progress", review: "Needs Review", screening: "Pending", shortlisted: "Pending",
  };
  return {
    id: String(raw.candidate_id), initials: initials(raw.name), name: raw.name || "Candidate", experience: "—", jobId,
    interviewStatus: statusMap[raw.pipeline_status] || "Pending", coverageLabel: raw.match_status || "—", activity: "Synced from API",
    interviewToken: raw.interview_token || "", applicationId: raw.application_id,
  };
}
