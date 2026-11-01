"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import FilterChips from "@/components/ui/FilterChips";
import Button from "@/components/ui/Button";
import { Panel, ListRow, SectionTitle } from "@/components/ui/Primitives";

const BOUNDS = { north: 33.613, south: 33.595, east: -111.955, west: -111.971 };

function zillow(path: string, filterState?: Record<string, unknown>): string {
  const state = encodeURIComponent(JSON.stringify({ mapBounds: BOUNDS, isMapVisible: true, isListVisible: true, mapZoom: 15, ...(filterState ? { filterState } : {}) }));
  return `https://www.zillow.com/homes/${path}/?searchQueryState=${state}`;
}

const OFF = { value: false };
const TABS = [
  { value: "buy", label: "For sale", url: zillow("for_sale"), description: "Homes currently listed for sale" },
  { value: "rent", label: "For rent", url: zillow("for_rent", { isForRent: { value: true }, isForSaleByAgent: OFF, isForSaleByOwner: OFF, isNewConstruction: OFF, isComingSoon: OFF, isAuction: OFF, isForSaleForeclosure: OFF }), description: "Available rentals" },
  { value: "sold", label: "Recently sold", url: zillow("recently_sold", { isRecentlySold: { value: true }, isForSaleByAgent: OFF, isForSaleByOwner: OFF, isNewConstruction: OFF, isComingSoon: OFF, isAuction: OFF, isForSaleForeclosure: OFF }), description: "Recent sales" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export default function RealEstatePage() {
  const [tab, setTab] = useState<Tab>("buy");
  const active = TABS.find((t) => t.value === tab)!;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Real estate" subtitle="Inside Sunburst Farms East boundaries" back="/community">
          <FilterChips options={TABS.map(({ value, label }) => ({ value, label }))} value={tab} onChange={setTab} label="Listing type" />
        </PageHeader>

        <main className="flex-1 px-4 md:px-6">
          <Panel padded>
            <p className="text-[17px] font-bold" style={{ color: "var(--text)" }}>
              {active.label} on Zillow
            </p>
            <p className="text-[15px] mt-1" style={{ color: "var(--text-2)" }}>
              {active.description}, filtered to 50th to 56th Street and Cactus to Thunderbird. Opens in Zillow.
            </p>
            <div className="mt-3">
              <Button href={active.url} iconRight="external-link">
                Open in Zillow
              </Button>
            </div>
          </Panel>

          <SectionTitle>Community boundaries</SectionTitle>
          <Panel padded>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
              <div className="flex gap-2"><dt className="w-5 font-semibold" style={{ color: "var(--text-3)" }}>N</dt><dd style={{ color: "var(--text)" }}>Thunderbird Rd</dd></div>
              <div className="flex gap-2"><dt className="w-5 font-semibold" style={{ color: "var(--text-3)" }}>S</dt><dd style={{ color: "var(--text)" }}>Cactus Rd</dd></div>
              <div className="flex gap-2"><dt className="w-5 font-semibold" style={{ color: "var(--text-3)" }}>W</dt><dd style={{ color: "var(--text)" }}>50th St</dd></div>
              <div className="flex gap-2"><dt className="w-5 font-semibold" style={{ color: "var(--text-3)" }}>E</dt><dd style={{ color: "var(--text)" }}>56th St</dd></div>
            </dl>
            <p className="text-[14px] mt-3" style={{ color: "var(--text-3)" }}>
              Sections 2, 3, 4 and 7. Phoenix, AZ 85254.
            </p>
          </Panel>

          <SectionTitle>More</SectionTitle>
          <Panel>
            <ListRow href="https://www.zillow.com/home-values/94846/scottsdale-az-85254/" external icon="dollar-sign" title="Home value trends" description="85254 market data on Zillow" />
            <ListRow href="https://www.google.com/maps/place/Sunburst+Farms+East,+Phoenix,+AZ+85254/" external icon="map" title="Community map" description="Google Maps" />
            <ListRow href="/info/5" icon="map-pin" title="Section boundaries" description="Official map from the association" />
          </Panel>
        </main>
      </div>
    </AuthGuard>
  );
}
