"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import type { NewsItem, SourceSummary, SourceKind } from "@/lib/newsSources";

type View = "all" | "nearby" | "alerts";

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
  "deer valley",
  "sunburst",
  "tatum",
  "56th st",
  "scottsdale rd",
  "paradise valley mall",
  "pv mall",
  "horizon high",
  "sunnyslope",
  "moon valley",
];

const KIND_LABEL: Record<SourceKind, string> = {
  alert: "Alerts",
  tv: "TV",
  paper: "Papers & Online",
  radio: "Radio",
  gov: "Government",
};
const KIND_ORDER: SourceKind[] = ["tv", "paper", "radio", "gov", "alert"];

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

function untilTime(iso: string): string {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return sameDay ? `until ${time}` : `until ${d.toLocaleDateString("en-US", { weekday: "short" })} ${time}`;
}

function severityColor(sev?: string): string {
  if (sev === "Extreme" || sev === "Severe") return "var(--danger)";
  return "var(--warning)";
}

function Pill({
  active,
  onClick,
  children,
  tone = "navy",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "navy" | "danger";
}) {
  const activeBg = tone === "danger" ? "var(--danger)" : "var(--navy)";
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3.5 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-all active:scale-95"
      style={{
        background: active ? activeBg : "var(--card)",
        color: active ? "var(--white)" : "var(--text-secondary)",
        border: active ? `1px solid ${activeBg}` : "1px solid var(--border)",
        fontWeight: active ? 700 : 600,
      }}
    >
      {children}
    </button>
  );
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<SourceSummary[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<View>("all");
  const [sourceId, setSourceId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? []);
        setSources(data.sources ?? []);
        setUpdatedAt(data.updatedAt ?? null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const alerts = useMemo(() => items.filter((i) => i.kind === "alert"), [items]);

  const visible = useMemo(() => {
    let list = items;
    if (view === "nearby") list = list.filter(isNearby);
    else if (view === "alerts") list = list.filter((i) => i.kind === "alert");
    else list = list.filter((i) => i.kind !== "alert"); // alerts live in the banner
    if (sourceId) list = list.filter((i) => i.source === sourceId);
    return list;
  }, [items, view, sourceId]);

  const liveSources = useMemo(
    () =>
      KIND_ORDER.flatMap((kind) =>
        sources.filter((s) => s.kind === kind && s.count > 0 && s.kind !== "alert"),
      ),
    [sources],
  );
  const liveCount = liveSources.length + (alerts.length > 0 ? 1 : 0);

  const selectSource = (id: string) => {
    setSourceId((cur) => (cur === id ? null : id));
    if (view === "alerts") setView("all");
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-6" style={{ background: "var(--bg)" }}>
        <header
          className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-2"
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
                Arizona News
              </h1>
              <p className="text-[11px] font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                {loading
                  ? "Loading sources…"
                  : `${liveCount} live sources${updatedAt ? ` · updated ${timeAgo(updatedAt)}` : ""}`}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <Pill active={view === "all"} onClick={() => setView("all")}>
              All Arizona
            </Pill>
            <Pill active={view === "nearby"} onClick={() => setView("nearby")}>
              {"\u{1F4CD}"} Near Us
            </Pill>
            {alerts.length > 0 && (
              <Pill active={view === "alerts"} onClick={() => { setView("alerts"); setSourceId(null); }} tone="danger">
                {"\u{1F6A8}"} Alerts ({alerts.length})
              </Pill>
            )}
          </div>

          {!loading && liveSources.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
              <button
                onClick={() => setSourceId(null)}
                className="shrink-0 px-3 py-1 rounded-lg text-[11.5px] font-bold whitespace-nowrap transition-all active:scale-95"
                style={{
                  background: sourceId === null ? "var(--accent-light)" : "transparent",
                  color: sourceId === null ? "var(--accent)" : "var(--text-muted)",
                  border: `1px solid ${sourceId === null ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                Every source
              </button>
              {liveSources.map((s) => {
                const active = sourceId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSource(s.id)}
                    className="shrink-0 px-3 py-1 rounded-lg text-[11.5px] whitespace-nowrap transition-all active:scale-95"
                    style={{
                      background: active ? "var(--accent-light)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                      fontWeight: active ? 700 : 600,
                    }}
                    title={s.name}
                  >
                    {s.short}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div
                className="w-7 h-7 rounded-full animate-spin"
                style={{ border: "2.5px solid var(--border)", borderTopColor: "var(--accent)" }}
              />
            </div>
          ) : (
            <>
              {/* Active weather alerts banner */}
              {view === "all" && !sourceId && alerts.length > 0 && (
                <div className="flex flex-col gap-2 mb-3 animate-fade-up">
                  {alerts.slice(0, 2).map((a) => {
                    const color = severityColor(a.severity);
                    return (
                      <a
                        key={a.title + a.expiresAt}
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 p-3.5 rounded-2xl active:opacity-70"
                        style={{ background: "var(--card)", border: `1.5px solid ${color}` }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[17px]"
                          style={{ background: color, color: "var(--white)" }}
                        >
                          {"⚠"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[14px] font-extrabold" style={{ color }}>
                              {a.title}
                            </span>
                            {a.expiresAt && (
                              <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                                {untilTime(a.expiresAt)}
                              </span>
                            )}
                          </div>
                          {a.description && (
                            <p
                              className="text-[12px] leading-relaxed mt-0.5 overflow-hidden"
                              style={{
                                color: "var(--text-secondary)",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {a.description}
                            </p>
                          )}
                          <span className="text-[10.5px] font-semibold" style={{ color: "var(--text-muted)" }}>
                            National Weather Service &middot; Maricopa County
                          </span>
                        </div>
                      </a>
                    );
                  })}
                  {alerts.length > 2 && (
                    <button
                      onClick={() => setView("alerts")}
                      className="text-[12px] font-bold text-center py-1"
                      style={{ color: "var(--danger)" }}
                    >
                      See all {alerts.length} active alerts
                    </button>
                  )}
                </div>
              )}

              {error || visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl mb-3">{view === "alerts" ? "☀️" : "\u{1F4F0}"}</span>
                  <p className="text-[15px] font-bold mb-1" style={{ color: "var(--navy)" }}>
                    {error
                      ? "News unavailable"
                      : view === "alerts"
                        ? "No active alerts"
                        : view === "nearby"
                          ? "Nothing near us right now"
                          : "No stories yet"}
                  </p>
                  <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {error
                      ? "Couldn't reach the news feeds. Try again in a bit."
                      : view === "alerts"
                        ? "All clear from the National Weather Service for Maricopa County."
                        : view === "nearby"
                          ? "No stories mentioning our area yet today. Check All Arizona."
                          : "This source hasn't published anything recently."}
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-2xl overflow-hidden divide-y animate-fade-up"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  {visible.map((item) => {
                    const isAlert = item.kind === "alert";
                    const srcShort = sources.find((s) => s.id === item.source)?.short ?? item.sourceName;
                    return (
                      <a
                        key={item.link + item.title}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3.5 p-4 active:opacity-60 transition-opacity"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: isAlert ? severityColor(item.severity) : "var(--accent)" }}
                            >
                              {isAlert ? "⚠ NWS Alert" : srcShort}
                            </span>
                            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                              {isAlert && item.expiresAt ? untilTime(item.expiresAt) : timeAgo(item.publishedAt)}
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
                    );
                  })}
                </div>
              )}
            </>
          )}

          {!loading && (
            <p className="text-[11px] text-center py-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {KIND_ORDER.filter((k) => k !== "alert")
                .map((k) => {
                  const names = liveSources.filter((s) => s.kind === k).map((s) => s.short);
                  return names.length ? `${KIND_LABEL[k]}: ${names.join(", ")}` : null;
                })
                .filter(Boolean)
                .join(" · ")}
              <br />
              Headlines refresh every 15 minutes. Tapping a story opens the source site.
            </p>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
