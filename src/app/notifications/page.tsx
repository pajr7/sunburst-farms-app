"use client";

import { MOCK_NOTIFICATIONS } from "@/lib/data";
import BottomNav from "@/components/BottomNav";

const typeIcons: Record<string, string> = {
  claim: "\u{1F64C}",
  comment: "\u{1F4AC}",
  event: "\u{1F389}",
  welcome: "\u{1F33B}",
};

export default function NotificationsPage() {
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
  const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "var(--warm-sand)" }}>
      <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-4" style={{ background: "var(--warm-sand)" }}>
        <h1 className="font-display text-2xl" style={{ color: "var(--charcoal)" }}>
          Notifications
        </h1>
      </header>

      <main className="flex-1 px-4">
        {unread.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--terracotta)" }}>
              New
            </p>
            <div className="flex flex-col gap-2">
              {unread.map((notif, i) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
                  style={{ background: "var(--cream-wash)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ background: notif.avatar ? "var(--sunburst)" : "var(--cat-events-bg)" }}
                  >
                    {notif.avatar || typeIcons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug" style={{ color: "var(--charcoal)" }}>
                      {notif.message}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--stone)" }}>
                      {notif.timestamp}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: "var(--sunburst)" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {read.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--stone)" }}>
              Earlier
            </p>
            <div className="flex flex-col gap-2">
              {read.map((notif, i) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl"
                  style={{ background: "var(--cream-wash)", opacity: 0.7 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                    style={{ background: notif.avatar ? "oklch(0.88 0.04 70)" : "var(--cat-general-bg)" }}
                  >
                    {notif.avatar || typeIcons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug" style={{ color: "var(--charcoal)" }}>
                      {notif.message}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--stone)" }}>
                      {notif.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
