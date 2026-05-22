"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ListingCategory,
  ListingCondition,
  LISTING_CATEGORY_LABELS,
  LISTING_CATEGORY_EMOJI,
  LISTING_CONDITION_LABELS,
} from "@/lib/data";
import { createListing, uploadListingImage } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";

import AuthGuard from "@/components/AuthGuard";

const CATEGORIES: ListingCategory[] = ["home_garden", "furniture", "tools", "equestrian", "electronics", "vehicles", "other"];
const CONDITIONS: ListingCondition[] = ["new", "like_new", "good", "fair"];

interface PhotoItem {
  file: File;
  preview: string;
}

export default function NewListingPage() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const [condition, setCondition] = useState<ListingCondition>("good");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((prev) => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!category || !title || !user) return;
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const photo of photos) {
        const url = await uploadListingImage(user.id, photo.file);
        if (url) imageUrls.push(url);
      }
      await createListing(
        user.id,
        title,
        description,
        category,
        condition,
        isFree ? null : parseFloat(price) || 0,
        isFree,
        imageUrls.length > 0 ? imageUrls : undefined
      );
      setSubmitted(true);
    } catch {
      // handle error
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen pb-24 md:pb-4 items-center justify-center px-6" style={{ background: "var(--bg)" }}>
          <div className="text-center animate-fade-up">
            <span className="text-5xl block mb-4">{"\u{1F389}"}</span>
            <h1 className="font-extrabold tracking-tight text-2xl mb-2" style={{ color: "var(--navy)" }}>
              Listed!
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Your item is now visible to all neighbors in Sunburst Farms.
            </p>
            <button
              onClick={() => router.push("/market")}
              className="px-6 py-3 rounded-full font-semibold text-sm"
              style={{ background: "var(--navy)", color: "var(--white)" }}
            >
              View Marketplace
            </button>
          </div>
                  </div>
      </AuthGuard>
    );
  }

  const canSubmit = category && title && (isFree || (price && parseFloat(price) > 0));

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
          <h1 className="font-extrabold tracking-tight text-2xl" style={{ color: "var(--navy)" }}>
            List an item
          </h1>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Sell or give away to your neighbors
          </p>
        </header>

        <main className="flex-1 px-4">
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            {photos.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
                {photos.map((photo, i) => (
                  <div key={i} className="relative shrink-0 w-28 h-28 rounded-xl overflow-hidden">
                    <img
                      src={photo.preview}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "var(--navy)", color: "var(--white)" }}
                    >
                      X
                    </button>
                    {i === 0 && (
                      <span
                        className="absolute bottom-1 left-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{ background: "var(--navy)", color: "var(--white)" }}
                      >
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                {photos.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 w-28 h-28 rounded-xl flex flex-col items-center justify-center gap-1"
                    style={{ background: "var(--card)", border: "2px dashed var(--text-muted)" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {photos.length}/5
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{ background: "var(--card)", border: "2px dashed var(--text-muted)" }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Add photos (up to 5)
                </span>
              </button>
            )}
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Title
            </label>
            <input
              type="text"
              placeholder="What are you selling?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Price
            </label>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setIsFree(!isFree)}
                className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isFree ? "var(--navy)" : "var(--card)",
                  color: isFree ? "var(--white)" : "var(--text)",
                  border: isFree ? "none" : "1px solid var(--border)",
                }}
              >
                Free
              </button>
              {!isFree && (
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: category === cat ? "var(--navy)" : "var(--card)",
                    color: category === cat ? "var(--white)" : "var(--text)",
                    border: category === cat ? "none" : "1px solid var(--border)",
                  }}
                >
                  {LISTING_CATEGORY_EMOJI[cat]} {LISTING_CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Condition
            </label>
            <div className="flex gap-2">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex-1"
                  style={{
                    background: condition === cond ? "var(--navy)" : "var(--card)",
                    color: condition === cond ? "var(--white)" : "var(--text)",
                    border: condition === cond ? "none" : "1px solid var(--border)",
                  }}
                >
                  {LISTING_CONDITION_LABELS[cond]}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Description
            </label>
            <textarea
              placeholder="Tell neighbors about this item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-opacity"
            style={{
              background: canSubmit ? "var(--navy)" : "var(--text-muted)",
              color: "var(--white)",
              opacity: canSubmit && !loading ? 1 : 0.5,
            }}
          >
            {loading ? "Listing..." : "List item"}
          </button>
        </main>

              </div>
    </AuthGuard>
  );
}
