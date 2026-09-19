import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Play, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TranscriptEntry } from "@/types/filtr";

interface TranscriptItemProps {
  entry: TranscriptEntry;
  isFocused?: boolean;
  onPlayTimestamp?: (time: string) => void;
  defaultExpanded?: boolean;
}

export function TranscriptItem({
  entry,
  isFocused = false,
  onPlayTimestamp,
  defaultExpanded = true,
}: TranscriptItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      id={`transcript-${entry.timestamp.replace(":", "-")}`}
      className={`transition-all rounded-lg border ${
        isFocused
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
          : "border-border/70 bg-card hover:border-border"
      }`}
    >
      {/* Question Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground"
            aria-label={expanded ? "Collapse question" : "Expand question"}
          >
            {expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-primary">
                {entry.timestamp}
              </span>
              <span className="text-xs font-semibold text-foreground">
                Q{entry.questionNumber}: {entry.title}
              </span>
              {entry.hasFollowUp && (
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-500/20">
                  Follow-up
                </span>
              )}
            </div>
            {entry.requirementName && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                {entry.requirementName}
              </p>
            )}
          </div>
        </div>

        {onPlayTimestamp && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPlayTimestamp(entry.timestamp);
            }}
            className="h-7 px-2 text-xs text-primary gap-1"
          >
            <Play className="size-3 fill-current" />
            Play
          </Button>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-border/40 text-xs">
          {/* AI Question */}
          <div className="rounded-md bg-muted/40 p-3 border border-border/50">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="size-3" />
                AI Interview Question
              </span>
              <span className="font-mono">{entry.timestamp}</span>
            </div>
            <p className="text-foreground font-medium leading-relaxed">{entry.aiQuestion}</p>
          </div>

          {/* Candidate Answer */}
          <div className="pl-3 border-l-2 border-primary/40 space-y-1 py-0.5">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Candidate Answer</span>
              {entry.candidateAnswerTime && (
                <span className="font-mono">{entry.candidateAnswerTime}</span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed italic">
              "{entry.candidateAnswer}"
            </p>
          </div>

          {/* Follow-up Section if present */}
          {entry.hasFollowUp && entry.aiFollowUp && (
            <div className="space-y-3 pt-2">
              <div className="rounded-md bg-amber-500/5 p-3 border border-amber-500/20">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="size-3" />
                    AI Adaptive Follow-Up
                  </span>
                  <span className="font-mono">{entry.aiFollowUpTime || entry.timestamp}</span>
                </div>
                <p className="text-foreground font-medium leading-relaxed">{entry.aiFollowUp}</p>
              </div>

              {entry.candidateFollowUpAnswer && (
                <div className="pl-3 border-l-2 border-amber-500/40 space-y-1 py-0.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>Candidate Clarification</span>
                    {entry.candidateFollowUpTime && (
                      <span className="font-mono">{entry.candidateFollowUpTime}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{entry.candidateFollowUpAnswer}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
