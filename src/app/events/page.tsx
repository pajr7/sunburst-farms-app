"use client";

import { useState, useEffect, Fragment } from "react";
import { getEvents, toggleRsvp } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import EventCard from "@/components/EventCard";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Spinner, SectionTitle } from "@/components/ui/Primitives";

function monthLabel(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
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
    if (!user || busy) return;
    setBusy(eventId);
    await toggleRsvp(eventId, user.id);
    await loadEvents();
    setBusy(null);
  }

  let lastMonth = "";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader
          title="Events"
          back="/community"
          actions={
            <Button href="/events/new" size="sm" icon="plus">
              Create
            </Button>
          }
        />

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading events" />
          ) : events.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No upcoming events"
              body="Potlucks, trail rides, yard sales, board meetings. Plan something and neighbors can RSVP here."
              action={<Button href="/events/new" icon="plus">Create an event</Button>}
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {events.map((event: any, i: number) => {
                const m = monthLabel(event.event_date);
                const showMonth = m !== lastMonth;
                lastMonth = m;
                return (
                  <Fragment key={event.id}>
                    {showMonth && (
                      <li className="list-none -mb-1">
                        <SectionTitle>{m}</SectionTitle>
                      </li>
                    )}
                    <EventCard
                      event={{
                        id: event.id,
                        title: event.title,
                        date: event.event_date,
                        time: event.event_time,
                        location: event.location,
                        description: event.description,
                        attendees: event.rsvps?.length ?? 0,
                        image: event.image_url,
                        author: { name: event.author?.name ?? "Neighbor", avatar: event.author?.avatar_initials ?? "??", avatarUrl: event.author?.avatar_url }
                      }}
                      index={i}
                      onRsvp={() => handleRsvp(event.id)}
                      isRsvped={event.rsvps?.some((r: any) => r.user_id === user?.id) ?? false}
                      busy={busy === event.id}
                    />
                  </Fragment>
                );
              })}
            </ul>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
