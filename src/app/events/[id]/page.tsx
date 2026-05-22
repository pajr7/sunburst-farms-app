"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvent, toggleRsvp, getEventPhotos, uploadEventPhoto, addEventPhoto, deleteEventPhoto } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadEvent();
    loadPhotos();
  }, [id]);

  async function loadEvent() {
    try {
      const data = await getEvent(id);
      setEvent(data);
    } catch {
      setEvent(null);
    }
    setLoading(false);
  }

  async function loadPhotos() {
    try {
      const data = await getEventPhotos(id);
      setPhotos(data);
    } catch {}
  }

  async function handleRsvp() {
    if (!user || !event) return;
    await toggleRsvp(event.id, user.id);
    loadEvent();
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const url = await uploadEventPhoto(user.id, id, files[i]);
      if (url) await addEventPhoto(id, user.id, url);
    }
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

  const [saving, setSaving] = useState(false);
  async function handleDownload(url: string, filename: string) {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] }).catch(() => {});
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch {}
    setSaving(false);
  }

  const isRsvped = event?.rsvps?.some((r: any) => r.user_id === user?.id) ?? false;

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </AuthGuard>
    );
  }

  if (!event) {
    return (
      <AuthGuard>
        <div className="flex flex-col items-center justify-center min-h-screen px-6" style={{ background: "var(--bg)" }}>
          <p className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>Event not found</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>It may have been removed or already passed.</p>
          <button
            onClick={() => router.push("/events")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "var(--navy)", color: "var(--white)" }}
          >
            Back to events
          </button>
        </div>
      </AuthGuard>
    );
  }

  const date = new Date(event.event_date + "T00:00:00");
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        {/* Cover image or colored header */}
        {event.image_url ? (
          <div className="relative">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full object-cover"
              style={{ height: 220 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 50%)" }}
            />
            <button
              onClick={() => router.back()}
              className="absolute top-[env(safe-area-inset-top,12px)] left-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        ) : (
          <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-medium mb-3"
              style={{ color: "var(--accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          </header>
        )}

        <main className="flex-1 px-4">
          {/* Title + date badge */}
          <div className="flex gap-4 mb-5 animate-fade-up animate-fade-up-delay-1">
            <div
              className="flex flex-col items-center justify-center shrink-0 w-16 h-18 rounded-xl py-2"
              style={{ background: "var(--accent-light)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                {date.toLocaleString("en-US", { month: "short" }).toUpperCase()}
              </span>
              <span className="text-2xl font-bold leading-none" style={{ color: "var(--navy)" }}>
                {date.getDate()}
              </span>
              <span className="text-[10px] font-medium uppercase" style={{ color: "var(--text-muted)" }}>
                {date.toLocaleString("en-US", { weekday: "short" })}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-extrabold tracking-tight mb-1" style={{ color: "var(--navy)" }}>
                {event.title}
              </h1>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Hosted by {event.author?.name ?? "Neighbor"}
              </p>
            </div>
          </div>

          {/* Info rows */}
          <div
            className="rounded-2xl overflow-hidden divide-y mb-5 animate-fade-up animate-fade-up-delay-2"
            style={{ background: "var(--card)", border: "1px solid var(--border)", "--tw-divide-opacity": "1" } as React.CSSProperties}
          >
            <div className="flex items-center gap-3.5 p-4" style={{ borderColor: "var(--border)" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-light)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{formattedDate}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{event.event_time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4" style={{ borderColor: "var(--border)" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-light)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{event.location}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Location</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4" style={{ borderColor: "var(--border)" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-light)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                  {event.rsvps?.length ?? 0} going
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {event.rsvps?.length === 0 ? "Be the first to RSVP" : "neighbors attending"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-5 animate-fade-up animate-fade-up-delay-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                About this event
              </h2>
              <div
                className="p-4 rounded-2xl"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.rsvps?.length > 0 && (
            <div className="mb-6 animate-fade-up animate-fade-up-delay-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                Who's going
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.rsvps.map((rsvp: any) => (
                  <div
                    key={rsvp.user_id}
                    className="flex items-center gap-2 px-3 py-2 rounded-full"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: "var(--accent-light)", color: "var(--navy)" }}
                    >
                      {rsvp.profiles?.avatar_initials ?? "??"}
                    </div>
                    <span className="text-[12px] font-medium" style={{ color: "var(--text)" }}>
                      {rsvp.profiles?.name ?? "Neighbor"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="mb-6 animate-fade-up animate-fade-up-delay-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Photos ({photos.length})
              </h2>
              <label
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer"
                style={{ background: "var(--accent-light)", color: "var(--navy)" }}
              >
                {uploading ? "Uploading..." : "+ Add Photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden">
                {photos.map((photo: any) => (
                  <button
                    key={photo.id}
                    onClick={() => setViewingPhoto(photo)}
                    className="aspect-square overflow-hidden"
                  >
                    <img
                      src={photo.image_url}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="p-6 rounded-2xl text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="mx-auto mb-2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  No photos yet. Be the first to share!
                </p>
              </div>
            )}
          </div>

          {/* Photo viewer modal */}
          {viewingPhoto && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.9)" }}
              onClick={() => setViewingPhoto(null)}
            >
              <div className="absolute top-4 right-4 flex gap-2" style={{ top: "env(safe-area-inset-top, 16px)" }}>
                {viewingPhoto.user_id === user?.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(viewingPhoto.id); }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(viewingPhoto.image_url, `sunburst-photo-${viewingPhoto.id}.jpg`); }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewingPhoto(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <img
                src={viewingPhoto.image_url}
                alt=""
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-xs text-white/60">
                  by {viewingPhoto.uploader?.name ?? "Neighbor"}
                </p>
              </div>
            </div>
          )}

          {/* RSVP button */}
          <button
            onClick={handleRsvp}
            className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all animate-fade-up animate-fade-up-delay-5"
            style={{
              background: isRsvped ? "var(--card)" : "var(--navy)",
              color: isRsvped ? "var(--navy)" : "var(--white)",
              border: isRsvped ? "2px solid var(--navy)" : "none",
            }}
          >
            {isRsvped ? "Cancel RSVP" : "RSVP — I'm Going"}
          </button>
        </main>
      </div>
    </AuthGuard>
  );
}
