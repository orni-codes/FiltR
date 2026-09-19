import { FileText, MessageSquare, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { EvidenceStatus } from "@/components/evidence/EvidenceStatus";
import type { InterviewEvidence } from "@/types/filtr";

interface EvidencePanelProps {
  evidence: InterviewEvidence;
  onJumpToTranscript?: (time: string) => void;
  className?: string;
}

export function EvidencePanel({
  evidence,
  onJumpToTranscript,
  className = "",
}: EvidencePanelProps) {
  return (
    <Panel className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border p-5 bg-card">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Requirement Evidence Analysis
          </div>
          <h2 className="mt-1 text-sm font-semibold text-foreground">{evidence.requirementName}</h2>
        </div>
        <EvidenceStatus status={evidence.status} />
      </div>

      <div className="p-6 space-y-6">
        {/* Core Evidence Synthesis */}
        <div>
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Evidence Conclusion
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-foreground">{evidence.evidence}</p>
          {evidence.evidencePoints && evidence.evidencePoints.length > 0 && (
            <ul className="mt-3 space-y-1.5 border-l-2 border-primary/30 pl-3">
              {evidence.evidencePoints.map((point, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Evidence Sources */}
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
            Evidence Sources
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Resume Source */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 flex items-start gap-3">
              <FileText className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-foreground">Resume Claim</div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  "{evidence.resumeClaim}"
                </p>
                <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                  Source: {evidence.resumeSource}
                </div>
              </div>
            </div>

            {/* Interview Source */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5 flex items-start gap-3">
              <MessageSquare className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    Interview Q{evidence.interviewQuestionNumber}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    @{evidence.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  "{evidence.question}"
                </p>
                {onJumpToTranscript && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => onJumpToTranscript(evidence.timestamp)}
                    className="mt-2 h-auto p-0 text-[11px] text-primary gap-1 font-medium"
                  >
                    <Play className="size-3 fill-current" />
                    Jump to transcript @{evidence.timestamp}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
