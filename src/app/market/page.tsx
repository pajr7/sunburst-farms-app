"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListingCategory, LISTING_CATEGORY_LABELS, LISTING_CATEGORY_EMOJI } from "@/lib/data";
import { getListings } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";

import AuthGuard from "@/components/AuthGuard";
import ImageCarousel from "@/components/ImageCarousel";

const ALL_CATEGORIES: (ListingCategory | "all")[] = ["all", "home_garden", "furniture", "tools", "equestrian", "electronics", "vehicles", "other"];

export default function MarketPage() {
  const [activeFilter, setActiveFilter] = useState<ListingCategory | "all">("all");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadListings();
  }, [activeFilter]);

  async function loadListings() {
    setLoading(true);
    try {
      const data = await getListings(activeFilter === "all" ? undefined : activeFilter);
      setListings(data ?? []);
    } catch {
      setListings([]);
    }
    setLoading(false);
  }

  function getListingImages(listing: any): { image_url: string; position: number }[] {
    if (listing.listing_images && listing.listing_images.length > 0) {
      return listing.listing_images;
    }
    if (listing.image_url) {
      return [{ image_url: listing.image_url, position: 0 }];
    }
    return [];
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-3" style={{ background: "var(--bg)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-extrabold tracking-tight text-2xl" style={{ color: "var(--navy)" }}>
                Marketplace
              </h1>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Buy, sell & give away in SBFE
              </p>
            </div>
            <button
              onClick={() => router.push("/market/new")}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: "var(--navy)", color: "var(--white)" }}
            >
              + List item
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
            {ALL_CATEGORIES.map((cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                  style={{
                    background: active ? "var(--navy)" : "var(--card)",
                    color: active ? "var(--white)" : "var(--text-secondary)",
                    border: active ? "none" : "1px solid var(--border)",
                  }}
                >
                  {cat === "all" ? "All" : `${LISTING_CATEGORY_EMOJI[cat]} ${LISTING_CATEGORY_LABELS[cat]}`}
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">{"\u{1F3F7}\u{FE0F}"}</span>
              <p className="font-extrabold tracking-tight text-xl mb-1" style={{ color: "var(--navy)" }}>
                No listings yet
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Be the first to list something!
              </p>
              <button
                onClick={() => router.push("/market/new")}
                className="px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: "var(--navy)", color: "var(--white)" }}
              >
                List an item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {listings.map((listing: any, i: number) => {
                const images = getListingImages(listing);
                return (
                  <div
                    key={listing.id}
                    className={`rounded-2xl overflow-hidden animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    {images.length > 1 ? (
                      <ImageCarousel images={images} title={listing.title} />
                    ) : images.length === 1 ? (
                      <Link href={`/market/${listing.id}`}>
                        <img
                          src={images[0].image_url}
                          alt={listing.title}
                          className="w-full aspect-square object-cover"
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <Link href={`/market/${listing.id}`}>
                        <div
                          className="w-full aspect-square flex items-center justify-center text-4xl"
                          style={{ background: "var(--bg)" }}
                        >
                          {LISTING_CATEGORY_EMOJI[listing.category as ListingCategory] ?? "\u{1F4E6}"}
                        </div>
                      </Link>
                    )}
                    <Link href={`/market/${listing.id}`}>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-base" style={{ color: listing.is_free ? "var(--sage-dark, var(--sage))" : "var(--text)" }}>
                            {listing.is_free ? "Free" : `$${listing.price}`}
                          </span>
                          {listing.status === "sold" && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: "var(--text-muted)", color: "var(--white)" }}>
                              Sold
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                          {listing.title}
                        </h3>
                        <p className="text-[11px] mt-1 truncate" style={{ color: "var(--text-muted)" }}>
                          {listing.seller?.name ?? "Neighbor"} &middot; {listing.seller?.section ?? ""}
                        </p>
                      </div>
                    </Link>
                    {listing.seller_id !== user?.id && (
                      <div className="px-3 pb-3">
                        <button
                          onClick={() => router.push(`/messages/${listing.seller_id}`)}
                          className="w-full py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                          style={{ background: "var(--bg)", color: "var(--navy)" }}
                        >
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </AuthGuard>
  );
}
