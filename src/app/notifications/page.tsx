"use client";

import { useState, useEffect } from "react";
import { getNotifications, markNotificationRead } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";

import AuthGuard from "@/components/AuthGuard";

const typeIcons: Record<string, string> = {
  claim: "\u{1F64C}",
  comment: "\u{1F4AC}",
  event: "\u{1F389}",
  welcome: "\u{1F33B}",
  approved: "\u{2705}",
  denied: "\u{274C}",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  async function loadNotifications() {
    try {
      const data = await getNotifications(user!.id);
      setNotifications(data ?? []);
    } catch {
      setNotifications([]);
    }
    setLoading(false);
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-4" style={{ background: "var(--bg)" }}>
          <h1 className="font-extrabold tracking-tight text-2xl" style={{ color: "var(--navy)" }}>
            Notifications
          </h1>
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
              <span className="text-4xl mb-3">&#128276;</span>
              <p className="font-extrabold tracking-tight text-xl mb-1" style={{ color: "var(--navy)" }}>No notifications yet</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>You'll see updates from your neighbors here</p>
            </div>
          ) : (
            <>
              {unread.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
                    New
                  </p>
                  <div className="flex flex-col gap-2">
                    {unread.map((notif: any, i: number) => (
                      <button
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl text-left w-full animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
                        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                          style={{ background: "var(--cat-events-bg)" }}
                        >
                          {typeIcons[notif.type] ?? "\u{1F514}"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug" style={{ color: "var(--text)" }}>
                            {notif.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            {formatTime(notif.created_at)}
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ background: "var(--accent)" }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {read.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                    Earlier
                  </p>
                  <div className="flex flex-col gap-2">
                    {read.map((notif: any) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 p-3.5 rounded-2xl"
                        style={{ background: "var(--card)", border: "1px solid var(--border)", opacity: 0.7 }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                          style={{ background: "var(--cat-general-bg)" }}
                        >
                          {typeIcons[notif.type] ?? "\u{1F514}"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug" style={{ color: "var(--text)" }}>
                            {notif.message}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            {formatTime(notif.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </AuthGuard>
  );
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
