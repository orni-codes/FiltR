import { Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Sparkles, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { Metric } from "@/components/shared/Metric";

interface InterviewCompleteProps {
  candidateName: string;
  jobTitle?: string;
  totalQuestionsAnswered: number;
  durationMinutes: number;
  completedAt?: string;
}

export function InterviewComplete({
  candidateName,
  jobTitle = "Position",
  totalQuestionsAnswered,
  durationMinutes,
  completedAt,
}: InterviewCompleteProps) {
  return (
    <div className="animate-workspace-enter mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="size-9" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Interview Complete
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, <span className="font-semibold text-foreground">{candidateName}</span>. Your
          interview responses for the{" "}
          <span className="font-semibold text-foreground">{jobTitle}</span> role have been securely
          submitted.
        </p>
      </div>

      {/* Summary stats */}
      <Panel className="p-6">
        <div className="grid grid-cols-2 gap-4 divide-x divide-border">
          <div className="text-center px-4">
            <Metric label="Questions completed" value={`${totalQuestionsAnswered}`} />
          </div>
          <div className="text-center px-4">
            <Metric label="Session duration" value={`~${Math.max(1, durationMinutes)} mins`} />
          </div>
        </div>
      </Panel>

      {/* What happens next explanation */}
      <Panel className="p-6">
        <h2 className="text-sm font-semibold">What happens next?</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Objective Evidence Mapping</div>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Your video responses are mapped directly against the job requirements to generate an
                evidence trail for the hiring team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="text-xs font-semibold">Recruiter Review</div>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                The hiring team will review your evidence portfolio and follow up directly regarding
                subsequent rounds.
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="lg" asChild>
          <Link to="/jobs">
            Return to FiltR Home
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
