import { CheckCircle2, Mic, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InterviewStepState } from "@/lib/interview-session";

interface RecordingControlsProps {
  stepState: InterviewStepState;
  isRecording: boolean;
  recordingSeconds: number;
  onStartRecording: () => void;
  onStopAndSubmit: () => void;
  isLastQuestion?: boolean;
}

export function RecordingControls({
  stepState,
  isRecording,
  recordingSeconds,
  onStartRecording,
  onStopAndSubmit,
  isLastQuestion = false,
}: RecordingControlsProps) {
  const isBusy = stepState === "ANALYZING" || stepState === "SUBMITTED";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm">
      <div className="text-xs text-muted-foreground text-center sm:text-left">
        {isRecording ? (
          <span className="flex items-center gap-2 font-medium text-foreground">
            <span className="size-2 rounded-full bg-red-500 animate-ping" />
            Speaking now · Click submit when finished
          </span>
        ) : isBusy ? (
          <span className="flex items-center gap-2 font-medium text-foreground">
            <Sparkles className="size-3.5 text-primary animate-spin" />
            Processing response evidence...
          </span>
        ) : (
          <span>Click start recording when you are ready to speak your answer.</span>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
        {!isRecording && !isBusy && (
          <Button
            size="lg"
            type="button"
            onClick={onStartRecording}
            className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground font-semibold px-6 shadow-md hover:bg-primary/90"
          >
            <Mic className="size-4" />
            Start Recording Answer
          </Button>
        )}

        {isRecording && (
          <Button
            size="lg"
            type="button"
            variant="destructive"
            onClick={onStopAndSubmit}
            className="w-full sm:w-auto gap-2 font-semibold px-6 shadow-md bg-red-600 hover:bg-red-700 text-white"
          >
            <Square className="size-4 fill-current" />
            {isLastQuestion ? "Submit Final Answer" : "Stop & Submit Answer"}
          </Button>
        )}

        {isBusy && (
          <Button size="lg" disabled className="w-full sm:w-auto gap-2">
            <CheckCircle2 className="size-4" />
            Submitting...
          </Button>
        )}
      </div>
    </div>
  );
}
