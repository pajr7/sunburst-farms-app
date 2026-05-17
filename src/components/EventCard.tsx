"use client";

import { Event } from "@/lib/data";

export default function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const date = new Date(event.date + "T00:00:00");
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const weekday = date.toLocaleString("en-US", { weekday: "short" });

  return (
    <div
      className={`flex gap-4 p-4 rounded-2xl animate-fade-up animate-fade-up-delay-${Math.min(index + 1, 5)}`}
      style={{ background: "var(--cream-wash)" }}
    >
      <div className="flex flex-col items-center justify-center shrink-0 w-16">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--terracotta)" }}>
          {month}
        </span>
        <span className="text-2xl font-bold leading-none" style={{ color: "var(--charcoal)" }}>
          {day}
        </span>
        <span className="text-[10px] font-medium uppercase" style={{ color: "var(--stone)" }}>
          {weekday}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[15px] mb-1" style={{ color: "var(--charcoal)" }}>
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--stone)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {event.time}
        </div>
        <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--stone)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {event.location}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: "var(--cat-events-bg)", color: "var(--cat-events-text)" }}
          >
            {event.attendees} going
          </span>
          <button
            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors"
            style={{ background: "var(--sunburst)", color: "var(--charcoal)" }}
          >
            RSVP
          </button>
        </div>
      </div>
    </div>
  );
}
