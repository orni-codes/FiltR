import {
  FileText,
  Video,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Metric } from "@/components/shared/Metric";
import { statusTone } from "@/lib/status-utils";
import { EvidenceChain } from "@/components/evidence/EvidenceChain";
import type { Candidate, Interview, CandidateReport, Job } from "@/types/filtr";

interface CandidateOverviewProps {
  candidate: Candidate;
  job?: Job;
  interview?: Interview | undefined;
  report?: CandidateReport | undefined;
  onGoToTab: (tab: "overview" | "resume" | "interview" | "evidence" | "report") => void;
}

export function CandidateOverview({
  candidate,
  job,
  interview,
  report,
  onGoToTab,
}: CandidateOverviewProps) {
  const covered = report?.validatedCount ?? 0;
  const partial = report?.partialCount ?? 0;
  const needsValidation = report?.needsValidationCount ?? 0;
  const total = report?.requirementsTotal ?? 6;

  return (
    <div className="animate-workspace-enter space-y-6">
      {/* Top Profile Summary Panel */}
      <Panel className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground shadow-sm">
              {candidate.initials}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{candidate.name}</h1>
                <StatusBadge tone={statusTone(candidate.interviewStatus)}>
                  {candidate.interviewStatus}
                </StatusBadge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {job?.title ?? "Data Analyst"} · {candidate.experience} relevant experience
              </p>
              {job?.requiredSkills && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
            <Metric label="Requirements assessed" value={`${total}`} />
            <Metric label="Interview duration" value={interview?.duration ?? "24:18"} />
            <Metric label="Last activity" value={candidate.activity} />
          </div>
        </div>
      </Panel>

      {/* Quick Navigation Cards: 4 Core Modules */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Resume Card */}
        <button
          onClick={() => onGoToTab("resume")}
          className="group rounded-xl border border-border/80 bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-muted/30"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <FileText className="size-4 text-primary" />
            </div>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="mt-3 font-semibold text-xs text-foreground">Resume Claims</div>
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
            Inspect source claims and previous background history.
          </p>
        </button>

        {/* Interview Card */}
        <button
          onClick={() => onGoToTab("interview")}
          className="group rounded-xl border border-border/80 bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-muted/30"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Video className="size-4 text-primary" />
            </div>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="mt-3 font-semibold text-xs text-foreground">Interview Transcript</div>
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
            Watch spoken video responses and inspect timestamped questions.
          </p>
        </button>

        {/* Evidence Card */}
        <button
          onClick={() => onGoToTab("evidence")}
          className="group rounded-xl border border-border/80 bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-muted/30"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <Sparkles className="size-4 text-primary" />
            </div>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="mt-3 font-semibold text-xs text-foreground">Evidence Chain</div>
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
            Trace claims to questions, candidate quotes, and extracted points.
          </p>
        </button>

        {/* Report Card */}
        <button
          onClick={() => onGoToTab("report")}
          className="group rounded-xl border border-border/80 bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-muted/30"
        >
          <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <ShieldCheck className="size-4 text-primary" />
            </div>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="mt-3 font-semibold text-xs text-foreground">Evidence Report</div>
          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
            Review full requirement coverage and compliance audit trail.
          </p>
        </button>
      </div>

      {/* Coverage Snapshot & Recruiter Action */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Coverage Snapshot */}
        <Panel className="p-5 lg:col-span-7">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Coverage Snapshot
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {covered}
              </div>
              <div className="text-[10px] text-muted-foreground">Validated</div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{partial}</div>
              <div className="text-[10px] text-muted-foreground">Partial</div>
            </div>
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-center">
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {needsValidation}
              </div>
              <div className="text-[10px] text-muted-foreground">Needs Validation</div>
            </div>
          </div>
        </Panel>

        {/* Human Recruiter Action */}
        <Panel className="p-5 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
              <AlertCircle className="size-3.5" />
              Recruiter Action Needed
            </div>
            <h3 className="mt-1.5 text-xs font-semibold text-foreground">
              Review Product Analytics Ownership
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              Spoken answer confirmed Amplitude funnel analysis, but follow-up clarified engineering
              owned schema governance.
            </p>
          </div>
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToTab("evidence")}
              className="w-full text-xs gap-1.5"
            >
              Inspect Evidence Trail
              <ArrowRight className="size-3" />
            </Button>
          </div>
        </Panel>
      </div>

      {/* Signature Interactive Evidence Chain */}
      {interview && interview.status === "completed" && (
        <EvidenceChain interview={interview} onOpenReport={() => onGoToTab("report")} />
      )}
    </div>
  );
}
