import { Link } from "@tanstack/react-router";
import { ChevronRight, FileCheck, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { statusTone } from "@/lib/status-utils";
import { getJobReportsForJob, getInterview } from "@/data/mock";

interface JobReportsProps {
  jobId: string;
  jobTitle: string;
}

export function JobReports({ jobId, jobTitle }: JobReportsProps) {
  const rows = getJobReportsForJob(jobId);

  return (
    <Panel className="animate-workspace-enter overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border p-5 bg-card">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Candidate Evidence Portfolios
          </div>
          <h2 className="mt-1 text-sm font-semibold text-foreground">Completed Reports</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {rows.length} candidate reports ready for evidence review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <SlidersHorizontal className="size-3.5" />
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left">
          <thead className="border-b border-border bg-muted/30 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3.5">Candidate</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-center">Assessed</th>
              <th className="px-4 py-3.5 text-center text-emerald-600 dark:text-emerald-400">
                Validated
              </th>
              <th className="px-4 py-3.5 text-center text-amber-600 dark:text-amber-400">
                Partial
              </th>
              <th className="px-4 py-3.5 text-center text-rose-600 dark:text-rose-400">
                Needs Validation
              </th>
              <th className="px-4 py-3.5">Duration</th>
              <th className="px-4 py-3.5">Completed</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">
                  No completed interview reports available for this job yet.
                </td>
              </tr>
            ) : (
              rows.map(({ candidate, report }) => {
                const interview = getInterview(candidate.id);

                return (
                  <tr key={candidate.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                          {candidate.initials}
                        </div>
                        <div>
                          <Link
                            to="/jobs/$jobId/candidates/$candidateId"
                            params={{ jobId, candidateId: candidate.id }}
                            search={{ tab: "report" }}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {candidate.name}
                          </Link>
                          <div className="text-[10px] text-muted-foreground">
                            {candidate.experience}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge tone={statusTone(candidate.interviewStatus)}>
                        {candidate.interviewStatus}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-foreground">
                      {report.requirementsTotal}
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {report.validatedCount}
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-amber-600 dark:text-amber-400">
                      {report.partialCount}
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-rose-600 dark:text-rose-400">
                      {report.needsValidationCount}
                    </td>

                    <td className="px-4 py-4 font-mono text-muted-foreground">
                      {interview?.duration || "24:18"}
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">{report.completedDate}</td>

                    <td className="px-5 py-4 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          to="/jobs/$jobId/candidates/$candidateId"
                          params={{ jobId, candidateId: candidate.id }}
                          search={{ tab: "report" }}
                          className="gap-1 text-xs"
                        >
                          Review Evidence
                          <ChevronRight className="size-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
