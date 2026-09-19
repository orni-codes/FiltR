import type { StatusTone } from "@/types/filtr";

/** Map common string statuses to a tone */
export function statusTone(status: string): StatusTone {
  switch (status) {
    case "Completed":
    case "Validated":
    case "Active":
      return "success";
    case "In Progress":
    case "Required":
      return "info";
    case "Needs Review":
    case "Partial":
    case "Needs validation":
      return "warning";
    default:
      return "neutral";
  }
}
