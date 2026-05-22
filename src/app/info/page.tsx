"use client";

import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

const sections = [
  {
    title: "Updates & Meetings",
    items: [
      {
        label: "Important Community Updates",
        description: "Latest announcements and notices",
        pageId: "1095",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        ),
      },
      {
        label: "Monthly Minutes",
        description: "Board meeting minutes and community communication",
        pageId: "50",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        label: "Board Meeting Agenda & Location",
        description: "Upcoming meeting details",
        pageId: "656",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Services & Resources",
    items: [
      {
        label: "Irrigation Schedule & Updates",
        description: "Current irrigation service schedule",
        pageId: "1182",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        ),
      },
      {
        label: "Irrigation & Bridle Paths",
        description: "Service info and path maps",
        pageId: "154",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
      {
        label: "Bulk Trash Schedule",
        description: "Pickup dates and guidelines",
        pageId: "1086",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" />
          </svg>
        ),
      },
      {
        label: "Property Services",
        description: "Find services for your property",
        pageId: "1297",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        label: "Community Events",
        description: "HOA-organized events and activities",
        pageId: "817",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        label: "Community Finance",
        description: "Budget and financial reports",
        pageId: "83",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        label: "Community Documents",
        description: "CC&Rs, bylaws, and governing docs",
        pageId: "15",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
      {
        label: "FAQ & Info about SBFE",
        description: "Frequently asked questions",
        pageId: "1344",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Contact & Location",
    items: [
      {
        label: "Community Location",
        description: "Map and section boundaries",
        pageId: "5",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
      },
      {
        label: "Contact Us",
        description: "Board and management contacts",
        pageId: "4",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        ),
      },
    ],
  },
];

export default function InfoPage() {
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
            Community Info
          </h1>
          <p className="text-sm mt-0.5 animate-fade-up animate-fade-up-delay-1" style={{ color: "var(--text-muted)" }}>
            Official Sunburst Farms East resources
          </p>
        </header>

        <main className="flex-1 px-4">
          {sections.map((section, si) => (
            <div key={section.title} className={`mb-5 animate-fade-up animate-fade-up-delay-${Math.min(si + 1, 5)}`}>
              <h2
                className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {section.title}
              </h2>
              <div
                className="rounded-2xl overflow-hidden divide-y"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                {section.items.map((item) => (
                  <Link
                    key={item.pageId}
                    href={`/info/${item.pageId}`}
                    className="flex items-center gap-3.5 p-4 active:opacity-70 transition-opacity"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--accent-light)" }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                        {item.label}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {item.description}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </AuthGuard>
  );
}
