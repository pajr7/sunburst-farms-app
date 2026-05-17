"use client";

import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "var(--warm-sand)" }}>
      <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-4">
        <h1 className="font-display text-2xl" style={{ color: "var(--charcoal)" }}>
          Your Profile
        </h1>
      </header>

      <main className="flex-1 px-4">
        {/* Profile card */}
        <div className="p-5 rounded-2xl mb-4 animate-fade-up" style={{ background: "var(--cream-wash)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: "var(--sunburst)", color: "var(--charcoal)" }}
            >
              PA
            </div>
            <div>
              <h2 className="font-semibold text-lg" style={{ color: "var(--charcoal)" }}>
                Your Name
              </h2>
              <p className="text-sm" style={{ color: "var(--stone)" }}>
                Section 3 &middot; Joined May 2026
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--charcoal)" }}>12</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--stone)" }}>Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--charcoal)" }}>8</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--stone)" }}>Claimed</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--charcoal)" }}>34</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--stone)" }}>Shared</p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2 animate-fade-up animate-fade-up-delay-1">
          {[
            { icon: "\u{1F4E6}", label: "My Posts", desc: "Things you've shared" },
            { icon: "\u{2764}\u{FE0F}", label: "Saved Items", desc: "Posts you've bookmarked" },
            { icon: "\u{1F514}", label: "Notification Settings", desc: "Choose what alerts you" },
            { icon: "\u{1F3E0}", label: "Household", desc: "Manage your address and section" },
            { icon: "\u{1F91D}", label: "Invite a Neighbor", desc: "Share your community code" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 p-4 rounded-xl text-left w-full"
              style={{ background: "var(--cream-wash)" }}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: "var(--stone)" }}>
                  {item.desc}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
