import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import type { Resume } from "@/types/filtr";

interface ResumeViewProps {
  candidateName: string;
  resume?: Resume;
}

export function ResumeView({ candidateName, resume }: ResumeViewProps) {
  if (!resume) {
    return (
      <div className="animate-workspace-enter">
        <Panel className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="animate-workspace-enter grid gap-5 xl:grid-cols-12">
      <Panel className="xl:col-span-8">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-sm font-semibold">{candidateName} — Resume</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {resume.pages} page{resume.pages !== 1 ? "s" : ""} · Analyzed {resume.analyzedDate}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <FileText />
            Open source
          </Button>
        </div>
        <div className="space-y-6 p-6">
          {resume.entries.map((entry) => (
            <div key={`${entry.company}-${entry.period}`}>
              <h3 className="text-sm font-semibold">
                {entry.title} · {entry.company}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {entry.period}
                {entry.location ? ` · ${entry.location}` : ""}
              </p>
              {entry.bullets.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="xl:col-span-4">
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-semibold">Connected claims</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Resume signals mapped into the interview
          </p>
        </div>
        <div className="divide-y divide-border">
          {resume.connectedClaims.map((claim) => (
            <div key={claim.claim} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{claim.claim}</span>
                <span className="text-[11px] font-semibold text-primary">
                  {claim.questionCount} question{claim.questionCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
