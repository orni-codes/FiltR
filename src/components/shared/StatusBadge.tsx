import type { ReactNode } from "react";
import type { StatusTone } from "@/types/filtr";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: StatusTone;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
  neutral: "bg-muted text-muted-foreground",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium ${TONE_CLASSES[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
