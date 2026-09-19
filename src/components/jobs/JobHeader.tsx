import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, Sparkles } from "lucide-react";
import type { Job } from "@/types/filtr";

interface JobHeaderProps {
  job: Job;
}
interface JobNavigationProps {
  jobId: string;
}

const JOB_TABS = [
  { label: "Overview", path: "" as const, exact: true },
  { label: "Job Details", path: "/details" as const },
  { label: "Candidates", path: "/candidates" as const },
  { label: "Interview", path: "/interview" as const },
  { label: "Reports", path: "/reports" as const },
] as const;

export function JobHeader({ job }: JobHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-card/80 px-4 pb-6 pt-7 backdrop-blur-xl lg:px-8">
      <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            <span className="flex size-5 items-center justify-center rounded-md bg-primary/10">
              <BriefcaseBusiness className="size-3" />
            </span>{" "}
            Active job <span className="text-muted-foreground/60">/</span> Interview workspace
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            {job.title}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Evidence-led screening workspace · {job.candidateCount} candidates ·{" "}
            {job.requirements.length} requirements
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5">
            <MapPin className="size-3" />
            {job.location}
          </span>
          <span className="rounded-full border border-border bg-background/70 px-3 py-1.5">
            {job.workMode}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 text-primary">
            <Sparkles className="size-3" /> AI assisted
          </span>
        </div>
      </div>
    </div>
  );
}

export function JobNavigation({ jobId }: JobNavigationProps) {
  return (
    <div
      className="sticky top-16 z-20 flex overflow-x-auto border-b border-border bg-background/85 px-4 backdrop-blur-xl lg:px-8"
      role="tablist"
    >
      <div className="mx-auto flex w-full max-w-7xl gap-1">
        {JOB_TABS.map((tab) => {
          const { label } = tab;
          const exact = "exact" in tab && tab.exact;
          const to =
            label === "Overview"
              ? "/jobs/$jobId"
              : label === "Job Details"
                ? "/jobs/$jobId/details"
                : label === "Candidates"
                  ? "/jobs/$jobId/candidates"
                  : label === "Interview"
                    ? "/jobs/$jobId/interview"
                    : "/jobs/$jobId/reports";
          return (
            <Link
              key={label}
              to={to}
              params={{ jobId }}
              role="tab"
              activeOptions={{ exact: !!exact }}
              className="relative h-12 shrink-0 border-b-2 border-transparent px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className:
                  "relative h-12 shrink-0 border-b-2 border-primary px-3.5 text-xs font-semibold text-foreground",
              }}
            >
              <span className="flex h-full items-center">{label}</span>
              <span className="absolute inset-x-3.5 bottom-0 h-0.5 rounded-full bg-primary opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
