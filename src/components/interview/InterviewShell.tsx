import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Brand } from "@/components/brand/Brand";
import { Shield } from "lucide-react";

interface InterviewShellProps {
  children: ReactNode;
  candidateName?: string;
  jobTitle?: string;
}

export function InterviewShell({ children, candidateName, jobTitle }: InterviewShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/80 bg-background/90 px-4 sm:px-8 backdrop-blur-md">
        <Link to="/jobs" className="hover:opacity-90 transition-opacity">
          <Brand />
        </Link>

        <div className="flex items-center gap-4 text-xs">
          {candidateName && (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="font-medium text-foreground">{candidateName}</span>
              {jobTitle && <span className="text-muted-foreground">· {jobTitle}</span>}
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 rounded-full px-2.5 py-1 border border-border/50">
            <Shield className="size-3 text-primary" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 px-4 text-center text-[11px] text-muted-foreground">
        FiltR Interview Intelligence · All responses recorded for objective evaluation only
      </footer>
    </div>
  );
}
