import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight, Command, Menu, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCandidate, getJob } from "@/data/mock";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const matches = useMatches();
  const params = matches.reduce<Record<string, string>>((acc, m) => {
    if (m.params && typeof m.params === "object") Object.assign(acc, m.params);
    return acc;
  }, {});
  const jobId = params["jobId"] as string | undefined;
  const candidateId = params["candidateId"] as string | undefined;
  const job = jobId ? getJob(jobId) : undefined;
  const candidate = candidateId ? getCandidate(candidateId) : undefined;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <nav className="flex min-w-0 items-center gap-1 text-xs" aria-label="Breadcrumb">
        <Link
          to="/jobs"
          className="rounded-lg px-2 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Jobs
        </Link>
        {job && (
          <>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <Link
              to="/jobs/$jobId"
              params={{ jobId: job.id }}
              className="max-w-40 truncate rounded-lg px-2 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {job.title}
            </Link>
          </>
        )}
        {candidate && (
          <>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="max-w-36 truncate px-2 py-1.5 font-medium text-foreground">
              {candidate.name}
            </span>
          </>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden h-9 items-center gap-2 rounded-xl border border-border bg-card/80 px-3 text-xs text-muted-foreground shadow-sm sm:flex">
          <Search className="size-3.5" />
          <span>Search workspace</span>
          <kbd className="ml-3 flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px]">
            <Command className="size-2.5" />K
          </kbd>
        </div>
        <Button variant="outline" size="icon" className="rounded-xl bg-card" aria-label="AI status">
          <Sparkles className="size-4 text-primary" />
        </Button>
      </div>
    </header>
  );
}
