"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

const SBFE_BOUNDS = encodeURIComponent(JSON.stringify({
  mapBounds: { north: 33.613, south: 33.595, east: -111.955, west: -111.971 },
  isMapVisible: true,
  isListVisible: true,
  mapZoom: 15,
}));

const SBFE_BOUNDS_RENT = encodeURIComponent(JSON.stringify({
  mapBounds: { north: 33.613, south: 33.595, east: -111.955, west: -111.971 },
  isMapVisible: true,
  isListVisible: true,
  mapZoom: 15,
  filterState: { isForRent: { value: true }, isForSaleByAgent: { value: false }, isForSaleByOwner: { value: false }, isNewConstruction: { value: false }, isComingSoon: { value: false }, isAuction: { value: false }, isForSaleForeclosure: { value: false } },
}));

const SBFE_BOUNDS_SOLD = encodeURIComponent(JSON.stringify({
  mapBounds: { north: 33.613, south: 33.595, east: -111.955, west: -111.971 },
  isMapVisible: true,
  isListVisible: true,
  mapZoom: 15,
  filterState: { isRecentlySold: { value: true }, isForSaleByAgent: { value: false }, isForSaleByOwner: { value: false }, isNewConstruction: { value: false }, isComingSoon: { value: false }, isAuction: { value: false }, isForSaleForeclosure: { value: false } },
}));

const ZILLOW_URL = `https://www.zillow.com/homes/for_sale/?searchQueryState=${SBFE_BOUNDS}`;
const ZILLOW_RENT_URL = `https://www.zillow.com/homes/for_rent/?searchQueryState=${SBFE_BOUNDS_RENT}`;
const ZILLOW_SOLD_URL = `https://www.zillow.com/homes/recently_sold/?searchQueryState=${SBFE_BOUNDS_SOLD}`;

type Tab = "buy" | "rent" | "sold";

export default function RealEstatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("buy");

  const tabs: { key: Tab; label: string; url: string; description: string }[] = [
    { key: "buy", label: "For Sale", url: ZILLOW_URL, description: "Homes currently listed for sale" },
    { key: "rent", label: "For Rent", url: ZILLOW_RENT_URL, description: "Available rental properties" },
    { key: "sold", label: "Recently Sold", url: ZILLOW_SOLD_URL, description: "Recent sales in SBFE" },
  ];

  const activeTabData = tabs.find((t) => t.key === activeTab)!;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header
          className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center gap-3 pt-3 animate-fade-up">
            <Link
              href="/profile"
              className="w-8 h-8 flex items-center justify-center rounded-full active:opacity-70"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div>
              <h1
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: "var(--navy)" }}
              >
                Real Estate
              </h1>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Sunburst Farms East homes
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4">
          {/* Tab pills */}
          <div className="flex gap-2 mb-5 animate-fade-up animate-fade-up-delay-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
                style={{
                  background: activeTab === tab.key ? "var(--navy)" : "var(--card)",
                  color: activeTab === tab.key ? "white" : "var(--text-secondary)",
                  border: activeTab === tab.key ? "none" : "1px solid var(--border)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Zillow card */}
          <div className="mb-5 animate-fade-up animate-fade-up-delay-2">
            <a
              href={activeTabData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden active:opacity-80 transition-opacity"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div
                className="px-5 py-4 flex items-center gap-4"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold" style={{ color: "var(--navy)" }}>
                    View {activeTabData.label} on Zillow
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {activeTabData.description} within SBFE boundaries
                  </p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>

              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ background: "var(--accent-light)", borderTop: "1px solid var(--border)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>
                  Opens Zillow filtered to 50th-56th St, Cactus-Thunderbird
                </p>
              </div>
            </a>
          </div>

          {/* Boundary map card */}
          <div className="mb-5 animate-fade-up animate-fade-up-delay-3">
            <h2
              className="text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Community Boundaries
            </h2>
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--navy)" }}>
                    Sunburst Farms East
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "var(--text-muted)" }}>N</span>
                      <span className="font-medium">Thunderbird Rd</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "var(--text-muted)" }}>S</span>
                      <span className="font-medium">Cactus Rd</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "var(--text-muted)" }}>W</span>
                      <span className="font-medium">50th St</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "var(--text-muted)" }}>E</span>
                      <span className="font-medium">56th St</span>
                    </div>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                    Sections 2, 3, 4 & 7 - Phoenix, AZ 85254
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mb-5 animate-fade-up animate-fade-up-delay-4">
            <h2
              className="text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Quick Links
            </h2>
            <div
              className="rounded-2xl overflow-hidden divide-y"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <a
                href="https://www.zillow.com/home-values/94846/scottsdale-az-85254/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--gold-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Home Value Trends
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    85254 zip code market data
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <a
                href={`https://www.google.com/maps/place/Sunburst+Farms+East,+Phoenix,+AZ+85032/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Community Map
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    View SBFE on Google Maps
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <Link
                href="/info/5"
                className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Community Location
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Section boundaries and map
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
