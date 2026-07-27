"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    label: "Home",
    href: "/",
    path: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    label: "Market",
    href: "/market",
    path: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  { label: "Post", href: "/new", isCreate: true, path: null },
  {
    label: "Messages",
    href: "/messages",
    path: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  },
  {
    label: "Profile",
    href: "/profile",
    path: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
];

const sideLinks = [
  {
    label: "Events",
    href: "/events",
    path: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    label: "Trusted Vendors",
    href: "/vendors",
    path: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  },
  {
    label: "Real Estate",
    href: "/realestate",
    path: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    label: "Pay Dues",
    href: "/dues",
    path: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </>
    ),
  },
  {
    label: "Community Info",
    href: "/info",
    path: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
  },
  {
    label: "Notifications",
    href: "/notifications",
    path: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  },
];

function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-50"
      style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
    >
      <div className="px-6 pt-7 pb-5">
        <h1 className="text-[17px] font-extrabold tracking-tight leading-tight" style={{ color: "var(--navy)" }}>
          Sunburst Farms
        </h1>
        <p className="text-[11px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
          East &middot; Phoenix, AZ
        </p>
      </div>

      <div className="flex flex-col gap-0.5 px-3">
        {tabs
          .filter((t) => !t.isCreate)
          .map((tab) => (
            <SideLink key={tab.href} href={tab.href} label={tab.label} path={tab.path} pathname={pathname} />
          ))}
      </div>

      <div className="mx-6 my-4" style={{ borderTop: "1px solid var(--border)" }} />

      <div className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {sideLinks.map((link) => (
          <SideLink key={link.href} href={link.href} label={link.label} path={link.path} pathname={pathname} />
        ))}
      </div>

      <div className="p-3">
        <Link
          href="/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-bold text-[13px] active:scale-[0.98] transition-transform"
          style={{ background: "var(--accent)", color: "white" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Post
        </Link>
      </div>
    </nav>
  );
}

function SideLink({
  href,
  label,
  path,
  pathname,
}: {
  href: string;
  label: string;
  path: React.ReactNode;
  pathname: string;
}) {
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  const color = active ? "var(--accent)" : "var(--text-secondary)";

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors"
      style={{ background: active ? "var(--accent-light)" : "transparent" }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {path}
      </svg>
      <span className="text-[13px]" style={{ color, fontWeight: active ? 700 : 600 }}>
        {label}
      </span>
    </Link>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around pt-1.5 pb-[env(safe-area-inset-bottom,6px)]"
      style={{ background: "var(--card)", borderTop: "1px solid var(--border)" }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));

        if (tab.isCreate) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center active:scale-95 transition-transform"
              style={{ minWidth: 60 }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
                Post
              </span>
            </Link>
          );
        }

        const color = active ? "var(--accent)" : "var(--text-muted)";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-1 py-1"
            style={{ minWidth: 60 }}
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth={active ? 2.3 : 1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {tab.path}
            </svg>
            <span className="text-[10px]" style={{ color, fontWeight: active ? 700 : 500 }}>
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
      <div className="md:ml-64">
        <div className="max-w-[600px] mx-auto">{children}</div>
      </div>
      <MobileBottomNav />
    </>
  );
}
