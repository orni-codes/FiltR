/**
 * FiltR Central State Store
 * Manages Jobs, Candidates, Resumes, Interviews, and Reports in-session.
 * Provides reactivity via useSyncExternalStore and localStorage/sessionStorage persistence.
 */

import { useSyncExternalStore } from "react";
import type {
  Job,
  Candidate,
  Interview,
  Resume,
  CandidateReport,
  PipelineStage,
  ActivityEntry,
  JobRequirement,
} from "@/types/filtr";
import type { ParsedResumeProfile, RequirementMatchAnalysis } from "@/lib/ai/service";

const STORE_STORAGE_KEY = "filtr_app_store_v1";

interface StoreData {
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  resumes: Resume[];
  reports: CandidateReport[];
  tokenMap: Record<string, string>;
}

// ─── Default Initial Seed Data ────────────────────────────────────────────────

function getInitialStoreData(): StoreData {
  const DATA_ANALYST_REQUIREMENTS: Job["requirements"] = [
    {
      id: "req-sql",
      name: "Advanced SQL and data modeling",
      type: "Required",
      coverage: "3 questions",
      status: "Validated",
    },
    {
      id: "req-dashboard",
      name: "Dashboard design and data storytelling",
      type: "Required",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: "req-comms",
      name: "Cross-functional stakeholder communication",
      type: "Required",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: "req-stats",
      name: "Statistical analysis and experimentation",
      type: "Required",
      coverage: "2 questions",
      status: "Partial",
    },
    {
      id: "req-python",
      name: "Python for analytical workflows",
      type: "Preferred",
      coverage: "1 question",
      status: "Partial",
    },
    {
      id: "req-product",
      name: "Experience with product analytics",
      type: "Preferred",
      coverage: "2 questions",
      status: "Needs validation",
    },
  ];

  const UIUX_REQUIREMENTS: Job["requirements"] = [
    {
      id: "req-figma",
      name: "Figma and design systems",
      type: "Required",
      coverage: "3 questions",
      status: "Validated",
    },
    {
      id: "req-research",
      name: "User research and usability testing",
      type: "Required",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: "req-prototyping",
      name: "Rapid prototyping",
      type: "Required",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: "req-comms-ux",
      name: "Stakeholder presentation skills",
      type: "Required",
      coverage: "1 question",
      status: "Partial",
    },
    {
      id: "req-motion",
      name: "Motion design",
      type: "Preferred",
      coverage: "1 question",
      status: "Needs validation",
    },
  ];

  const FRONTEND_REQUIREMENTS: Job["requirements"] = [
    {
      id: "req-react",
      name: "React and component architecture",
      type: "Required",
      coverage: "3 questions",
      status: "Validated",
    },
    {
      id: "req-ts",
      name: "TypeScript and type safety",
      type: "Required",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: "req-perf",
      name: "Web performance optimization",
      type: "Required",
      coverage: "2 questions",
      status: "Partial",
    },
    {
      id: "req-a11y",
      name: "Accessibility standards",
      type: "Required",
      coverage: "2 questions",
      status: "Validated",
    },
    {
      id: "req-testing",
      name: "Testing strategies",
      type: "Preferred",
      coverage: "1 question",
      status: "Validated",
    },
    {
      id: "req-graphql",
      name: "GraphQL and API integration",
      type: "Preferred",
      coverage: "1 question",
      status: "Needs validation",
    },
  ];

  const JOBS: Job[] = [
    {
      id: "data-analyst",
      title: "Data Analyst",
      location: "Bengaluru",
      workMode: "Hybrid",
      experience: "2–4 years",
      employmentType: "Full-time",
      description:
        "Own analytical projects from ambiguous business question to trusted recommendation. Partner with product, operations, and finance to define metrics, build durable data models, and communicate findings that change decisions.",
      requiredSkills: ["SQL", "Data modeling", "Experimentation", "Data visualization"],
      preferredSkills: ["Python", "Amplitude", "dbt", "Product analytics"],
      requirements: DATA_ANALYST_REQUIREMENTS,
      candidateCount: 24,
      interviewCount: 18,
      activity: "4 updates today",
      status: "Active",
    },
    {
      id: "uiux-designer",
      title: "UI/UX Designer",
      location: "Remote",
      workMode: "Remote",
      experience: "3–5 years",
      employmentType: "Full-time",
      description:
        "Shape product experiences from discovery through delivery. Work with product and engineering to craft interfaces that are both intuitive and technically feasible, and validate designs with real users before shipping.",
      requiredSkills: ["Figma", "Design systems", "User research", "Prototyping"],
      preferredSkills: ["Motion design", "Framer", "Accessibility"],
      requirements: UIUX_REQUIREMENTS,
      candidateCount: 16,
      interviewCount: 11,
      activity: "2 updates today",
      status: "Active",
    },
    {
      id: "frontend-dev",
      title: "Frontend Developer",
      location: "Bengaluru",
      workMode: "Hybrid",
      experience: "3–6 years",
      employmentType: "Full-time",
      description:
        "Build the interfaces that recruiters and candidates experience every day. Own component architecture, performance, and accessibility across the FiltR product, working closely with design and backend teams.",
      requiredSkills: ["React", "TypeScript", "Performance", "Accessibility"],
      preferredSkills: ["GraphQL", "Testing", "CI/CD"],
      requirements: FRONTEND_REQUIREMENTS,
      candidateCount: 31,
      interviewCount: 22,
      activity: "8 updates today",
      status: "Active",
    },
  ];

  const CANDIDATES: Candidate[] = [
    {
      id: "alex-johnson",
      initials: "AJ",
      name: "Alex Johnson",
      experience: "2.4 years",
      jobId: "data-analyst",
      interviewStatus: "Completed",
      coverageLabel: "3/6 validated · 2 partial",
      activity: "12 min ago",
      interviewToken: "tok-aj-001",
    },
    {
      id: "sarah-chen",
      initials: "SC",
      name: "Sarah Chen",
      experience: "3 years",
      jobId: "data-analyst",
      interviewStatus: "In Progress",
      coverageLabel: "3/6 validated",
      activity: "1 hour ago",
      interviewToken: "tok-sc-001",
    },
    {
      id: "rahul-das",
      initials: "RD",
      name: "Rahul Das",
      experience: "1.8 years",
      jobId: "data-analyst",
      interviewStatus: "Pending",
      coverageLabel: "—",
      activity: "Yesterday",
      interviewToken: "tok-rd-001",
    },
    {
      id: "lena-morales",
      initials: "LM",
      name: "Lena Morales",
      experience: "4.1 years",
      jobId: "data-analyst",
      interviewStatus: "Needs Review",
      coverageLabel: "4/6 validated · 1 partial",
      activity: "Yesterday",
      interviewToken: "tok-lm-001",
    },
    {
      id: "priya-sharma",
      initials: "PS",
      name: "Priya Sharma",
      experience: "4 years",
      jobId: "uiux-designer",
      interviewStatus: "Completed",
      coverageLabel: "4/5 validated",
      activity: "3 hours ago",
      interviewToken: "tok-ps-001",
    },
    {
      id: "tom-wells",
      initials: "TW",
      name: "Tom Wells",
      experience: "5.2 years",
      jobId: "uiux-designer",
      interviewStatus: "In Progress",
      coverageLabel: "2/5 validated",
      activity: "Today",
      interviewToken: "tok-tw-001",
    },
    {
      id: "james-okafor",
      initials: "JO",
      name: "James Okafor",
      experience: "3.5 years",
      jobId: "frontend-dev",
      interviewStatus: "Completed",
      coverageLabel: "6/7 validated",
      activity: "1 hour ago",
      interviewToken: "tok-jo-001",
    },
    {
      id: "mei-lin",
      initials: "ML",
      name: "Mei Lin",
      experience: "4.8 years",
      jobId: "frontend-dev",
      interviewStatus: "Completed",
      coverageLabel: "7/7 validated",
      activity: "2 hours ago",
      interviewToken: "tok-ml-001",
    },
  ];

  const INTERVIEWS: Interview[] = [
    {
      id: "int-alex-da",
      candidateId: "alex-johnson",
      jobId: "data-analyst",
      status: "completed",
      duration: "24:18",
      questionsTotal: 6,
      questionsAnswered: 6,
      transcript: [
        {
          id: "tr-1",
          questionNumber: 1,
          timestamp: "02:14",
          title: "Advanced SQL & Dimensional Modeling",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
          aiQuestion:
            "Can you walk through an end-to-end data model you architected in SQL, and how you handled dimensional modeling, indexing, and join optimization for high query volumes?",
          candidateAnswer:
            "At Northstar Commerce, I designed the canonical revenue data mart. We processed roughly 4 million event rows daily. I implemented Kimball star schema modeling with conformed date and customer dimensions, partitioned the fact table on transaction date, and established surrogate keys. Query latency on executive dashboard aggregations dropped by 64%.",
          candidateAnswerTime: "02:14–04:02",
        },
        {
          id: "tr-2",
          questionNumber: 2,
          timestamp: "06:12",
          title: "Dashboard Design & Data Storytelling",
          requirementId: "req-dashboard",
          requirementName: "Dashboard design and data storytelling",
          aiQuestion:
            "Describe how you designed an executive dashboard. What core metrics did you highlight and how did you tailor the presentation to prevent misinterpretation by non-technical stakeholders?",
          candidateAnswer:
            "I rebuilt our executive customer retention dashboard. Rather than raw monthly churn, I structured it around weekly cohort retention curves with confidence bands. I included an executive summary card with plain-language drivers at the top and progressive disclosure drill-downs for operational leads. It revealed that onboarding drop-off occurred in day 3, leading to product workflow fixes.",
          candidateAnswerTime: "06:12–08:45",
        },
        {
          id: "tr-3",
          questionNumber: 3,
          timestamp: "10:30",
          title: "Cross-functional Stakeholder Alignment",
          requirementId: "req-comms",
          requirementName: "Cross-functional stakeholder communication",
          aiQuestion:
            "Tell me about a time a leader or stakeholder challenged your metric definition or analytical conclusions. How did you handle the friction and align on next steps?",
          candidateAnswer:
            "The VP of Sales disputed our definition of Active Customer because marketing was counting newsletter openers while finance only counted completed purchases. Instead of arguing in meetings, I held a cross-functional alignment workshop, documented both formulas with their revenue impact, and created a unified metric dictionary that both departments signed off on.",
          candidateAnswerTime: "10:30–12:55",
        },
        {
          id: "tr-4",
          questionNumber: 4,
          timestamp: "14:20",
          title: "Statistical Analysis & Experimentation",
          requirementId: "req-stats",
          requirementName: "Statistical analysis and experimentation",
          aiQuestion:
            "How do you approach A/B test analysis when sample sizes are uneven or metric variance is high? What statistical tests or guardrails do you apply?",
          candidateAnswer:
            "I check for sample ratio mismatch first. When variance is high, I use log transformations or non-parametric Mann-Whitney U tests rather than standard t-tests. I also ensure minimum detectable effect is calculated before launching tests.",
          candidateAnswerTime: "14:20–16:15",
        },
        {
          id: "tr-5",
          questionNumber: 5,
          timestamp: "18:05",
          title: "Product Analytics & Event Taxonomy",
          requirementId: "req-product",
          requirementName: "Experience with product analytics",
          aiQuestion:
            "What is your experience setting up event taxonomy and tracking user cohorts in product analytics platforms such as Amplitude, Mixpanel, or PostHog?",
          candidateAnswer:
            "I used Amplitude daily to create funnel analyses and retention cohorts for the checkout optimization team. I helped document naming conventions for three new user actions.",
          candidateAnswerTime: "18:05–19:40",
          hasFollowUp: true,
          aiFollowUp:
            "Did you directly design and govern the event taxonomy schema across the engineering codebase, or did you primarily consume pre-existing event streams for analysis?",
          aiFollowUpTime: "19:42",
          candidateFollowUpAnswer:
            "Our platform engineering team owned the schema definitions in code. My role was primarily auditing tracking completeness in Amplitude and building the downstream cohort views.",
          candidateFollowUpTime: "19:45–21:10",
        },
        {
          id: "tr-6",
          questionNumber: 6,
          timestamp: "22:15",
          title: "Python for Analytical Automation",
          requirementId: "req-python",
          requirementName: "Python for analytical workflows",
          aiQuestion:
            "How do you leverage Python (e.g., pandas, automated data scripts) to enhance your analytical workflows and automate repetitive data hygiene checks?",
          candidateAnswer:
            "I write Python scripts with pandas and SQLAlchemy for data cleaning and API ingestion when warehouse connectors are missing. I built a weekly anomaly detection script that flags sudden revenue variance.",
          candidateAnswerTime: "22:15–24:10",
        },
      ],
      evidenceItems: [
        {
          id: "ev-1",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
          requirementType: "Required",
          resumeClaim: "Built finance-ready revenue models used in monthly planning",
          resumeSource: "Resume p.1 · Northstar Commerce",
          interviewQuestionNumber: 1,
          question:
            "Can you walk through an end-to-end data model you architected in SQL, and how you handled dimensional modeling, indexing, and join optimization for high query volumes?",
          answer:
            "At Northstar Commerce, I designed the canonical revenue data mart. We processed roughly 4 million event rows daily. I implemented Kimball star schema modeling with conformed date and customer dimensions, partitioned the fact table on transaction date, and established surrogate keys. Query latency on executive dashboard aggregations dropped by 64%.",
          evidence:
            "Candidate demonstrated comprehensive understanding of Kimball star schema design, table partitioning, surrogate key strategies, and query performance optimization on 4M+ daily event rows.",
          evidencePoints: [
            "Implemented Kimball star schema with conformed date & customer dimensions",
            "Partitioned fact table on transaction date to optimize latency",
            "Decreased aggregation query runtime by 64% in production",
          ],
          status: "Validated",
          timestamp: "02:14",
          duration: "01:48",
        },
        {
          id: "ev-2",
          requirementId: "req-dashboard",
          requirementName: "Dashboard design and data storytelling",
          requirementType: "Required",
          resumeClaim: "Created cohort dashboards that identified onboarding drop-off",
          resumeSource: "Resume p.1 · Northstar Commerce",
          interviewQuestionNumber: 2,
          question:
            "Describe how you designed an executive dashboard. What core metrics did you highlight and how did you tailor the presentation to prevent misinterpretation by non-technical stakeholders?",
          answer:
            "I rebuilt our executive customer retention dashboard. Rather than raw monthly churn, I structured it around weekly cohort retention curves with confidence bands. I included an executive summary card with plain-language drivers at the top and progressive disclosure drill-downs for operational leads. It revealed that onboarding drop-off occurred in day 3, leading to product workflow fixes.",
          evidence:
            "Clear audience framing and data storytelling; candidate structured retention views around weekly cohorts with executive summary insights that directly drove product intervention.",
          evidencePoints: [
            "Shifted executive reporting from misleading monthly totals to cohort retention curves",
            "Implemented progressive disclosure for multi-level technical & non-technical audiences",
            "Insight directly initiated an onboarding redesign experiment",
          ],
          status: "Validated",
          timestamp: "06:12",
          duration: "02:33",
        },
        {
          id: "ev-3",
          requirementId: "req-comms",
          requirementName: "Cross-functional stakeholder communication",
          requirementType: "Required",
          resumeClaim: "Maintained core BI reporting layer for 12 internal stakeholders",
          resumeSource: "Resume p.2 · Orbit Labs",
          interviewQuestionNumber: 3,
          question:
            "Tell me about a time a leader or stakeholder challenged your metric definition or analytical conclusions. How did you handle the friction and align on next steps?",
          answer:
            "The VP of Sales disputed our definition of Active Customer because marketing was counting newsletter openers while finance only counted completed purchases. Instead of arguing in meetings, I held a cross-functional alignment workshop, documented both formulas with their revenue impact, and created a unified metric dictionary that both departments signed off on.",
          evidence:
            "Strong conflict resolution and diplomacy; established canonical metric dictionary across conflicting executive teams with documented business trade-offs.",
          evidencePoints: [
            "Identified cross-department definition discrepancies between sales, marketing, and finance",
            "Organized structured workshop to document financial impact rather than debate definitions",
            "Created formal metric dictionary adopted organization-wide",
          ],
          status: "Validated",
          timestamp: "10:30",
          duration: "02:25",
        },
        {
          id: "ev-4",
          requirementId: "req-stats",
          requirementName: "Statistical analysis and experimentation",
          requirementType: "Required",
          resumeClaim: "Partnered with product teams on experiment measurement",
          resumeSource: "Resume p.1 · Northstar Commerce",
          interviewQuestionNumber: 4,
          question:
            "How do you approach A/B test analysis when sample sizes are uneven or metric variance is high? What statistical tests or guardrails do you apply?",
          answer:
            "I check for sample ratio mismatch first. When variance is high, I use log transformations or non-parametric Mann-Whitney U tests rather than standard t-tests. I also ensure minimum detectable effect is calculated before launching tests.",
          evidence:
            "Sound statistical awareness covering SRM checks and non-parametric tests, but candidate did not explain sequential testing guardrails, variance reduction (CUPED), or false discovery rate adjustments.",
          evidencePoints: [
            "Understands sample ratio mismatch (SRM) detection",
            "Applies Mann-Whitney U tests for skewed data distributions",
            "Lacks demonstration of advanced variance reduction (CUPED) or multi-variant corrections",
          ],
          status: "Partial",
          timestamp: "14:20",
          duration: "01:55",
        },
        {
          id: "ev-5",
          requirementId: "req-python",
          requirementName: "Python for analytical workflows",
          requirementType: "Preferred",
          resumeClaim: "Automated weekly reporting pipeline, saving 6 hours per week",
          resumeSource: "Resume p.2 · Orbit Labs",
          interviewQuestionNumber: 6,
          question:
            "How do you leverage Python (e.g., pandas, automated data scripts) to enhance your analytical workflows and automate repetitive data hygiene checks?",
          answer:
            "I write Python scripts with pandas and SQLAlchemy for data cleaning and API ingestion when warehouse connectors are missing. I built a weekly anomaly detection script that flags sudden revenue variance.",
          evidence:
            "Candidate demonstrated practical data engineering automation with pandas and SQLAlchemy; lacks evidence around testing, CI pipeline integration, or production packaging.",
          evidencePoints: [
            "Uses pandas and SQLAlchemy for custom API ingestion scripts",
            "Implemented automated anomaly detection alerting for revenue fluctuations",
            "Limited depth regarding unit testing or automated DAG orchestration",
          ],
          status: "Partial",
          timestamp: "22:15",
          duration: "01:55",
        },
        {
          id: "ev-6",
          requirementId: "req-product",
          requirementName: "Experience with product analytics",
          requirementType: "Preferred",
          resumeClaim: "Cohort analysis & user funnel reviews in Amplitude",
          resumeSource: "Resume p.1 · Northstar Commerce",
          interviewQuestionNumber: 5,
          question:
            "What is your experience setting up event taxonomy and tracking user cohorts in product analytics platforms such as Amplitude, Mixpanel, or PostHog?",
          answer:
            "I used Amplitude daily to create funnel analyses and retention cohorts for the checkout optimization team. I helped document naming conventions for three new user actions.",
          evidence:
            "Candidate has solid consumption and funnel analysis experience in Amplitude, but follow-up clarified that platform engineering owned taxonomy architecture and schema governance.",
          evidencePoints: [
            "Experienced in creating funnels, cohort segmentation, and retention charts in Amplitude",
            "Audited client-side event tracking completeness",
            "Clarified that engineering owned code-level event schema governance (Recruiter review recommended)",
          ],
          status: "Needs validation",
          timestamp: "18:05",
          duration: "03:05",
          hasFollowUp: true,
          followUpQuestion:
            "Did you directly design and govern the event taxonomy schema across the engineering codebase, or did you primarily consume pre-existing event streams for analysis?",
          followUpAnswer:
            "Our platform engineering team owned the schema definitions in code. My role was primarily auditing tracking completeness in Amplitude and building the downstream cohort views.",
          followUpTimestamp: "19:42",
        },
      ],
    },
  ];

  const RESUMES: Resume[] = [
    {
      candidateId: "alex-johnson",
      pages: 2,
      analyzedDate: "Sep 19",
      entries: [
        {
          company: "Northstar Commerce",
          title: "Data Analyst",
          period: "2024–Present",
          location: "Bengaluru",
          bullets: [
            "Built finance-ready revenue models in SQL used for board-level reporting.",
            "Created cohort dashboards in Tableau identifying drop-off in day 3 of onboarding.",
            "Partnered with growth engineering on A/B experiment measurement and conversion funnels.",
          ],
        },
        {
          company: "Orbit Labs",
          title: "Business Intelligence Associate",
          period: "2022–2024",
          location: "Bengaluru",
          bullets: [
            "Maintained core BI data warehouse and dimensional schema for 12 internal stakeholders.",
            "Automated weekly data quality checks with Python scripts, saving 6 hours weekly.",
          ],
        },
      ],
      connectedClaims: [
        { claim: "Revenue data modeling", questionCount: 1 },
        { claim: "Cohort analysis", questionCount: 2 },
        { claim: "Stakeholder alignment", questionCount: 1 },
        { claim: "Experiment measurement", questionCount: 1 },
        { claim: "Python automation", questionCount: 1 },
      ],
    },
  ];

  const REPORTS: CandidateReport[] = [
    {
      candidateId: "alex-johnson",
      jobId: "data-analyst",
      requirementsCovered: 5,
      requirementsTotal: 6,
      validatedCount: 3,
      partialCount: 2,
      needsValidationCount: 1,
      confidence: "High",
      completedDate: "Sep 19, 2026",
      humanReviewRequired: true,
      auditTrail: [
        {
          id: "aud-1",
          timestamp: "Sep 19, 09:14 AM",
          eventType: "Resume Uploaded",
          description: "Candidate resume 'Alex_Johnson_Resume_2026.pdf' (2 pages) uploaded.",
          source: "Candidate Portal",
        },
        {
          id: "aud-2",
          timestamp: "Sep 19, 09:15 AM",
          eventType: "Resume Parsed",
          description: "Extracted 5 key work claims and verified 2 previous employment periods.",
          source: "FiltR Resume Parser",
        },
        {
          id: "aud-3",
          timestamp: "Sep 19, 09:16 AM",
          eventType: "Requirement Identified",
          description:
            "Mapped resume claims to 6 role requirements for Data Analyst (Bengaluru).",
          source: "Job Criteria Engine",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
        },
        {
          id: "aud-4",
          timestamp: "Sep 19, 10:02 AM",
          eventType: "Interview Question Generated",
          description:
            "Generated contextual question on SQL dimensional modeling & revenue reconciliation.",
          source: "Interview Engine Q1",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
        },
        {
          id: "aud-5",
          timestamp: "Sep 19, 10:06 AM",
          eventType: "Candidate Answered",
          description:
            "Candidate submitted 1m 48s spoken answer explaining Kimball star schema.",
          source: "Interview Stream @ 02:14",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
        },
        {
          id: "aud-6",
          timestamp: "Sep 19, 10:07 AM",
          eventType: "Evidence Extracted",
          description:
            "Extracted proof of Kimball modeling, table partitioning, and 64% query optimization.",
          source: "AI Synthesis Engine",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
        },
        {
          id: "aud-7",
          timestamp: "Sep 19, 10:07 AM",
          eventType: "Status Assigned",
          description: "Requirement 'Advanced SQL and data modeling' assigned status VALIDATED.",
          source: "FiltR Evaluation Matrix",
          requirementId: "req-sql",
          requirementName: "Advanced SQL and data modeling",
        },
        {
          id: "aud-8",
          timestamp: "Sep 19, 10:20 AM",
          eventType: "Follow-up Generated",
          description:
            "Initial answer lacked schema governance clarity; adaptive follow-up clarification question triggered.",
          source: "Interview Engine Q5",
          requirementId: "req-product",
          requirementName: "Experience with product analytics",
        },
        {
          id: "aud-9",
          timestamp: "Sep 19, 10:24 AM",
          eventType: "Candidate Answered",
          description:
            "Candidate clarified that engineering owned code-level event schema governance.",
          source: "Interview Stream @ 19:42",
          requirementId: "req-product",
          requirementName: "Experience with product analytics",
        },
        {
          id: "aud-10",
          timestamp: "Sep 19, 10:28 AM",
          eventType: "Status Assigned",
          description:
            "Requirement 'Experience with product analytics' assigned status NEEDS VALIDATION (Recruiter review required).",
          source: "FiltR Evaluation Matrix",
          requirementId: "req-product",
          requirementName: "Experience with product analytics",
        },
      ],
    },
    {
      candidateId: "lena-morales",
      jobId: "data-analyst",
      requirementsCovered: 4,
      requirementsTotal: 6,
      validatedCount: 4,
      partialCount: 1,
      needsValidationCount: 1,
      confidence: "Medium",
      completedDate: "Sep 18, 2026",
      humanReviewRequired: true,
      auditTrail: [
        {
          id: "aud-lm-1",
          timestamp: "Sep 18, 02:10 PM",
          eventType: "Resume Uploaded",
          description: "Candidate resume uploaded.",
          source: "Candidate Portal",
        },
        {
          id: "aud-lm-2",
          timestamp: "Sep 18, 02:45 PM",
          eventType: "Candidate Answered",
          description: "Interview completed across 6 questions.",
          source: "Interview Stream",
        },
        {
          id: "aud-lm-3",
          timestamp: "Sep 18, 02:46 PM",
          eventType: "Status Assigned",
          description: "4 requirements Validated, 1 Partial, 1 Needs Validation.",
          source: "FiltR Evaluation Matrix",
        },
      ],
    },
    {
      candidateId: "priya-sharma",
      jobId: "uiux-designer",
      requirementsCovered: 4,
      requirementsTotal: 5,
      validatedCount: 4,
      partialCount: 0,
      needsValidationCount: 1,
      confidence: "High",
      completedDate: "Sep 19, 2026",
      humanReviewRequired: true,
      auditTrail: [],
    },
    {
      candidateId: "james-okafor",
      jobId: "frontend-dev",
      requirementsCovered: 6,
      requirementsTotal: 7,
      validatedCount: 5,
      partialCount: 1,
      needsValidationCount: 1,
      confidence: "High",
      completedDate: "Sep 19, 2026",
      humanReviewRequired: true,
      auditTrail: [],
    },
    {
      candidateId: "mei-lin",
      jobId: "frontend-dev",
      requirementsCovered: 7,
      requirementsTotal: 7,
      validatedCount: 7,
      partialCount: 0,
      needsValidationCount: 0,
      confidence: "High",
      completedDate: "Sep 19, 2026",
      humanReviewRequired: false,
      auditTrail: [],
    },
  ];

  const TOKEN_MAP: Record<string, string> = {
    demo: "alex-johnson",
    "tok-aj-001": "alex-johnson",
    "tok-sc-001": "sarah-chen",
    "tok-rd-001": "rahul-das",
    "tok-lm-001": "lena-morales",
    "tok-ps-001": "priya-sharma",
    "tok-tw-001": "tom-wells",
    "tok-jo-001": "james-okafor",
    "tok-ml-001": "mei-lin",
  };

  return {
    jobs: JOBS,
    candidates: CANDIDATES,
    interviews: INTERVIEWS,
    resumes: RESUMES,
    reports: REPORTS,
    tokenMap: TOKEN_MAP,
  };
}

