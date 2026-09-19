import { HelpCircle, Sparkles, Clock } from "lucide-react";
import type { DemoInterviewQuestion } from "@/lib/interview-session";

interface FollowUpQuestionProps {
  question: DemoInterviewQuestion;
  className?: string;
}

export function FollowUpQuestion({ question, className = "" }: FollowUpQuestionProps) {
  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-card p-6 shadow-md sm:p-8 relative overflow-hidden ${className}`}
    >
      {/* Subtle indicator bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-amber-500/80" />

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
            <HelpCircle className="size-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              {question.followUpPrompt || "Let's clarify that."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium">
            {question.requirementName}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="size-3" />~{Math.round((question.timeEstimateSeconds ?? 90) / 60)}m
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          FiltR would like a quick clarification on your specific contribution:
        </p>
        <h2 className="text-lg font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl">
          "{question.question}"
        </h2>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
        <p>Focus specifically on your direct responsibilities and decisions.</p>
      </div>
    </div>
  );
}
