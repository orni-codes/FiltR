import { Check } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import type { Interview } from "@/types/filtr";

interface InterviewPreviewProps {
  candidateName: string;
  candidateInitials: string;
  interview?: Interview | undefined;
}

export function InterviewPreview({
  candidateName,
  candidateInitials,
  interview,
}: InterviewPreviewProps) {
  const isActive = interview?.status === "in_progress";
  const question = interview?.currentQuestionText ?? "Interview not yet started";
  const qNum = interview?.currentQuestionNumber;
  const qTotal = interview?.questionsTotal;

  return (
    <div className="animate-workspace-enter grid gap-5 xl:grid-cols-12">
      {/* Live interview window */}
      <div className="xl:col-span-8">
        <div className="relative aspect-video overflow-hidden rounded-md bg-foreground">
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
              {candidateInitials}
            </div>
            {qNum && qTotal && (
              <div className="mt-6 text-[10px] font-semibold uppercase text-primary-foreground/60">
                Question {qNum} of {qTotal}
              </div>
            )}
            <h2 className="mt-3 max-w-xl text-xl font-medium leading-8 text-primary-foreground">
              {question}
            </h2>
            {isActive && (
              <div className="mt-6 flex items-center gap-2 text-xs text-primary-foreground/70">
                <span className="animate-status-pulse size-1.5 rounded-full bg-destructive" />
                Recording · {interview?.duration ?? "00:00"}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-xs text-primary-foreground">
            {candidateName}
          </div>
        </div>
      </div>

      {/* Side panels */}
      <div className="space-y-5 xl:col-span-4">
        <Panel>
          <div className="border-b border-border p-5">
            <div className="text-[10px] font-semibold uppercase text-primary">
              Candidate experience
            </div>
            <h2 className="mt-2 text-sm font-semibold">Calm, focused, minimal</h2>
          </div>
          <div className="space-y-3 p-5">
            {[
              { label: "Interview link verified", done: true },
              { label: "Camera and microphone ready", done: isActive },
              {
                label: `${interview?.questionsAnswered ?? 0} of ${interview?.questionsTotal ?? "—"} questions answered`,
                done: false,
              },
            ].map(({ label, done }, index) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span
                  className={`flex size-5 items-center justify-center rounded-full ${
                    done ? "bg-success text-success-foreground" : "bg-info text-info-foreground"
                  }`}
                >
                  {done ? <Check className="size-3" /> : String(index + 1)}
                </span>
                {label}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-xs font-semibold">Adaptive follow-up</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            If the answer does not clarify metric ownership, FiltR will ask who approved the
            canonical definition.
          </p>
        </Panel>
      </div>
    </div>
  );
}
