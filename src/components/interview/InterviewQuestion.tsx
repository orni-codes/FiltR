import { Sparkles, Clock } from "lucide-react";
import type { DemoInterviewQuestion } from "@/lib/interview-session";

interface InterviewQuestionProps {
  question: DemoInterviewQuestion;
  className?: string;
}

export function InterviewQuestion({ question, className = "" }: InterviewQuestionProps) {
  return (
    <div className={`rounded-xl border border-border/70 bg-card p-6 shadow-sm sm:p-8 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {question.requirementName}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium">
            {question.requirementType}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="size-3" />~{Math.round((question.timeEstimateSeconds ?? 120) / 60)}m
            recommended
          </span>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl">
          "{question.question}"
        </h2>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
        <p>Take a breath to organize your thoughts before beginning your recording.</p>
      </div>
    </div>
  );
}
