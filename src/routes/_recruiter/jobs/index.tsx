import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, Plus, UsersRound, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { statusTone } from "@/lib/status-utils";
import { useFiltRStore } from "@/lib/store";

export const Route = createFileRoute("/_recruiter/jobs/")({
  head: () => ({ meta: [{ title: "Jobs — FiltR" }, { name: "description", content: "Job-centered AI interview intelligence with traceable candidate evidence." }] }),
  component: JobsHome,
});

function JobsHome() {
  const { jobs } = useFiltRStore();
  const candidates = jobs.reduce((sum, job) => sum + job.candidateCount, 0);
  const interviews = jobs.reduce((sum, job) => sum + job.interviewCount, 0);
  const requirements = jobs.reduce((sum, job) => sum + job.requirements.length, 0);

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-7 lg:px-8 lg:py-9">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 filtr-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl animate-workspace-enter">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/90 p-6 shadow-sm lg:p-8 filtr-glow">
          <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"><Zap className="size-3" /> Interviewer workspace</div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">Filter the signal.<br /><span className="text-muted-foreground">Not the candidate.</span></h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Run adaptive interviews, trace every conclusion back to evidence, and keep the final hiring decision with your team.</p>
            </div>
            <Button asChild size="lg" className="h-11 rounded-xl px-5 shadow-lg shadow-primary/15"><Link to="/jobs/new"><Plus className="size-4" /> New job</Link></Button>
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Active roles", value: jobs.length, icon: BriefcaseBusiness, note: "currently interviewing" },
              { label: "Candidates in motion", value: candidates, icon: UsersRound, note: "across active roles" },
              { label: "Evidence points", value: requirements, icon: CheckCircle2, note: "requirements mapped" },
            ].map(({ label, value, icon: Icon, note }) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-background/70 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span><Icon className="size-4 text-primary" /></div>
                <div className="mt-2 flex items-end gap-2"><span className="text-2xl font-semibold tracking-tight">{value}</span><span className="pb-1 text-[10px] text-muted-foreground">{note}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Workspace</div><h2 className="mt-1 text-xl font-semibold tracking-tight">Active jobs</h2></div>
            <div className="text-[11px] text-muted-foreground">{jobs.length} roles · updated continuously</div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {jobs.map((job, index) => {
              const coverage = Math.min(100, Math.round(((job.interviewCount || 0) / Math.max(job.candidateCount, 1)) * 100));
              return (
                <Link key={job.id}
                  // @ts-expect-error — generated route types may lag file-based additions
                  to="/jobs/$jobId" params={{ jobId: job.id }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.06]">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/60"><BriefcaseBusiness className="size-4 text-primary" /></div>
                    <StatusBadge tone={index === 0 ? "success" : statusTone(job.status)}>{job.status}</StatusBadge>
                  </div>
                  <div className="mt-5"><h3 className="text-lg font-semibold tracking-tight">{job.title}</h3><p className="mt-1 text-[11px] text-muted-foreground">{job.location} · {job.workMode}</p></div>
                  <p className="mt-4 line-clamp-2 text-xs leading-5 text-muted-foreground">{job.activity}</p>
                  <div className="mt-5 rounded-xl border border-border/70 bg-muted/25 p-3.5">
                    <div className="flex items-center justify-between text-[10px]"><span className="font-medium text-muted-foreground">Interview coverage</span><span className="font-semibold text-foreground">{coverage}%</span></div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(coverage, 8)}%` }} /></div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center"><div><div className="text-sm font-semibold">{job.candidateCount}</div><div className="text-[9px] uppercase tracking-wide text-muted-foreground">Candidates</div></div><div><div className="text-sm font-semibold">{job.interviewCount}</div><div className="text-[9px] uppercase tracking-wide text-muted-foreground">Interviews</div></div><div><div className="text-sm font-semibold">{job.requirements.length}</div><div className="text-[9px] uppercase tracking-wide text-muted-foreground">Signals</div></div></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><Clock3 className="size-3" /> {job.activity}</span><ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" /></div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><div><div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Interview engine</div><h3 className="mt-1 text-sm font-semibold">Evidence is the product</h3></div><Video className="size-4 text-muted-foreground" /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Resume claim", "Adaptive question", "Evidence trail"].map((step, i) => <div key={step} className="relative rounded-xl border border-border/80 bg-muted/20 p-4"><div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">0{i+1}</div><div className="mt-2 text-xs font-semibold">{step}</div>{i < 2 && <ArrowUpRight className="absolute right-3 top-3 size-3 text-primary/50" />}</div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.045] p-5"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"><CheckCircle2 className="size-3.5" /> Human review</div><h3 className="mt-2 text-sm font-semibold">AI surfaces evidence. People decide.</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Every report keeps the source question, response and requirement visible so recruiters can inspect the signal instead of trusting a black-box score.</p></div>
        </section>
      </div>
    </main>
  );
}
