"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEvent, uploadPostImage } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";

import AuthGuard from "@/components/AuthGuard";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const isValid = title && eventDate && eventTime && location;

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const url = await uploadPostImage(user.id, imageFile);
        if (url) imageUrl = url;
      }
      await createEvent(user.id, title, description, eventDate, eventTime, location, imageUrl);
      setSubmitted(true);
    } catch {
      // handle error
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen pb-24 items-center justify-center px-6" style={{ background: "var(--bg)" }}>
          <div className="text-center animate-fade-up">
            <span className="text-5xl block mb-4">{"\u{1F389}"}</span>
            <h1 className="font-extrabold tracking-tight text-2xl mb-2" style={{ color: "var(--navy)" }}>
              Event created!
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Your neighbors can now RSVP. Spread the word!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push("/events")}
                className="px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: "var(--navy)", color: "var(--white)" }}
              >
                View events
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
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
          <h1 className="font-extrabold tracking-tight text-2xl" style={{ color: "var(--navy)" }}>
            Create an event
          </h1>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            BBQ, garage sale, trail ride, potluck — anything goes
          </p>
        </header>

        <main className="flex-1 px-4 pt-2">
          {/* Cover image */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Cover image (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Event cover"
                  className="w-full rounded-2xl object-cover"
                  style={{ height: 180 }}
                />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "var(--navy)", color: "var(--white)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl flex items-center gap-4 p-4 cursor-pointer transition-colors"
                style={{ background: "var(--card)", border: "2px dashed var(--border)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Add a photo or logo
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Flyer, logo, or a photo of the venue
                  </p>
                </div>
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Event name
            </label>
            <input
              type="text"
              placeholder="e.g., Neighborhood BBQ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Date
              </label>
              <input
                type="date"
                min={today}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Time
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., My place — 12345 E Cactus Rd"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Details (optional)
            </label>
            <textarea
              placeholder="What should people know? What to bring, what to expect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-opacity"
            style={{
              background: isValid ? "var(--navy)" : "var(--text-muted)",
              color: "var(--white)",
              opacity: isValid && !loading ? 1 : 0.5,
            }}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </main>
      </div>
    </AuthGuard>
  );
}
