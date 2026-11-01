"use client";

import { useState, useRef } from "react";
import { createEvent, uploadPostImage } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Primitives";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];
  const errors = {
    title: !title.trim() ? "Give the event a name" : undefined,
    date: !eventDate ? "Pick a date" : eventDate < today ? "Pick a date that hasn't passed" : undefined,
    time: !eventTime ? "Pick a start time" : undefined,
    location: !location.trim() ? "Say where it is" : undefined,
  };
  const valid = Object.values(errors).every((e) => !e);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid || !user || loading) return;
    setLoading(true);
    setError(null);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const url = await uploadPostImage(user.id, imageFile);
        if (!url) throw new Error("upload");
        imageUrl = url;
      }
      const data = await createEvent(user.id, title.trim(), description.trim(), eventDate, eventTime, location.trim(), imageUrl);
      setCreated({ id: data.id });
    } catch (err) {
      setError(err instanceof Error && err.message === "upload" ? "The cover photo didn't upload. Try a smaller photo or remove it." : "Couldn't create the event. Check your connection and try again.");
    }
    setLoading(false);
  }

  if (created) {
    return (
      <AuthGuard>
        <PageHeader title="Event created" back="/events" />
        <EmptyState
          icon="check-circle"
          title="Your event is live"
          body="Neighbors can see it under Events and RSVP. You'll see who's coming on the event page."
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Button href={`/events/${created.id}`}>View event</Button>
              <Button href="/events" variant="secondary">All events</Button>
            </div>
          }
        />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-28 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Create an event" subtitle="Visible to Sunburst Farms East residents only" back sticky={false} />

        <form onSubmit={handleSubmit} noValidate className="flex-1 px-4 md:px-6">
          <div className="mb-5">
            <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
              Cover photo <span className="font-normal" style={{ color: "var(--text-3)" }}>(optional)</span>
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="sr-only" id="event-cover" />
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Cover preview" className="w-full rounded-xl object-cover" style={{ height: 180, border: "1px solid var(--border)" }} />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "var(--text)", color: "white" }}
                  aria-label="Remove cover photo"
                >
                  <Icon name="x" size={18} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <label htmlFor="event-cover" className="flex items-center gap-4 p-4 rounded-xl cursor-pointer" style={{ background: "var(--surface)", border: "1.5px dashed var(--border-strong)" }}>
                <span className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                  <Icon name="image" size={24} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold" style={{ color: "var(--text)" }}>Add a photo or flyer</span>
                  <span className="block text-[14px]" style={{ color: "var(--text-2)" }}>Shown at the top of the event</span>
                </span>
              </label>
            )}
          </div>

          <Field label="Event name" required error={tried ? errors.title : undefined}>
            {(id, by) => <TextInput id={id} describedBy={by} value={title} onChange={setTitle} placeholder="Neighborhood potluck" invalid={tried && !!errors.title} />}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" required error={tried ? errors.date : undefined}>
              {(id, by) => <TextInput id={id} describedBy={by} type="date" min={today} value={eventDate} onChange={setEventDate} invalid={tried && !!errors.date} />}
            </Field>
            <Field label="Start time" required error={tried ? errors.time : undefined}>
              {(id, by) => <TextInput id={id} describedBy={by} type="time" value={eventTime} onChange={setEventTime} invalid={tried && !!errors.time} />}
            </Field>
          </div>

          <Field label="Location" required error={tried ? errors.location : undefined} hint="A park, the arena, or your street. Share exact house addresses by message if you prefer.">
            {(id, by) => <TextInput id={id} describedBy={by} value={location} onChange={setLocation} placeholder="Sereno Park pavilion" invalid={tried && !!errors.location} />}
          </Field>

          <Field label="Details" optional>
            {(id, by) => <TextArea id={id} describedBy={by} value={description} onChange={setDescription} rows={4} placeholder="What to bring, what to expect, who it's for" />}
          </Field>

          {error && (
            <div className="mb-4">
              <Notice tone="danger" icon="alert-triangle">{error}</Notice>
            </div>
          )}

          <Button type="submit" full size="lg" loading={loading}>
            {loading ? "Creating" : "Create event"}
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
