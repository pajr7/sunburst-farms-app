"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { type ListingCategory, type ListingCondition, LISTING_CATEGORY_LABELS, LISTING_CONDITION_LABELS } from "@/lib/data";
import { createListing, uploadListingImage } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Field, TextInput, TextArea, ChoiceChips } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Primitives";
import EmptyState from "@/components/ui/EmptyState";

const CATEGORIES = (Object.keys(LISTING_CATEGORY_LABELS) as ListingCategory[]).map((c) => ({ value: c, label: LISTING_CATEGORY_LABELS[c] }));
const CONDITIONS = (Object.keys(LISTING_CONDITION_LABELS) as ListingCondition[]).map((c) => ({ value: c, label: LISTING_CONDITION_LABELS[c] }));

interface PhotoItem {
  file: File;
  preview: string;
}

export default function NewListingPage() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const [condition, setCondition] = useState<ListingCondition>("good");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricing, setPricing] = useState<"price" | "free">("price");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [tried, setTried] = useState(false);
  const [created, setCreated] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const isFree = pricing === "free";
  const priceNum = parseFloat(price);
  const errors = {
    title: !title.trim() ? "Add a short title" : undefined,
    category: !category ? "Pick a category" : undefined,
    price: !isFree && !(priceNum > 0) ? "Enter a price, or choose Free" : undefined,
  };
  const valid = !errors.title && !errors.category && !errors.price;

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const toAdd = files.slice(0, 5 - photos.length);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((prev) => [...prev, { file, preview: reader.result as string }]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid || !user || loading) return;
    setLoading(true);
    setError(null);
    try {
      const imageUrls: string[] = [];
      for (const photo of photos) {
        const url = await uploadListingImage(user.id, photo.file);
        if (!url) throw new Error("upload");
        imageUrls.push(url);
      }
      const data = await createListing(user.id, title.trim(), description.trim(), category!, condition, isFree ? null : priceNum, isFree, imageUrls.length ? imageUrls : undefined);
      setCreated({ id: data.id });
    } catch (err) {
      setError(err instanceof Error && err.message === "upload" ? "One of the photos didn't upload. Try a smaller photo or remove it." : "Couldn't publish the listing. Check your connection and try again.");
    }
    setLoading(false);
  }

  if (created) {
    return (
      <AuthGuard>
        <PageHeader title="Listed" back="/market" />
        <EmptyState
          icon="check-circle"
          title="Your item is live"
          body="Neighbors can see it in the Marketplace now. You'll get messages here in the app."
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Button href={`/market/${created.id}`}>View listing</Button>
              <Button href="/market/new" variant="secondary" onClick={() => router.refresh()}>List another</Button>
            </div>
          }
        />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-28 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="List an item" subtitle="Sell or give away to neighbors" back="/market" sticky={false} />

        <form onSubmit={handleSubmit} noValidate className="flex-1 px-4 md:px-6">
          {/* Photos */}
          <div className="mb-5">
            <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
              Photos <span className="font-normal" style={{ color: "var(--text-3)" }}>(up to 5)</span>
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="sr-only" id="listing-photos" />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6">
              {photos.map((photo, i) => (
                <div key={i} className="relative shrink-0 w-28 h-28 rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <img src={photo.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "var(--text)", color: "white" }}
                    aria-label={`Remove photo ${i + 1}`}
                  >
                    <Icon name="x" size={16} strokeWidth={2.5} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--text)", color: "white" }}>
                      Cover
                    </span>
                  )}
                </div>
              ))}
              {photos.length < 5 && (
                <label
                  htmlFor="listing-photos"
                  className={`shrink-0 ${photos.length ? "w-28 h-28" : "w-full h-36"} rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer`}
                  style={{ background: "var(--surface)", border: "1.5px dashed var(--border-strong)", color: "var(--text-2)" }}
                >
                  <Icon name="image" size={26} />
                  <span className="text-[14px] font-semibold">{photos.length ? "Add more" : "Add photos"}</span>
                </label>
              )}
            </div>
          </div>

          <Field label="Title" required error={tried ? errors.title : undefined}>
            {(id, by) => <TextInput id={id} describedBy={by} value={title} onChange={setTitle} placeholder="What are you selling?" invalid={tried && !!errors.title} />}
          </Field>

          <div className="mb-4">
            <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
              Price <span style={{ color: "var(--danger)" }} aria-hidden>*</span>
            </p>
            <ChoiceChips
              label="Pricing"
              value={pricing}
              onChange={(v) => setPricing(v as "price" | "free")}
              options={[
                { value: "price", label: "Set a price" },
                { value: "free", label: "Free" },
              ]}
            />
            {!isFree && (
              <div className="mt-3 max-w-[200px]">
                <label htmlFor="listing-price" className="sr-only">Price in dollars</label>
                <TextInput id="listing-price" value={price} onChange={setPrice} placeholder="0" type="number" inputMode="decimal" min="0" step="1" prefix="$" invalid={tried && !!errors.price} />
              </div>
            )}
            {tried && errors.price && (
              <p role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>
                {errors.price}
              </p>
            )}
          </div>

          <div className="mb-4">
            <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
              Category <span style={{ color: "var(--danger)" }} aria-hidden>*</span>
            </p>
            <ChoiceChips label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
            {tried && errors.category && (
              <p role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>
                {errors.category}
              </p>
            )}
          </div>

          <div className="mb-4">
            <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
              Condition
            </p>
            <ChoiceChips label="Condition" value={condition} onChange={setCondition} options={CONDITIONS} />
          </div>

          <Field label="Description" optional hint="Size, age, what's included, anything a buyer should know.">
            {(id, by) => <TextArea id={id} describedBy={by} value={description} onChange={setDescription} rows={4} placeholder="Tell neighbors about this item" />}
          </Field>

          <p className="text-[14px] mb-4" style={{ color: "var(--text-2)" }}>
            Pickup details are shared by message, not posted publicly.
          </p>

          {error && (
            <div className="mb-4">
              <Notice tone="danger" icon="alert-triangle">{error}</Notice>
            </div>
          )}

          <Button type="submit" full size="lg" loading={loading}>
            {loading ? "Publishing" : "Publish listing"}
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
