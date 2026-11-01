"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMMUNITY_NAME } from "@/lib/data";
import { getPosts, getListings, getEvents, getLatestIrrigation, type IrrigationUpdate } from "@/lib/database";
import { irrigationIsCurrent } from "@/lib/irrigation";
import { isNearbyNews, type NewsItem } from "@/lib/newsSources";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import HomeOverview, { type HomeEvent } from "@/components/HomeOverview";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import { timeAgo } from "@/components/ui/Primitives";
import { useUnreadCounts } from "@/components/AppShell";

export default function Home() {
  const { profile } = useAuth();
  const unread = useUnreadCounts();
  const [posts, setPosts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [irrigation, setIrrigation] = useState<IrrigationUpdate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then((d) => setPosts((d ?? []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
    getListings().then((d) => setListings((d ?? []).slice(0, 8))).catch(() => {});
    getEvents()
      .then((d) =>
        setEvents(
          (d ?? []).slice(0, 3).map((e: any) => ({ id: e.id, title: e.title, date: e.event_date, time: e.event_time, location: e.location, going: e.rsvps?.length ?? 0 })),
        ),
      )
      .catch(() => {});
    getLatestIrrigation()
      .then((u) => setIrrigation(u && irrigationIsCurrent(u) ? u : null))
      .catch(() => {});
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        const items: NewsItem[] = (data.items ?? []).filter((i: NewsItem) => i.group === "news");
        const nearby = items.filter(isNearbyNews);
        const picked = [...nearby, ...items.filter((i) => !nearby.includes(i))].slice(0, 3);
        setNews(picked);
      })
      .catch(() => {});
  }, []);

  const firstName = profile?.name?.split(" ")[0];

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-40 px-4 md:px-6 pt-[calc(env(safe-area-inset-top,0px)_+_18px)] md:pt-6 pb-3" style={{ background: "var(--bg)" }}>
          <div className="flex items-center gap-2 min-h-[44px]">
            <div className="flex-1 min-w-0">
              <h1 className="text-[18px] md:text-[20px] font-bold tracking-tight leading-tight" style={{ color: "var(--text)" }}>
                {COMMUNITY_NAME}
              </h1>
              <p className="text-[13px] leading-none mt-0.5" style={{ color: "var(--text-3)" }}>
                {firstName ? `Good to see you, ${firstName}` : "Phoenix, AZ"}
              </p>
            </div>
            <Link
              href="/notifications"
              className="relative w-10 h-11 flex items-center justify-center rounded-lg md:hidden"
              style={{ color: "var(--text-2)" }}
              aria-label={unread.notifications ? `Notifications, ${unread.notifications} unread` : "Notifications"}
            >
              <Icon name="bell" size={22} />
              {unread.notifications > 0 && (
                <span className="absolute top-2 right-1 w-2.5 h-2.5 rounded-full" style={{ background: "var(--danger)", boxShadow: "0 0 0 2px var(--bg)" }} aria-hidden />
              )}
            </Link>
            <Link href="/profile" className="md:hidden w-10 h-11 flex items-center justify-center rounded-lg" aria-label="Your account">
              <Avatar initials={profile?.avatar_initials ?? "?"} size={34} tone="solid" />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6">
          <HomeOverview
            firstName={firstName}
            loading={loading}
            irrigation={irrigation}
            posts={posts.map((p) => ({
              id: p.id,
              author: { id: p.author?.id, name: p.author?.name ?? "Neighbor", avatar: p.author?.avatar_initials ?? "??", address: p.author?.section ?? "" },
              category: p.category,
              title: p.title,
              body: p.body,
              image: p.image_url,
              timestamp: timeAgo(p.created_at),
              likes: p.likes?.length ?? 0,
              comments: p.comments?.length ?? 0,
              claimed: !!p.claimed_by,
            }))}
            listings={listings}
            events={events}
            news={news}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
