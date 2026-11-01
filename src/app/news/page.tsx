"use client";

import { useState, useEffect, useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Icon from "@/components/ui/Icon";
import SourceLogo from "@/components/ui/SourceLogo";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, Notice, timeAgo } from "@/components/ui/Primitives";
import type { NewsItem, SourceSummary, SourceKind, Group } from "@/lib/newsSources";

type View = "all" | "nearby" | "sports" | "alerts";

const NEARBY_TERMS = [
  "north phoenix", "scottsdale", "paradise valley", "85254", "85032", "kierland", "desert ridge", "thunderbird",
  "cactus rd", "cactus road", "shea blvd", "bell rd", "bell road", "greenway", "cave creek", "paradise ridge",
  "deer valley", "sunburst", "tatum", "56th st", "scottsdale rd", "paradise valley mall", "pv mall", "horizon high",
  "sunnyslope", "moon valley",
];

const KIND_LABEL: Record<SourceKind, string> = {
  alert: "Alerts",
  tv: "TV",
  paper: "Papers & online",
  radio: "Radio",
  gov: "Government",
  "sports-net": "Sports networks",
  "sports-team": "Teams",
};
const NEWS_KINDS: SourceKind[] = ["tv", "paper", "radio", "gov"];
const SPORTS_KINDS: SourceKind[] = ["sports-net", "sports-team"];
const VIEW_GROUP: Record<View, Group | null> = { all: "news", nearby: null, sports: "sports", alerts: "alert" };

function isNearby(item: NewsItem): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return NEARBY_TERMS.some((t) => text.includes(t));
}

function untilTime(iso: string): string {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return sameDay ? `until ${time}` : `until ${d.toLocaleDateString("en-US", { weekday: "short" })} ${time}`;
}

function severityTone(sev?: string): "danger" | "warning" {
  return sev === "Extreme" || sev === "Severe" ? "danger" : "warning";
}

function ViewTab({ active, onClick, children, tone = "default" }: { active: boolean; onClick: () => void; children: React.ReactNode; tone?: "default" | "danger" }) {
  const bg = tone === "danger" ? "var(--danger)" : "var(--primary)";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="shrink-0 px-3.5 h-9 rounded-lg text-[14px] font-semibold whitespace-nowrap transition-colors"
      style={{
        background: active ? bg : "var(--surface)",
        color: active ? "var(--text-on-primary)" : tone === "danger" ? "var(--danger)" : "var(--text-2)",
        border: `1px solid ${active ? bg : "var(--border-strong)"}`,
      }}
    >
      {children}
    </button>
  );
}

