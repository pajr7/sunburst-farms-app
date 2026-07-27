"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "var(--navy)" : "none"} stroke={active ? "var(--navy)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Market",
    href: "/market",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--navy)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: "Post",
    href: "/new",
    isCreate: true,
    icon: (_active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/messages",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--navy)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--navy)" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col z-50 border-r"
      style={{ background: "var(--white)", borderColor: "var(--border)" }}
    >
      <div className="px-6 pt-7 pb-6">
        <h1 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
          Sunburst Farms
        </h1>
        <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
          Community
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-0.5 px-3">
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
              style={{
                background: active ? "var(--accent-light)" : "transparent",
              }}
            >
              {tab.icon(active)}
              <span
                className="text-[13px] font-semibold"
                style={{ color: active ? "var(--navy)" : "var(--text-secondary)" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="px-3 pb-6">
        <Link
          href="/info"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Community Info
          </span>
        </Link>
        <Link
          href="/vendors"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Trusted Vendors
          </span>
        </Link>
        <Link
          href="/realestate"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Real Estate
          </span>
        </Link>
        <Link
          href="/dues"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Pay Dues
          </span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Notifications
          </span>
        </Link>
      </div>
    </nav>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around px-1 pb-[env(safe-area-inset-bottom,6px)] pt-1.5"
      style={{
        background: "var(--white)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const isCreate = (tab as any).isCreate;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 py-1 px-1.5 relative"
            style={{ minWidth: 44 }}
          >
            {isCreate ? (
              <div className="-mt-5 mb-0.5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "var(--navy)" }}
                >
                  {tab.icon(active)}
                </div>
              </div>
            ) : (
              <>
                {tab.icon(active)}
              </>
            )}
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? "var(--navy)" : "var(--text-muted)" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === "/join" || pathname === "/login";

  if (hideNav) return <>{children}</>;

  return (
    <>
      <SideNav />
      <div className="md:ml-60">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
}
