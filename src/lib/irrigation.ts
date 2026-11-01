import type { IrrigationUpdate, IrrigationStatus } from "./database";

export const IRRIGATION_STATUS_LABEL: Record<IrrigationStatus, string> = {
  awaiting: "Awaiting information",
  estimated: "Estimated",
  confirmed: "Confirmed",
  delayed: "Delayed or changed",
};

export const IRRIGATION_STATUS_HELP: Record<IrrigationStatus, string> = {
  awaiting: "The coordinator has not received a date from the water provider yet.",
  estimated: "A best guess from the coordinator. It can still move.",
  confirmed: "The water provider has confirmed this date.",
  delayed: "The earlier date no longer holds. See the note for what changed.",
};

function fmt(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** "Thu, Nov 6" or "Nov 6 to Nov 8" or "No date yet" */
export function irrigationWindow(u: IrrigationUpdate): string {
  if (!u.window_start) return "No date yet";
  if (!u.window_end || u.window_end === u.window_start) return fmt(u.window_start);
  return `${fmt(u.window_start)} to ${fmt(u.window_end)}`;
}

export function irrigationSummary(u: IrrigationUpdate): string {
  if (u.status === "awaiting") return "Waiting on the next delivery date";
  const w = irrigationWindow(u);
  if (u.status === "estimated") return `Estimated ${w}`;
  if (u.status === "confirmed") return `Water ${w}`;
  return `Changed: ${u.note?.split("\n")[0] || w}`;
}

/**
 * A past estimate or confirmation must not keep showing as current.
 * Awaiting/delayed stay current for 14 days after posting.
 */
export function irrigationIsCurrent(u: IrrigationUpdate, now = new Date()): boolean {
  const today = now.toISOString().slice(0, 10);
  const end = u.window_end ?? u.window_start;
  if (end) return end >= today;
  const ageDays = (now.getTime() - new Date(u.created_at).getTime()) / 86400000;
  return ageDays <= 14;
}
