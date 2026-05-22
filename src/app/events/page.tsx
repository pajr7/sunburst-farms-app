"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getEvents, toggleRsvp } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import EventCard from "@/components/EventCard";

import AuthGuard from "@/components/AuthGuard";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data ?? []);
    } catch {
      setEvents([]);
    }
    setLoading(false);
  }

  async function handleRsvp(eventId: string) {
    if (!user) return;
    await toggleRsvp(eventId, user.id);
    loadEvents();
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-4" style={{ background: "var(--bg)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
                Community Events
              </h1>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                What's happening in the neighborhood
              </p>
            </div>
            <Link
              href="/events/new"
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--navy)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
              <span className="text-4xl mb-3">&#127881;</span>
              <p className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>No upcoming events</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Be the first to plan something!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any, i: number) => (
                <EventCard
                  key={event.id}
                  event={{
                    id: event.id,
                    title: event.title,
                    date: event.event_date,
                    time: event.event_time,
                    location: event.location,
                    description: event.description,
                    attendees: event.rsvps?.length ?? 0,
                    image: event.image_url,
                    author: {
                      name: event.author?.name ?? "Neighbor",
                      avatar: event.author?.avatar_initials ?? "??",
                    },
                  }}
                  index={i}
                  onRsvp={() => handleRsvp(event.id)}
                  isRsvped={event.rsvps?.some((r: any) => r.user_id === user?.id) ?? false}
                />
              ))}
            </div>
          )}
        </main>

      </div>
    </AuthGuard>
  );
}
