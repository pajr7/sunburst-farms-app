import { NextResponse } from "next/server";
import { SOURCES, type Source, type NewsItem } from "@/lib/newsSources";

const PER_FEED = 20;
const MAX_ITEMS = 200;

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
    .replace(/\s+/g, " ")
    .trim();
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

function parseRss(xml: string, src: Source): NewsItem[] {
  const out: NewsItem[] = [];
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const itemXml of items.slice(0, PER_FEED)) {
    let title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    if (!title || !link) continue;

    let description = extractTag(itemXml, "description").slice(0, 300);
    if (src.format === "gnews") {
      // Google News titles end in " - Outlet Name"; description is just links
      title = title.replace(/\s+-\s+[^-]+$/, "").trim();
      description = "";
    }

    out.push({
      title,
      link,
      description,
      image: src.format === "gnews" ? null : extractImage(itemXml),
      source: src.id,
      sourceName: src.name,
      kind: src.kind,
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
      title: event || title,
      link: "https://www.weather.gov/psr/",
      description: summary.slice(0, 300),
      image: null,
      source: src.id,
      sourceName: src.name,
      kind: src.kind,
      publishedAt: toIso(extractTag(entryXml, "updated") || extractTag(entryXml, "published")),
      severity: extractTag(entryXml, "cap:severity") || undefined,
      expiresAt: expiresRaw ? toIso(expiresRaw) : undefined,
    });
  }
  return out;
}

async function fetchSource(src: Source): Promise<NewsItem[]> {
  try {
    const res = await fetch(src.url, {
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
    return src.format === "atom" ? parseAtom(xml, src) : parseRss(xml, src);
  } catch {
    return [];
  }
}

export async function GET() {
  const results = await Promise.all(SOURCES.map(fetchSource));

  // Dedupe near-identical headlines; earlier sources in SOURCES win
  const seen = new Set<string>();
  const items: NewsItem[] = [];
  for (const list of results) {
    for (const item of list) {
      const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      items.push(item);
    }
  }

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const counts: Record<string, number> = {};
  for (const item of items) counts[item.source] = (counts[item.source] ?? 0) + 1;

  const sources = SOURCES.map((s) => ({
    id: s.id,
    name: s.name,
    short: s.short,
    kind: s.kind,
    count: counts[s.id] ?? 0,
  }));

  return NextResponse.json(
    { items: items.slice(0, MAX_ITEMS), sources, updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
  );
}
