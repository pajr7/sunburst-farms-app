"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { type Category, COMMUNITY_NAME } from "@/lib/data";
import { getPosts, toggleLike, getEvents, getLatestIrrigation, type IrrigationUpdate } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import PostCard from "@/components/PostCard";
import AuthGuard from "@/components/AuthGuard";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import FilterChips from "@/components/ui/FilterChips";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, timeAgo, StatusBadge } from "@/components/ui/Primitives";
import { useUnreadCounts } from "@/components/AppShell";
import DateTile from "@/components/ui/DateTile";
import { irrigationIsCurrent, irrigationSummary } from "@/lib/irrigation";

type Filter = "all" | "alerts" | "giveaways" | "help" | "recommendations" | "updates";

const FILTERS: { value: Filter; label: string; categories?: Category[] }[] = [
  { value: "all", label: "All" },
  { value: "alerts", label: "Alerts & lost pets", categories: ["safety", "lost_found"] },
  { value: "giveaways", label: "Free & to borrow", categories: ["produce", "eggs", "flowers", "seeds", "free", "tools"] },
  { value: "help", label: "Help needed", categories: ["help"] },
  { value: "recommendations", label: "Recommendations", categories: ["recommendation"] },
  { value: "updates", label: "Updates", categories: ["general", "events"] },
];

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [irrigation, setIrrigation] = useState<IrrigationUpdate | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const unread = useUnreadCounts();

  useEffect(() => {
    loadPosts();
    getEvents().then((d) => setEvents(d ?? [])).catch(() => setEvents([]));
    getLatestIrrigation().then(setIrrigation).catch(() => setIrrigation(undefined));
  }, []);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data ?? []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }

  async function handleLike(postId: string) {
    if (!user) return;
    // Optimistic update, then reconcile
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes?.some((l: any) => l.user_id === user.id);
        return { ...p, likes: liked ? p.likes.filter((l: any) => l.user_id !== user.id) : [...(p.likes ?? []), { user_id: user.id }] };
      }),
    );
    await toggleLike(postId, user.id);
  }

  const visiblePosts = useMemo(() => {
    const cats = FILTERS.find((f) => f.value === filter)?.categories;
    let list = cats ? posts.filter((p) => cats.includes(p.category)) : posts;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.body, p.author?.name, p.author?.section].filter(Boolean).some((f: string) => f.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [posts, filter, query]);

  const nextEvent = events[0];
  const showIrrigation = irrigation && irrigationIsCurrent(irrigation);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        {/* Compact community header */}
        <header
          className="sticky top-0 z-40 px-4 md:px-6 pt-[calc(env(safe-area-inset-top,0px)_+_18px)] md:pt-6 pb-2"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center gap-2 min-h-[44px]">
            <div className="flex-1 min-w-0">
              <h1 className="text-[18px] md:text-[20px] font-bold tracking-tight leading-tight" style={{ color: "var(--text)" }}>
                {COMMUNITY_NAME}
              </h1>
              <p className="text-[13px] leading-none mt-0.5 md:hidden" style={{ color: "var(--text-3)" }}>
                Phoenix, AZ
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-label="Search posts"
              className="w-10 h-11 flex items-center justify-center rounded-lg"
              style={{ color: searchOpen ? "var(--primary)" : "var(--text-2)" }}
            >
              <Icon name="search" size={22} strokeWidth={searchOpen ? 2.2 : 1.75} />
            </button>
            <Link
              href="/notifications"
              className="relative w-10 h-11 flex items-center justify-center rounded-lg md:hidden"
              style={{ color: "var(--text-2)" }}
              aria-label={unread.notifications ? `Notifications, ${unread.notifications} unread` : "Notifications"}
            >
              <Icon name="bell" size={22} />
              {unread.notifications > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full" style={{ background: "var(--danger)", boxShadow: "0 0 0 2px var(--bg)" }} aria-hidden />
              )}
            </Link>
            <Link href="/profile" className="md:hidden w-10 h-11 flex items-center justify-center rounded-lg" aria-label="Your account">
              <Avatar initials={profile?.avatar_initials ?? "?"} size={34} tone="solid" />
            </Link>
          </div>

          {searchOpen && (
            <div className="relative mt-2">
              <Icon name="search" size={18} color="var(--text-3)" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts and neighbors"
                autoFocus
                aria-label="Search posts and neighbors"
                className="w-full h-11 pl-10 pr-10 rounded-lg text-[16px] outline-none"
                style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-md"
                  aria-label="Clear search"
                  style={{ color: "var(--text-3)" }}
                >
                  <Icon name="x" size={18} />
                </button>
              )}
            </div>
          )}
        </header>

        <main className="flex-1 px-4 md:px-6">
          {/* One timely module: irrigation when there is a current status, otherwise the next event */}
          {!query && showIrrigation && irrigation && (
            <Link href="/irrigation" className="block mb-3">
              <Panel>
                <div className="flex items-center gap-3.5 px-4 py-3.5">
                  <span className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--info-soft)", color: "var(--info)" }}>
                    <Icon name="droplet" size={22} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--info)" }}>
                        Irrigation
                      </span>
                      <StatusBadge tone={irrigation.status === "confirmed" ? "success" : irrigation.status === "delayed" ? "danger" : "warning"}>
                        {irrigation.status === "awaiting" ? "Awaiting info" : irrigation.status === "estimated" ? "Estimate" : irrigation.status === "confirmed" ? "Confirmed" : "Delayed"}
                      </StatusBadge>
                    </span>
                    <span className="block text-[16px] font-semibold leading-snug mt-0.5 truncate" style={{ color: "var(--text)" }}>
                      {irrigationSummary(irrigation)}
                    </span>
                    <span className="block text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>
                      {irrigation.author?.name ? `${irrigation.author.name} · ` : ""}updated {timeAgo(irrigation.created_at)}
                    </span>
                  </span>
                  <Icon name="chevron-right" size={18} color="var(--text-3)" />
                </div>
              </Panel>
            </Link>
          )}
          {!query && !showIrrigation && nextEvent && (
            <Link href={`/events/${nextEvent.id}`} className="block mb-3">
              <Panel>
                <div className="flex items-center gap-3.5 px-4 py-3.5">
                  <DateTile date={nextEvent.event_date} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
                      Next event
                    </span>
                    <span className="block text-[16px] font-semibold leading-snug truncate" style={{ color: "var(--text)" }}>
                      {nextEvent.title}
                    </span>
                    <span className="block text-[14px] mt-0.5 truncate" style={{ color: "var(--text-2)" }}>
                      {nextEvent.location}
                      {nextEvent.rsvps?.length ? ` · ${nextEvent.rsvps.length} going` : ""}
                    </span>
                  </span>
                  <Icon name="chevron-right" size={18} color="var(--text-3)" />
                </div>
              </Panel>
            </Link>
          )}

          {/* Posting action */}
          {!query && (
            <div className="mb-3">
              <Button href="/post" variant="secondary" full icon="edit">
                Share with neighbors
              </Button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-3">
            <FilterChips options={FILTERS.map(({ value, label }) => ({ value, label }))} value={filter} onChange={setFilter} label="Filter posts" />
          </div>

          {/* Feed */}
          {loading ? (
            <Spinner label="Loading posts" />
          ) : visiblePosts.length === 0 ? (
            <EmptyState
              icon={query ? "search" : "message-circle"}
              title={query ? "No matches" : "Nothing here yet"}
              body={query ? `Nothing found for “${query}”.` : filter === "all" ? "Be the first to share something with your neighbors." : "No posts in this group right now."}
              action={!query && filter === "all" ? <Button href="/post" icon="edit">Share with neighbors</Button> : undefined}
            />
          ) : (
            <Panel>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {visiblePosts.map((post: any, i: number) => (
                  <div key={post.id} style={{ borderColor: "var(--border)" }}>
                    <PostCard
                      post={{
                        id: post.id,
                        author: {
                          id: post.author?.id,
                          name: post.author?.name ?? "Neighbor",
                          avatar: post.author?.avatar_initials ?? "??",
                          address: post.author?.section ?? "",
                        },
                        category: post.category,
                        title: post.title,
                        body: post.body,
                        image: post.image_url,
                        timestamp: timeAgo(post.created_at),
                        likes: post.likes?.length ?? 0,
                        comments: post.comments?.length ?? 0,
                        claimed: !!post.claimed_by,
                      }}
                      index={i}
                      onLike={() => handleLike(post.id)}
                      isLiked={post.likes?.some((l: any) => l.user_id === user?.id) ?? false}
                      isOwn={post.author_id === user?.id}
                    />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

