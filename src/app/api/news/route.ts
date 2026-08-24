import { NextResponse } from "next/server";

const FEEDS = [
  { source: "ABC15", url: "https://www.abc15.com/news.rss" },
  { source: "AZFamily", url: "https://www.azfamily.com/arc/outboundfeeds/rss/" },
  { source: "12News", url: "https://www.12news.com/feeds/syndication/rss/news/local" },
];

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  image: string | null;
  source: string;
  publishedAt: string;
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  return match[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function extractImage(itemXml: string): string | null {
  const enclosure = itemXml.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image[^"]*"/i)
    ?? itemXml.match(/<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/i);
  if (enclosure) return enclosure[1];
  const media = itemXml.match(/<media:content[^>]*url="([^"]+)"/i)
    ?? itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  if (media) return media[1];
  return null;
}

async function fetchFeed(source: string, url: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (SBFE Community App)" },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: NewsItem[] = [];
    const itemMatches = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
    for (const itemXml of itemMatches.slice(0, 20)) {
      const title = extractTag(itemXml, "title");
      const link = extractTag(itemXml, "link");
      const pubDate = extractTag(itemXml, "pubDate");
      if (!title || !link) continue;
      const parsed = new Date(pubDate);
      items.push({
        title,
        link,
        description: extractTag(itemXml, "description").slice(0, 300),
        image: extractImage(itemXml),
        source,
        publishedAt: isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString(),
      });
    }
    return items;
  } catch {
    return [];
  }
}

export async function GET() {
  const results = await Promise.all(FEEDS.map((f) => fetchFeed(f.source, f.url)));
  const all = results.flat();

  // Dedupe near-identical headlines across stations
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return NextResponse.json(
    { items: deduped.slice(0, 40), updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
  );
}
