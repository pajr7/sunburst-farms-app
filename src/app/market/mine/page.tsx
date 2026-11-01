"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyListings, updateListingStatus, deleteListing } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import { LISTING_CATEGORY_ICON, type ListingCategory } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, StatusBadge, Notice } from "@/components/ui/Primitives";
import { listingImages, priceLabel } from "@/components/ListingCard";

type Status = "available" | "pending" | "sold";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyListings(user.id)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [user]);

  async function setStatus(id: string, status: Status) {
    setError(null);
    const prev = listings;
    setListings((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      await updateListingStatus(id, status);
    } catch {
      setListings(prev);
      setError("Couldn't update that listing. Try again.");
    }
  }

  async function remove(id: string) {
    if (!user) return;
    setError(null);
    try {
      await deleteListing(id, user.id);
      setListings((l) => l.filter((x) => x.id !== id));
    } catch {
      setError("Couldn't delete that listing. Try again.");
    }
    setConfirm(null);
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Your listings" back="/market" actions={<Button href="/market/new" size="sm" icon="plus">List item</Button>} />
        <main className="flex-1 px-4 md:px-6">
          {error && (
            <div className="mb-3">
              <Notice tone="danger" icon="alert-triangle">{error}</Notice>
            </div>
          )}
          {loading ? (
            <Spinner />
          ) : listings.length === 0 ? (
            <EmptyState icon="tag" title="You haven't listed anything" body="Items you list show up here so you can update or remove them." action={<Button href="/market/new" icon="plus">List an item</Button>} />
          ) : (
            <Panel>
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {listings.map((l) => {
                  const img = listingImages(l)[0];
                  const status: Status = l.status;
                  return (
                    <li key={l.id} className="p-4" style={{ borderColor: "var(--border)" }}>
                      <div className="flex gap-3.5">
                        <Link href={`/market/${l.id}`} className="w-20 h-20 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: "var(--surface-2)", color: "var(--text-3)" }}>
                          {img ? <img src={img.image_url} alt="" className="w-full h-full object-cover" /> : <Icon name={LISTING_CATEGORY_ICON[l.category as ListingCategory] ?? "package"} size={28} />}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/market/${l.id}`} className="block">
                            <span className="text-[16px] font-semibold leading-snug line-clamp-2" style={{ color: "var(--text)" }}>
                              {l.title}
                            </span>
                            <span className="block text-[15px] font-bold mt-0.5" style={{ color: l.is_free ? "var(--primary)" : "var(--text)" }}>
                              {priceLabel(l)}
                            </span>
                          </Link>
                          <div className="mt-1.5">
                            <StatusBadge tone={status === "available" ? "success" : status === "pending" ? "warning" : "neutral"}>
                              {status === "available" ? "Available" : status === "pending" ? "Pending pickup" : "Sold"}
                            </StatusBadge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {status !== "available" && (
                          <Button size="sm" variant="secondary" onClick={() => setStatus(l.id, "available")}>Mark available</Button>
                        )}
                        {status !== "pending" && status !== "sold" && (
                          <Button size="sm" variant="secondary" onClick={() => setStatus(l.id, "pending")}>Mark pending</Button>
                        )}
                        {status !== "sold" && (
                          <Button size="sm" variant="secondary" icon="check" onClick={() => setStatus(l.id, "sold")}>Mark sold</Button>
                        )}
                        {confirm === l.id ? (
                          <>
                            <Button size="sm" variant="danger" onClick={() => remove(l.id)}>Yes, delete</Button>
                            <Button size="sm" variant="ghost" onClick={() => setConfirm(null)}>Cancel</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirm(l.id)}>Delete</Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
