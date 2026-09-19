import { Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Check, Video, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { statusTone } from "@/lib/status-utils";
import type { Candidate } from "@/types/filtr";
import { useState } from "react";

interface CandidateHeaderProps {
  candidate: Candidate;
  jobId: string;
  jobTitle: string;
}

export function CandidateHeader({ candidate, jobId, jobTitle }: CandidateHeaderProps) {
  const [copied, setCopied] = useState(false);
  const interviewLink = candidate.interviewToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/interview/${candidate.interviewToken}`
    : "";
  const handleCopyLink = () => {
    if (!interviewLink) return;
    navigator.clipboard.writeText(interviewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden border-b border-border bg-card/85 px-4 pb-6 pt-6 backdrop-blur-xl lg:px-8">
      <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-5 -ml-2 rounded-lg text-muted-foreground"
          asChild
        >
          <Link to="/jobs/$jobId/candidates" params={{ jobId }}>
            <ArrowLeft /> Back to candidates
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="flex items-center gap-4">
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-foreground text-sm font-semibold text-background shadow-xl shadow-black/10">
              <span>{candidate.initials}</span>
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white">
                <ShieldCheck className="size-2.5" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{candidate.name}</h1>
                <StatusBadge tone={statusTone(candidate.interviewStatus)}>
                  {candidate.interviewStatus}
                </StatusBadge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {jobTitle} · {candidate.experience} experience
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-1 text-primary">
                  <Sparkles className="size-3" /> Evidence workspace
                </span>
                <span>Last activity {candidate.activity}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl bg-background"
              onClick={handleCopyLink}
              disabled={!interviewLink}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy interview link"}
            </Button>
            {interviewLink && (
              <Button size="sm" className="rounded-xl" asChild>
                <a href={interviewLink} target="_blank" rel="noopener noreferrer">
                  <Video /> Open interview
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
