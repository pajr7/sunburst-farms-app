"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

const actions = [
  {
    href: "/post",
    label: "Share",
    description: "Produce, eggs, flowers, or community updates",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: "oklch(0.42 0.10 160)",
    bg: "oklch(0.95 0.025 150)",
  },
  {
    href: "/events/new",
    label: "Event",
    description: "BBQ, garage sale, potluck, or meetup",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M10 14l2 2 4-4" />
      </svg>
    ),
    color: "oklch(0.50 0.14 25)",
    bg: "oklch(0.95 0.025 25)",
  },
  {
    href: "/market/new",
    label: "Sell",
    description: "List something for sale or free pickup",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    color: "oklch(0.72 0.14 75)",
    bg: "oklch(0.95 0.03 75)",
  },
];

export default function NewChoicePage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="px-5 pt-[env(safe-area-inset-top,20px)] pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
            Create
          </p>
          <h1 className="text-[26px] font-extrabold tracking-tight leading-tight" style={{ color: "var(--navy)" }}>
            What are you<br />sharing today?
          </h1>
        </header>

        <main className="flex-1 px-5">
          <div className="grid grid-cols-1 gap-4">
            {actions.map((action) => (
              <button
                key={action.href}
                onClick={() => router.push(action.href)}
                className="group w-full rounded-[20px] text-left transition-all duration-200 active:scale-[0.97] overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-4 p-5">
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ background: action.bg, color: action.color }}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[15px] font-bold mb-0.5" style={{ color: "var(--text)" }}>
                      {action.label}
                    </h2>
                    <p className="text-[12px] leading-snug" style={{ color: "var(--text-muted)" }}>
                      {action.description}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: action.bg }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={action.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
              Visible to all Sunburst Farms neighbors
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
