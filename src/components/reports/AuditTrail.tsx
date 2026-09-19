import {
  Shield,
  Clock,
  ArrowDown,
  CheckCircle2,
  FileText,
  Sparkles,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import type { AuditTrailEvent } from "@/types/filtr";

interface AuditTrailProps {
  events: AuditTrailEvent[];
  className?: string;
}

export function AuditTrail({ events, className = "" }: AuditTrailProps) {
  if (!events || events.length === 0) {
    return null;
  }

  const getEventIcon = (type: AuditTrailEvent["eventType"]) => {
    switch (type) {
      case "Resume Uploaded":
      case "Resume Parsed":
        return <FileText className="size-3.5 text-primary" />;
      case "Requirement Identified":
        return <Sparkles className="size-3.5 text-primary" />;
      case "Interview Question Generated":
      case "Candidate Answered":
        return <MessageSquare className="size-3.5 text-primary" />;
      case "Follow-up Generated":
        return <HelpCircle className="size-3.5 text-amber-500" />;
      case "Evidence Extracted":
        return <Sparkles className="size-3.5 text-emerald-500" />;
      case "Status Assigned":
        return <CheckCircle2 className="size-3.5 text-emerald-500" />;
      default:
        return <Shield className="size-3.5 text-primary" />;
    }
  };

  return (
    <Panel className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-border p-5 bg-card flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Compliance & Traceability
          </div>
          <h2 className="mt-1 text-sm font-semibold text-foreground">Audit Trail</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="size-3.5 text-primary" />
          <span>Immutable Evaluation Log</span>
        </div>
      </div>

      {/* Chronological Event Stream */}
      <div className="p-6">
        <div className="relative space-y-6">
          {/* Vertical line connecting events */}
          <div className="absolute left-3.5 sm:left-4 top-3 bottom-3 w-0.5 bg-border -translate-x-1/2" />

          {events.map((event, index) => (
            <div key={event.id || index} className="relative pl-8 sm:pl-10 flex flex-col gap-1">
              {/* Event Node Dot */}
              <div className="absolute left-0 top-0.5 flex size-7 sm:size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                {getEventIcon(event.eventType)}
              </div>

              {/* Event Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{event.eventType}</span>
                  {event.requirementName && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {event.requirementName}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {event.timestamp}
                </span>
              </div>

              {/* Event Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>

              {/* Event Source Tag */}
              {event.source && (
                <div className="mt-0.5 text-[10px] font-mono text-primary/80">
                  Logged by: {event.source}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
