"use client";

import Link from "next/link";
import { type ListingCategory, LISTING_CATEGORY_ICON } from "@/lib/data";
import ImageCarousel from "./ImageCarousel";
import Icon from "./ui/Icon";
import { StatusBadge } from "./ui/Primitives";

export function listingImages(listing: any): { image_url: string; position: number }[] {
  if (listing.listing_images?.length > 0) return listing.listing_images;
  if (listing.image_url) return [{ image_url: listing.image_url, position: 0 }];
  return [];
}

export function priceLabel(listing: { is_free: boolean; price: number | null }): string {
  if (listing.is_free) return "Free";
  const p = Number(listing.price ?? 0);
  return `$${p % 1 === 0 ? p.toLocaleString() : p.toFixed(2)}`;
}

/** Airbnb-style listing tile: photo, then price, title, seller. Nothing else. */
export default function ListingCard({ listing, index = 0, isMine = false }: { listing: any; index?: number; isMine?: boolean }) {
  const images = listingImages(listing);
  const href = `/market/${listing.id}`;
  const unavailable = listing.status !== "available";

  return (
    <li className="list-none" data-index={index}>
      <div className="relative rounded-xl overflow-hidden" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        {images.length > 1 ? (
          <ImageCarousel images={images} title={listing.title} />
        ) : images.length === 1 ? (
          <Link href={href} tabIndex={-1} aria-hidden>
            <img src={images[0].image_url} alt="" className="w-full aspect-square object-cover" loading="lazy" />
          </Link>
        ) : (
          <Link href={href} tabIndex={-1} aria-hidden className="w-full aspect-square flex items-center justify-center" style={{ color: "var(--text-3)" }}>
            <Icon name={LISTING_CATEGORY_ICON[listing.category as ListingCategory] ?? "package"} size={40} strokeWidth={1.25} />
          </Link>
        )}
        {(unavailable || isMine) && (
          <span className="absolute top-2 left-2 flex gap-1">
            {unavailable && (
              <StatusBadge tone={listing.status === "sold" ? "neutral" : "warning"}>{listing.status === "sold" ? "Sold" : "Pending"}</StatusBadge>
            )}
            {isMine && <StatusBadge tone="info">Yours</StatusBadge>}
          </span>
        )}
      </div>
      <Link href={href} className="block pt-2.5">
        <span className="block text-[17px] font-bold" style={{ color: listing.is_free ? "var(--primary)" : "var(--text)" }}>
          {priceLabel(listing)}
        </span>
        <span className="block text-[15px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text)" }}>
          {listing.title}
        </span>
        <span className="block text-[13px] mt-0.5 truncate" style={{ color: "var(--text-3)" }}>
          {listing.seller?.name ?? "Neighbor"}
          {listing.seller?.section ? ` · ${listing.seller.section}` : ""}
        </span>
      </Link>
    </li>
  );
}
