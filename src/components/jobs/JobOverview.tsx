import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  UsersRound,
  Video,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPipelineStages, getRecentActivity } from "@/data/mock";
import type { Job } from "@/types/filtr";

interface JobOverviewProps {
  job: Job;
}

export function JobOverview({ job }: JobOverviewProps) {
  const pipeline = getPipelineStages(job.id);
  const activity = getRecentActivity(job.id);
  const required = job.requirements.filter((r) => r.type === "Required").length;
  const preferred = job.requirements.filter((r) => r.type === "Preferred").length;

  return (
    <div className="animate-workspace-enter space-y-6">
      <section className="grid gap-3 md:grid-cols-3">
        {[
          {
            label: "Candidates",
            value: job.candidateCount,
            note: "people in the workspace",
            icon: UsersRound,
          },
          {
            label: "Interviews",
            value: job.interviewCount,
            note: "generated / in progress",
            icon: Video,
          },
          {
            label: "Requirements",
            value: job.requirements.length,
            note: `${required} required · ${preferred} preferred`,
            icon: CheckCircle2,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                <Icon className="size-4" />
              </span>
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-[-0.03em]">{value}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{note}</div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              <Zap className="size-3" /> Candidate signal
            </div>
            <h2 className="mt-1 text-sm font-semibold">Pipeline</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Movement through the {job.title} interview.
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link to="/jobs/$jobId/candidates" params={{ jobId: job.id }}>
              View candidates <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-5">
          {pipeline.map((stage, index) => (
            <div key={stage.label} className="relative bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">{stage.count}</div>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{stage.label}</div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/75"
                  style={{ width: `${Math.max(12, Math.min(100, stage.count * 14))}%` }}
                />
              </div>
              {index < pipeline.length - 1 && (
                <ChevronRight className="absolute -right-2 top-8 z-10 hidden size-4 rounded-full bg-card text-muted-foreground sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-sm font-semibold">Recent activity</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">Latest candidate events</p>
            </div>
            <Clock3 className="size-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {activity.map((entry) => (
              <div
                key={entry.title}
                className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] font-semibold">
                  {entry.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium">{entry.title}</div>
                  <div className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    {entry.note}
                  </div>
                </div>
                <div className="whitespace-nowrap text-[10px] text-muted-foreground">
                  {entry.time}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-primary/15 bg-primary/[0.045] p-5">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            <CheckCircle2 className="size-3.5" /> Evidence-first workflow
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            Every conclusion has a trail.
          </h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            FiltR connects resume claims to interview questions, candidate answers and extracted
            evidence—so the recruiter can inspect the signal before making a decision.
          </p>
          <div className="mt-6 space-y-2">
            {["Resume claim", "Adaptive question", "Candidate response", "Requirement status"].map(
              (step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-xl border border-primary/10 bg-background/60 px-3 py-2.5"
                >
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-[9px] font-semibold text-primary">
                    0{i + 1}
                  </span>
                  <span className="text-xs font-medium">{step}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
