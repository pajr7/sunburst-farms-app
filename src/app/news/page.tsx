"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  image: string | null;
  source: string;
  publishedAt: string;
}

const NEARBY_TERMS = [
  "north phoenix",
  "scottsdale",
  "paradise valley",
  "85254",
  "85032",
  "kierland",
  "desert ridge",
  "thunderbird",
  "cactus rd",
  "cactus road",
  "shea blvd",
  "bell rd",
  "bell road",
  "greenway",
  "cave creek",
  "paradise ridge",
];

function isNearby(item: NewsItem): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return NEARBY_TERMS.some((t) => text.includes(t));
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<"all" | "nearby">("all");

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (filter === "nearby" ? items.filter(isNearby) : items),
    [items, filter],
  );

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-6" style={{ background: "var(--bg)" }}>
        <header
          className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-3"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center gap-3 pt-2 mb-3">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center rounded-full active:opacity-70"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-[20px] font-extrabold tracking-tight leading-none" style={{ color: "var(--navy)" }}>
                Local News
              </h1>
              <p className="text-[11px] font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                ABC15 &middot; AZFamily &middot; 12News
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {(
              [
                { key: "all", label: "All Phoenix" },
                { key: "nearby", label: "\u{1F4CD} Near Us" },
              ] as const
            ).map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-4 py-1.5 rounded-full text-[12px] transition-all active:scale-95"
                  style={{
                    background: active ? "var(--navy)" : "var(--card)",
                    color: active ? "var(--white)" : "var(--text-secondary)",
                    border: active ? "1px solid var(--navy)" : "1px solid var(--border)",
                    fontWeight: active ? 700 : 600,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-7 h-7 rounded-full animate-spin"
                style={{ border: "2.5px solid var(--border)", borderTopColor: "var(--accent)" }}
              />
            </div>
          ) : error || visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3">{"\u{1F4F0}"}</span>
              <p className="text-[15px] font-bold mb-1" style={{ color: "var(--navy)" }}>
                {filter === "nearby" ? "Nothing near us right now" : "News unavailable"}
              </p>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {filter === "nearby"
                  ? "No stories mentioning our area yet today. Check All Phoenix."
                  : "Couldn't reach the news feeds. Try again in a bit."}
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden divide-y animate-fade-up"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {visible.map((item) => (
                <a
                  key={item.link}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3.5 p-4 active:opacity-60 transition-opacity"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold" style={{ color: "var(--accent)" }}>
                        {item.source}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {timeAgo(item.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold leading-snug mb-1" style={{ color: "var(--text)" }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="text-[12px] leading-relaxed overflow-hidden"
                        style={{
                          color: "var(--text-muted)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-[84px] h-[84px] rounded-xl object-cover shrink-0"
                      loading="lazy"
                    />
                  )}
                </a>
              ))}
            </div>
          )}

          <p className="text-[11px] text-center py-4" style={{ color: "var(--text-muted)" }}>
            Headlines update automatically every 15 minutes. Tapping a story opens the source site.
          </p>
        </main>
      </div>
    </AuthGuard>
  );
}
