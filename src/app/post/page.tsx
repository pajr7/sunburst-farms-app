"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Category, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";
import { createPost, uploadPostImage } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";

import AuthGuard from "@/components/AuthGuard";

const POST_CATEGORIES: Category[] = ["produce", "eggs", "flowers", "seeds", "tools", "events", "general"];

export default function CreatePostPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!category || !title || !user) return;
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const url = await uploadPostImage(user.id, imageFile);
        if (url) imageUrl = url;
      }
      await createPost(user.id, category, title, body, imageUrl);
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
            <span className="text-5xl block mb-4">{"\u{1F33B}"}</span>
            <h1 className="font-extrabold tracking-tight text-2xl mb-2" style={{ color: "var(--navy)" }}>
              Shared with your neighbors!
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Your post is now visible to all 281 homes in Sunburst Farms.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-full font-semibold text-sm"
              style={{ background: "var(--navy)", color: "var(--white)" }}
            >
              Back to feed
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
          <h1 className="font-extrabold tracking-tight text-2xl" style={{ color: "var(--navy)" }}>
            Share with neighbors
          </h1>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            What do you have to offer today?
          </p>
        </header>

        <main className="flex-1 px-4">
          <div className="mb-5">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: category === cat ? "var(--navy)" : "var(--card)",
                    color: category === cat ? "var(--white)" : "var(--text)",
                    border: category === cat ? "none" : "1px solid var(--border)",
                  }}
                >
                  {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Fresh eggs on the porch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Details
            </label>
            <textarea
              placeholder="Tell your neighbors what you're sharing, where to find it, and any other details..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Photo (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: 240 }}
                />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "var(--navy)", color: "var(--white)" }}
                >
                  X
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{ background: "var(--card)", border: "2px dashed var(--text-muted)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Tap to add a photo or video
                </span>
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !category || !title}
            className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-opacity"
            style={{
              background: category && title ? "var(--navy)" : "var(--text-muted)",
              color: "var(--white)",
              opacity: category && title && !loading ? 1 : 0.5,
            }}
          >
            {loading ? "Posting..." : "Share with Sunburst Farms"}
          </button>
        </main>

      </div>
    </AuthGuard>
  );
}
