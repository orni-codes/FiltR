import { Play, Volume2, Sparkles } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { InterviewTranscript } from "@/components/interview/InterviewTranscript";
import type { Interview } from "@/types/filtr";

interface CandidateInterviewProps {
  candidateName: string;
  candidateInitials: string;
  interview?: Interview | undefined;
  focusTime?: string | undefined;
  onTimestampClick: (time: string) => void;
}

export function CandidateInterview({
  candidateName,
  candidateInitials,
  interview,
  focusTime,
  onTimestampClick,
}: CandidateInterviewProps) {
  if (!interview || interview.status === "not_started") {
    return (
      <div className="animate-workspace-enter">
        <Panel className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Interview not yet started.</p>
        </Panel>
      </div>
    );
  }

  // Pick the focused transcript or evidence item
  const currentTimestamp = focusTime || interview.transcript[0]?.timestamp || "02:14";
  const focusedEvidence =
    interview.evidenceItems.find((e) => e.timestamp === currentTimestamp) ||
    interview.evidenceItems[0];
  const focusedTranscript =
    interview.transcript.find((t) => t.timestamp === currentTimestamp) || interview.transcript[0];

  return (
    <div className="animate-workspace-enter space-y-6">
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Left column: Video player & Active Question Card */}
        <div className="space-y-6 xl:col-span-6">
          {/* Video player frame */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-950 border border-border/80 shadow-md">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-neutral-800 text-2xl font-bold text-neutral-100 shadow-inner">
                {candidateInitials}
              </div>
              <p className="mt-3 text-xs text-neutral-400 font-mono">
                Playback Position: {currentTimestamp}
              </p>
            </div>

            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold text-neutral-200 backdrop-blur border border-white/10">
              <Play className="size-3 fill-current text-primary" />
              {currentTimestamp}
            </div>

            <div className="absolute bottom-4 left-4 text-xs font-medium text-neutral-300 drop-shadow">
              {candidateName} · {interview.duration} total duration
            </div>
          </div>

          {/* Active Question Highlight */}
          {focusedTranscript && (
            <Panel className="p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="size-3.5" />
                  Active Video Segment ({focusedTranscript.timestamp})
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Q{focusedTranscript.questionNumber}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  "{focusedTranscript.aiQuestion}"
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/20 p-3 rounded-md border border-border/60">
                  "{focusedTranscript.candidateAnswer}"
                </p>
              </div>
            </Panel>
          )}
        </div>

        {/* Right column: Full Interactive Structured Transcript */}
        <div className="xl:col-span-6">
          <InterviewTranscript
            interview={interview}
            focusTime={currentTimestamp}
            onPlayTimestamp={onTimestampClick}
          />
        </div>
      </div>
    </div>
  );
}
