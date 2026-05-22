"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { recommendVendor } from "@/lib/database";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

const CATEGORIES = [
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

export default function RecommendVendorPage() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  async function handleSubmit() {
    if (!businessName || !category || !phone || !user) return;
    setError(null);
    setLoading(true);
    try {
      await recommendVendor(
        user.id,
        businessName,
        category,
        phone,
        description,
        email,
        website,
      );
      setSubmitted(true);
    } catch {
      setError("Failed to submit. Please try again.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen items-center justify-center px-6" style={{ background: "var(--bg)" }}>
          <div className="text-center animate-fade-up">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mb-2" style={{ color: "var(--navy)" }}>
              Recommendation Submitted
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              An admin will review and approve the vendor. Thanks for helping the community!
            </p>
            <Link
              href="/vendors"
              className="px-6 py-3 rounded-full font-bold text-sm inline-block"
              style={{ background: "var(--navy)", color: "white" }}
            >
              Back to Vendors
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header
          className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center gap-3 pt-3 animate-fade-up">
            <Link
              href="/vendors"
              className="w-8 h-8 flex items-center justify-center rounded-full active:opacity-70"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
                Recommend a Vendor
              </h1>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Share a trusted service provider
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4">
          <div className="animate-fade-up animate-fade-up-delay-1">
            {/* Business name */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Business Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Desert Sun Landscaping"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Category *
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className="px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                    style={{
                      background: category === cat.key ? "var(--navy)" : "var(--card)",
                      color: category === cat.key ? "white" : "var(--text)",
                      border: category === cat.key ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="(480) 555-1234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Why You Recommend Them
              </label>
              <textarea
                placeholder="What work did they do? Would you hire them again?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Email (optional)
              </label>
              <input
                type="email"
                placeholder="vendor@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>

            {/* Website */}
            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Website (optional)
              </label>
              <input
                type="url"
                placeholder="www.example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>

            {error && (
              <p className="text-sm mb-3 text-center" style={{ color: "var(--danger)" }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !businessName || !category || !phone}
              className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
              style={{
                background: businessName && category && phone ? "var(--navy)" : "var(--text-muted)",
                color: "white",
                opacity: businessName && category && phone && !loading ? 1 : 0.5,
              }}
            >
              {loading ? "Submitting..." : "Submit Recommendation"}
            </button>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
