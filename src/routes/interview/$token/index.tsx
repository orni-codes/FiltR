import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, LockKeyhole, Sparkles, Video, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_INTERVIEW_QUESTIONS } from "@/lib/interview-session";

export const Route = createFileRoute("/interview/$token/")({ component: InterviewWelcomePage });
const parentRoute = getRouteApi("/interview/$token");

export function InterviewWelcomePage() {
  const { token, candidate, job } = parentRoute.useLoaderData();
  const totalQuestions = DEMO_INTERVIEW_QUESTIONS.length;

  return (
    <div className="animate-workspace-enter">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary"><Sparkles className="size-3" /> Adaptive AI interview</div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Welcome, {candidate.name}.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">You’ve been invited to a structured video interview for <span className="font-medium text-white">{job?.title ?? "this role"}</span>. FiltR adapts follow-up questions when it needs clearer evidence.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-[11px] text-muted-foreground"><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{totalQuestions} questions</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">~15–20 min</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Self-paced</span></div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" className="h-12 rounded-xl px-6 font-semibold shadow-xl shadow-primary/20" asChild><Link to="/interview/$token/device-check" params={{ token }}>Begin interview <ArrowRight /></Link></Button><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[11px] text-muted-foreground"><LockKeyhole className="size-3.5 text-emerald-400" /> Recorded only after you start an answer</div></div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative rounded-2xl border border-white/10 bg-black/25 p-5">
            <div className="flex items-center justify-between"><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Interview briefing</div><span className="flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-400" /> ready</span></div>
            <div className="mt-5 space-y-3">
              {[{ icon: Clock3, title: "Take your time", body: "Each question includes preparation time." }, { icon: Video, title: "Camera + microphone", body: "You’ll check both before starting." }, { icon: Volume2, title: "Clear audio matters", body: "Use headphones if your room is noisy." }].map(({ icon: Icon, title, body }) => <div key={title} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" /></span><div><div className="text-xs font-semibold text-white">{title}</div><div className="mt-1 text-[11px] leading-5 text-muted-foreground">{body}</div></div></div>)}
            </div>
            <div className="mt-5 flex items-start gap-2.5 border-t border-white/8 pt-4 text-[10px] leading-5 text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-400" /> Your responses are shared with the hiring team only for interview review and evidence synthesis.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
