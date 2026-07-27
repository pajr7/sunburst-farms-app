"use client";

import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function DuesPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-28 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="px-5 pt-[env(safe-area-inset-top,12px)] pb-3">
          <div className="flex items-center gap-3 pt-3 animate-fade-up">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center rounded-2xl active:opacity-70"
              style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
                HOA Dues
              </h1>
              <p className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
                Sunburst Farms East
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5">
          {/* Amount card */}
          <div
            className="rounded-3xl p-6 mb-4 animate-fade-up animate-fade-up-delay-1"
            style={{ background: "var(--navy)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
                Monthly Assessment
              </p>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-[42px] font-extrabold leading-none" style={{ color: "white" }}>$130</span>
              <span className="text-[14px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>/mo</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Due the 1st
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  $1,560/yr
                </span>
              </div>
            </div>
          </div>

          {/* Online payment coming soon */}
          <div
            className="rounded-3xl p-6 mb-4 text-center animate-fade-up animate-fade-up-delay-2"
            style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
          >
            <div className="text-4xl mb-3">{"\u{1F4F1}"}</div>
            <h2 className="text-[16px] font-bold mb-1.5" style={{ color: "var(--navy)" }}>
              Online Payment Coming Soon
            </h2>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
              We're working with the HOA board to set up digital payments. Pay instantly from your phone.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[12px] font-semibold" style={{ color: "var(--accent)" }}>
                No more mailing checks
              </span>
            </div>
          </div>

          {/* Current method */}
          <div
            className="rounded-3xl overflow-hidden mb-4 animate-fade-up animate-fade-up-delay-3"
            style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
          >
            <div className="p-5 pb-3">
              <h2 className="text-[13px] font-bold mb-1" style={{ color: "var(--navy)" }}>
                Current Payment Method
              </h2>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                Until online payments are available
              </p>
            </div>
            <div className="px-5 pb-5">
              <div
                className="flex items-center gap-3.5 p-4 rounded-2xl"
                style={{ background: "var(--bg)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "oklch(0.93 0.03 240)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.38 0.10 240)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    Mail a Check
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Payable to SBFE HOA. Address on your monthly statement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ-style quick info */}
          <div
            className="rounded-3xl overflow-hidden divide-y animate-fade-up animate-fade-up-delay-4"
            style={{ background: "var(--card)", border: "1.5px solid var(--border)" }}
          >
            <InfoRow
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
              iconBg="oklch(0.93 0.035 155)"
              iconColor="oklch(0.35 0.09 155)"
              title="Due Date"
              subtitle="1st of every month"
            />
            <InfoRow
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
              iconBg="oklch(0.95 0.03 25)"
              iconColor="oklch(0.50 0.14 25)"
              title="Late Fee"
              subtitle="See your HOA statement for details"
            />
            <InfoRow
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
              iconBg="var(--accent-light)"
              iconColor="var(--accent)"
              title="Questions?"
              subtitle="Message the HOA board through the app"
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function InfoRow({ icon, iconBg, iconColor, title, subtitle }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3.5 p-4" style={{ borderColor: "var(--border)" }}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{title}</p>
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
      </div>
    </div>
  );
}
