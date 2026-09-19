import type { RequirementStatus } from "@/types/filtr";

interface EvidenceStatusProps {
  status: RequirementStatus;
  size?: "sm" | "md";
}

export function EvidenceStatus({ status, size = "md" }: EvidenceStatusProps) {
  const isSmall = size === "sm";

  if (status === "Validated") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        } bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20`}
      >
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Validated
      </span>
    );
  }

  if (status === "Partial") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        } bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20`}
      >
        <span className="size-1.5 rounded-full bg-amber-500" />
        Partial
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      } bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20`}
    >
      <span className="size-1.5 rounded-full bg-rose-500" />
      Needs validation
    </span>
  );
}
