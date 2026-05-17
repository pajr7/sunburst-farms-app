"use client";

import { useState } from "react";
import { Category, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";
import BottomNav from "@/components/BottomNav";

const POST_CATEGORIES: Category[] = ["produce", "eggs", "flowers", "seeds", "tools", "events", "general"];

export default function CreatePostPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen pb-24 items-center justify-center px-6" style={{ background: "var(--warm-sand)" }}>
        <div className="text-center animate-fade-up">
          <span className="text-5xl block mb-4">{"\u{1F33B}"}</span>
          <h1 className="font-display text-2xl mb-2" style={{ color: "var(--charcoal)" }}>
            Shared with your neighbors!
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--stone)" }}>
            Your post is now visible to all 281 homes in Sunburst Farms.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCategory(null);
              setTitle("");
              setBody("");
            }}
            className="px-6 py-3 rounded-full font-semibold text-sm"
            style={{ background: "var(--sunburst)", color: "var(--charcoal)" }}
          >
            Share something else
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "var(--warm-sand)" }}>
      <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
        <h1 className="font-display text-2xl" style={{ color: "var(--charcoal)" }}>
          Share with neighbors
        </h1>
        <p className="text-xs font-medium" style={{ color: "var(--stone)" }}>
          What do you have to offer today?
        </p>
      </header>

      <main className="flex-1 px-4">
        {/* Category selection */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {POST_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: category === cat ? "var(--charcoal)" : "var(--cream-wash)",
                  color: category === cat ? "var(--cream-wash)" : "var(--charcoal)",
                }}
              >
                {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
            Title
          </label>
          <input
            type="text"
            placeholder="e.g., Fresh eggs on the porch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "var(--cream-wash)",
              color: "var(--charcoal)",
              border: "1px solid transparent",
            }}
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
            Details
          </label>
          <textarea
            placeholder="Tell your neighbors what you're sharing, where to find it, and any other details..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{
              background: "var(--cream-wash)",
              color: "var(--charcoal)",
              border: "1px solid transparent",
            }}
          />
        </div>

        {/* Photo upload area */}
        <div className="mb-6">
          <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
            Photo (optional)
          </label>
          <div
            className="w-full py-8 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer"
            style={{ background: "var(--cream-wash)", border: "2px dashed var(--stone)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs font-medium" style={{ color: "var(--stone)" }}>
              Tap to add a photo
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => {
            if (category && title) setSubmitted(true);
          }}
          className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-opacity"
          style={{
            background: category && title ? "var(--sunburst)" : "var(--stone)",
            color: "var(--charcoal)",
            opacity: category && title ? 1 : 0.5,
          }}
        >
          Share with Sunburst Farms
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
