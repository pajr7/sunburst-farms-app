"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVendors } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "landscaping", label: "Landscaping" },
  { key: "plumbing", label: "Plumbing" },
  { key: "electrical", label: "Electrical" },
  { key: "hvac", label: "HVAC" },
  { key: "handyman", label: "Handyman" },
  { key: "pest_control", label: "Pest Control" },
  { key: "pool", label: "Pool Service" },
  { key: "roofing", label: "Roofing" },
  { key: "painting", label: "Painting" },
  { key: "fencing", label: "Fencing" },
  { key: "tree_service", label: "Tree Service" },
  { key: "cleaning", label: "Cleaning" },
  { key: "garage_doors", label: "Garage Doors" },
  { key: "other", label: "Other" },
];

export default function VendorsPage() {
  const [filter, setFilter] = useState("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    loadVendors();
  }, [filter]);

  async function loadVendors() {
    setLoading(true);
    try {
      const data = await getVendors(filter === "all" ? undefined : filter);
      setVendors(data);
    } catch {
      setVendors([]);
    }
    setLoading(false);
  }

  const featured = vendors.filter((v) => v.tier === "featured");
  const free = vendors.filter((v) => v.tier === "free");

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header
          className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-3"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
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
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
                  Trusted Vendors
                </h1>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  SBFE-approved service providers
                </p>
              </div>
            </div>
            <Link
              href="/vendors/recommend"
              className="px-3.5 py-2 rounded-full text-[12px] font-bold"
              style={{ background: "var(--navy)", color: "white" }}
            >
              Recommend
            </Link>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap shrink-0 transition-all"
                style={{
                  background: filter === cat.key ? "var(--navy)" : "var(--card)",
                  color: filter === cat.key ? "white" : "var(--text-secondary)",
                  border: filter === cat.key ? "none" : "1px solid var(--border)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="font-extrabold tracking-tight text-lg mb-1" style={{ color: "var(--navy)" }}>
                No vendors yet
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Know a great service provider? Recommend them!
              </p>
            </div>
          ) : (
            <>
              {/* Featured vendors */}
              {featured.length > 0 && (
                <div className="mb-5 animate-fade-up">
                  <h2
                    className="text-[11px] font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5"
                    style={{ color: "var(--gold)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Featured
                  </h2>
                  <div className="flex flex-col gap-3">
                    {featured.map((vendor) => (
                      <FeaturedCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                </div>
              )}

              {/* Free vendors */}
              {free.length > 0 && (
                <div className="mb-5 animate-fade-up animate-fade-up-delay-1">
                  <h2
                    className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    All Vendors
                  </h2>
                  <div
                    className="rounded-2xl overflow-hidden divide-y"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    {free.map((vendor) => (
                      <FreeRow key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}

function FeaturedCard({ vendor }: { vendor: any }) {
  const categoryLabel = CATEGORIES.find((c) => c.key === vendor.category)?.label ?? vendor.category;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--card)", border: "1.5px solid var(--gold-light)" }}
    >
      {vendor.image_url && (
        <img
          src={vendor.image_url}
          alt={vendor.business_name}
          className="w-full h-36 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold" style={{ color: "var(--navy)" }}>
                {vendor.business_name}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                style={{ background: "var(--gold-light)", color: "var(--gold)" }}
              >
                Featured
              </span>
            </div>
            <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
              {categoryLabel}
            </p>
          </div>
        </div>

        {vendor.description && (
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
            {vendor.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold active:opacity-70"
              style={{ background: "var(--navy)", color: "white" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call
            </a>
          )}
          {vendor.email && (
            <a
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold active:opacity-70"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
          )}
          {vendor.website && (
            <a
              href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold active:opacity-70"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Website
            </a>
          )}
        </div>

        {vendor.recommender?.name && (
          <p className="text-[10px] mt-3 pt-2" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
            Recommended by {vendor.recommender.name}
          </p>
        )}
      </div>
    </div>
  );
}

function FreeRow({ vendor }: { vendor: any }) {
  const categoryLabel = CATEGORIES.find((c) => c.key === vendor.category)?.label ?? vendor.category;

  return (
    <div className="flex items-center gap-3.5 p-4" style={{ borderColor: "var(--border)" }}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold"
        style={{ background: "var(--accent-light)", color: "var(--accent)" }}
      >
        {vendor.business_name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold truncate" style={{ color: "var(--text)" }}>
          {vendor.business_name}
        </p>
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          {categoryLabel}
        </p>
      </div>
      {vendor.phone && (
        <a
          href={`tel:${vendor.phone.replace(/\D/g, "")}`}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 active:opacity-70"
          style={{ background: "var(--accent-light)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      )}
    </div>
  );
}
