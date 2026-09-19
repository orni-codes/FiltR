import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <section
      className={`rounded-2xl border border-border/90 bg-card shadow-sm transition-shadow ${className}`}
    >
      {children}
    </section>
  );
}
