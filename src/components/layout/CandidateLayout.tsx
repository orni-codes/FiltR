import { Outlet, Link } from "@tanstack/react-router";
import { ShieldCheck, Wifi } from "lucide-react";
import { Brand } from "@/components/brand/Brand";

interface CandidateLayoutProps { token: string; candidateName?: string; jobTitle?: string; questionsAnswered?: number; questionsTotal?: number; }

export function CandidateLayout({ candidateName, jobTitle, questionsAnswered, questionsTotal }: CandidateLayoutProps) {
  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,oklch(0.32_0.09_268/0.24),transparent_38rem)]" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/jobs" className="opacity-95 transition-opacity hover:opacity-100"><Brand /></Link>
          <div className="flex items-center gap-3 text-[10px]">
            {candidateName && <div className="hidden border-r border-white/10 pr-3 text-right sm:block"><div className="font-medium text-white">{candidateName}</div><div className="mt-0.5 text-muted-foreground">{jobTitle}</div></div>}
            {typeof questionsAnswered === "number" && typeof questionsTotal === "number" && <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-medium text-muted-foreground">{questionsAnswered} / {questionsTotal}</div>}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-400 animate-status-pulse" /> <span className="hidden sm:inline">Secure session</span><ShieldCheck className="size-3 sm:hidden" /></div>
          </div>
        </div>
      </header>
      <main className="relative flex-1 px-4 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-5xl"><Outlet /></div></main>
      <footer className="relative border-t border-white/10 px-4 py-5 text-center text-[10px] text-muted-foreground"><div className="mx-auto flex max-w-5xl items-center justify-center gap-2"><Wifi className="size-3" /> FiltR interview environment · Your responses are securely processed for evidence synthesis.</div></footer>
    </div>
  );
}
