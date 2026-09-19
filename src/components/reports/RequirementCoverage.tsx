import { MessageSquare, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { EvidenceStatus } from "@/components/evidence/EvidenceStatus";
import type { InterviewEvidence } from "@/types/filtr";

interface RequirementCoverageProps {
  evidenceItems: InterviewEvidence[];
  onSelectRequirement?: (id: string) => void;
  onJumpToTimestamp?: (time: string) => void;
  className?: string;
}

export function RequirementCoverage({
  evidenceItems,
  onSelectRequirement,
  onJumpToTimestamp,
  className = "",
}: RequirementCoverageProps) {
  return (
    <Panel className={`overflow-hidden ${className}`}>
      <div className="border-b border-border p-5 bg-card flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Objective Criteria Evaluation
          </div>
          <h2 className="mt-1 text-sm font-semibold text-foreground">Requirement Coverage</h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {evidenceItems.length} Requirements Assessed
        </span>
      </div>

      <div className="divide-y divide-border">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className="p-5 transition-colors hover:bg-muted/30 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-foreground">
                  {item.requirementName}
                </span>
                {item.requirementType && (
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {item.requirementType}
                  </span>
                )}
              </div>
              <EvidenceStatus status={item.status} size="sm" />
            </div>

            {/* Evidence summary text */}
            <div className="rounded-md border border-border/60 bg-muted/20 p-3.5">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">
                Extracted Evidence
              </div>
              <p className="text-xs text-foreground leading-relaxed">"{item.evidence}"</p>
            </div>

            {/* Source and action links */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="size-3.5 text-primary" />
                <span>
                  Source: Interview Q{item.interviewQuestionNumber} (@{item.timestamp})
                </span>
              </div>

              <div className="flex items-center gap-3">
                {onSelectRequirement && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectRequirement(item.id)}
                    className="h-7 text-xs text-primary"
                  >
                    View evidence chain
                  </Button>
                )}

                {onJumpToTimestamp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onJumpToTimestamp(item.timestamp)}
                    className="h-7 text-xs gap-1.5"
                  >
                    <Play className="size-3 fill-current" />
                    Play {item.timestamp}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
