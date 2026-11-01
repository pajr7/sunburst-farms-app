"use client";

import Link from "next/link";
import { type Post, CATEGORY_LABELS, CATEGORY_ICON, postKind } from "@/lib/data";
import type { IrrigationUpdate } from "@/lib/database";
import type { NewsItem } from "@/lib/newsSources";
import { irrigationWindow, IRRIGATION_STATUS_LABEL } from "@/lib/irrigation";
import Icon, { type IconName } from "./ui/Icon";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import DateTile from "./ui/DateTile";
import SourceLogo from "./ui/SourceLogo";
import { Panel, StatusBadge, timeAgo, formatTime12, type Tone } from "./ui/Primitives";
import { priceLabel, listingImages } from "./ListingCard";
import { kindTone } from "./PostCard";

export interface HomeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  going: number;
}

export interface HomeOverviewProps {
  firstName?: string;
  posts: Post[];
  listings: any[];
  events: HomeEvent[];
  news: NewsItem[];
  irrigation?: IrrigationUpdate | null;
  loading?: boolean;
}

const TONE_COLOR: Record<Tone, string> = {
  neutral: "var(--text-3)",
  success: "var(--primary-soft-text)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
};

function Section({ title, href, linkLabel = "See all", children }: { title: string; href: string; linkLabel?: string; children: React.ReactNode }) {
  return (
    <section className="mb-6" aria-label={title}>
      <div className="flex items-end justify-between mb-2.5">
        <h2 className="text-[19px] font-bold leading-tight" style={{ color: "var(--text)" }}>
          {title}
        </h2>
        <Link href={href} className="inline-flex items-center gap-0.5 text-[15px] font-semibold h-9 px-1" style={{ color: "var(--primary)" }}>
          {linkLabel}
          <Icon name="chevron-right" size={16} strokeWidth={2.2} />
        </Link>
      </div>
      {children}
    </section>
  );
}

function QuickLink({ href, icon, label, tone = "neutral" }: { href: string; icon: IconName; label: string; tone?: Tone }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1.5 rounded-xl py-3.5 min-h-[76px]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: tone === "neutral" ? "var(--surface-2)" : `var(--${tone === "success" ? "primary" : tone}-soft)`, color: tone === "neutral" ? "var(--text-2)" : TONE_COLOR[tone] }}>
        <Icon name={icon} size={20} />
      </span>
      <span className="text-[13px] font-semibold text-center leading-tight" style={{ color: "var(--text)" }}>
        {label}
      </span>
    </Link>
  );
}

