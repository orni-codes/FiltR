import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { InterviewPreview } from "@/components/interview/InterviewPreview";
import { useFiltRStore } from "@/lib/store";
import { createInterview, getInterviewDetails } from "@/lib/api";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/interview")({ component: JobInterviewPage });
const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function JobInterviewPage() {
  const { job } = parentRoute.useLoaderData();
  const { candidates } = useFiltRStore();
  const jobCandidates = candidates.filter((item) => item.jobId === job.id);
  const [selectedCandidateId, setSelectedCandidateId] = useState(jobCandidates[0]?.id ?? "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [interview, setInterview] = useState<any>();
  const candidate = useMemo(() => jobCandidates.find((item) => item.id === selectedCandidateId) ?? jobCandidates[0], [jobCandidates, selectedCandidateId]);

  useEffect(() => {
    if (!candidate?.applicationId) return;
    createInterview(String(candidate.applicationId)).then(async (created) => {
      setGeneratedUrl(`/interview/${created.interview_token}`);
      try { setInterview(await getInterviewDetails(String(created.interview_id))); } catch {}
    }).catch(() => undefined);
  }, [candidate?.applicationId]);

  const handleGenerate = async () => {
    if (!candidate?.applicationId) return;
    setIsGenerating(true);
    setCopied(false);
    try {
      const created = await createInterview(String(candidate.applicationId));
      setGeneratedUrl(`/interview/${created.interview_token}`);
      setInterview(await getInterviewDetails(String(created.interview_id)));
    } finally { setIsGenerating(false); }
  };

  const copyLink = async () => {
    if (!generatedUrl) return;
    try { await navigator.clipboard?.writeText(`${window.location.origin}${generatedUrl}`); setCopied(true); } catch { setCopied(false); }
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary"><Sparkles className="size-3.5" /> AI Interview Generator</div><h1 className="mt-1 text-lg font-semibold">Generate an adaptive interview</h1><p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">The existing backend generates the questions and adaptive follow-ups from the job and candidate evidence.</p></div>
          {candidate && <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground lg:min-w-[320px]">Candidate<select value={candidate.id} onChange={(e) => { setSelectedCandidateId(e.target.value); setGeneratedUrl(""); }} className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-xs font-normal normal-case tracking-normal">{jobCandidates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
        </div>
        {candidate && <div className="mt-5 flex justify-end border-t border-border pt-4"><Button onClick={handleGenerate} disabled={isGenerating || !candidate.applicationId} className="gap-2"><Sparkles className="size-3.5" />{isGenerating ? "Generating…" : "Generate interview"}</Button></div>}
        {generatedUrl && <div className="mt-4 flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex items-center gap-2 text-xs font-semibold"><Link2 className="size-3.5 text-primary" /> Interview link ready</div><code className="mt-1 block truncate text-[11px] text-muted-foreground">{window.location.origin}{generatedUrl}</code></div><Button variant="outline" size="sm" onClick={copyLink} className="shrink-0 gap-2">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "Copied" : "Copy link"}</Button></div>}
      </Panel>
      {candidate ? <InterviewPreview candidateName={candidate.name} candidateInitials={candidate.initials} interview={interview} /> : <Panel className="p-10 text-center"><h2 className="text-sm font-semibold">Add a candidate before generating an interview</h2></Panel>}
    </div>
  );
}
