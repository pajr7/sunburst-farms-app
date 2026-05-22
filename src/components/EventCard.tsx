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
      className={`rounded-2xl overflow-hidden animate-fade-up animate-fade-up-delay-${Math.min(index + 1, 5)}`}
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <Link href={`/events/${event.id}`} className="block">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full object-cover"
            style={{ height: 140 }}
            loading="lazy"
          />
        )}
        <div className="flex gap-4 p-4">
          <div
            className="flex flex-col items-center justify-center shrink-0 w-16 rounded-xl py-2"
            style={{ background: "var(--accent-light)" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              {month}
            </span>
            <span className="text-2xl font-bold leading-none" style={{ color: "var(--navy)" }}>
              {day}
            </span>
            <span className="text-[10px] font-medium uppercase" style={{ color: "var(--text-muted)" }}>
              {weekday}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] mb-1" style={{ color: "var(--text)" }}>
              {event.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {event.time}
            </div>
            <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 px-4 pb-4 -mt-1">
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: "var(--accent-light)", color: "var(--accent)" }}
        >
          {event.attendees} going
        </span>
        <button
          onClick={(e) => { e.preventDefault(); onRsvp?.(); }}
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors"
          style={{
            background: isRsvped ? "var(--navy)" : "var(--accent-light)",
            color: isRsvped ? "var(--white)" : "var(--navy)",
          }}
        >
          {isRsvped ? "GOING" : "RSVP"}
        </button>
      </div>
    </div>
  );
}
