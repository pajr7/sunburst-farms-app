"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--sunburst)" : "var(--stone)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Events",
    href: "/events",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--sunburst)" : "var(--stone)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Post",
    href: "/post",
    isCreate: true,
    icon: () => (
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--sunburst)" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
    ),
  },
  {
    label: "Alerts",
    href: "/notifications",
    badge: 2,
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--sunburst)" : "var(--stone)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--sunburst)" : "var(--stone)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/join") return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2"
      style={{
        background: "var(--warm-sand)",
        boxShadow: "0 -1px 12px oklch(0.25 0.01 70 / 0.08)",
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
            style={{ minWidth: 56 }}
          >
            {tab.isCreate ? (
              <div className="-mt-4">{tab.icon(active)}</div>
            ) : (
              <>
                {active && (
                  <div
                    className="absolute -top-0.5 w-1 h-1 rounded-full"
                    style={{ background: "var(--sunburst)" }}
                  />
                )}
                <div className="relative">
                  {tab.icon(active)}
                  {tab.badge && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{ background: "var(--terracotta)", color: "var(--cream-wash)" }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
              </>
            )}
            <span
              className="text-[10px] font-semibold tracking-wide uppercase"
              style={{ color: active ? "var(--charcoal)" : "var(--stone)" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
