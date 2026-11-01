"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getNotifications, markNotificationRead } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, SectionTitle, timeAgo } from "@/components/ui/Primitives";

const TYPE_ICON: Record<string, IconName> = {
  claim: "hand",
  comment: "reply",
  event: "calendar",
  welcome: "sun",
  approved: "check-circle",
  denied: "x",
  irrigation: "droplet",
  announcement: "megaphone",
};

function hrefFor(n: any): string | null {
  if (n.related_post_id) return `/posts/${n.related_post_id}`;
  if (n.related_event_id) return `/events/${n.related_event_id}`;
  if (n.type === "irrigation") return "/irrigation";
  return null;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    getNotifications(user.id)
      .then((d) => setNotifications(d ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [user]);

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markNotificationRead(id);
  }

  async function markAllRead() {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.all(ids.map(markNotificationRead));
  }

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const Row = ({ n }: { n: any }) => {
    const href = hrefFor(n);
    const inner = (
      <>
        <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: n.read ? "var(--surface-2)" : "var(--primary-soft)", color: n.read ? "var(--text-3)" : "var(--primary-soft-text)" }}>
          <Icon name={TYPE_ICON[n.type] ?? "bell"} size={19} />
        </span>
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-[15px] leading-snug" style={{ color: "var(--text)", fontWeight: n.read ? 400 : 600 }}>
            {n.message}
          </span>
          <span className="block text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>
            {timeAgo(n.created_at)}
          </span>
        </span>
        {!n.read && <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-2" style={{ background: "var(--primary)" }} aria-label="Unread" />}
      </>
    );
    const cls = "ui-row flex items-start gap-3 px-4 py-3.5 w-full";
    return href ? (
      <Link href={href} onClick={() => !n.read && markRead(n.id)} className={cls}>
        {inner}
      </Link>
    ) : (
      <button type="button" onClick={() => !n.read && markRead(n.id)} className={cls} disabled={n.read}>
        {inner}
      </button>
    );
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Notifications" back="/" actions={unread.length > 0 ? <Button size="sm" variant="ghost" onClick={markAllRead}>Mark all read</Button> : undefined} />
        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner />
          ) : notifications.length === 0 ? (
            <EmptyState icon="bell" title="No notifications yet" body="Replies to your posts, RSVPs, and official updates will show up here." />
          ) : (
            <>
              {unread.length > 0 && (
                <>
                  <SectionTitle>New</SectionTitle>
                  <Panel>
                    {unread.map((n) => <Row key={n.id} n={n} />)}
                  </Panel>
                </>
              )}
              {read.length > 0 && (
                <>
                  <SectionTitle>Earlier</SectionTitle>
                  <Panel>
                    {read.map((n) => <Row key={n.id} n={n} />)}
                  </Panel>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
