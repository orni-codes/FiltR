/**
 * FiltR AI Mock Service Layer
 * Simulates intelligent parsing, requirement extraction, evidence synthesis,
 * and adaptive interview generation. Structured for drop-in backend API replacement.
 */

import type {
  JobRequirement,
  RequirementStatus,
  InterviewEvidence,
  TranscriptEntry,
  CandidateReport,
  AuditTrailEvent,
  Resume,
  Interview,
} from "@/types/filtr";

export interface ExtractedRequirement {
  id: string;
  name: string;
  category: "Technical" | "Domain" | "Communication" | "Leadership" | "Analytical";
  type: "Required" | "Preferred";
  description: string;
  coverage: string;
  status: RequirementStatus;
}

export interface ParsedResumeProfile {
  name: string;
  experience: string;
  summary: string;
  skills: string[];
  projects: Array<{ title: string; period: string; description: string }>;
  education: Array<{ degree: string; institution: string; year: string }>;
  connectedClaims: Array<{ claim: string; questionCount: number }>;
}

export interface RequirementMatchAnalysis {
  requirementId: string;
  requirementName: string;
  status: RequirementStatus;
  evidence: string;
  resumeSource: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * AI Service: Extract role requirements from Job Description text or uploaded file
 */
export async function extractRequirements(
  jobTitle: string,
  description: string,
): Promise<ExtractedRequirement[]> {
  await delay(1800); // realistic AI parsing delay

  const titleLower = jobTitle.toLowerCase();

  if (
    titleLower.includes("data") ||
    titleLower.includes("analyst") ||
    titleLower.includes("analytics")
  ) {
    return [
      {
        id: `req-${Date.now()}-1`,
        name: "Advanced SQL and dimensional data modeling",
        category: "Technical",
        type: "Required",
        description:
          "Ability to architect robust fact/dimension tables, optimize query latency, and reconcile metric definitions.",
        coverage: "3 questions",
        status: "Validated",
      },
      {
        id: `req-${Date.now()}-2`,
        name: "Dashboard design and data storytelling",
        category: "Communication",
        type: "Required",
        description:
          "Experience structuring cohort retention curves and executive dashboards tailored to business stakeholders.",
        coverage: "2 questions",
        status: "Validated",
      },
      {
        id: `req-${Date.now()}-3`,
        name: "Cross-functional stakeholder communication",
        category: "Communication",
        type: "Required",
        description:
          "Demonstrated ability to align disagreeing departments around canonical metric dictionaries.",
        coverage: "2 questions",
        status: "Validated",
      },
      {
        id: `req-${Date.now()}-4`,
        name: "Statistical analysis and experimentation",
        category: "Analytical",
        type: "Required",
        description:
          "Practical knowledge of A/B testing, sample ratio mismatch detection, and variance evaluation.",
        coverage: "2 questions",
        status: "Partial",
      },
      {
        id: `req-${Date.now()}-5`,
        name: "Python for analytical workflows",
        category: "Technical",
        type: "Preferred",
        description:
          "Automation of reporting pipelines, pandas data hygiene checks, and anomaly detection.",
        coverage: "1 question",
        status: "Partial",
      },
      {
        id: `req-${Date.now()}-6`,
        name: "Experience with product analytics",
        category: "Domain",
        type: "Preferred",
        description:
          "Hands-on tracking event taxonomy auditing, funnel analysis, and cohort segmentation in tools like Amplitude.",
        coverage: "2 questions",
        status: "Needs validation",
      },
    ];
  }

  if (
    titleLower.includes("design") ||
    titleLower.includes("ui") ||
    titleLower.includes("ux") ||
    titleLower.includes("product design")
  ) {
    return [
      {
        id: `req-${Date.now()}-1`,
        name: "Figma and design systems",
        category: "Technical",
        type: "Required",
        description:
          "Comprehensive token architecture, component libraries, and responsive autolayout patterns.",
        coverage: "3 questions",
        status: "Validated",
      },
      {
        id: `req-${Date.now()}-2`,
        name: "User research and usability testing",
        category: "Analytical",
        type: "Required",
        description:
          "Planning and moderating discovery interviews, synthesizing qualitative insights, and usability benchmarking.",
        coverage: "2 questions",
        status: "Validated",
      },
      {
        id: `req-${Date.now()}-3`,
        name: "Rapid interactive prototyping",
        category: "Technical",
        type: "Required",
        description:
          "Crafting realistic micro-interactions and testing complex flow validation prior to engineering handoff.",
        coverage: "2 questions",
        status: "Validated",
      },
      {
        id: `req-${Date.now()}-4`,
        name: "Stakeholder presentation skills",
        category: "Communication",
        type: "Required",
        description:
          "Defending design trade-offs with business metrics and engineering feasibility constraints.",
        coverage: "1 question",
        status: "Partial",
      },
      {
        id: `req-${Date.now()}-5`,
        name: "Motion design and micro-animations",
        category: "Technical",
        type: "Preferred",
        description:
          "Timing curves and transitional choreography in Framer, Rive, or After Effects.",
        coverage: "1 question",
        status: "Needs validation",
      },
    ];
  }

  // General engineering / technical fallback
  return [
    {
      id: `req-${Date.now()}-1`,
      name: "Core architectural engineering",
      category: "Technical",
      type: "Required",
      description:
        "Proven experience designing modular, scalable, and type-safe software architectures.",
      coverage: "3 questions",
      status: "Validated",
    },
    {
      id: `req-${Date.now()}-2`,
      name: "System performance and optimization",
      category: "Technical",
      type: "Required",
      description:
        "Profiling bottlenecks, memory optimization, and latency reduction in production systems.",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: `req-${Date.now()}-3`,
      name: "Collaborative technical communication",
      category: "Communication",
      type: "Required",
      description:
        "Writing clear technical specs, mentoring team members, and code review diligence.",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: `req-${Date.now()}-4`,
      name: "Automated testing and verification",
      category: "Technical",
      type: "Required",
      description: "Unit testing, integration testing, and CI/CD quality gate enforcement.",
      coverage: "1 question",
      status: "Partial",
    },
    {
      id: `req-${Date.now()}-5`,
      name: "Domain infrastructure & tooling",
      category: "Domain",
      type: "Preferred",
      description: "Familiarity with cloud primitives, containerization, and telemetry monitoring.",
      coverage: "1 question",
      status: "Needs validation",
    },
  ];
}

/**
 * AI Service: Parse resume text / PDF into candidate structured profile
 */
export async function analyzeResume(
  candidateName: string,
  resumeText: string,
): Promise<ParsedResumeProfile> {
  await delay(1600); // realistic parsing delay

  const words = resumeText.split(/\s+/).length;
  const isExperienced =
    words > 100 ||
    resumeText.toLowerCase().includes("senior") ||
    resumeText.toLowerCase().includes("lead");

  return {
    name: candidateName,
    experience: isExperienced ? "3.5 years" : "2.2 years",
    summary: `Analytical professional with experience driving data modeling, stakeholder alignment, and metric governance. Proven track record delivering production data pipelines and cross-functional reporting systems.`,
    skills: [
      "SQL",
      "Data Modeling",
      "Python",
      "Tableau",
      "A/B Testing",
      "Amplitude",
      "Stakeholder Alignment",
    ],
    projects: [
      {
        title: "Enterprise Revenue Data Mart",
        period: "2024–Present",
        description:
          "Architected canonical dimensional revenue schema in Snowflake, reducing query latency by 64% and unifying financial metrics.",
      },
      {
        title: "Cohort Retention & Onboarding Analytics",
        period: "2023–2024",
        description:
          "Built automated retention curve models revealing drop-off patterns in onboarding, leading to product interventions.",
      },
      {
        title: "Automated Data Hygiene Pipeline",
        period: "2022–2023",
        description:
          "Developed Python alerting scripts to identify transaction anomalies and prevent reporting discrepancies.",
      },
    ],
    education: [
      {
        degree: "B.S. in Computer Science / Information Systems",
        institution: "State University",
        year: "2022",
      },
    ],
    connectedClaims: [
      { claim: "Revenue dimensional modeling", questionCount: 1 },
      { claim: "Retention cohort dashboards", questionCount: 2 },
      { claim: "Cross-functional metric alignment", questionCount: 1 },
      { claim: "A/B experiment measurement", questionCount: 1 },
      { claim: "Python automation scripts", questionCount: 1 },
    ],
  };
}

/**
 * AI Service: Initial matching of candidate resume against job requirements
 */
export async function analyzeResumeAgainstRequirements(
  resume: ParsedResumeProfile,
  requirements: JobRequirement[],
): Promise<RequirementMatchAnalysis[]> {
  await delay(1200);

  return requirements.map((req, index) => {
    if (index === 0) {
      return {
        requirementId: req.id,
        requirementName: req.name,
        status: "Validated",
        evidence: `Resume indicates direct experience architecting canonical data models and production dimensional layers (${resume.projects[0]?.title || "Revenue Project"}).`,
        resumeSource: "Resume p.1 · Experience Section",
      };
    }

    if (index === 1 || index === 2) {
      return {
        requirementId: req.id,
        requirementName: req.name,
        status: "Validated",
        evidence: `Resume demonstrates relevant project work (${resume.projects[1]?.title || "Dashboard Work"}) with documented stakeholder delivery.`,
        resumeSource: "Resume p.1 · Project Claims",
      };
    }

    if (index === 3 || index === 4) {
      return {
        requirementId: req.id,
        requirementName: req.name,
        status: "Partial",
        evidence: `Found background mention of analytical concepts, but technical depth and variance reduction require interview validation.`,
        resumeSource: "Resume p.2 · Skills & Tools",
      };
    }

    return {
      requirementId: req.id,
      requirementName: req.name,
      status: "Needs validation",
      evidence: `Resume mentions usage and tool familiarity, but ownership scope vs engineering governance must be clarified in the interview.`,
      resumeSource: "Resume p.2 · Overview",
    };
  });
}

/**
 * AI Service: Generate interview session with questions and invitation token
 */
export async function generateInterview(config: {
  jobId: string;
  candidateId: string;
  requirements: JobRequirement[];
  numQuestions: number;
  durationMinutes: number;
  enableFollowUps: boolean;
}): Promise<{
  interviewToken: string;
  interviewUrl: string;
  questionsCount: number;
  estimatedDuration: string;
}> {
  await delay(1400);

  const token = `tok-${config.candidateId.substring(0, 3)}-${Date.now().toString().slice(-4)}`;
  const url = `/interview/${token}`;

  return {
    interviewToken: token,
    interviewUrl: url,
    questionsCount: Math.min(config.numQuestions, config.requirements.length || 6),
    estimatedDuration: `${config.durationMinutes}:00`,
  };
}

/**
 * AI Service: Analyze candidate spoken answer and generate evidence points
 */
export async function analyzeAnswer(
  question: string,
  answer: string,
  requirement: JobRequirement,
): Promise<{
  status: RequirementStatus;
  evidenceSummary: string;
  evidencePoints: string[];
  needsFollowUp: boolean;
  followUpPrompt?: string;
  followUpQuestion?: string;
}> {
  await delay(1500);

  const answerLower = answer.toLowerCase();
  const isShort = answer.split(" ").length < 15;

  if (isShort || answerLower.includes("helped") || answerLower.includes("contributed")) {
    return {
      status: "Needs validation",
      evidenceSummary: `Candidate indicated contribution to ${requirement.name}, but direct architecture ownership was ambiguous.`,
      evidencePoints: [
        "Candidate confirmed familiarity with relevant tooling",
        "Clarified team contribution rather than sole architecture governance",
        "Recommended for recruiter verification",
      ],
      needsFollowUp: true,
      followUpPrompt: "Let's clarify that.",
      followUpQuestion: `Did you directly design and govern the implementation for ${requirement.name}, or did you primarily consume pre-existing architecture?`,
    };
  }

  return {
    status: "Validated",
    evidenceSummary: `Candidate provided comprehensive explanation of ${requirement.name} with specific trade-offs and operational metrics.`,
    evidencePoints: [
      `Demonstrated thorough methodology for ${requirement.name}`,
      "Articulated specific operational decisions and metrics",
      "Evidence aligned with source resume claims",
    ],
    needsFollowUp: false,
  };
}

export const aiService = {
  extractRequirements,
  analyzeResume,
  analyzeResumeAgainstRequirements,
  generateInterview,
  analyzeAnswer,
};