// ─── Observable Store State ───────────────────────────────────────────────────

let currentStore: StoreData = (function () {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load store from localStorage", e);
    }
  }
  return getInitialStoreData();
})();

const listeners = new Set<() => void>();

function notifyListeners() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(currentStore));
    } catch (e) {
      console.warn("Failed to save store to localStorage", e);
    }
  }
  listeners.forEach((listener) => listener());
}

// ─── Store API Actions ────────────────────────────────────────────────────────

export const filtRStore = {
  getSnapshot(): StoreData {
    return currentStore;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Add Job
  addJob(newJob: Job): void {
    currentStore = {
      ...currentStore,
      jobs: [newJob, ...currentStore.jobs],
    };
    notifyListeners();
  },

  // Update Job Requirements
  updateJobRequirements(jobId: string, requirements: JobRequirement[]): void {
    currentStore = {
      ...currentStore,
      jobs: currentStore.jobs.map((j) => (j.id === jobId ? { ...j, requirements } : j)),
    };
    notifyListeners();
  },

  // Add Candidate
  addCandidate(candidateData: {
    jobId: string;
    name: string;
    email: string;
    appliedDate: string;
    stage: string;
    profile?: ParsedResumeProfile;
    resumeAnalysis?: RequirementMatchAnalysis[];
  }): Candidate {
    const candidateId = `${candidateData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const interviewToken = `tok-${candidateId.substring(0, 3)}-${Date.now().toString().slice(-4)}`;
    
    const initials = candidateData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    const newCandidate: Candidate = {
      id: candidateId,
      initials,
      name: candidateData.name,
      experience: candidateData.profile?.experience || "2 years",
      jobId: candidateData.jobId,
      interviewStatus: "Pending",
      coverageLabel: "—",
      activity: "Just now",
      interviewToken,
    };

    // Create resume from profile if available
    let resume: Resume | undefined;
    if (candidateData.profile) {
      resume = {
        candidateId,
        pages: 2,
        analyzedDate: new Date().toISOString().split('T')[0],
        entries: candidateData.profile.projects?.map((p: any) => ({
          company: "Previous Company",
          title: p.title,
          period: p.period,
          bullets: [p.description],
        })) || [],
        connectedClaims: candidateData.profile.connectedClaims || [],
      };
    }

    currentStore = {
      ...currentStore,
      candidates: [newCandidate, ...currentStore.candidates],
      resumes: resume ? [resume, ...currentStore.resumes] : currentStore.resumes,
      jobs: currentStore.jobs.map((j) =>
        j.id === candidateData.jobId ? { ...j, candidateCount: j.candidateCount + 1 } : j,
      ),
      tokenMap: {
        ...currentStore.tokenMap,
        [interviewToken]: candidateId,
      },
    };
    notifyListeners();
    
    return newCandidate;
  },

  // Register / Add Interview
  addInterview(interview: Interview, token: string): void {
    currentStore = {
      ...currentStore,
      interviews: [interview, ...currentStore.interviews.filter((i) => i.candidateId !== interview.candidateId)],
      tokenMap: {
        ...currentStore.tokenMap,
        [token]: interview.candidateId,
      },
      jobs: currentStore.jobs.map((j) =>
        j.id === interview.jobId ? { ...j, interviewCount: j.interviewCount + 1 } : j,
      ),
    };
    notifyListeners();
  },

  // Complete Candidate Interview
  completeCandidateInterview(candidateId: string, interviewData?: Partial<Interview>): void {
    const candidate = currentStore.candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const existingInterview = currentStore.interviews.find((i) => i.candidateId === candidateId);
    const updatedInterview: Interview = {
      id: existingInterview?.id || `int-${candidateId}`,
      candidateId,
      jobId: candidate.jobId,
      status: "completed",
      duration: interviewData?.duration || "18:45",
      questionsTotal: interviewData?.questionsTotal || 6,
      questionsAnswered: interviewData?.questionsAnswered || 6,
      transcript: interviewData?.transcript || existingInterview?.transcript || [],
      evidenceItems: interviewData?.evidenceItems || existingInterview?.evidenceItems || [],
    };

    // Calculate coverage counts
    const validated = updatedInterview.evidenceItems.filter((e) => e.status === "Validated").length;
    const partial = updatedInterview.evidenceItems.filter((e) => e.status === "Partial").length;
    const needsValidation = updatedInterview.evidenceItems.filter((e) => e.status === "Needs validation").length;
    const total = updatedInterview.evidenceItems.length || 6;

    const newReport: CandidateReport = {
      candidateId,
      jobId: candidate.jobId,
      requirementsCovered: validated + partial,
      requirementsTotal: total,
      validatedCount: validated,
      partialCount: partial,
      needsValidationCount: needsValidation,
      confidence: validated >= 3 ? "High" : "Medium",
      completedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      humanReviewRequired: needsValidation > 0 || partial > 0,
      auditTrail: [
        {
          id: `aud-${Date.now()}-1`,
          timestamp: "Just now",
          eventType: "Interview Question Generated",
          description: "Candidate completed interactive spoken video interview session.",
          source: "Interview Engine",
        },
        {
          id: `aud-${Date.now()}-2`,
          timestamp: "Just now",
          eventType: "Evidence Extracted",
          description: `Extracted requirement evidence points across ${total} questions.`,
          source: "AI Synthesis Engine",
        },
        {
          id: `aud-${Date.now()}-3`,
          timestamp: "Just now",
          eventType: "Status Assigned",
          description: `Evaluated ${validated} Validated, ${partial} Partial, ${needsValidation} Needs Validation.`,
          source: "FiltR Evaluation Matrix",
        },
      ],
    };

    currentStore = {
      ...currentStore,
      candidates: currentStore.candidates.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              interviewStatus: "Completed",
              coverageLabel: `${validated}/${total} validated`,
              activity: "Just now",
            }
          : c,
      ),
      interviews: [
        updatedInterview,
        ...currentStore.interviews.filter((i) => i.candidateId !== candidateId),
      ],
      reports: [
        newReport,
        ...currentStore.reports.filter((r) => r.candidateId !== candidateId),
      ],
    };
    notifyListeners();
  },

  // Reset to default seed
  resetStore(): void {
    currentStore = getInitialStoreData();
    notifyListeners();
  },

  // Generate mock interview for a candidate
  generateMockInterview(candidateId: string, jobId: string, requirements: JobRequirement[]): Interview {
    const interviewId = `int-${candidateId}`;
    const questionsTotal = requirements.length;
    
    const interview: Interview = {
      id: interviewId,
      candidateId,
      jobId,
      status: "not_started",
      duration: "00:00",
      questionsTotal,
      questionsAnswered: 0,
      transcript: [],
      evidenceItems: [],
    };

    const alreadyGenerated = currentStore.interviews.some((item) => item.candidateId === candidateId);

    currentStore = {
      ...currentStore,
      interviews: [
        interview,
        ...currentStore.interviews.filter((item) => item.candidateId !== candidateId),
      ],
      jobs: currentStore.jobs.map((j) =>
        j.id === jobId && !alreadyGenerated ? { ...j, interviewCount: j.interviewCount + 1 } : j,
      ),
    };
    notifyListeners();

    return interview;
  },
};

// ─── React Hook for Store Subscription ────────────────────────────────────────

export function useFiltRStore(): StoreData {
  return useSyncExternalStore(filtRStore.subscribe, filtRStore.getSnapshot, filtRStore.getSnapshot);
}

// ─── Store Accessor Helpers ───────────────────────────────────────────────────

export function getJobs(): Job[] {
  return currentStore.jobs;
}

export function getJob(id: string): Job | undefined {
  return currentStore.jobs.find((j) => j.id === id);
}

export function getCandidatesForJob(jobId: string): Candidate[] {
  return currentStore.candidates.filter((c) => c.jobId === jobId);
}

export function getCandidate(id: string): Candidate | undefined {
  return currentStore.candidates.find((c) => c.id === id);
}

export function getCandidateByToken(token: string): Candidate | undefined {
  const candidateId = currentStore.tokenMap[token];
  if (!candidateId) return undefined;
  return currentStore.candidates.find((c) => c.id === candidateId);
}

export function getInterview(candidateId: string): Interview | undefined {
  return currentStore.interviews.find((i) => i.candidateId === candidateId);
}

export function getResume(candidateId: string): Resume | undefined {
  return currentStore.resumes.find((r) => r.candidateId === candidateId);
}

export function getReport(candidateId: string): CandidateReport | undefined {
  return currentStore.reports.find((r) => r.candidateId === candidateId);
}

export const getCandidateReport = getReport;

export function getJobReportsForJob(
  jobId: string,
): Array<{ candidate: Candidate; report: CandidateReport }> {
  return currentStore.reports
    .filter((r) => r.jobId === jobId)
    .map((r) => ({
      candidate: currentStore.candidates.find((c) => c.id === r.candidateId)!,
      report: r,
    }))
    .filter((item) => item.candidate !== undefined);
}
