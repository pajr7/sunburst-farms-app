"use client";

import { useState } from "react";
import { MOCK_POSTS, Category, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";
import PostCard from "@/components/PostCard";
import BottomNav from "@/components/BottomNav";

const ALL_CATEGORIES: (Category | "all")[] = ["all", "produce", "eggs", "flowers", "seeds", "tools", "events", "general"];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");

  const filteredPosts = activeFilter === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter((p) => p.category === activeFilter);

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "var(--warm-sand)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-3" style={{ background: "var(--warm-sand)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-display text-2xl" style={{ color: "var(--charcoal)" }}>
              Sunburst Farms
            </h1>
            <p className="text-xs font-medium" style={{ color: "var(--stone)" }}>
              Good afternoon, neighbor
            </p>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--cream-wash)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
          {ALL_CATEGORIES.map((cat) => {
            const active = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                style={{
                  background: active ? "var(--charcoal)" : "var(--cream-wash)",
                  color: active ? "var(--cream-wash)" : "var(--stone)",
                }}
              >
                {cat === "all" ? "All" : `${CATEGORY_EMOJI[cat]} ${CATEGORY_LABELS[cat]}`}
              </button>
            );
          })}
        </div>
      </header>

      {/* Feed */}
      <main className="flex-1 px-4">
        <div className="flex flex-col gap-3">
          {filteredPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">
              {activeFilter !== "all" ? CATEGORY_EMOJI[activeFilter] : "\u{1F331}"}
            </span>
            <p className="font-display text-xl mb-1" style={{ color: "var(--charcoal)" }}>
              Nothing here yet
            </p>
            <p className="text-sm" style={{ color: "var(--stone)" }}>
              Be the first to share something!
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
