import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight, Filter, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { statusTone } from "@/lib/status-utils";
import type { Candidate, Job } from "@/types/filtr";

interface CandidateTableProps {
  job: Job;
  candidates: Candidate[];
}
const HEADERS = ["Candidate", "Experience", "Interview", "Coverage", "Last activity", ""];

export function CandidateTable({ job, candidates }: CandidateTableProps) {
  return (
    <div className="animate-workspace-enter space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total candidates", value: candidates.length },
          {
            label: "Interviewed",
            value: candidates.filter((c) => c.interviewStatus === "Completed").length,
          },
          {
            label: "Awaiting action",
            value: candidates.filter((c) => c.interviewStatus !== "Completed").length,
          },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {m.label}
            </div>
            <div className="mt-2 text-2xl font-semibold">{m.value}</div>
          </div>
        ))}
      </div>
      <Panel className="overflow-hidden rounded-2xl shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">Candidates</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                {job.candidateCount}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Inspect evidence before moving a candidate forward.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Search /> Search
            </Button>
            <Button variant="outline" size="sm" className="hidden rounded-xl sm:inline-flex">
              <SlidersHorizontal /> Filter
            </Button>
            <Button size="sm" className="rounded-xl" asChild>
              <Link to="/jobs/$jobId/candidates/new" params={{ jobId: job.id }}>
                <Plus /> Add candidate
              </Link>
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="border-b border-border bg-muted/25 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="group transition-colors hover:bg-primary/[0.025]">
                  <td className="px-5 py-4">
                    <Link
                      to="/jobs/$jobId/candidates/$candidateId"
                      params={{ jobId: job.id, candidateId: candidate.id }}
                      search={{ tab: "overview" }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-[10px] font-semibold text-background">
                        {candidate.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold group-hover:text-primary">
                          {candidate.name}
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {candidate.email ?? "No email provided"}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {candidate.experience}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge tone={statusTone(candidate.interviewStatus)}>
                      {candidate.interviewStatus}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: candidate.interviewStatus === "Completed" ? "78%" : "36%",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {candidate.coverageLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[10px] text-muted-foreground">
                    {candidate.activity}
                  </td>
                  <td className="px-5 py-4">
                    <Button variant="ghost" size="icon" className="rounded-lg" asChild>
                      <Link
                        to="/jobs/$jobId/candidates/$candidateId"
                        params={{ jobId: job.id, candidateId: candidate.id }}
                        search={{ tab: "overview" }}
                      >
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
