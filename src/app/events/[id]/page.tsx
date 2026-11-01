"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvent, toggleRsvp, getEventPhotos, uploadEventPhoto, addEventPhoto, deleteEventPhoto, deleteEvent } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, Notice, SectionTitle, formatDateLong, formatTime12 } from "@/components/ui/Primitives";
import { AvatarStack } from "@/components/EventCard";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<any>(null);
  const [showAllGuests, setShowAllGuests] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadEvent();
    loadPhotos();
  }, [id]);

  async function loadEvent() {
    try {
      setEvent(await getEvent(id));
    } catch {
      setEvent(null);
    }
    setLoading(false);
  }

  async function loadPhotos() {
    try {
      setPhotos(await getEventPhotos(id));
    } catch {}
  }

  async function handleRsvp() {
    if (!user || !event || rsvpBusy) return;
    setRsvpBusy(true);
    setError(null);
    try {
      await toggleRsvp(event.id, user.id);
      await loadEvent();
    } catch {
      setError("Couldn't save your RSVP. Try again.");
    }
    setRsvpBusy(false);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);
    setError(null);
    let failed = 0;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadEventPhoto(user.id, id, files[i]);
      if (url) await addEventPhoto(id, user.id, url);
      else failed++;
    }
    if (failed) setError(`${failed} photo${failed > 1 ? "s" : ""} didn't upload. Try smaller files.`);
    await loadPhotos();
    setUploading(false);
    e.target.value = "";
  }

  async function handleDeletePhoto(photoId: string) {
    if (!user) return;
    await deleteEventPhoto(photoId, user.id);
    setViewingPhoto(null);
    loadPhotos();
  }

  async function handleDeleteEvent() {
    if (!user || !event) return;
    setError(null);
    try {
      await deleteEvent(event.id, user.id);
      router.replace("/events");
    } catch {
      setError("Couldn't cancel this event. If this keeps happening, ask a board member.");
      setConfirmDelete(false);
    }
  }

  useEffect(() => {
    if (!viewingPhoto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setViewingPhoto(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewingPhoto]);

  if (loading) {
    return (
      <AuthGuard>
        <PageHeader title="Event" back="/events" />
        <Spinner label="Loading event" />
      </AuthGuard>
    );
  }

  if (!event) {
    return (
      <AuthGuard>
        <PageHeader title="Event" back="/events" />
        <EmptyState icon="calendar" title="Event not found" body="It may have been canceled or already passed." action={<Button href="/events">Back to events</Button>} />
      </AuthGuard>
    );
  }

  const isRsvped = event.rsvps?.some((r: any) => r.user_id === user?.id) ?? false;
  const isHost = event.author_id === user?.id || event.author?.id === user?.id;
  const guests: any[] = event.rsvps ?? [];
  const guestInitials = guests.map((r) => r.profiles?.avatar_initials ?? "?");
  const visibleGuests = showAllGuests ? guests : guests.slice(0, 8);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-32 md:pb-8" style={{ background: "var(--bg)" }}>
        {event.image_url ? (
          <div className="relative md:px-6 md:pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute top-[calc(env(safe-area-inset-top,0px)_+_12px)] left-3 md:top-9 md:left-9 z-10 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "var(--surface)", color: "var(--text)", boxShadow: "var(--shadow-md)" }}
              aria-label="Back"
            >
              <Icon name="chevron-left" size={24} />
            </button>
            <img src={event.image_url} alt="" className="w-full object-cover md:rounded-xl" style={{ height: 240 }} />
          </div>
        ) : (
          <PageHeader title="Event" back sticky={false} />
        )}

        <main className="flex-1 px-4 md:px-6 pt-4">
          <p className="text-[15px] font-bold" style={{ color: "var(--primary)" }}>
            {formatDateLong(event.event_date)}
          </p>
          <h1 className="text-[26px] font-bold leading-tight mt-1" style={{ color: "var(--text)" }}>
            {event.title}
          </h1>

          <Panel className="mt-4">
            <div className="ui-row flex items-center gap-3.5 px-4 py-3.5">
              <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                <Icon name="clock" size={20} />
              </span>
              <div>
                <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                  {formatTime12(event.event_time)}
                </p>
                <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                  {formatDateLong(event.event_date)}
                </p>
              </div>
            </div>
            <div className="ui-row flex items-center gap-3.5 px-4 py-3.5">
              <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                <Icon name="map-pin" size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                  {event.location}
                </p>
                <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                  Location
                </p>
              </div>
            </div>
            <div className="ui-row flex items-center gap-3.5 px-4 py-3.5">
              <Avatar initials={event.author?.avatar_initials ?? "?"} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                  {event.author?.name ?? "Neighbor"}
                  {isHost ? " (you)" : ""}
                </p>
                <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                  Host{event.author?.section ? ` · ${event.author.section}` : ""}
                </p>
              </div>
              {!isHost && event.author?.id && (
                <Button href={`/messages/${event.author.id}?about=${encodeURIComponent(event.title)}&kind=event`} size="sm" variant="secondary" icon="message-circle">
                  Message
                </Button>
              )}
            </div>
          </Panel>

          {/* RSVP (desktop inline; mobile uses the sticky bar below) */}
          <div className="hidden md:flex items-center gap-3 mt-4">
            <Button variant={isRsvped ? "soft" : "primary"} icon={isRsvped ? "check" : undefined} onClick={handleRsvp} loading={rsvpBusy} aria-pressed={isRsvped}>
              {isRsvped ? "You're going" : "I'm going"}
            </Button>
            {isRsvped && (
              <Button variant="ghost" onClick={handleRsvp} disabled={rsvpBusy}>
                Can't make it anymore
              </Button>
            )}
          </div>

          {error && (
            <div className="mt-3">
              <Notice tone="danger" icon="alert-triangle">{error}</Notice>
            </div>
          )}

          {event.description && (
            <>
              <SectionTitle>About</SectionTitle>
              <p className="text-[16px] leading-[1.6] whitespace-pre-line" style={{ color: "var(--text)" }}>
                {event.description}
              </p>
            </>
          )}

          <SectionTitle>{guests.length === 0 ? "Guests" : `${guests.length} going`}</SectionTitle>
          {guests.length === 0 ? (
            <p className="text-[15px]" style={{ color: "var(--text-2)" }}>
              No one has RSVP'd yet. Be the first.
            </p>
          ) : (
            <Panel padded>
              <AvatarStack initials={guestInitials} total={guests.length} />
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {visibleGuests.map((r) => (
                  <li key={r.user_id} className="text-[15px]" style={{ color: "var(--text)" }}>
                    {r.profiles?.name ?? "Neighbor"}
                  </li>
                ))}
              </ul>
              {guests.length > 8 && !showAllGuests && (
                <button type="button" onClick={() => setShowAllGuests(true)} className="text-[15px] font-semibold mt-2" style={{ color: "var(--primary)" }}>
                  Show all {guests.length}
                </button>
              )}
            </Panel>
          )}

          <SectionTitle
            action={
              <label className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[14px] font-semibold cursor-pointer" style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}>
                <Icon name="image" size={16} />
                {uploading ? "Uploading…" : "Add photos"}
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            }
          >
            Photos{photos.length ? ` (${photos.length})` : ""}
          </SectionTitle>
          {photos.length > 0 ? (
            <ul className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
              {photos.map((photo: any) => (
                <li key={photo.id}>
                  <button type="button" onClick={() => setViewingPhoto(photo)} className="block w-full aspect-square overflow-hidden" aria-label={`Open photo by ${photo.uploader?.name ?? "neighbor"}`}>
                    <img src={photo.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px]" style={{ color: "var(--text-2)" }}>
              No photos yet. Add some during or after the event.
            </p>
          )}

          {isHost && (
            <>
              <SectionTitle>Host tools</SectionTitle>
              <Panel padded>
                <p className="text-[14px] mb-3" style={{ color: "var(--text-2)" }}>
                  Canceling removes the event and everyone's RSVPs.
                </p>
                {!confirmDelete ? (
                  <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirmDelete(true)}>
                    Cancel this event
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="danger" onClick={handleDeleteEvent}>
                      Yes, cancel it
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                      Keep event
                    </Button>
                  </div>
                )}
              </Panel>
            </>
          )}
        </main>

        {/* Mobile RSVP bar */}
        <div
          className="md:hidden fixed bottom-[calc(58px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 px-4 py-3 flex items-center gap-3"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
              {isRsvped ? "Your RSVP" : guests.length ? `${guests.length} going` : "Be the first to RSVP"}
            </p>
            <p className="text-[15px] font-semibold truncate" style={{ color: "var(--text)" }}>
              {isRsvped ? "You're going" : formatDateLong(event.event_date)}
            </p>
          </div>
          <Button variant={isRsvped ? "secondary" : "primary"} icon={isRsvped ? "check" : undefined} onClick={handleRsvp} loading={rsvpBusy} aria-pressed={isRsvped}>
            {isRsvped ? "Going" : "I'm going"}
          </Button>
        </div>

        {viewingPhoto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Photo"
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setViewingPhoto(null)}
          >
            <div className="absolute right-4 flex gap-2" style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)" }}>
              {viewingPhoto.user_id === user?.id && (
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDeletePhoto(viewingPhoto.id); }} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)", color: "white" }} aria-label="Delete photo">
                  <Icon name="trash" size={20} />
                </button>
              )}
              <button type="button" onClick={() => setViewingPhoto(null)} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)", color: "white" }} aria-label="Close" autoFocus>
                <Icon name="x" size={22} />
              </button>
            </div>
            <img src={viewingPhoto.image_url} alt="" className="max-w-full max-h-[80vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
            <p className="absolute bottom-6 left-0 right-0 text-center text-[14px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Photo by {viewingPhoto.uploader?.name ?? "a neighbor"}
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