/** Logo-first source picker: the outlet's icon with a small label underneath. */
function SourceChip({ active, onClick, label, logo, logoBg, logoCrop, name }: { active: boolean; onClick: () => void; label: string; logo?: string; logoBg?: string; logoCrop?: number; name: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      aria-pressed={active}
      aria-label={name}
      className="shrink-0 flex flex-col items-center gap-1 w-[64px] py-1 rounded-lg transition-colors"
      style={{ background: active ? "var(--primary-soft)" : "transparent" }}
    >
      <span
        className="rounded-xl p-[3px]"
        style={{ boxShadow: active ? "0 0 0 2px var(--primary)" : "0 0 0 1px var(--border)", background: "var(--surface)" }}
      >
        <SourceLogo src={logo} bg={logoBg} crop={logoCrop} name={name} size={40} rounded={9} />
      </span>
      <span className="text-[11px] font-semibold leading-tight text-center truncate w-full px-0.5" style={{ color: active ? "var(--primary-soft-text)" : "var(--text-2)" }}>
        {label}
      </span>
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

  const alerts = useMemo(() => items.filter((i) => i.group === "alert"), [items]);

  const visible = useMemo(() => {
    let list = items;
    if (view === "nearby") list = list.filter((i) => i.group !== "alert" && isNearby(i));
    else list = list.filter((i) => i.group === VIEW_GROUP[view]);
    if (sourceId) list = list.filter((i) => i.sources.includes(sourceId));
    return list;
  }, [items, view, sourceId]);

  const byKind = (kinds: SourceKind[]) => kinds.flatMap((kind) => sources.filter((s) => s.kind === kind && s.count > 0));
  const newsSources = useMemo(() => byKind(NEWS_KINDS), [sources]); // eslint-disable-line react-hooks/exhaustive-deps
  const sportsSources = useMemo(() => byKind(SPORTS_KINDS), [sources]); // eslint-disable-line react-hooks/exhaustive-deps
  const chipSources = view === "sports" ? sportsSources : view === "alerts" ? [] : newsSources;
  const liveCount = sources.filter((s) => s.count > 0).length;

  const switchView = (next: View) => {
    setView(next);
    const keep = next === "sports" ? sportsSources.some((s) => s.id === sourceId) : next === "alerts" ? false : newsSources.some((s) => s.id === sourceId);
    if (!keep) setSourceId(null);
  };

  const emptyTitle = error ? "News unavailable" : view === "alerts" ? "No active alerts" : view === "nearby" ? "Nothing near us right now" : "No stories yet";
  const emptyBody = error
    ? "Couldn't reach the news feeds. Try again in a bit."
    : view === "alerts"
      ? "All clear from the National Weather Service for Maricopa County."
      : view === "nearby"
        ? "No stories mentioning our area yet today. Check the News tab."
        : "This source hasn't published anything recently.";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader
          title="Local news & sports"
          subtitle={loading ? "Loading sources…" : `${liveCount} Arizona sources${updatedAt ? `, updated ${timeAgo(updatedAt)}` : ""}`}
          back="/community"
        >
          <div role="group" aria-label="View" className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 py-0.5">
            <ViewTab active={view === "all"} onClick={() => switchView("all")}>News</ViewTab>
            <ViewTab active={view === "nearby"} onClick={() => switchView("nearby")}>Near us</ViewTab>
            <ViewTab active={view === "sports"} onClick={() => switchView("sports")}>Sports</ViewTab>
            {alerts.length > 0 && (
              <ViewTab active={view === "alerts"} onClick={() => switchView("alerts")} tone="danger">
                Alerts ({alerts.length})
              </ViewTab>
            )}
          </div>
          {!loading && chipSources.length > 0 && (
            <div role="group" aria-label="Source" className="flex gap-1 overflow-x-auto hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 mt-2 items-start">
              <button
                type="button"
                onClick={() => setSourceId(null)}
                aria-pressed={sourceId === null}
                className="shrink-0 flex flex-col items-center gap-1 w-[64px] py-1 rounded-lg transition-colors"
                style={{ background: sourceId === null ? "var(--primary-soft)" : "transparent" }}
              >
                <span className="w-[46px] h-[46px] rounded-xl flex items-center justify-center" style={{ background: sourceId === null ? "var(--primary)" : "var(--surface-2)", color: sourceId === null ? "var(--text-on-primary)" : "var(--text-2)", boxShadow: sourceId === null ? "0 0 0 2px var(--primary)" : "0 0 0 1px var(--border)" }}>
                  <Icon name={view === "sports" ? "star" : "newspaper"} size={22} />
                </span>
                <span className="text-[11px] font-semibold leading-tight" style={{ color: sourceId === null ? "var(--primary-soft-text)" : "var(--text-2)" }}>
                  All
                </span>
              </button>
              {chipSources.map((s, i) => {
                const prev = chipSources[i - 1];
                const newKind = view === "sports" && prev && prev.kind !== s.kind;
                return (
                  <span key={s.id} className="flex items-start shrink-0">
                    {newKind && <span className="w-px h-10 mx-1 mt-1.5" style={{ background: "var(--border-strong)" }} aria-hidden />}
                    <SourceChip active={sourceId === s.id} onClick={() => setSourceId((cur) => (cur === s.id ? null : s.id))} label={s.short} logo={s.logo} logoBg={s.logoBg} logoCrop={s.logoCrop} name={s.name} />
                  </span>
                );
              })}
            </div>
          )}
        </PageHeader>

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading news" />
          ) : (
            <>
              {view === "all" && !sourceId && alerts.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {alerts.slice(0, 2).map((a) => (
                    <Notice key={a.title + a.expiresAt} tone={severityTone(a.severity)} icon="alert-triangle" title={`${a.title}${a.expiresAt ? ` · ${untilTime(a.expiresAt)}` : ""}`}>
                      {a.description && <span className="block line-clamp-2">{a.description}</span>}
                      <span className="block text-[13px] mt-1" style={{ color: "var(--text-3)" }}>National Weather Service, Maricopa County</span>
                    </Notice>
                  ))}
                  {alerts.length > 2 && (
                    <button type="button" onClick={() => switchView("alerts")} className="text-[14px] font-semibold text-center py-1" style={{ color: "var(--danger)" }}>
                      See all {alerts.length} active alerts
                    </button>
                  )}
                </div>
              )}

              {error || visible.length === 0 ? (
                <EmptyState icon={view === "alerts" ? "sun" : "newspaper"} title={emptyTitle} body={emptyBody} />
              ) : (
                <Panel>
                  <ul>
                    {visible.map((item) => {
                      const isAlert = item.group === "alert";
                      const bylineId = sourceId && item.sources.includes(sourceId) ? sourceId : item.source;
                      const bylineSource = sources.find((s) => s.id === bylineId);
                      const byline = bylineSource?.short ?? item.sourceName;
                      return (
                        <li key={item.link + item.title} className="ui-row">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex gap-3.5 px-4 py-3.5 active:bg-[var(--surface-2)]">
                            <span className="flex-1 min-w-0">
                              <span className="flex items-center gap-2 mb-1.5 text-[13px]">
                                {!isAlert && <SourceLogo src={bylineSource?.logo ?? item.logo} bg={bylineSource?.logoBg ?? item.logoBg} crop={bylineSource?.logoCrop ?? item.logoCrop} name={byline} size={22} rounded={6} />}
                                <span className="font-bold" style={{ color: isAlert ? (severityTone(item.severity) === "danger" ? "var(--danger)" : "var(--warning)") : "var(--text-2)" }}>
                                  {isAlert ? "NWS alert" : byline}
                                </span>
                                <span style={{ color: "var(--text-3)" }}>{isAlert && item.expiresAt ? untilTime(item.expiresAt) : timeAgo(item.publishedAt)}</span>
                              </span>
                              <span className="block text-[16px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
                                {item.title}
                              </span>
                              {item.description && (
                                <span className="block text-[14px] leading-relaxed mt-1 line-clamp-2" style={{ color: "var(--text-2)" }}>
                                  {item.description}
                                </span>
                              )}
                            </span>
                            {item.image && (
                              <img src={item.image} alt="" className="w-[84px] h-[84px] rounded-lg object-cover shrink-0" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              )}
            </>
          )}

          {!loading && (
            <p className="text-[13px] text-center py-5 leading-relaxed" style={{ color: "var(--text-3)" }}>
              {[...NEWS_KINDS, ...SPORTS_KINDS]
                .map((k) => {
                  const names = sources.filter((s) => s.kind === k && s.count > 0).map((s) => s.short);
                  return names.length ? `${KIND_LABEL[k]}: ${names.join(", ")}` : null;
                })
                .filter(Boolean)
                .join(" · ")}
              <br />
              Headlines refresh every 15 minutes. Tapping a story opens the source site.
              <Icon name="external-link" size={12} className="inline ml-1 align-middle" />
            </p>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
