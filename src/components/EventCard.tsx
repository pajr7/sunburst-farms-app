"use client";

import Link from "next/link";
import { Event } from "@/lib/data";

interface EventCardProps {
  event: Event;
  index?: number;
  onRsvp?: () => void;
  isRsvped?: boolean;
}

export default function EventCard({ event, index = 0, onRsvp, isRsvped = false }: EventCardProps) {
  const date = new Date(event.date + "T00:00:00");
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const weekday = date.toLocaleString("en-US", { weekday: "short" });

  return (
    <div
      className={`flex gap-3.5 animate-fade-up animate-fade-up-delay-${Math.min(index + 1, 5)}`}
    >
      {/* Date rail (Luma pattern: date lives outside the card) */}
      <div className="flex flex-col items-center shrink-0 pt-1" style={{ width: 44 }}>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {month}
        </span>
        <span className="text-[22px] font-extrabold leading-tight" style={{ color: "var(--navy)" }}>
          {day}
        </span>
        <span className="text-[10px] font-medium uppercase" style={{ color: "var(--text-muted)" }}>
          {weekday}
        </span>
        <div className="flex-1 w-px mt-2" style={{ background: "var(--border)" }} />
      </div>

      {/* Card */}
      <div
        className="flex-1 min-w-0 mb-4 rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <Link href={`/events/${event.id}`} className="block">
          {event.image && (
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full object-cover"
                style={{ height: 150 }}
                loading="lazy"
              />
              {isRsvped && (
                <span
                  className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{
                    background: "var(--card)",
                    color: "var(--success)",
                    border: "1.5px solid var(--success)",
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Going
                </span>
              )}
            </div>
          )}

          <div className="p-3.5 pb-2.5">
            {/* Organizer */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                style={{ background: "var(--accent-light)", color: "var(--navy)" }}
              >
                {event.author?.avatar ?? "?"}
              </div>
              <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-muted)" }}>
                {event.author?.name ?? "Neighbor"}
              </span>
              {isRsvped && !event.image && (
                <span
                  className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                  style={{ color: "var(--success)", border: "1.5px solid var(--success)" }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Going
                </span>
              )}
            </div>

            <h3 className="font-bold text-[15px] leading-snug mb-1.5" style={{ color: "var(--text)" }}>
              {event.title}
            </h3>

            <div className="flex items-center gap-3.5">
              <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {event.time}
              </span>
              <span className="flex items-center gap-1 text-[12px] truncate" style={{ color: "var(--text-muted)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </span>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-between px-3.5 pb-3">
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-muted)" }}>
            {event.attendees} going
          </span>
          <button
            onClick={(e) => { e.preventDefault(); onRsvp?.(); }}
            className="text-[13px] font-bold px-5 rounded-full transition-all active:scale-95"
            style={{
              height: 38,
              background: isRsvped ? "var(--card)" : "var(--navy)",
              color: isRsvped ? "var(--text-secondary)" : "var(--white)",
              border: isRsvped ? "1.5px solid var(--border)" : "1.5px solid var(--navy)",
            }}
          >
            {isRsvped ? "Cancel RSVP" : "RSVP"}
          </button>
        </div>
      </div>
    </div>
  );
}
