/**
 * FiltR mock data module.
 * Bridges to the centralized store in src/lib/store.ts.
 */

export {
  filtRStore,
  useFiltRStore,
  getJobs,
  getJob,
  getCandidatesForJob,
  getCandidate,
  getCandidateByToken,
  getInterview,
  getResume,
  getReport,
  getCandidateReport,
  getJobReportsForJob,
} from "@/lib/store";

import type { PipelineStage, ActivityEntry } from "@/types/filtr";

const PIPELINE_STAGES: Record<string, PipelineStage[]> = {
  "data-analyst": [
    { label: "Candidates", count: 24 },
    { label: "Interview Invited", count: 18 },
    { label: "In Progress", count: 5 },
    { label: "Completed", count: 11 },
    { label: "Needs Review", count: 3 },
  ],
  "uiux-designer": [
    { label: "Candidates", count: 16 },
    { label: "Interview Invited", count: 11 },
    { label: "In Progress", count: 3 },
    { label: "Completed", count: 7 },
    { label: "Needs Review", count: 2 },
  ],
  "frontend-dev": [
    { label: "Candidates", count: 31 },
    { label: "Interview Invited", count: 22 },
    { label: "In Progress", count: 8 },
    { label: "Completed", count: 12 },
    { label: "Needs Review", count: 4 },
  ],
};

const RECENT_ACTIVITY: Record<string, ActivityEntry[]> = {
  "data-analyst": [
    {
      initials: "AJ",
      title: "Alex Johnson completed the AI interview",
      note: "3 Validated · 2 Partial · 1 Needs Validation",
      time: "12 min ago",
    },
    {
      initials: "SC",
      title: "Sarah Chen answered question 4 of 6",
      note: "Interview in progress",
      time: "1 hour ago",
    },
    {
      initials: "LM",
      title: "Lena Morales was flagged for recruiter review",
      note: "Statistical analysis needs validation",
      time: "Yesterday",
    },
  ],
  "uiux-designer": [
    {
      initials: "PS",
      title: "Priya Sharma completed the AI interview",
      note: "4 of 5 requirements validated",
      time: "3 hours ago",
    },
    {
      initials: "TW",
      title: "Tom Wells answered question 2 of 5",
      note: "Interview in progress",
      time: "Today",
    },
  ],
  "frontend-dev": [
    {
      initials: "ML",
      title: "Mei Lin completed the AI interview",
      note: "7 of 7 requirements validated",
      time: "2 hours ago",
    },
    {
      initials: "JO",
      title: "James Okafor completed the AI interview",
      note: "6 of 7 requirements validated",
      time: "1 hour ago",
    },
  ],
};

export function getPipelineStages(jobId: string): PipelineStage[] {
  return (
    PIPELINE_STAGES[jobId] ?? [
      { label: "Candidates", count: 1 },
      { label: "Interview Invited", count: 1 },
      { label: "In Progress", count: 0 },
      { label: "Completed", count: 0 },
      { label: "Needs Review", count: 0 },
    ]
  );
}

export function getRecentActivity(jobId: string): ActivityEntry[] {
  return (
    RECENT_ACTIVITY[jobId] ?? [
      {
        initials: "FR",
        title: "Role criteria and requirements generated",
        note: "Ready for candidate pipeline",
        time: "Just now",
      },
    ]
  );
}
