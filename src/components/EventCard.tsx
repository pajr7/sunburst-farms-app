"use client";

import Link from "next/link";
import { type Event } from "@/lib/data";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import { Panel, formatTime12 } from "./ui/Primitives";

interface EventCardProps {
  event: Event;
  index?: number;
  onRsvp?: () => void;
  isRsvped?: boolean;
  busy?: boolean;
}

export function eventDateLine(date: string, time: string): string {
  const d = new Date(date + "T00:00:00");
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return time ? `${day} · ${formatTime12(time)}` : day;
}

export function AvatarStack({ initials, total }: { initials: string[]; total: number }) {
  const shown = initials.slice(0, 4);
  if (total === 0) return null;
  return (
    <span className="flex items-center">
      <span className="flex -space-x-2">
        {shown.map((i, idx) => (
          <span key={idx} className="rounded-full" style={{ boxShadow: "0 0 0 2px var(--surface)" }}>
            <Avatar initials={i} size={26} />
          </span>
        ))}
      </span>
      <span className="ml-2 text-[14px] font-semibold" style={{ color: "var(--text-2)" }}>
        {total} going
      </span>
    </span>
  );
}

export default function EventCard({ event, index = 0, onRsvp, isRsvped = false, busy = false }: EventCardProps) {
  const href = `/events/${event.id}`;
  return (
    <li className="list-none" data-index={index}>
      <Panel>
        <Link href={href} className="block">
          {event.image && (
            <img src={event.image} alt="" className="w-full object-cover" style={{ height: 176 }} loading="lazy" />
          )}
          <div className="px-4 pt-3.5 pb-2">
            <p className="text-[14px] font-bold" style={{ color: "var(--primary)" }}>
              {eventDateLine(event.date, event.time)}
            </p>
            <h3 className="text-[19px] font-bold leading-snug mt-0.5" style={{ color: "var(--text)" }}>
              {event.title}
            </h3>
            <p className="flex items-center gap-1.5 text-[15px] mt-1.5 truncate" style={{ color: "var(--text-2)" }}>
              <Icon name="map-pin" size={16} />
              <span className="truncate">{event.location}</span>
            </p>
            <p className="flex items-center gap-2 text-[14px] mt-2" style={{ color: "var(--text-2)" }}>
              <Avatar initials={event.author?.avatar ?? "?"} src={event.author?.avatarUrl} size={22} />
              Hosted by {event.author?.name ?? "a neighbor"}
            </p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-3 px-4 pb-3.5 pt-1">
          <AvatarStack initials={event.attendeeInitials ?? []} total={event.attendees} />
          {event.attendees === 0 && (
            <span className="text-[14px]" style={{ color: "var(--text-3)" }}>
              No RSVPs yet
            </span>
          )}
          <Button
            size="sm"
            variant={isRsvped ? "soft" : "primary"}
            icon={isRsvped ? "check" : undefined}
            onClick={onRsvp}
            loading={busy}
            aria-pressed={isRsvped}
          >
            {isRsvped ? "Going" : "RSVP"}
          </Button>
        </div>
      </Panel>
    </li>
  );
}
