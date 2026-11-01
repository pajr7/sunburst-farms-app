"use client";

import { useState, useEffect, useMemo } from "react";
import { type ListingCategory, LISTING_CATEGORY_LABELS } from "@/lib/data";
import { getListings } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import ListingCard from "@/components/ListingCard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import FilterChips from "@/components/ui/FilterChips";
import EmptyState from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Primitives";

const CATEGORY_OPTIONS: { value: ListingCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.keys(LISTING_CATEGORY_LABELS) as ListingCategory[]).map((c) => ({ value: c, label: LISTING_CATEGORY_LABELS[c] })),
];

export default function MarketPage() {
  const [category, setCategory] = useState<ListingCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getListings()
      .then((d) => setListings(d ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    let list = category === "all" ? listings : listings.filter((l) => l.category === category);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((l) => [l.title, l.description, l.seller?.name].filter(Boolean).some((f: string) => f.toLowerCase().includes(q)));
    return list;
  }, [listings, category, query]);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader
          title="Marketplace"
          actions={
            <>
              <Button href="/market/mine" variant="ghost" size="sm" icon="tag" aria-label="Your listings" title="Your listings" />
              <Button href="/market/new" size="sm" icon="plus">
                List item
              </Button>
            </>
          }
        >
          <div className="relative mb-3">
            <Icon name="search" size={18} color="var(--text-3)" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items"
              aria-label="Search items"
              className="w-full h-11 pl-10 pr-4 rounded-lg text-[16px] outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
            />
          </div>
          <FilterChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} label="Filter by category" />
        </PageHeader>

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading listings" />
          ) : visible.length === 0 ? (
            <EmptyState
              icon="store"
              title={query || category !== "all" ? "No items match" : "Nothing listed yet"}
              body={query || category !== "all" ? "Try another category or clear your search." : "Sell or give away something to your neighbors."}
              action={!query && category === "all" ? <Button href="/market/new" icon="plus">List an item</Button> : undefined}
            />
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6" aria-label="Listings">
              {visible.map((listing: any, i: number) => (
                <ListingCard key={listing.id} listing={listing} index={i} isMine={listing.seller_id === user?.id} />
              ))}
            </ul>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
