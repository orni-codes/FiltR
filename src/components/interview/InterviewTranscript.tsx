import { useState } from "react";
import { MessageSquareText, Search, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { TranscriptItem } from "@/components/interview/TranscriptItem";
import type { Interview } from "@/types/filtr";

interface InterviewTranscriptProps {
  interview: Interview;
  focusTime?: string;
  onPlayTimestamp?: (time: string) => void;
  className?: string;
}

export function InterviewTranscript({
  interview,
  focusTime,
  onPlayTimestamp,
  className = "",
}: InterviewTranscriptProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandAll, setExpandAll] = useState(true);

  const filteredEntries = interview.transcript.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aiQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidateAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.requirementName &&
        item.requirementName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Panel className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border p-5 bg-card">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Full Interview Transcript
          </div>
          <h2 className="mt-1 text-sm font-semibold text-foreground">
            {interview.questionsAnswered} of {interview.questionsTotal} Questions Answered ·{" "}
            {interview.duration}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-40 sm:w-56 rounded-md border border-border bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandAll(!expandAll)}
            className="h-8 text-xs gap-1"
          >
            <ChevronsUpDown className="size-3.5" />
            {expandAll ? "Collapse all" : "Expand all"}
          </Button>
        </div>
      </div>

      {/* Transcript Items */}
      <div className="p-4 sm:p-6 space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No transcript entries match your search query.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <TranscriptItem
              key={entry.timestamp}
              entry={entry}
              isFocused={focusTime === entry.timestamp}
              onPlayTimestamp={onPlayTimestamp}
              defaultExpanded={expandAll}
            />
          ))
        )}
      </div>
    </Panel>
  );
}
