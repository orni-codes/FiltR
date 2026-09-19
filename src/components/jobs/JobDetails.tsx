import { MessageSquareText, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Job } from "@/types/filtr";

interface JobDetailsProps {
  job: Job;
}

function SkillPanel({ title, skills }: { title: string; skills: string[] }) {
  return (
    <Panel className="p-5">
      <h3 className="text-xs font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded border border-border bg-muted/40 px-2 py-1 text-[11px]"
          >
            {skill}
          </span>
        ))}
      </div>
    </Panel>
  );
}

export function JobDetails({ job }: JobDetailsProps) {
  const fields = [
    ["Job title", job.title],
    ["Location", `${job.location} · ${job.workMode}`],
    ["Experience", job.experience],
    ["Employment type", job.employmentType],
  ];

  return (
    <div className="animate-workspace-enter grid gap-5 xl:grid-cols-12">
      <div className="space-y-5 xl:col-span-7">
        {/* Job details */}
        <Panel>
          <div className="border-b border-border p-5">
            <h2 className="text-sm font-semibold">Job details</h2>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1.5 text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Description */}
        <Panel>
          <div className="border-b border-border p-5">
            <h2 className="text-sm font-semibold">Job description</h2>
          </div>
          <p className="p-5 text-sm leading-6 text-muted-foreground">{job.description}</p>
        </Panel>

        {/* Skills */}
        <div className="grid gap-5 sm:grid-cols-2">
          <SkillPanel title="Required skills" skills={job.requiredSkills} />
          <SkillPanel title="Preferred skills" skills={job.preferredSkills} />
        </div>
      </div>

      {/* AI-extracted requirements */}
      <Panel className="xl:col-span-5">
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">AI-extracted requirements</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Approved from the job description</p>
        </div>
        <div className="divide-y divide-border">
          {job.requirements.map((req) => (
            <div key={req.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-medium leading-5">{req.name}</div>
                <StatusBadge tone={req.type === "Required" ? "info" : "neutral"}>
                  {req.type}
                </StatusBadge>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <MessageSquareText className="size-3" />
                Interview coverage · {req.coverage}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
