"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getListing, markListingSold } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import { LISTING_CATEGORY_LABELS, LISTING_CATEGORY_EMOJI, LISTING_CONDITION_LABELS, ListingCategory, ListingCondition } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import ImageCarousel from "@/components/ImageCarousel";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (params.id) {
      getListing(params.id as string)
        .then(setListing)
        .catch(() => setListing(null))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  async function handleMarkSold() {
    if (!listing || marking) return;
    setMarking(true);
    try {
      await markListingSold(listing.id);
      setListing({ ...listing, status: "sold" });
    } catch {}
    setMarking(false);
  }

  function getImages(): { image_url: string; position: number }[] {
    if (listing?.listing_images?.length > 0) return listing.listing_images;
    if (listing?.image_url) return [{ image_url: listing.image_url, position: 0 }];
    return [];
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </AuthGuard>
    );
  }

  if (!listing) {
    return (
      <AuthGuard>
        <div className="flex flex-col items-center justify-center min-h-screen px-6" style={{ background: "var(--bg)" }}>
          <p className="font-extrabold tracking-tight text-xl mb-2" style={{ color: "var(--navy)" }}>Listing not found</p>
          <button
            onClick={() => router.push("/market")}
            className="px-6 py-3 rounded-full font-semibold text-sm"
            style={{ background: "var(--navy)", color: "var(--white)" }}
          >
            Back to Marketplace
          </button>
        </div>
      </AuthGuard>
    );
  }

  const images = getImages();
  const isOwner = user?.id === listing.seller_id;
  const isSold = listing.status === "sold";

  return (
    <AuthGuard>
      <div className="min-h-screen pb-8 md:pb-4" style={{ background: "var(--bg)" }}>
        <div className="md:flex md:gap-8 md:p-6">
          <div className="relative md:flex-1 md:max-w-lg md:rounded-2xl md:overflow-hidden md:self-start md:sticky md:top-6">
            <button
              onClick={() => router.back()}
              className="absolute top-[env(safe-area-inset-top,12px)] left-4 z-10 w-9 h-9 rounded-full flex items-center justify-center md:top-4"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {images.length > 0 ? (
              <ImageCarousel images={images} title={listing.title} showCounter />
            ) : (
              <div
                className="w-full aspect-square flex items-center justify-center text-6xl"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                {LISTING_CATEGORY_EMOJI[listing.category as ListingCategory] ?? "\u{1F4E6}"}
              </div>
            )}
          </div>

          <div className="px-4 pt-4 md:flex-1 md:px-0 md:pt-0">
            {isSold && (
              <div
                className="mb-3 px-4 py-2 rounded-xl text-center text-sm font-bold uppercase tracking-wider"
                style={{ background: "var(--text-muted)", color: "var(--white)" }}
              >
                Sold
              </div>
            )}

            <div className="flex items-start justify-between mb-1">
              <h1 className="font-extrabold tracking-tight text-2xl flex-1" style={{ color: "var(--navy)" }}>
                {listing.title}
              </h1>
              <span className="font-bold text-xl shrink-0 ml-3" style={{ color: listing.is_free ? "var(--sage-dark, var(--sage))" : "var(--text)" }}>
                {listing.is_free ? "Free" : `$${listing.price}`}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {LISTING_CATEGORY_EMOJI[listing.category as ListingCategory]} {LISTING_CATEGORY_LABELS[listing.category as ListingCategory]}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {LISTING_CONDITION_LABELS[listing.condition as ListingCondition]}
              </span>
            </div>

            {listing.description && (
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text)" }}>
                {listing.description}
              </p>
            )}

            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "var(--accent-light)", color: "var(--navy)" }}
              >
                {listing.seller?.avatar_initials ?? "??"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {listing.seller?.name ?? "Neighbor"}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {listing.seller?.section}
                </p>
              </div>
            </div>

            {!isOwner && !isSold && (
              <button
                onClick={() => router.push(`/messages/${listing.seller_id}`)}
                className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
                style={{ background: "var(--navy)", color: "var(--white)" }}
              >
                Message Seller
              </button>
            )}

            {isOwner && !isSold && (
              <button
                onClick={handleMarkSold}
                disabled={marking}
                className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
                style={{
                  background: "var(--navy)",
                  color: "var(--white)",
                  opacity: marking ? 0.5 : 1,
                }}
              >
                {marking ? "Updating..." : "Mark as Sold"}
              </button>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
