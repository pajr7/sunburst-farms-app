"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Category, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";
import { getPosts, toggleLike, getEvents } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import PostCard from "@/components/PostCard";
import AuthGuard from "@/components/AuthGuard";

const SHORTCUTS = [
  { label: "Events", href: "/events", emoji: "\u{1F389}" },
  { label: "Vendors", href: "/vendors", emoji: "\u{2B50}" },
  { label: "Real Estate", href: "/realestate", emoji: "\u{1F3E0}" },
  { label: "Dues", href: "/dues", emoji: "\u{1F4B3}" },
  { label: "Info", href: "/info", emoji: "\u{2139}\u{FE0F}" },
];

const FILTER_CATEGORIES: (Category | "all")[] = [
  "all",
  "safety",
  "lost_found",
  "free",
  "recommendation",
  "help",
  "produce",
  "eggs",
  "flowers",
  "seeds",
  "tools",
  "general",
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    loadPosts();
  }, [activeFilter]);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await getPosts(activeFilter === "all" ? undefined : activeFilter);
      setPosts(data ?? []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data ?? []);
    } catch {
      setEvents([]);
    }
  }

  async function handleLike(postId: string) {
    if (!user) return;
    await toggleLike(postId, user.id);
    loadPosts();
  }

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p: any) =>
      [p.title, p.body, p.author?.name, p.author?.section]
        .filter(Boolean)
        .some((field: string) => field.toLowerCase().includes(q)),
    );
  }, [posts, query]);

  const firstName = profile?.name?.split(" ")[0] ?? "neighbor";
  const initials = profile?.avatar_initials ?? "?";
  const nextEvent = events[0];

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-6" style={{ background: "var(--bg)" }}>
        {/* Sticky header */}
        <header
          className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-2.5"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center justify-between pt-2 mb-3">
            <div className="md:hidden">
              <h1 className="text-[19px] font-extrabold tracking-tight leading-none" style={{ color: "var(--navy)" }}>
                Sunburst Farms
              </h1>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                East &middot; Phoenix, AZ
              </p>
            </div>
            <h1 className="hidden md:block text-[20px] font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
              Neighborhood Feed
            </h1>

            <div className="flex items-center gap-2">
              <Link
                href="/notifications"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                aria-label="Notifications"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </Link>
              <Link
                href="/profile"
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold"
                style={{ background: "var(--navy)", color: "var(--white)" }}
              >
                {initials}
              </Link>
            </div>
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2.5 px-4 rounded-full"
            style={{ background: "var(--card)", border: "1px solid var(--border)", height: 42 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts and neighbors"
              className="flex-1 bg-transparent outline-none text-[14px] min-w-0"
              style={{ color: "var(--text)" }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="shrink-0 active:opacity-60" aria-label="Clear search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 px-4">
          {/* Compose box */}
          <Link
            href="/new"
            className="flex items-center gap-3 p-3 mb-3 rounded-2xl active:scale-[0.99] transition-transform animate-fade-up"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
              style={{ background: "var(--accent-light)", color: "var(--navy)" }}
            >
              {initials}
            </div>
            <span className="flex-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
              What&rsquo;s happening, {firstName}?
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </Link>

          {/* Shortcuts */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-3 animate-fade-up animate-fade-up-delay-1">
            {SHORTCUTS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full shrink-0 active:scale-95 transition-transform"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <span className="text-[14px] leading-none">{s.emoji}</span>
                <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {s.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Next event */}
          {nextEvent && !query && (
            <Link
              href={`/events/${nextEvent.id}`}
              className="flex items-center gap-3.5 p-3.5 mb-3 rounded-2xl active:scale-[0.99] transition-transform animate-fade-up animate-fade-up-delay-2"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {(() => {
                const date = new Date(nextEvent.event_date + "T00:00:00");
                const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
                const day = date.getDate();
                return (
                  <div
                    className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                    style={{ background: "var(--cat-events-bg)" }}
                  >
                    <span className="text-[9px] font-bold uppercase leading-none" style={{ color: "var(--cat-events-text)" }}>
                      {month}
                    </span>
                    <span className="text-[17px] font-extrabold leading-none mt-0.5" style={{ color: "var(--cat-events-text)" }}>
                      {day}
                    </span>
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--accent)" }}>
                  Next event
                </p>
                <p className="text-[14px] font-bold truncate leading-tight" style={{ color: "var(--text)" }}>
                  {nextEvent.title}
                </p>
                <p className="text-[12px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {nextEvent.location}
                  {nextEvent.rsvps?.length ? ` · ${nextEvent.rsvps.length} going` : ""}
                </p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-3 animate-fade-up animate-fade-up-delay-2">
            {FILTER_CATEGORIES.map((cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition-all active:scale-95"
                  style={{
                    background: active ? "var(--navy)" : "var(--card)",
                    color: active ? "var(--white)" : "var(--text-secondary)",
                    border: active ? "1px solid var(--navy)" : "1px solid var(--border)",
                    fontWeight: active ? 700 : 600,
                  }}
                >
                  {cat === "all" ? "All" : `${CATEGORY_EMOJI[cat]} ${CATEGORY_LABELS[cat]}`}
                </button>
              );
            })}
          </div>

          {/* Feed */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-7 h-7 rounded-full animate-spin"
                style={{
                  border: "2.5px solid var(--border)",
                  borderTopColor: "var(--accent)",
                }}
              />
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3">
                {query ? "\u{1F50D}" : activeFilter !== "all" ? CATEGORY_EMOJI[activeFilter] : "\u{1F331}"}
              </span>
              <p className="text-[15px] font-bold mb-1" style={{ color: "var(--navy)" }}>
                {query ? "No matches" : "Nothing here yet"}
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {query ? `Nothing found for "${query}"` : "Be the first to share something"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {visiblePosts.map((post: any, i: number) => (
                <PostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    author: {
                      name: post.author?.name ?? "Neighbor",
                      avatar: post.author?.avatar_initials ?? "??",
                      address: post.author?.section ?? "",
                    },
                    category: post.category,
                    title: post.title,
                    body: post.body,
                    image: post.image_url,
                    timestamp: formatTime(post.created_at),
                    likes: post.likes?.length ?? 0,
                    comments: post.comments?.length ?? 0,
                    claimed: !!post.claimed_by,
                  }}
                  index={i}
                  onLike={() => handleLike(post.id)}
                  isLiked={post.likes?.some((l: any) => l.user_id === user?.id) ?? false}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
