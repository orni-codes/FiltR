import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CandidateHeader } from "@/components/candidates/CandidateHeader";
import { CandidateOverview } from "@/components/candidates/CandidateOverview";
import { ResumeView } from "@/components/candidates/ResumeView";
import { CandidateInterview } from "@/components/candidates/CandidateInterview";
import { EvidenceView } from "@/components/evidence/EvidenceView";
import { CandidateReport } from "@/components/reports/CandidateReport";
import { getCandidate, getJob, getInterview, getResume, getCandidateReport } from "@/data/mock";

const candidateSearchSchema = z.object({
  tab: z
    .enum(["overview", "resume", "interview", "evidence", "report"])
    .default("overview")
    .catch("overview"),
  time: z.string().optional(),
});

type CandidateSearch = z.infer<typeof candidateSearchSchema>;

export const Route = createFileRoute("/_recruiter/jobs/$jobId/candidates/$candidateId")({
  validateSearch: (search: Record<string, unknown>): CandidateSearch =>
    candidateSearchSchema.parse(search),
  loader: ({ params }) => {
    const job = getJob(params.jobId);
    const candidate = getCandidate(params.candidateId);
    if (!job || !candidate) throw notFound();

    const resume = getResume(candidate.id);
    const interview = getInterview(candidate.id);
    const report = getCandidateReport(candidate.id);

    return { job, candidate, resume, interview, report };
  },
  component: CandidateWorkspacePage,
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Candidate not found.</p>
    </div>
  ),
});

const CANDIDATE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "resume", label: "Resume" },
  { id: "interview", label: "Interview" },
  { id: "evidence", label: "Evidence" },
  { id: "report", label: "Report" },
] as const;

function CandidateWorkspacePage() {
  const { job, candidate, resume, interview, report } = Route.useLoaderData();
  const { tab = "overview", time } = Route.useSearch();
  const navigate = useNavigate();

  const setTab = (newTab: CandidateSearch["tab"], newTime?: string) => {
    navigate({
      // @ts-expect-error — regenerated after build
      to: "/jobs/$jobId/candidates/$candidateId",
      params: { jobId: job.id, candidateId: candidate.id },
      search: { tab: newTab, ...(newTime ? { time: newTime } : {}) },
    });
  };

  const handleJumpToTimestamp = (targetTime: string) => {
    setTab("interview", targetTime);
  };

  const handleTimestampClick = (targetTime: string) => {
    setTab("interview", targetTime);
  };

  return (
    <>
      <CandidateHeader candidate={candidate} jobId={job.id} jobTitle={job.title} />

      {/* Candidate workspace tabs */}
      <div
        className="flex overflow-x-auto border-b border-border bg-card px-4 lg:px-8"
        role="tablist"
      >
        {CANDIDATE_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`h-11 shrink-0 border-b-2 px-3 text-xs transition-colors ${
              tab === t.id
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="px-4 py-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {tab === "overview" && (
            <CandidateOverview
              candidate={candidate}
              job={job}
              interview={interview}
              report={report}
              onGoToTab={(targetTab) => setTab(targetTab)}
            />
          )}

          {tab === "resume" && <ResumeView candidateName={candidate.name} resume={resume} />}

          {tab === "interview" && (
            <CandidateInterview
              candidateName={candidate.name}
              candidateInitials={candidate.initials}
              interview={interview}
              focusTime={time}
              onTimestampClick={handleTimestampClick}
            />
          )}

          {tab === "evidence" && interview && (
            <EvidenceView
              interview={interview}
              onJumpToTimestamp={handleJumpToTimestamp}
              onOpenReport={() => setTab("report")}
            />
          )}

          {tab === "report" && interview && report && (
            <CandidateReport
              candidateName={candidate.name}
              jobTitle={job.title}
              interview={interview}
              report={report}
              onJumpToTimestamp={handleJumpToTimestamp}
            />
          )}
        </div>
      </main>
    </>
  );
}
