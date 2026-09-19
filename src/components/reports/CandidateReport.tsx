import { useState } from "react";
import { AlertCircle, Clock, ShieldCheck, UserCheck } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Metric";
import { EvidenceChain } from "@/components/evidence/EvidenceChain";
import { RequirementCoverage } from "@/components/reports/RequirementCoverage";
import { AuditTrail } from "@/components/reports/AuditTrail";
import type { Interview, CandidateReport as CandidateReportType } from "@/types/filtr";

interface CandidateReportProps {
  candidateName: string;
  jobTitle: string;
  interview: Interview;
  report: CandidateReportType;
  onJumpToTimestamp?: (time: string) => void;
}

export function CandidateReport({
  candidateName,
  jobTitle,
  interview,
  report,
  onJumpToTimestamp,
}: CandidateReportProps) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    interview.evidenceItems[0]?.id || "",
  );

  return (
    <div className="animate-workspace-enter space-y-6">
      {/* Top Header Section */}
      <Panel className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="size-3.5" />
              Evidence-Based Interview Report
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {candidateName}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {jobTitle} · Interview completed on {report.completedDate}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {report.humanReviewRequired && (
              <div className="flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <AlertCircle className="size-4 shrink-0" />
                <span>Human Recruiter Review Required</span>
              </div>
            )}

            <div className="flex items-center gap-6 border-l border-border pl-6">
              <Metric label="Duration" value={interview.duration} />
              <Metric
                label="Questions"
                value={`${interview.questionsAnswered}/${interview.questionsTotal}`}
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* Report Summary: Compact Analytical Coverage Counts */}
      <Panel className="p-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Requirement Coverage Summary
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3.5">
            <div className="text-xl font-bold text-foreground">{report.requirementsTotal}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Requirements assessed</div>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {report.validatedCount}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Validated</div>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5">
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {report.partialCount}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Partial evidence</div>
          </div>

          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3.5">
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {report.needsValidationCount}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Needs recruiter validation
            </div>
          </div>
        </div>
      </Panel>

      {/* Signature Interactive Evidence Chain */}
      <EvidenceChain
        interview={interview}
        selectedEvidenceId={selectedEvidenceId}
        onSelectEvidence={setSelectedEvidenceId}
        {...(onJumpToTimestamp ? { onJumpToTranscript: onJumpToTimestamp } : {})}
      />

      {/* Requirement Coverage Details */}
      <RequirementCoverage
        evidenceItems={interview.evidenceItems}
        onSelectRequirement={(id) => {
          setSelectedEvidenceId(id);
          window.scrollTo({ top: 400, behavior: "smooth" });
        }}
        {...(onJumpToTimestamp ? { onJumpToTimestamp } : {})}
      />

      {/* Audit Trail Section */}
      <AuditTrail events={report.auditTrail} />
    </div>
  );
}
