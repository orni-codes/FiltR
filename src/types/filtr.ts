// FiltR domain types

export type RequirementType = "Required" | "Preferred";
export type RequirementStatus = "Validated" | "Partial" | "Needs validation";
export type CandidateInterviewStatus = "Completed" | "In Progress" | "Pending" | "Needs Review";
export type JobStatus = "Active" | "Paused" | "Closed";
export type InterviewStatus = "not_started" | "in_progress" | "completed";
export type ConfidenceLevel = "High" | "Medium" | "Low";
export type StatusTone = "success" | "warning" | "info" | "neutral";

export interface JobRequirement {
  id: string;
  name: string;
  type: RequirementType;
  coverage: string; // e.g. "3 questions"
  status: RequirementStatus;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  workMode: string;
  experience: string;
  employmentType: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requirements: JobRequirement[];
  candidateCount: number;
  interviewCount: number;
  activity: string;
  status: JobStatus;
}

export interface Candidate {
  id: string;
  initials: string;
  name: string;
  email?: string | undefined;
  experience: string;
  jobId: string;
  interviewStatus: CandidateInterviewStatus;
  coverageLabel: string; // e.g. "3/6 validated"
  activity: string;
  interviewToken: string;
}

export interface AuditTrailEvent {
  id: string;
  timestamp: string; // e.g. "Sep 19, 10:14 AM" or "08:42"
  eventType:
    | "Resume Uploaded"
    | "Resume Parsed"
    | "Requirement Identified"
    | "Interview Question Generated"
    | "Candidate Answered"
    | "Follow-up Generated"
    | "Evidence Extracted"
    | "Status Assigned";
  description: string;
  source?: string; // e.g. "Resume p.1", "Interview Q2", "AI Synthesis"
  requirementId?: string;
  requirementName?: string;
}

export interface InterviewEvidence {
  id: string;
  requirementId: string;
  requirementName: string;
  requirementType?: RequirementType;
  resumeClaim: string;
  resumeSource: string;
  interviewQuestionNumber: number;
  question: string;
  answer: string;
  evidence: string;
  evidencePoints?: string[];
  status: RequirementStatus;
  timestamp: string; // e.g. "02:14"
  duration?: string;
  hasFollowUp?: boolean;
  followUpQuestion?: string | undefined;
  followUpAnswer?: string | undefined;
  followUpTimestamp?: string | undefined;
}

export interface TranscriptEntry {
  id?: string;
  questionNumber?: number;
  timestamp: string; // e.g. "02:14"
  title: string;
  aiQuestion: string;
  candidateAnswer: string;
  candidateAnswerTime?: string | undefined; // e.g. "02:14–03:02"
  hasFollowUp?: boolean;
  aiFollowUp?: string | undefined;
  aiFollowUpTime?: string | undefined; // e.g. "03:02"
  candidateFollowUpAnswer?: string | undefined;
  candidateFollowUpTime?: string | undefined; // e.g. "03:02–03:41"
  requirementId?: string;
  requirementName?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  status: InterviewStatus;
  duration: string; // e.g. "28:14"
  questionsTotal: number;
  questionsAnswered: number;
  currentQuestionText?: string;
  currentQuestionNumber?: number;
  transcript: TranscriptEntry[];
  evidenceItems: InterviewEvidence[];
}

export interface ResumeEntry {
  company: string;
  title: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface Resume {
  candidateId: string;
  pages: number;
  analyzedDate: string;
  entries: ResumeEntry[];
  connectedClaims: Array<{ claim: string; questionCount: number }>;
}

export interface CandidateReport {
  candidateId: string;
  jobId: string;
  requirementsCovered: number;
  requirementsTotal: number;
  validatedCount: number;
  partialCount: number;
  needsValidationCount: number;
  confidence: ConfidenceLevel;
  completedDate: string;
  humanReviewRequired: boolean;
  auditTrail: AuditTrailEvent[];
}

// Pipeline stage counts for JobOverview
export interface PipelineStage {
  label: string;
  count: number;
}

export interface ActivityEntry {
  initials: string;
  title: string;
  note: string;
  time: string;
}
