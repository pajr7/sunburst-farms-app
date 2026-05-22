"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { updateProfileVisibility } from "@/lib/database";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

export default function ProfilePage() {
  const { profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [toggling, setToggling] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  async function handleToggleAddress() {
    if (!profile || toggling) return;
    setToggling(true);
    await updateProfileVisibility(profile.id, !profile.show_address);
    await refreshProfile();
    setToggling(false);
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header
          className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3"
          style={{ background: "var(--bg)" }}
        >
          <h1
            className="text-2xl font-extrabold tracking-tight pt-3 animate-fade-up"
            style={{ color: "var(--navy)" }}
          >
            Profile
          </h1>
        </header>

        <main className="flex-1 px-4">
          {/* Profile card */}
          <div
            className="rounded-2xl p-5 mb-5 animate-fade-up animate-fade-up-delay-1"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: "var(--accent-light)", color: "var(--navy)" }}
              >
                {profile?.avatar_initials ?? "??"}
              </div>
              <div>
                <h2 className="font-extrabold text-lg tracking-tight" style={{ color: "var(--navy)" }}>
                  {profile?.name ?? "Neighbor"}
                </h2>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {profile?.section} {profile?.address ? `· ${profile.address}` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="mb-5 animate-fade-up animate-fade-up-delay-2">
            <h2
              className="text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Settings
            </h2>
            <div
              className="rounded-2xl overflow-hidden divide-y"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* Address toggle */}
              <div className="flex items-center gap-3.5 p-4" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Show address to neighbors
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {profile?.show_address
                      ? `Visible: ${profile?.address}`
                      : "Your address is hidden"}
                  </p>
                </div>
                <button
                  onClick={handleToggleAddress}
                  disabled={toggling}
                  className="relative w-12 h-7 rounded-full transition-colors shrink-0"
                  style={{
                    background: profile?.show_address ? "var(--navy)" : "var(--text-muted)",
                    opacity: toggling ? 0.5 : 1,
                  }}
                >
                  <div
                    className="absolute top-0.5 w-6 h-6 rounded-full transition-transform"
                    style={{
                      background: "white",
                      left: profile?.show_address ? "calc(100% - 26px)" : "2px",
                    }}
                  />
                </button>
              </div>

              {/* Notifications */}
              <button className="flex items-center gap-3.5 p-4 w-full text-left" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Notification Settings
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Choose what alerts you
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Household */}
              <button className="flex items-center gap-3.5 p-4 w-full text-left" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Household
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Manage your address and section
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Community */}
          <div className="mb-5 animate-fade-up animate-fade-up-delay-3">
            <h2
              className="text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Community
            </h2>
            <div
              className="rounded-2xl overflow-hidden divide-y"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* Community Info */}
              <Link
                href="/info"
                className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Community Info
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    HOA updates, irrigation, documents, contacts
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {/* Trusted Vendors */}
              <Link
                href="/vendors"
                className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Trusted Vendors
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    SBFE-approved service providers
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {/* Real Estate */}
              <Link
                href="/realestate"
                className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Real Estate
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Homes for sale & rent in SBFE
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {/* Invite */}
              <button className="flex items-center gap-3.5 p-4 w-full text-left" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--accent-light)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Invite a Neighbor
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Share the app with your community
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Admin */}
              {profile?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "var(--gold-light)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                      Admin Panel
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Approve new members
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Sign out */}
          <div className="mb-5 animate-fade-up animate-fade-up-delay-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3.5 p-4 w-full text-left active:opacity-70 transition-opacity"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.95 0.03 25)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--danger)" }}>
                    Sign Out
                  </p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
