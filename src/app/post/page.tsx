"use client";

import { Suspense } from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type Category, CATEGORY_LABELS, CATEGORY_ICON, postKind } from "@/lib/data";
import { createPost, uploadPostImage } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Panel, Notice } from "@/components/ui/Primitives";

type Intent = "update" | "give" | "help" | "sell" | "event";

const INTENTS: { value: Intent; label: string; description: string; icon: IconName; categories?: Category[]; href?: string }[] = [
  { value: "update", label: "Share an update", description: "News, a recommendation, a safety heads-up, or a lost pet", icon: "message-circle", categories: ["general", "recommendation", "safety", "lost_found"] },
  { value: "give", label: "Give away or lend", description: "Extra produce, eggs, plants, free stuff, or a tool to borrow", icon: "gift", categories: ["produce", "eggs", "flowers", "seeds", "free", "tools"] },
  { value: "help", label: "Ask for help", description: "A hand with a project, a ride, a referral", icon: "hand", categories: ["help"] },
  { value: "sell", label: "Sell an item", description: "Goes in the Marketplace with photos and a price", icon: "store", href: "/market/new" },
  { value: "event", label: "Create an event", description: "Neighbors can RSVP and see who's going", icon: "calendar", href: "/events/new" },
];

const DRAFT_KEY = "sbfe-post-draft";

function CreatePostPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { user } = useAuth();
  const [intent, setIntent] = useState<Intent | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore a draft (text only) if the page was left mid-post
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.intent) setIntent(d.intent);
        if (d.category) setCategory(d.category);
        if (d.title) setTitle(d.title);
        if (d.body) setBody(d.body);
      }
    } catch {}
    const c = search.get("category") as Category | null;
    if (c && CATEGORY_LABELS[c]) {
      const i = INTENTS.find((x) => x.categories?.includes(c));
      if (i) setIntent(i.value);
      setCategory(c);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      if (title || body || category) sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ intent, category, title, body }));
    } catch {}
  }, [intent, category, title, body]);

  const current = INTENTS.find((i) => i.value === intent);
  const errors = {
    category: !category ? "Pick one" : undefined,
    title: !title.trim() ? "Add a short title" : undefined,
  };
  const valid = !errors.category && !errors.title;

  function chooseIntent(i: (typeof INTENTS)[number]) {
    if (i.href) {
      router.push(i.href);
      return;
    }
    setIntent(i.value);
    if (i.categories?.length === 1) setCategory(i.categories[0]);
    else if (category && !i.categories?.includes(category)) setCategory(null);
  }

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
      const data = await createPost(user.id, category!, title.trim(), body.trim(), imageUrl);
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {}
      setCreated({ id: data.id });
    } catch (err) {
      setError(err instanceof Error && err.message === "upload" ? "The photo didn't upload. Try a smaller photo or remove it." : "Couldn't publish. Check your connection and try again.");
    }
    setLoading(false);
  }

  if (created) {
    return (
      <AuthGuard>
        <PageHeader title="Shared" back="/" />
        <EmptyState
          icon="check-circle"
          title="Shared with your neighbors"
          body="Your post is on the Home feed. You can edit its status or delete it from the post page."
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Button href={`/posts/${created.id}`}>View post</Button>
              <Button href="/" variant="secondary">Back to Home</Button>
            </div>
          }
        />
      </AuthGuard>
    );
  }

  const kindHint = category ? postKind(category) : null;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-28 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title={current ? current.label : "Share with neighbors"} subtitle={current ? undefined : "What would you like to do?"} back={intent ? true : "/"} sticky={false} />

        <main className="flex-1 px-4 md:px-6">
          {!intent ? (
            <Panel>
              {INTENTS.map((i) => (
                <button
                  key={i.value}
                  type="button"
                  onClick={() => chooseIntent(i)}
                  className="ui-row flex items-center gap-3.5 px-4 py-4 w-full text-left min-h-[64px]"
                >
                  <span className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--primary-soft)", color: "var(--primary-soft-text)" }}>
                    <Icon name={i.icon} size={22} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[17px] font-semibold" style={{ color: "var(--text)" }}>{i.label}</span>
                    <span className="block text-[14px] leading-snug mt-0.5" style={{ color: "var(--text-2)" }}>{i.description}</span>
                  </span>
                  <Icon name="chevron-right" size={18} color="var(--text-3)" />
                </button>
              ))}
            </Panel>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {current?.categories && current.categories.length > 1 && (
                <div className="mb-5">
                  <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                    What kind? <span style={{ color: "var(--danger)" }} aria-hidden>*</span>
                  </p>
                  <div role="radiogroup" aria-label="Post type" className="grid grid-cols-2 gap-2">
                    {current.categories.map((c) => {
                      const active = category === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setCategory(c)}
                          className="flex items-center gap-2.5 px-3 h-12 rounded-lg text-[15px] font-semibold text-left"
                          style={{
                            background: active ? "var(--primary)" : "var(--surface)",
                            color: active ? "var(--text-on-primary)" : "var(--text)",
                            border: `1px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
                          }}
                        >
                          <Icon name={CATEGORY_ICON[c]} size={18} />
                          {CATEGORY_LABELS[c]}
                        </button>
                      );
                    })}
                  </div>
                  {tried && errors.category && (
                    <p role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>{errors.category}</p>
                  )}
                </div>
              )}

              {kindHint === "alert" && (
                <div className="mb-4">
                  <Notice tone="danger" icon="alert-triangle">Safety alerts show at the top of the feed in red. For emergencies, call 911 first.</Notice>
                </div>
              )}
              {kindHint === "giveaway" && (
                <div className="mb-4">
                  <Notice tone="success" icon="gift">Neighbors tap &ldquo;I&rsquo;ll take it&rdquo; to message you. Mark the post claimed from the post page when it&rsquo;s gone.</Notice>
                </div>
              )}

              <Field label="Title" required error={tried ? errors.title : undefined}>
                {(id, by) => (
                  <TextInput
                    id={id}
                    describedBy={by}
                    value={title}
                    onChange={setTitle}
                    invalid={tried && !!errors.title}
                    placeholder={
                      kindHint === "giveaway" ? "Two dozen eggs on the porch" : kindHint === "lost_found" ? "Lost: orange tabby near 54th St" : kindHint === "help" ? "Need a hand moving a couch Saturday" : kindHint === "alert" ? "Coyote on the bridle path this morning" : "What's going on?"
                    }
                  />
                )}
              </Field>

              <Field label="Details" optional hint={kindHint === "lost_found" ? "Where and when, what they look like, how to reach you." : kindHint === "giveaway" ? "Where to pick up and when it's available." : undefined}>
                {(id, by) => <TextArea id={id} describedBy={by} value={body} onChange={setBody} rows={5} />}
              </Field>

              <div className="mb-5">
                <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                  Photo <span className="font-normal" style={{ color: "var(--text-3)" }}>(optional)</span>
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="sr-only" id="post-photo" />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full rounded-xl object-cover" style={{ maxHeight: 260, border: "1px solid var(--border)" }} />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--text)", color: "white" }} aria-label="Remove photo">
                      <Icon name="x" size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="post-photo" className="flex items-center gap-3 px-4 h-14 rounded-xl cursor-pointer" style={{ background: "var(--surface)", border: "1.5px dashed var(--border-strong)", color: "var(--text-2)" }}>
                    <Icon name="image" size={22} />
                    <span className="text-[15px] font-semibold">Add a photo</span>
                  </label>
                )}
              </div>

              {error && (
                <div className="mb-4">
                  <Notice tone="danger" icon="alert-triangle">{error}</Notice>
                </div>
              )}

              <Button type="submit" full size="lg" loading={loading}>
                {loading ? "Publishing" : "Share with neighbors"}
              </Button>
              <p className="text-[13px] text-center mt-3" style={{ color: "var(--text-3)" }}>
                Visible to verified Sunburst Farms East residents only.
              </p>
            </form>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={null}>
      <CreatePostPageInner />
    </Suspense>
  );
}
