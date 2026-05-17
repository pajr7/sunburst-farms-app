"use client";

import { MOCK_EVENTS } from "@/lib/data";
import EventCard from "@/components/EventCard";
import BottomNav from "@/components/BottomNav";

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "var(--warm-sand)" }}>
      <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-4" style={{ background: "var(--warm-sand)" }}>
        <h1 className="font-display text-2xl" style={{ color: "var(--charcoal)" }}>
          Community Events
        </h1>
        <p className="text-xs font-medium" style={{ color: "var(--stone)" }}>
          What's happening in the neighborhood
        </p>
      </header>

      <main className="flex-1 px-4">
        <div className="flex flex-col gap-3">
          {MOCK_EVENTS.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
