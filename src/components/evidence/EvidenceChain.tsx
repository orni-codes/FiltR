import { useState } from "react";
import {
  FileText,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Play,
  ArrowDown,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { EvidenceStatus } from "@/components/evidence/EvidenceStatus";
import type { Interview, InterviewEvidence } from "@/types/filtr";

interface EvidenceChainProps {
  interview: Interview;
  selectedEvidenceId?: string;
  onSelectEvidence?: (id: string) => void;
  onJumpToTranscript?: (time: string) => void;
  onOpenReport?: () => void;
  className?: string;
}

export function EvidenceChain({
  interview,
  selectedEvidenceId,
  onSelectEvidence,
  onJumpToTranscript,
  onOpenReport,
  className = "",
}: EvidenceChainProps) {
  const items = interview.evidenceItems;
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    selectedEvidenceId || items[0]?.id || "",
  );

  const activeId = selectedEvidenceId || internalSelectedId;
  const currentEvidence = items.find((e) => e.id === activeId) || items[0];

  const handleSelect = (id: string) => {
    setInternalSelectedId(id);
    onSelectEvidence?.(id);
  };

  if (!currentEvidence) {
    return (
      <Panel className="p-8 text-center text-sm text-muted-foreground">
        No evidence items available.
      </Panel>
    );
  }

  return (
    <Panel className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border p-5 bg-card">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Traceable Evidence Chain
          </div>
          <h2 className="mt-1 text-sm font-semibold text-foreground">
            {currentEvidence.requirementName}
          </h2>
        </div>
        <EvidenceStatus status={currentEvidence.status} />
      </div>

      {/* Requirement Selector Tabs */}
      <div className="flex overflow-x-auto border-b border-border bg-muted/20 px-3 py-2 gap-1.5 scrollbar-none">
        {items.map((item) => {
          const isSelected = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <span>{item.requirementName}</span>
              <span
                className={`size-1.5 rounded-full ${
                  item.status === "Validated"
                    ? "bg-emerald-500"
                    : item.status === "Partial"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Vertical Interactive Evidence Chain */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Step 1: Resume Claim */}
        <div className="relative pl-8 sm:pl-10">
          {/* Connector Line */}
          <div className="absolute left-3.5 sm:left-4 top-8 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          {/* Node Icon */}
          <div className="absolute left-0 top-0 flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
            <FileText className="size-3.5 sm:size-4 text-primary" />
          </div>

          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>1. Resume Claim</span>
              <span className="text-primary font-mono text-[10px]">
                {currentEvidence.resumeSource}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-foreground leading-relaxed">
              "{currentEvidence.resumeClaim}"
            </p>
          </div>
        </div>

        {/* Step 2: Interview Question */}
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3.5 sm:left-4 top-8 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="absolute left-0 top-0 flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
            <MessageSquare className="size-3.5 sm:size-4 text-primary" />
          </div>

          <div className="rounded-lg border border-border/80 bg-muted/20 p-4">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>2. Interview Question (Q{currentEvidence.interviewQuestionNumber})</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                @{currentEvidence.timestamp}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-foreground leading-relaxed">
              "{currentEvidence.question}"
            </p>
          </div>
        </div>

        {/* Step 3: Candidate Answer */}
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3.5 sm:left-4 top-8 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="absolute left-0 top-0 flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
            <Play className="size-3.5 sm:size-4 text-primary ml-0.5" />
          </div>

          <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>3. Candidate Response</span>
              {onJumpToTranscript && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onJumpToTranscript(currentEvidence.timestamp)}
                  className="h-6 px-2 text-[10px] text-primary gap-1 -mr-1"
                >
                  <Play className="size-2.5 fill-current" />
                  Jump to {currentEvidence.timestamp}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "{currentEvidence.answer}"
            </p>

            {/* Follow-up expansion if present */}
            {currentEvidence.hasFollowUp && currentEvidence.followUpQuestion && (
              <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-500 uppercase">
                  <HelpCircle className="size-3" />
                  Follow-up Clarification (@{currentEvidence.followUpTimestamp})
                </div>
                <p className="text-xs font-medium text-foreground">
                  "{currentEvidence.followUpQuestion}"
                </p>
                <p className="text-xs text-muted-foreground italic pt-1">
                  "{currentEvidence.followUpAnswer}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: AI Extracted Evidence */}
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3.5 sm:left-4 top-8 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          <div className="absolute left-0 top-0 flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
            <Sparkles className="size-3.5 sm:size-4 text-primary" />
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              4. Extracted Evidence
            </div>
            <p className="mt-2 text-xs font-medium text-foreground leading-relaxed">
              {currentEvidence.evidence}
            </p>
            {currentEvidence.evidencePoints && currentEvidence.evidencePoints.length > 0 && (
              <ul className="mt-3 space-y-1.5 border-t border-primary/10 pt-2.5">
                {currentEvidence.evidencePoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="size-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Step 5: Requirement Status Conclusion */}
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-0 top-0 flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 sm:size-4 text-primary" />
          </div>

          <div className="rounded-lg border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                5. Outcome & Justification
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {currentEvidence.status === "Validated"
                  ? "Objective evidence established across resume claim and spoken response."
                  : currentEvidence.status === "Partial"
                    ? "Key components verified, but advanced governance or depth was not fully demonstrated."
                    : "Candidate clarified contribution, but direct ownership requires recruiter validation."}
              </div>
            </div>
            <EvidenceStatus status={currentEvidence.status} />
          </div>
        </div>
      </div>
    </Panel>
  );
}
