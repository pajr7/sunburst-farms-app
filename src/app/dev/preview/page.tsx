"use client";

// Development-only design preview. Renders components with clearly fake sample
// content so the design can be inspected without real resident data. Returns
// 404 in production and never writes anything.

import { notFound } from "next/navigation";
import { useState } from "react";
import { MOCK_POSTS, MOCK_EVENTS, MOCK_LISTINGS } from "@/lib/data";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import ListingCard from "@/components/ListingCard";
import HomeOverview from "@/components/HomeOverview";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import FilterChips from "@/components/ui/FilterChips";
import { Panel, Notice, SectionTitle, StatusBadge, ListRow } from "@/components/ui/Primitives";

export default function DevPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState<string[]>([]);

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
      <PageHeader title="Design preview" subtitle="Sample content, development only" actions={<Button size="sm" icon="plus">Primary</Button>}>
        <FilterChips
          label="Sample filters"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "alerts", label: "Alerts & lost pets" },
            { value: "giveaways", label: "Free & to borrow" },
            { value: "help", label: "Help needed" },
          ]}
        />
      </PageHeader>
      <main className="flex-1 px-4 md:px-6">
        <Notice tone="warning" icon="alert-triangle" title="Sample data">
          Everything on this page is made up for design review. It is not stored and not visible in production.
        </Notice>

        <SectionTitle>Home overview</SectionTitle>
        <HomeOverview
          firstName="Pat"
          posts={MOCK_POSTS.slice(0, 3).map((p) => ({ ...p, author: { ...p.author, id: "sample" } }))}
          listings={MOCK_LISTINGS}
          events={MOCK_EVENTS.map((e) => ({ id: e.id, title: e.title, date: e.date, time: e.time, location: e.location, going: e.attendees }))}
          news={[
            { title: "Scottsdale storms knock down power poles, leaving thousands without power", link: "#1", description: "", image: null, source: "fox10", sourceName: "FOX 10 Phoenix", sources: ["fox10"], kind: "tv", group: "news", publishedAt: new Date(Date.now() - 3600000).toISOString() },
            { title: "Paradise Valley approves new bridle path lighting near 56th Street", link: "#2", description: "", image: null, source: "azcentral", sourceName: "Arizona Republic", sources: ["azcentral"], kind: "paper", group: "news", publishedAt: new Date(Date.now() - 7200000).toISOString(), logo: "https://www.google.com/s2/favicons?domain=azcentral.com&sz=128" },
            { title: "Flood watch continues for the Valley through Monday morning", link: "#3", description: "", image: null, source: "12news", sourceName: "12News", sources: ["12news"], kind: "tv", group: "news", publishedAt: new Date(Date.now() - 9000000).toISOString(), logo: "https://www.12news.com/assets/shared-images/logos/KPNX.png", logoBg: "oklch(0.38 0.16 262)", logoCrop: 0.375 },
          ]}
          irrigation={{ id: "x", status: "estimated", window_start: "2026-11-06", window_end: "2026-11-08", note: null, created_at: new Date(Date.now() - 5400000).toISOString(), author: { name: "Dave Reiter" } }}
        />

        <SectionTitle>Feed</SectionTitle>
        <Panel>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {MOCK_POSTS.map((p, i) => (
              <div key={p.id} style={{ borderColor: "var(--border)" }}>
                <PostCard post={{ ...p, author: { ...p.author, id: "sample" } }} index={i} isLiked={liked.includes(p.id)} onLike={() => setLiked((l) => (l.includes(p.id) ? l.filter((x) => x !== p.id) : [...l, p.id]))} />
              </div>
            ))}
          </div>
        </Panel>

        <SectionTitle>Marketplace</SectionTitle>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
          {MOCK_LISTINGS.map((l, i) => (
            <ListingCard key={l.id} listing={l} index={i} isMine={i === 0} />
          ))}
        </ul>

        <SectionTitle>Events</SectionTitle>
        <ul className="flex flex-col gap-4">
          {MOCK_EVENTS.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} isRsvped={i === 0} />
          ))}
        </ul>

        <SectionTitle>Status and lists</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-3">
          <StatusBadge tone="success">Available</StatusBadge>
          <StatusBadge tone="neutral" icon="check">Claimed</StatusBadge>
          <StatusBadge tone="warning">Pending</StatusBadge>
          <StatusBadge tone="danger">Delayed</StatusBadge>
          <StatusBadge tone="info">Official</StatusBadge>
        </div>
        <Panel>
          <ListRow href="/events" icon="calendar" iconTone="success" title="Events" description="Next: Community Potluck, Sat, Nov 15 · 5:00 PM" />
          <ListRow href="/irrigation" icon="droplet" iconTone="info" title="Irrigation" description="Estimated Thu, Nov 6 to Sat, Nov 8 · updated 2 hr ago" />
          <ListRow href="/info" icon="building" title="Association" description="Official pages" />
        </Panel>

        <SectionTitle>Buttons</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="soft" icon="hand">I'll take it</Button>
          <Button variant="ghost" icon="reply">Reply</Button>
          <Button variant="danger" icon="trash">Delete</Button>
          <Button loading>Saving</Button>
        </div>
      </main>
    </div>
  );
}
