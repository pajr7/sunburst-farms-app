"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getListing, updateListingStatus, deleteListing } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import { LISTING_CATEGORY_LABELS, LISTING_CATEGORY_ICON, LISTING_CONDITION_LABELS, type ListingCategory, type ListingCondition } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import ImageCarousel from "@/components/ImageCarousel";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { ChoiceChips } from "@/components/ui/Field";
import { Panel, Spinner, Notice, StatusBadge, SectionTitle, timeAgo } from "@/components/ui/Primitives";
import { listingImages, priceLabel } from "@/components/ListingCard";

type Status = "available" | "pending" | "sold";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (params.id) {
      getListing(params.id as string)
        .then(setListing)
        .catch(() => setListing(null))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  async function setStatus(status: Status) {
    if (!listing || busy || status === listing.status) return;
    setBusy(true);
    setError(null);
    try {
      await updateListingStatus(listing.id, status);
      setListing({ ...listing, status });
    } catch {
      setError("Couldn't update the listing. Try again.");
    }
    setBusy(false);
  }

  async function handleDelete() {
    if (!listing || !user) return;
    setBusy(true);
    setError(null);
    try {
      await deleteListing(listing.id, user.id);
      router.replace("/market");
    } catch {
      setError("Couldn't delete this listing. Try again.");
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <PageHeader title="Listing" back="/market" />
        <Spinner label="Loading listing" />
      </AuthGuard>
    );
  }

  if (!listing) {
    return (
      <AuthGuard>
        <PageHeader title="Listing" back="/market" />
        <EmptyState icon="store" title="Listing not found" body="It may have been removed by the seller." action={<Button href="/market">Back to Marketplace</Button>} />
      </AuthGuard>
    );
  }

  const images = listingImages(listing);
  const isOwner = user?.id === listing.seller_id;
  const status: Status = listing.status;
  const about = encodeURIComponent(listing.title);
  const messageHref = `/messages/${listing.seller_id}?about=${about}&kind=listing`;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-32 md:pb-8" style={{ background: "var(--bg)" }}>
        {/* Photos, edge to edge on mobile */}
        <div className="relative md:px-6 md:pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute top-[calc(env(safe-area-inset-top,0px)_+_12px)] left-3 md:top-9 md:left-9 z-10 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "var(--surface)", color: "var(--text)", boxShadow: "var(--shadow-md)" }}
            aria-label="Back"
          >
            <Icon name="chevron-left" size={24} />
          </button>
          <div className="md:rounded-xl md:overflow-hidden" style={{ background: "var(--surface-2)" }}>
            {images.length > 0 ? (
              <ImageCarousel images={images} title={listing.title} showCounter />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center" style={{ color: "var(--text-3)" }}>
                <Icon name={LISTING_CATEGORY_ICON[listing.category as ListingCategory] ?? "package"} size={64} strokeWidth={1.1} />
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 px-4 md:px-6 pt-4">
          {status !== "available" && (
            <div className="mb-3">
              <Notice tone={status === "sold" ? "neutral" : "warning"} icon={status === "sold" ? "check-circle" : "clock"} title={status === "sold" ? "This item has been sold" : "Pending pickup"}>
                {status === "sold" ? "The seller marked it as sold." : "Someone has claimed this item. The seller will mark it sold once it's picked up."}
              </Notice>
            </div>
          )}

          <p className="text-[26px] font-bold leading-none" style={{ color: listing.is_free ? "var(--primary)" : "var(--text)" }}>
            {priceLabel(listing)}
          </p>
          <h1 className="text-[22px] font-bold leading-snug mt-1.5" style={{ color: "var(--text)" }}>
            {listing.title}
          </h1>
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <StatusBadge icon={LISTING_CATEGORY_ICON[listing.category as ListingCategory]}>{LISTING_CATEGORY_LABELS[listing.category as ListingCategory]}</StatusBadge>
            <StatusBadge>Condition: {LISTING_CONDITION_LABELS[listing.condition as ListingCondition]}</StatusBadge>
            <span className="text-[13px]" style={{ color: "var(--text-3)" }}>
              Listed {timeAgo(listing.created_at)}
            </span>
          </div>

          {listing.description && (
            <p className="text-[16px] leading-[1.6] mt-4 whitespace-pre-line" style={{ color: "var(--text)" }}>
              {listing.description}
            </p>
          )}

          <SectionTitle>Seller</SectionTitle>
          <Panel>
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <Avatar initials={listing.seller?.avatar_initials ?? "??"} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                  {listing.seller?.name ?? "Neighbor"}
                  {isOwner ? " (you)" : ""}
                </p>
                <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                  {listing.seller?.section ?? "Sunburst Farms East"} &middot; pickup details shared by message
                </p>
              </div>
              {!isOwner && status !== "sold" && (
                <Button href={messageHref} size="sm" variant="secondary" icon="message-circle" className="hidden md:inline-flex">
                  Message
                </Button>
              )}
            </div>
          </Panel>

          {isOwner && (
            <>
              <SectionTitle>Manage your listing</SectionTitle>
              <Panel padded>
                <p className="text-[14px] font-semibold mb-2" style={{ color: "var(--text-2)" }}>
                  Status
                </p>
                <ChoiceChips
                  label="Listing status"
                  value={status}
                  onChange={(v) => setStatus(v as Status)}
                  options={[
                    { value: "available", label: "Available" },
                    { value: "pending", label: "Pending pickup" },
                    { value: "sold", label: "Sold" },
                  ]}
                />
                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  {!confirmDelete ? (
                    <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirmDelete(true)}>
                      Delete listing
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="danger" onClick={handleDelete} loading={busy}>
                        Yes, delete it
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
                {error && (
                  <div className="mt-3">
                    <Notice tone="danger" icon="alert-triangle">{error}</Notice>
                  </div>
                )}
              </Panel>
            </>
          )}
        </main>

        {/* Sticky primary action on mobile */}
        {!isOwner && status !== "sold" && (
          <div
            className="md:hidden fixed bottom-[calc(58px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 px-4 py-3"
            style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
          >
            <Button href={messageHref} full size="lg" icon="message-circle">
              Message {listing.seller?.name?.split(" ")[0] ?? "seller"}
            </Button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
