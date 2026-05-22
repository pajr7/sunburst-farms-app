"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";
import { getPosts, toggleLike, getEvents } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import PostCard from "@/components/PostCard";
import AuthGuard from "@/components/AuthGuard";

const SECTIONS = [
  {
    label: "Events",
    href: "/events",
    bg: "oklch(0.93 0.03 310)",
    color: "oklch(0.35 0.12 310)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Marketplace",
    href: "/market",
    bg: "var(--gold-light)",
    color: "var(--gold)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: "Vendors",
    href: "/vendors",
    bg: "var(--accent-light)",
    color: "var(--accent)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Real Estate",
    href: "/realestate",
    bg: "oklch(0.93 0.035 155)",
    color: "oklch(0.35 0.09 155)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Info",
    href: "/info",
    bg: "oklch(0.93 0.03 240)",
    color: "oklch(0.38 0.10 240)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
];

const FILTER_CATEGORIES: (Category | "all")[] = ["all", "produce", "eggs", "flowers", "seeds", "tools", "general"];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const firstName = profile?.name?.split(" ")[0] ?? "neighbor";
  const initials = profile?.avatar_initials ?? "?";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>

        {/* Hero header */}
        <header className="px-5 pt-[env(safe-area-inset-top,16px)] pb-5">
          <div className="flex items-center justify-between mb-6 animate-fade-up">
            <div className="flex items-center gap-3.5">
              <Link
                href="/profile"
                className="w-13 h-13 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                style={{ width: 52, height: 52, background: "var(--navy)", color: "var(--white)" }}
              >
                {initials}
              </Link>
              <div>
                <p className="text-[13px] font-medium" style={{ color: "var(--text-muted)" }}>
                  {greeting},
                </p>
                <h1 className="text-[24px] font-extrabold tracking-tight leading-tight" style={{ color: "var(--navy)" }}>
                  {firstName}!
                </h1>
              </div>
            </div>
            <Link
              href="/notifications"
              className="w-11 h-11 rounded-full flex items-center justify-center relative"
              style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </Link>
          </div>

          {/* Section icons row */}
          <div className="flex justify-between px-1 animate-fade-up animate-fade-up-delay-1">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="flex flex-col items-center gap-2 active:scale-[0.93] transition-transform"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 px-4">

          {/* Upcoming Event card */}
          {events.length > 0 && (
            <section className="mb-5 animate-fade-up animate-fade-up-delay-2">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-[15px] font-bold" style={{ color: "var(--navy)" }}>
                  Upcoming Event
                </h2>
                <Link href="/events" className="text-[12px] font-semibold" style={{ color: "var(--accent)" }}>
                  See All
                </Link>
              </div>
              <Link
                href={`/events/${events[0].id}`}
                className="block rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
                style={{ background: "var(--navy)" }}
              >
                <div className="p-4 flex items-center gap-4">
                  {(() => {
                    const date = new Date(events[0].event_date + "T00:00:00");
                    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
                    const day = date.getDate();
                    const weekday = date.toLocaleString("en-US", { weekday: "short" });
                    return (
                      <div
                        className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                      >
                        <span className="text-[10px] font-bold uppercase leading-none" style={{ color: "rgba(255,255,255,0.6)" }}>{month}</span>
                        <span className="text-2xl font-extrabold leading-none mt-0.5" style={{ color: "white" }}>{day}</span>
                        <span className="text-[9px] font-semibold uppercase leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{weekday}</span>
                      </div>
                    );
                  })()}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold mb-1 truncate" style={{ color: "white" }}>
                      {events[0].title}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-[11px] font-medium truncate">{events[0].location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        {events[0].rsvps?.length ?? 0} Going
                      </span>
                      {events[0].time && (
                        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {events[0].time}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            </section>
          )}

          {/* Community Feed */}
          <section className="animate-fade-up animate-fade-up-delay-3">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-[15px] font-bold" style={{ color: "var(--navy)" }}>
                Community Feed
              </h2>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-3">
              {FILTER_CATEGORIES.map((cat) => {
                const active = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className="shrink-0 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all"
                    style={{
                      background: active ? "var(--navy)" : "var(--card)",
                      color: active ? "var(--white)" : "var(--text-secondary)",
                      border: active ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {cat === "all" ? "All" : `${CATEGORY_EMOJI[cat]} ${CATEGORY_LABELS[cat]}`}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-3xl mb-2">
                  {activeFilter !== "all" ? CATEGORY_EMOJI[activeFilter] : "\u{1F331}"}
                </span>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                  Nothing here yet
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Be the first to share something
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post: any, i: number) => (
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
          </section>
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
  return `${days}d ago`;
}
