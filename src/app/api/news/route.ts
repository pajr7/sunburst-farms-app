import { NextResponse } from "next/server";
import { SOURCES, groupOf, sourceLogo, type Source, type Feed, type NewsItem } from "@/lib/newsSources";

// ~40 feeds fetched in parallel; give the function room on a slow morning.
export const maxDuration = 30;

const PER_FEED = 20;
const MAX_PER_GROUP = 300;
const DESC_CHARS = 200;

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/[​-‏⁠﻿]/g, "") // zero-width junk spammers use
    .replace(/\s+/g, " ")
    .trim();
}

// Pirate-stream spam that floods search feeds on game day
const SPAM = [
  /live\s*stream/i,
  /free\s*stream/i,
  /streams?\s+(on|free)/i,
  /watch\s*live/i,
  /\blive\s+free\b/i,
  /on\s+tv\s+channel/i,
  /^[\[\(【!+*]/, // titles that open with brackets or punctuation
  /[！-～]/, // fullwidth letters: "Ｓｔｒｅａｍｓ"
  /[\u{1D400}-\u{1D7FF}]/u, // math-bold letters: "𝐋𝐈𝐕𝐄"
];
function isSpam(title: string): boolean {
  return SPAM.some((re) => re.test(title));
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decode(match[1]) : "";
}

function extractRawTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") : "";
}

function extractImage(itemXml: string): string | null {
  const enclosure =
    itemXml.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image[^"]*"/i) ??
    itemXml.match(/<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/i);
  if (enclosure) return enclosure[1];
  const media =
    itemXml.match(/<media:content[^>]*url="([^"]+)"/i) ??
    itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  if (media) return media[1];
  const inline = extractRawTag(itemXml, "description").match(/<img[^>]*src="([^"]+)"/i);
  if (inline) return inline[1].replace(/&amp;/g, "&");
  return null;
}

function toIso(raw: string): string {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function base(src: Source): Pick<NewsItem, "source" | "sourceName" | "sources" | "kind" | "group" | "logo" | "logoBg" | "logoCrop"> {
  return { source: src.id, sourceName: src.name, sources: [src.id], kind: src.kind, group: groupOf(src.kind), logo: src.logo ?? sourceLogo(src.domain), logoBg: src.logoBg, logoCrop: src.logoCrop };
}

function parseRss(xml: string, src: Source, feed: Feed): NewsItem[] {
  const out: NewsItem[] = [];
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const itemXml of items.slice(0, PER_FEED)) {
    let title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    if (!title || !link || isSpam(title)) continue;

    let description = extractTag(itemXml, "description").slice(0, DESC_CHARS);
    if (feed.format === "gnews") {
      // Google News titles end in " - Outlet Name"; description is just links
      title = title.replace(/\s+-\s+[^-]+$/, "").trim();
      description = "";
    }

    out.push({
      ...base(src),
      title,
      link,
      description,
      image: feed.format === "gnews" ? null : extractImage(itemXml),
      publishedAt: toIso(extractTag(itemXml, "pubDate")),
    });
  }
  return out;
}

function parseAtom(xml: string, src: Source): NewsItem[] {
  const out: NewsItem[] = [];
  const entries = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  const now = Date.now();
  for (const entryXml of entries.slice(0, PER_FEED)) {
    const title = extractTag(entryXml, "title");
    const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/i);
    if (!title || !linkMatch) continue;

    // NWS: skip anything already expired, and keep the event name clean
    const expiresRaw = extractTag(entryXml, "cap:expires");
    if (expiresRaw && new Date(expiresRaw).getTime() < now) continue;

    const event = extractTag(entryXml, "cap:event");
    const summary = extractTag(entryXml, "summary")
      .replace(/\* WHAT\.\.\./, "")
      .replace(/\* (WHERE|WHEN|IMPACTS|ADDITIONAL DETAILS)\.\.\./g, " ")
      .trim();

    out.push({
      ...base(src),
      title: event || title,
      link: "https://www.weather.gov/psr/",
      description: summary.slice(0, DESC_CHARS),
      image: null,
      publishedAt: toIso(extractTag(entryXml, "updated") || extractTag(entryXml, "published")),
      severity: extractTag(entryXml, "cap:severity") || undefined,
      expiresAt: expiresRaw ? toIso(expiresRaw) : undefined,
    });
  }
  return out;
}

async function fetchFeed(src: Source, feed: Feed): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 SBFE-Community-App",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return feed.format === "atom" ? parseAtom(xml, src) : parseRss(xml, src, feed);
  } catch {
    return [];
  }
}

function dedupeKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
}

export async function GET() {
  // One fetch per feed, in parallel, then regroup by source in SOURCES order
  const jobs = SOURCES.flatMap((src) => src.feeds.map((feed) => fetchFeed(src, feed)));
  const results = await Promise.all(jobs);

  const seen = new Map<string, NewsItem>();
  const items: NewsItem[] = [];
  for (const list of results) {
    for (const item of list) {
      const key = dedupeKey(item.title);
      if (!key) continue;
      const existing = seen.get(key);
      if (existing) {
        // Same story from another source: tag it so that source's button still finds it
        if (!existing.sources.includes(item.source)) existing.sources.push(item.source);
        continue;
      }
      seen.set(key, item);
      items.push(item);
    }
  }

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Cap each group separately so a busy sports day can't push the news out
  const perGroup: Record<string, number> = {};
  const trimmed = items.filter((item) => {
    perGroup[item.group] = (perGroup[item.group] ?? 0) + 1;
    return perGroup[item.group] <= MAX_PER_GROUP;
  });

  const counts: Record<string, number> = {};
  for (const item of trimmed) {
    for (const id of item.sources) counts[id] = (counts[id] ?? 0) + 1;
  }

  const sources = SOURCES.map((s) => ({
    id: s.id,
    name: s.name,
    short: s.short,
    kind: s.kind,
    group: groupOf(s.kind),
    count: counts[s.id] ?? 0,
    logo: s.logo ?? sourceLogo(s.domain),
    logoBg: s.logoBg,
    logoCrop: s.logoCrop,
  }));

  return NextResponse.json(
    { items: trimmed, sources, updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
  );
}
