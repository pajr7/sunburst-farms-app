// Every Arizona outlet with a working feed. Direct RSS where the site allows
// it; Google News site-search RSS for outlets that block or paywall their
// own feed (still their headlines, updated within minutes of publishing).
// Order matters: when two sources run the same headline, the first one in
// this list wins the dedupe.
export type SourceKind = "tv" | "paper" | "radio" | "gov" | "alert";

export interface Source {
  id: string;
  name: string;
  short: string;
  kind: SourceKind;
  format: "rss" | "atom" | "gnews";
  url: string;
}

const GN = (q: string) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

export const SOURCES: Source[] = [
  // Alerts first so they always survive dedupe
  { id: "nws", name: "NWS Weather Alerts", short: "Weather Alerts", kind: "alert", format: "atom", url: "https://api.weather.gov/alerts/active.atom?zone=AZC013" },

  // TV
  { id: "abc15", name: "ABC15 Arizona", short: "ABC15", kind: "tv", format: "rss", url: "https://www.abc15.com/news.rss" },
  { id: "azfamily", name: "Arizona's Family (3TV/CBS 5)", short: "AZFamily", kind: "tv", format: "rss", url: "https://www.azfamily.com/arc/outboundfeeds/rss/" },
  { id: "12news", name: "12News", short: "12News", kind: "tv", format: "rss", url: "https://www.12news.com/feeds/syndication/rss/news/local" },
  { id: "fox10", name: "FOX 10 Phoenix", short: "FOX 10", kind: "tv", format: "rss", url: "https://www.fox10phoenix.com/rss/category/news" },

  // Papers and online
  { id: "azcentral", name: "Arizona Republic", short: "AZ Republic", kind: "paper", format: "gnews", url: GN("site:azcentral.com when:2d") },
  { id: "newtimes", name: "Phoenix New Times", short: "New Times", kind: "paper", format: "rss", url: "https://www.phoenixnewtimes.com/phoenix/Rss.xml" },
  { id: "cronkite", name: "Cronkite News", short: "Cronkite", kind: "paper", format: "rss", url: "https://cronkitenews.azpbs.org/feed/" },
  { id: "azmirror", name: "Arizona Mirror", short: "AZ Mirror", kind: "paper", format: "rss", url: "https://azmirror.com/feed/" },
  { id: "luminaria", name: "AZ Luminaria", short: "Luminaria", kind: "paper", format: "rss", url: "https://azluminaria.org/feed/" },
  { id: "captimes", name: "Arizona Capitol Times", short: "Capitol Times", kind: "paper", format: "rss", url: "https://azcapitoltimes.com/feed/" },
  { id: "bizjournal", name: "Phoenix Business Journal", short: "Biz Journal", kind: "paper", format: "gnews", url: GN("site:bizjournals.com/phoenix when:3d") },

  // Radio
  { id: "ktar", name: "KTAR News 92.3", short: "KTAR", kind: "radio", format: "gnews", url: GN("site:ktar.com when:2d") },
  { id: "kjzz", name: "KJZZ 91.5", short: "KJZZ", kind: "radio", format: "gnews", url: GN("site:kjzz.org when:2d") },

  // Government
  { id: "maricopa", name: "Maricopa County", short: "County", kind: "gov", format: "rss", url: "https://www.maricopa.gov/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml" },
  { id: "adot", name: "ADOT", short: "ADOT", kind: "gov", format: "gnews", url: GN("site:azdot.gov when:7d") },
];

export interface NewsItem {
  title: string;
  link: string;
  description: string;
  image: string | null;
  source: string; // source id
  sourceName: string;
  kind: SourceKind;
  publishedAt: string;
  // alerts only
  severity?: string;
  expiresAt?: string;
}

export interface SourceSummary {
  id: string;
  name: string;
  short: string;
  kind: SourceKind;
  count: number;
}
