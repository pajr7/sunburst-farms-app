"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  getPendingProfiles,
  approveProfile,
  denyProfile,
  getPendingVendors,
  approveVendor,
  denyVendor,
} from "@/lib/database";

interface PendingProfile {
  id: string;
  name: string;
  address: string;
  section: string;
  avatar_initials: string;
  created_at: string;
  proof_image_url: string | null;
}

type AdminTab = "members" | "vendors";

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("members");
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!profile || profile.role !== "admin") {
      router.replace("/");
      return;
    }
    loadAll();
  }, [profile, authLoading, router]);

  async function loadAll() {
    try {
      const [members, vendors] = await Promise.all([
        getPendingProfiles(),
        getPendingVendors(),
      ]);
      setPending(members ?? []);
      setPendingVendors(vendors ?? []);
    } catch {}
    setLoading(false);
  }

  async function handleApprove(id: string) {
    setActioning(id);
    await approveProfile(id);
    setPending((prev) => prev.filter((p) => p.id !== id));
    setActioning(null);
  }

  async function handleDeny(id: string) {
    setActioning(id);
    await denyProfile(id);
    setPending((prev) => prev.filter((p) => p.id !== id));
    setActioning(null);
  }

  async function handleApproveVendor(id: string, tier: "free" | "featured") {
    setActioning(id);
    await approveVendor(id, tier);
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    setActioning(null);
  }

  async function handleDenyVendor(id: string) {
    setActioning(id);
    await denyVendor(id);
    setPendingVendors((prev) => prev.filter((v) => v.id !== id));
    setActioning(null);
  }

  if (authLoading || loading) {
    return (
      <div
        className="flex flex-col min-h-screen items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen pb-24 md:pb-4"
      style={{ background: "var(--bg)" }}
    >
      <header
        className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-3"
        style={{ background: "var(--bg)" }}
      >
        <h1
          className="font-extrabold tracking-tight text-2xl mb-3"
          style={{ color: "var(--navy)" }}
        >
          Admin
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("members")}
            className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
            style={{
              background: tab === "members" ? "var(--navy)" : "var(--card)",
              color: tab === "members" ? "white" : "var(--text-secondary)",
              border:
                tab === "members" ? "none" : "1px solid var(--border)",
            }}
          >
            Members{pending.length > 0 ? ` (${pending.length})` : ""}
          </button>
          <button
            onClick={() => setTab("vendors")}
            className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
            style={{
              background: tab === "vendors" ? "var(--navy)" : "var(--card)",
              color: tab === "vendors" ? "white" : "var(--text-secondary)",
              border:
                tab === "vendors" ? "none" : "1px solid var(--border)",
            }}
          >
            Vendors{pendingVendors.length > 0 ? ` (${pendingVendors.length})` : ""}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4">
        {tab === "members" && <MembersTab pending={pending} actioning={actioning} onApprove={handleApprove} onDeny={handleDeny} onViewProof={setViewingProof} />}
        {tab === "vendors" && <VendorsTab vendors={pendingVendors} actioning={actioning} onApprove={handleApproveVendor} onDeny={handleDenyVendor} />}
      </main>

      {viewingProof && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setViewingProof(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => setViewingProof(null)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={viewingProof}
            alt="Proof of residence"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function MembersTab({
  pending,
  actioning,
  onApprove,
  onDeny,
  onViewProof,
}: {
  pending: PendingProfile[];
  actioning: string | null;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  onViewProof: (url: string | null) => void;
}) {
  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
        <span className="text-4xl mb-3">&#9989;</span>
        <p
          className="font-extrabold tracking-tight text-xl mb-1"
          style={{ color: "var(--navy)" }}
        >
          All caught up
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No pending sign-up requests right now.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pending.map((person, i) => (
        <div
          key={person.id}
          className={`p-4 rounded-2xl animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "var(--accent-light)",
                color: "var(--navy)",
              }}
            >
              {person.avatar_initials}
            </div>
            <div className="flex-1">
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--text)" }}
              >
                {person.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {person.section} &middot; {person.address}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Requested {new Date(person.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {person.proof_image_url ? (
            <button
              onClick={() => onViewProof(person.proof_image_url)}
              className="w-full mb-3 rounded-xl overflow-hidden active:opacity-80 transition-opacity"
              style={{ border: "1px solid var(--border)" }}
            >
              <img
                src={person.proof_image_url}
                alt="Proof of residence"
                className="w-full object-cover"
                style={{ maxHeight: 160 }}
              />
              <div
                className="px-3 py-2 flex items-center gap-1.5"
                style={{ background: "var(--accent-light)" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  Tap to view proof
                </span>
              </div>
            </button>
          ) : (
            <div
              className="w-full mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
              style={{
                background: "oklch(0.95 0.03 25)",
                border: "1px solid oklch(0.90 0.03 25)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--danger)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--danger)" }}
              >
                No proof uploaded
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(person.id)}
              disabled={actioning === person.id}
              className="flex-1 py-2.5 rounded-full font-bold text-sm"
              style={{ background: "var(--navy)", color: "var(--white)" }}
            >
              {actioning === person.id ? "..." : "Approve"}
            </button>
            <button
              onClick={() => onDeny(person.id)}
              disabled={actioning === person.id}
              className="flex-1 py-2.5 rounded-full font-bold text-sm"
              style={{
                background: "var(--card)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function VendorsTab({
  vendors,
  actioning,
  onApprove,
  onDeny,
}: {
  vendors: any[];
  actioning: string | null;
  onApprove: (id: string, tier: "free" | "featured") => void;
  onDeny: (id: string) => void;
}) {
  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
        <span className="text-4xl mb-3">&#9989;</span>
        <p
          className="font-extrabold tracking-tight text-xl mb-1"
          style={{ color: "var(--navy)" }}
        >
          All caught up
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No pending vendor recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {vendors.map((vendor, i) => (
        <div
          key={vendor.id}
          className={`p-4 rounded-2xl animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="mb-3">
            <h3
              className="font-bold text-[15px]"
              style={{ color: "var(--navy)" }}
            >
              {vendor.business_name}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {vendor.category}
              {vendor.phone ? ` · ${vendor.phone}` : ""}
            </p>
            {vendor.recommender?.name && (
              <p
                className="text-[11px] mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Recommended by {vendor.recommender.name}
              </p>
            )}
          </div>

          {vendor.description && (
            <p
              className="text-[12px] mb-3 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {vendor.description}
            </p>
          )}

          {(vendor.email || vendor.website) && (
            <div
              className="text-[11px] mb-3 space-y-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {vendor.email && <p>{vendor.email}</p>}
              {vendor.website && <p>{vendor.website}</p>}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(vendor.id, "free")}
              disabled={actioning === vendor.id}
              className="flex-1 py-2.5 rounded-full font-bold text-sm"
              style={{ background: "var(--navy)", color: "var(--white)" }}
            >
              {actioning === vendor.id ? "..." : "Approve"}
            </button>
            <button
              onClick={() => onApprove(vendor.id, "featured")}
              disabled={actioning === vendor.id}
              className="flex-1 py-2.5 rounded-full font-bold text-sm"
              style={{ background: "var(--gold)", color: "white" }}
            >
              Featured
            </button>
            <button
              onClick={() => onDeny(vendor.id)}
              disabled={actioning === vendor.id}
              className="px-4 py-2.5 rounded-full font-bold text-sm"
              style={{
                background: "var(--card)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
