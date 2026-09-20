import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, FileCheck2, MoreHorizontal, Settings, UsersRound, X, Zap } from "lucide-react";
import { Brand } from "@/components/brand/Brand";
import { Button } from "@/components/ui/button";

interface SidebarProps { open: boolean; onClose: () => void; }

const NAV_ITEMS = [
  { label: "Jobs", icon: BriefcaseBusiness, to: "/jobs" as const, hint: "Workspace" },
  { label: "Candidates", icon: UsersRound, to: "/jobs/data-analyst/candidates" as const, hint: "People" },
  { label: "Reports", icon: FileCheck2, to: "/jobs/data-analyst/reports" as const, hint: "Evidence" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar/95 px-3 py-4 shadow-2xl shadow-slate-900/5 backdrop-blur-xl transition-transform duration-200 lg:translate-x-0`}>
      <div className="flex items-center justify-between px-2.5">
        <Link to="/jobs" onClick={onClose}><Brand /></Link>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose} aria-label="Close navigation"><X /></Button>
      </div>

      <div className="mx-2.5 mt-8 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span>Interviewer</span><span className="rounded-full border border-border bg-background px-2 py-0.5 text-[9px] tracking-normal text-primary">LIVE</span>
      </div>

      <nav className="mt-3 space-y-1" aria-label="Interviewer navigation">
        {NAV_ITEMS.map(({ label, icon: Icon, to, hint }) => (
          <Link key={label} to={to} onClick={onClose} className="group relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" activeProps={{ className: "group relative flex h-11 w-full items-center gap-3 rounded-xl bg-primary/[0.08] px-3 text-sm font-medium text-foreground ring-1 ring-primary/[0.10]" }} activeOptions={{ exact: label === "Jobs" }}>
            <span className="flex size-8 items-center justify-center rounded-lg bg-muted/70 transition-colors group-hover:bg-background"><Icon className="size-4" /></span>
            <span className="min-w-0 flex-1"><span className="block">{label}</span><span className="block text-[9px] font-normal text-muted-foreground">{hint}</span></span>
          </Link>
        ))}
      </nav>

      <div className="mx-2 mt-7 rounded-2xl border border-primary/15 bg-primary/[0.055] p-3.5 filtr-glow">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary"><Zap className="size-3.5" /> Signal engine</div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Evidence mapping is active. Human review stays in control.</p>
      </div>

      <div className="mt-auto space-y-2 pt-6">
        <Button variant="ghost" className="h-10 w-full justify-start rounded-xl px-3 text-muted-foreground"><Settings className="mr-2 size-4" />Settings</Button>
        <div className="flex items-center gap-2.5 border-t border-border px-2 pt-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-[10px] font-semibold text-background">AM</div>
          <div className="min-w-0"><div className="truncate text-xs font-medium">Ava Morgan</div><div className="truncate text-[10px] text-muted-foreground">Recruiting lead</div></div>
          <MoreHorizontal className="ml-auto size-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