export default function HomeOverview({ firstName, posts, listings, events, news, irrigation, loading }: HomeOverviewProps) {
  return (
    <div>
      {/* Irrigation, the one thing everyone asks about */}
      {irrigation && (
        <Link href="/irrigation" className="block mb-6">
          <Panel>
            <div className="flex items-center gap-3.5 px-4 py-4">
              <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--info-soft)", color: "var(--info)" }}>
                <Icon name="droplet" size={24} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--info)" }}>Irrigation</span>
                  <StatusBadge tone={irrigation.status === "confirmed" ? "success" : irrigation.status === "delayed" ? "danger" : irrigation.status === "estimated" ? "warning" : "neutral"}>
                    {IRRIGATION_STATUS_LABEL[irrigation.status]}
                  </StatusBadge>
                </span>
                <span className="block text-[18px] font-bold leading-snug mt-0.5" style={{ color: "var(--text)" }}>
                  {irrigation.status === "awaiting" ? "Waiting on the next delivery date" : irrigationWindow(irrigation)}
                </span>
                {irrigation.status === "delayed" && irrigation.note && (
                  <span className="block text-[14px] mt-0.5 line-clamp-1" style={{ color: "var(--text-2)" }}>
                    {irrigation.note}
                  </span>
                )}
                <span className="block text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  {irrigation.author?.name ? `${irrigation.author.name}, ` : ""}updated {timeAgo(irrigation.created_at)}
                </span>
              </span>
              <Icon name="chevron-right" size={20} color="var(--text-3)" />
            </div>
          </Panel>
        </Link>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <QuickLink href="/irrigation" icon="droplet" label="Irrigation" tone="info" />
        <QuickLink href="/events" icon="calendar" label="Events" tone="success" />
        <QuickLink href="/dues" icon="credit-card" label="Dues" />
        <QuickLink href="/info" icon="building" label="Association" />
      </div>

      {/* Latest from neighbors */}
      <Section title="Latest from neighbors" href="/posts" linkLabel="All posts">
        {posts.length === 0 ? (
          <Panel padded>
            <p className="text-[15px]" style={{ color: "var(--text-2)" }}>
              {loading ? "Loading…" : `Nothing posted yet${firstName ? `, ${firstName}` : ""}. Be the first.`}
            </p>
            {!loading && (
              <div className="mt-3">
                <Button href="/post" size="sm" icon="edit">Share with neighbors</Button>
              </div>
            )}
          </Panel>
        ) : (
          <Panel>
            <ul>
              {posts.map((p) => {
                const tone = kindTone(p.category);
                return (
                  <li key={p.id} className="ui-row">
                    <Link href={`/posts/${p.id}`} className="flex gap-3 px-4 py-3.5">
                      <Avatar initials={p.author.avatar} src={p.author.avatarUrl} size={38} />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-1.5 text-[13px]">
                          <span className="font-semibold truncate" style={{ color: "var(--text-2)" }}>{p.author.name}</span>
                          <span style={{ color: "var(--text-3)" }}>{p.timestamp}</span>
                        </span>
                        <span className="block text-[16px] font-semibold leading-snug line-clamp-2 mt-0.5" style={{ color: "var(--text)" }}>
                          {p.title}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-1" style={{ color: TONE_COLOR[tone] }}>
                          <Icon name={CATEGORY_ICON[p.category]} size={13} strokeWidth={2} />
                          {CATEGORY_LABELS[p.category]}
                          {postKind(p.category) === "giveaway" && p.claimed ? " · Claimed" : ""}
                          {p.comments > 0 ? ` · ${p.comments} ${p.comments === 1 ? "reply" : "replies"}` : ""}
                        </span>
                      </span>
                      {p.image && <img src={p.image} alt="" className="w-[72px] h-[72px] rounded-lg object-cover shrink-0" loading="lazy" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
              <Button href="/post" variant="secondary" size="sm" icon="edit" full>Share with neighbors</Button>
            </div>
          </Panel>
        )}
      </Section>

      {/* Marketplace */}
      {listings.length > 0 && (
        <Section title="Marketplace" href="/market">
          <ul className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 pb-1" aria-label="Latest listings">
            {listings.map((l) => {
              const img = listingImages(l)[0];
              return (
                <li key={l.id} className="shrink-0 w-[150px]">
                  <Link href={`/market/${l.id}`} className="block">
                    <span className="block w-[150px] h-[150px] rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-3)" }}>
                      {img ? <img src={img.image_url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Icon name="package" size={30} strokeWidth={1.25} />}
                    </span>
                    <span className="block text-[16px] font-bold mt-2" style={{ color: l.is_free ? "var(--primary)" : "var(--text)" }}>{priceLabel(l)}</span>
                    <span className="block text-[14px] leading-snug line-clamp-2" style={{ color: "var(--text)" }}>{l.title}</span>
                  </Link>
                </li>
              );
            })}
            <li className="shrink-0 w-[150px]">
              <Link href="/market" className="flex flex-col items-center justify-center w-[150px] h-[150px] rounded-xl gap-1.5" style={{ background: "var(--surface)", border: "1px dashed var(--border-strong)", color: "var(--text-2)" }}>
                <Icon name="store" size={24} />
                <span className="text-[14px] font-semibold">See all</span>
              </Link>
            </li>
          </ul>
        </Section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <Section title="Upcoming events" href="/events">
          <Panel>
            <ul>
              {events.map((e) => (
                <li key={e.id} className="ui-row">
                  <Link href={`/events/${e.id}`} className="flex items-center gap-3.5 px-4 py-3.5">
                    <DateTile date={e.date} size={50} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-[16px] font-semibold leading-snug truncate" style={{ color: "var(--text)" }}>{e.title}</span>
                      <span className="block text-[14px] mt-0.5 truncate" style={{ color: "var(--text-2)" }}>
                        {formatTime12(e.time)} &middot; {e.location}
                      </span>
                      <span className="block text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>
                        {e.going > 0 ? `${e.going} going` : "No RSVPs yet"}
                      </span>
                    </span>
                    <Icon name="chevron-right" size={18} color="var(--text-3)" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </Section>
      )}

      {/* Local news */}
      {news.length > 0 && (
        <Section title="Local news" href="/news">
          <Panel>
            <ul>
              {news.map((n) => (
                <li key={n.link} className="ui-row">
                  <a href={n.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 px-4 py-3.5">
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: "var(--text-2)" }}>
                        <SourceLogo src={n.logo} bg={n.logoBg} crop={n.logoCrop} name={n.sourceName} size={20} rounded={5} />
                        {n.sourceName}
                      </span>
                      <span className="block text-[15px] font-semibold leading-snug line-clamp-2 mt-0.5" style={{ color: "var(--text)" }}>{n.title}</span>
                      <span className="block text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>{timeAgo(n.publishedAt)}</span>
                    </span>
                    {n.image && <img src={n.image} alt="" className="w-[72px] h-[72px] rounded-lg object-cover shrink-0" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </Section>
      )}

      {/* Around the neighborhood */}
      <Section title="Explore" href="/community" linkLabel="Community">
        <div className="grid grid-cols-2 gap-2">
          <QuickLink href="/vendors" icon="wrench" label="Local services" />
          <QuickLink href="/realestate" icon="home" label="Real estate" />
          <QuickLink href="/news" icon="newspaper" label="News & sports" />
          <QuickLink href="/messages" icon="message-circle" label="Message a neighbor" />
        </div>
      </Section>
    </div>
  );
}
