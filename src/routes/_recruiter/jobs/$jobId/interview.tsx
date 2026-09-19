import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { InterviewPreview } from "@/components/interview/InterviewPreview";
import { getCandidatesForJob, getInterview } from "@/data/mock";
import { aiService } from "@/lib/ai/service";
import { filtRStore } from "@/lib/store";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/interview")({
  component: JobInterviewPage,
});

const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function JobInterviewPage() {
  const { job } = parentRoute.useLoaderData();
  const candidates = getCandidatesForJob(job.id);
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id ?? "");
  const [questionCount, setQuestionCount] = useState(
    Math.min(6, Math.max(4, job.requirements.length)),
  );
  const [duration, setDuration] = useState(15);
  const [followUps, setFollowUps] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const candidate = useMemo(
    () => candidates.find((item) => item.id === selectedCandidateId) ?? candidates[0],
    [candidates, selectedCandidateId],
  );
  const interview = candidate ? getInterview(candidate.id) : undefined;

  const handleGenerate = async () => {
    if (!candidate) return;
    setIsGenerating(true);
    setCopied(false);
    try {
      await aiService.generateInterview({
        jobId: job.id,
        candidateId: candidate.id,
        requirements: job.requirements,
        numQuestions: questionCount,
        durationMinutes: duration,
        enableFollowUps: followUps,
      });
      filtRStore.generateMockInterview(candidate.id, job.id, job.requirements);
      setGeneratedUrl(`/interview/${candidate.interviewToken}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = async () => {
    if (!generatedUrl) return;
    const absolute = `${window.location.origin}${generatedUrl}`;
    try {
      await navigator.clipboard?.writeText(absolute);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              AI Interview Generator
            </div>
            <h1 className="mt-1 text-lg font-semibold">Generate an adaptive interview</h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              FiltR will structure questions around the role requirements and use follow-ups when an
              answer needs clarification.
            </p>
          </div>

          {candidate && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
              <label className="col-span-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:col-span-2">
                Candidate
                <select
                  value={candidate.id}
                  onChange={(event) => {
                    setSelectedCandidateId(event.target.value);
                    setGeneratedUrl("");
                  }}
                  className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-normal normal-case tracking-normal"
                >
                  {candidates.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Questions
                <select
                  value={questionCount}
                  onChange={(event) => setQuestionCount(Number(event.target.value))}
                  className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-normal normal-case tracking-normal"
                >
                  {[4, 5, 6, 7, 8]
                    .filter((value) => value <= Math.max(4, job.requirements.length + 2))
                    .map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </select>
              </label>
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Minutes
                <select
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                  className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-normal normal-case tracking-normal"
                >
                  {[10, 15, 20, 25].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        {candidate && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={followUps}
                onChange={(event) => setFollowUps(event.target.checked)}
              />
              Allow adaptive follow-up questions
            </label>
            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              <Sparkles className="size-3.5" />
              {isGenerating ? "Generating…" : "Generate interview"}
            </Button>
          </div>
        )}

        {generatedUrl && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Link2 className="size-3.5 text-primary" /> Interview link ready
              </div>
              <code className="mt-1 block truncate text-[11px] text-muted-foreground">
                {window.location.origin}
                {generatedUrl}
              </code>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0 gap-2">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
        )}
      </Panel>

      {candidate ? (
        <InterviewPreview
          candidateName={candidate.name}
          candidateInitials={candidate.initials}
          interview={interview}
        />
      ) : (
        <Panel className="p-10 text-center">
          <h2 className="text-sm font-semibold">Add a candidate before generating an interview</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This job currently has no candidates.
          </p>
        </Panel>
      )}
    </div>
  );
}
