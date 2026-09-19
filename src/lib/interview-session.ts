export type InterviewStepState =
  "IDLE" | "QUESTION" | "RECORDING" | "SUBMITTED" | "ANALYZING" | "FOLLOW_UP" | "COMPLETE";

export interface DemoInterviewQuestion {
  id: string;
  requirementId: string;
  requirementName: string;
  requirementType: "Required" | "Preferred";
  question: string;
  isFollowUp?: boolean;
  parentQuestionId?: string;
  followUpPrompt?: string;
  expectedOutcome: "validated" | "partial" | "needs_validation";
  triggersFollowUp?: boolean;
  followUpQuestion?: DemoInterviewQuestion;
  timeEstimateSeconds?: number;
}

export const DEMO_INTERVIEW_QUESTIONS: DemoInterviewQuestion[] = [
  {
    id: "q1",
    requirementId: "req-sql",
    requirementName: "Advanced SQL and data modeling",
    requirementType: "Required",
    question:
      "Can you walk through an end-to-end data model you architected in SQL, and how you handled dimensional modeling, indexing, and join optimization for high query volumes?",
    expectedOutcome: "validated",
    timeEstimateSeconds: 120,
  },
  {
    id: "q2",
    requirementId: "req-dashboard",
    requirementName: "Dashboard design and data storytelling",
    requirementType: "Required",
    question:
      "Describe how you designed an executive dashboard. What core metrics did you highlight and how did you tailor the presentation to prevent misinterpretation by non-technical stakeholders?",
    expectedOutcome: "validated",
    timeEstimateSeconds: 120,
  },
  {
    id: "q3",
    requirementId: "req-comms",
    requirementName: "Cross-functional stakeholder communication",
    requirementType: "Required",
    question:
      "Tell me about a time a leader or stakeholder challenged your metric definition or analytical conclusions. How did you handle the friction and align on next steps?",
    expectedOutcome: "validated",
    timeEstimateSeconds: 120,
  },
  {
    id: "q4",
    requirementId: "req-stats",
    requirementName: "Statistical analysis and experimentation",
    requirementType: "Required",
    question:
      "How do you approach A/B test analysis when sample sizes are uneven or metric variance is high? What statistical tests or guardrails do you apply?",
    expectedOutcome: "partial",
    timeEstimateSeconds: 120,
  },
  {
    id: "q5",
    requirementId: "req-product",
    requirementName: "Experience with product analytics",
    requirementType: "Preferred",
    question:
      "What is your experience setting up event taxonomy and tracking user cohorts in product analytics platforms such as Amplitude, Mixpanel, or PostHog?",
    expectedOutcome: "needs_validation",
    triggersFollowUp: true,
    timeEstimateSeconds: 120,
    followUpQuestion: {
      id: "q5-followup",
      requirementId: "req-product",
      requirementName: "Experience with product analytics",
      requirementType: "Preferred",
      isFollowUp: true,
      parentQuestionId: "q5",
      followUpPrompt: "Let's clarify that.",
      question:
        "Did you directly design and govern the event taxonomy schema across the engineering codebase, or did you primarily consume pre-existing event streams for analysis?",
      expectedOutcome: "needs_validation",
      timeEstimateSeconds: 90,
    },
  },
  {
    id: "q6",
    requirementId: "req-python",
    requirementName: "Python for analytical workflows",
    requirementType: "Preferred",
    question:
      "How do you leverage Python (e.g., pandas, automated data scripts) to enhance your analytical workflows and automate repetitive data hygiene checks?",
    expectedOutcome: "validated",
    timeEstimateSeconds: 120,
  },
];

export interface AnswerRecord {
  questionId: string;
  requirementName: string;
  durationSeconds: number;
  recordedAt: string;
  isFollowUp?: boolean;
}

export interface InterviewSessionState {
  currentQuestionIndex: number;
  isInFollowUp: boolean;
  stepState: InterviewStepState;
  answers: AnswerRecord[];
  totalAnswered: number;
  startedAt?: string;
  completedAt?: string;
}

const STORAGE_KEY_PREFIX = "filtr_session_";

export function loadSessionState(token: string): InterviewSessionState {
  if (typeof window === "undefined") {
    return getInitialSessionState();
  }
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${token}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to load interview session from storage", e);
  }
  return getInitialSessionState();
}

export function saveSessionState(token: string, state: InterviewSessionState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${token}`, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save interview session to storage", e);
  }
}

export function getInitialSessionState(): InterviewSessionState {
  return {
    currentQuestionIndex: 0,
    isInFollowUp: false,
    stepState: "QUESTION",
    answers: [],
    totalAnswered: 0,
    startedAt: new Date().toISOString(),
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
