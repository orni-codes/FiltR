interface InterviewProgressProps {
  currentQuestionNumber: number;
  totalQuestions: number;
  isFollowUp?: boolean;
}

export function InterviewProgress({
  currentQuestionNumber,
  totalQuestions,
  isFollowUp = false,
}: InterviewProgressProps) {
  const percentage = Math.min(100, Math.round((currentQuestionNumber / totalQuestions) * 100));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            Question {currentQuestionNumber} of {totalQuestions}
          </span>
          {isFollowUp && (
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500 border border-amber-500/20">
              Clarification
            </span>
          )}
        </div>
        <span className="text-muted-foreground font-mono text-[11px]">{percentage}% complete</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
