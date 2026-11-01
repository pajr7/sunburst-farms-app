// Every Arizona outlet with a working feed. Direct RSS where the site allows
// it; Google News site-search RSS for outlets that block or paywall their
// own feed (still their headlines, updated within minutes of publishing).
//
// A source can have several feeds (an official team site plus a Google News
// query, for example). Stories that show up in more than one source are
// kept once but tagged with every source that carried them, so a team
// button still finds a story that a network ran first.
//
// Order matters: when two sources run the same headline, the first one in
// this list is shown as the byline.
export type SourceKind = "tv" | "paper" | "radio" | "gov" | "alert" | "sports-net" | "sports-team";
export type Group = "news" | "sports" | "alert";

export interface Feed {
  format: "rss" | "atom" | "gnews";
  url: string;
}

export interface Source {
  id: string;
  name: string;
  short: string;
  kind: SourceKind;
  /** Site whose logo represents this source */
  domain: string;
  /** Explicit logo file when the site's icon is too small; shown on logoBg */
  logo?: string;
  logoBg?: string;
  feeds: Feed[];
}

const GN = (q: string): Feed => ({
  format: "gnews",
  url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`,
});
const RSS = (url: string): Feed => ({ format: "rss", url });

// Team searches are limited to real outlets. Without this, game days fill
// up with "free live stream" spam from throwaway sites.
const SPORTS_SITES =
  "(site:arizonasports.com OR site:azcentral.com OR site:gophnx.com OR site:espn.com OR site:nfl.com OR site:nba.com OR site:mlb.com OR site:wnba.com OR site:uslchampionship.com OR site:si.com OR site:cbssports.com OR site:sports.yahoo.com OR site:nytimes.com OR site:azfamily.com OR site:12news.com OR site:abc15.com OR site:fox10phoenix.com OR site:ktar.com OR site:cronkitenews.azpbs.org OR site:foxsports.com OR site:nbcsports.com OR site:usatoday.com OR site:bleacherreport.com OR site:phoenixnewtimes.com)";
const TEAM = (q: string, days = 2): Feed => GN(`${q} ${SPORTS_SITES} when:${days}d`);

export const SOURCES: Source[] = [
  // Alerts first so they always survive dedupe
  { id: "nws", name: "NWS Weather Alerts", short: "Weather Alerts", kind: "alert", domain: "weather.gov", feeds: [{ format: "atom", url: "https://api.weather.gov/alerts/active.atom?zone=AZC013" }] },

  // ---------- NEWS ----------
  // TV
  { id: "abc15", name: "ABC15 Arizona", short: "ABC15", kind: "tv", domain: "abc15.com", feeds: [RSS("https://www.abc15.com/news.rss")] },
  { id: "azfamily", name: "Arizona's Family (3TV/CBS 5)", short: "AZFamily", kind: "tv", domain: "azfamily.com", feeds: [RSS("https://www.azfamily.com/arc/outboundfeeds/rss/")] },
  { id: "12news", name: "12News", short: "12News", kind: "tv", domain: "12news.com", logo: "https://www.12news.com/assets/shared-images/logos/KPNX.png", logoBg: "oklch(0.38 0.16 262)", feeds: [RSS("https://www.12news.com/feeds/syndication/rss/news/local")] },
  { id: "fox10", name: "FOX 10 Phoenix", short: "FOX 10", kind: "tv", domain: "fox10phoenix.com", feeds: [RSS("https://www.fox10phoenix.com/rss/category/news")] },

  // Papers and online
  { id: "azcentral", name: "Arizona Republic", short: "AZ Republic", kind: "paper", domain: "azcentral.com", feeds: [GN("site:azcentral.com when:2d")] },
  { id: "newtimes", name: "Phoenix New Times", short: "New Times", kind: "paper", domain: "phoenixnewtimes.com", feeds: [RSS("https://www.phoenixnewtimes.com/phoenix/Rss.xml")] },
  { id: "cronkite", name: "Cronkite News", short: "Cronkite", kind: "paper", domain: "cronkitenews.azpbs.org", feeds: [RSS("https://cronkitenews.azpbs.org/feed/")] },
  { id: "azmirror", name: "Arizona Mirror", short: "AZ Mirror", kind: "paper", domain: "azmirror.com", feeds: [RSS("https://azmirror.com/feed/")] },
  { id: "luminaria", name: "AZ Luminaria", short: "Luminaria", kind: "paper", domain: "azluminaria.org", feeds: [RSS("https://azluminaria.org/feed/")] },
  { id: "captimes", name: "Arizona Capitol Times", short: "Capitol Times", kind: "paper", domain: "azcapitoltimes.com", feeds: [RSS("https://azcapitoltimes.com/feed/")] },
  { id: "bizjournal", name: "Phoenix Business Journal", short: "Biz Journal", kind: "paper", domain: "bizjournals.com", feeds: [GN("site:bizjournals.com/phoenix when:3d")] },

  // Radio
  { id: "ktar", name: "KTAR News 92.3", short: "KTAR", kind: "radio", domain: "ktar.com", feeds: [GN("site:ktar.com when:2d")] },
  { id: "kjzz", name: "KJZZ 91.5", short: "KJZZ", kind: "radio", domain: "kjzz.org", feeds: [GN("site:kjzz.org when:2d")] },

  // Government
  { id: "maricopa", name: "Maricopa County", short: "County", kind: "gov", domain: "maricopa.gov", feeds: [RSS("https://www.maricopa.gov/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml")] },
  { id: "adot", name: "ADOT", short: "ADOT", kind: "gov", domain: "azdot.gov", feeds: [GN("site:azdot.gov when:7d")] },

  // ---------- SPORTS ----------
  // Networks and sports desks
  { id: "azsports", name: "Arizona Sports 98.7 FM", short: "AZ Sports 98.7", kind: "sports-net", domain: "arizonasports.com", feeds: [GN("site:arizonasports.com when:2d")] },
  { id: "phnx", name: "PHNX Sports", short: "PHNX", kind: "sports-net", domain: "gophnx.com", feeds: [RSS("https://gophnx.com/feed/")] },
  { id: "abc15sports", name: "ABC15 Sports", short: "ABC15 Sports", kind: "sports-net", domain: "abc15.com", feeds: [RSS("https://www.abc15.com/sports.rss")] },
  { id: "12newssports", name: "12News Sports", short: "12News Sports", kind: "sports-net", domain: "12news.com", logo: "https://www.12news.com/assets/shared-images/logos/KPNX.png", logoBg: "oklch(0.38 0.16 262)", feeds: [RSS("https://www.12news.com/feeds/syndication/rss/sports")] },
  { id: "fox10sports", name: "FOX 10 Sports", short: "FOX 10 Sports", kind: "sports-net", domain: "fox10phoenix.com", feeds: [RSS("https://www.fox10phoenix.com/rss/category/sports")] },
  { id: "azfamilysports", name: "AZFamily Sports", short: "AZFamily Sports", kind: "sports-net", domain: "azfamily.com", feeds: [RSS("https://www.azfamily.com/arc/outboundfeeds/rss/category/sports/")] },
  { id: "cronkitesports", name: "Cronkite Sports", short: "Cronkite Sports", kind: "sports-net", domain: "cronkitenews.azpbs.org", feeds: [RSS("https://cronkitenews.azpbs.org/category/sports/feed/")] },

  // Teams: official feed where one exists, plus Google News for everything else written about them
  { id: "cardinals", name: "Arizona Cardinals", short: "Cardinals", kind: "sports-team", domain: "azcardinals.com", feeds: [RSS("https://www.azcardinals.com/rss/news"), TEAM('"Arizona Cardinals"')] },
  { id: "suns", name: "Phoenix Suns", short: "Suns", kind: "sports-team", domain: "suns.com", feeds: [TEAM('"Phoenix Suns"')] },
  { id: "dbacks", name: "Arizona Diamondbacks", short: "D-backs", kind: "sports-team", domain: "dbacks.com", feeds: [RSS("https://www.mlb.com/dbacks/feeds/news/rss.xml"), TEAM('"Diamondbacks"')] },
  { id: "mercury", name: "Phoenix Mercury", short: "Mercury", kind: "sports-team", domain: "mercury.wnba.com", feeds: [TEAM('"Phoenix Mercury"', 3)] },
  { id: "rising", name: "Phoenix Rising FC", short: "Rising FC", kind: "sports-team", domain: "phxrisingfc.com", feeds: [TEAM('"Phoenix Rising"', 5)] },
  { id: "asu", name: "ASU Sun Devils", short: "Sun Devils", kind: "sports-team", domain: "thesundevils.com", feeds: [TEAM('"Sun Devils"')] },
  { id: "wildcats", name: "Arizona Wildcats", short: "Wildcats", kind: "sports-team", domain: "arizonawildcats.com", feeds: [RSS("https://arizonawildcats.com/rss"), TEAM('"Arizona Wildcats"')] },
];

export function groupOf(kind: SourceKind): Group {
  if (kind === "alert") return "alert";
  if (kind === "sports-net" || kind === "sports-team") return "sports";
  return "news";
}

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  image: string | null;
  source: string; // byline source id
  sourceName: string;
  sources: string[]; // every source id that carried this story
  kind: SourceKind;
  group: Group;
  publishedAt: string;
  logo?: string;
  logoBg?: string;
  // alerts only
  severity?: string;
  expiresAt?: string;
}

export interface SourceSummary {
  id: string;
  name: string;
  short: string;
  kind: SourceKind;
  group: Group;
  count: number;
  logo: string;
  logoBg?: string;
}

/* ---------- Shared "near us" matcher ---------- */
export const NEARBY_TERMS = [
  "north phoenix", "scottsdale", "paradise valley", "85254", "85032", "kierland", "desert ridge", "thunderbird",
  "cactus rd", "cactus road", "shea blvd", "bell rd", "bell road", "greenway", "cave creek", "paradise ridge",
  "deer valley", "sunburst", "tatum", "56th st", "scottsdale rd", "paradise valley mall", "pv mall", "horizon high",
  "sunnyslope", "moon valley",
];

export function isNearbyNews(item: Pick<NewsItem, "title" | "description">): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return NEARBY_TERMS.some((t) => text.includes(t));
}

/** Outlet logo via Google's favicon service; no assets to store or license. */
export function sourceLogo(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}
