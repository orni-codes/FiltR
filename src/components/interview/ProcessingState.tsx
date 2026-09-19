import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck, FileCheck } from "lucide-react";

interface ProcessingStateProps {
  requirementName: string;
  isFollowUp?: boolean;
}

const ANALYSIS_PHASES = [
  "Transcribing audio stream...",
  "Extracting candidate evidence points...",
  "Evaluating requirement coverage...",
  "Finalizing evidence record...",
];

export function ProcessingState({ requirementName, isFollowUp = false }: ProcessingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < ANALYSIS_PHASES.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-card p-8 text-center shadow-lg animate-workspace-enter">
      {/* Subtle pulsing background glow */}
      <div className="absolute inset-0 bg-primary/5 -z-10 animate-pulse" />

      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
        <Sparkles className="size-6 animate-spin" />
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        Analyzing your response...
      </h3>

      <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
        Evaluating evidence for{" "}
        <span className="font-semibold text-foreground">{requirementName}</span>
      </p>

      {/* Dynamic phase steps */}
      <div className="mt-6 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="size-2 rounded-full bg-primary animate-ping" />
          {ANALYSIS_PHASES[phaseIndex]}
        </div>

        {/* Mini progress ticks */}
        <div className="flex items-center gap-1.5 mt-2">
          {ANALYSIS_PHASES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= phaseIndex ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
