"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getConversations, getAllProfiles } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner } from "@/components/ui/Primitives";

function shortTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDirectory, setShowDirectory] = useState(false);
  const [neighbors, setNeighbors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingNeighbors, setLoadingNeighbors] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getConversations(user.id)
        .then((d) => setConversations(d ?? []))
        .catch(() => setConversations([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  async function openDirectory() {
    setShowDirectory(true);
    setLoadingNeighbors(true);
    try {
      const data = await getAllProfiles();
      setNeighbors((data ?? []).filter((p: any) => p.id !== user?.id && p.status === "approved"));
    } catch {
      setNeighbors([]);
    }
    setLoadingNeighbors(false);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  useEffect(() => {
    if (!showDirectory) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowDirectory(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDirectory]);

  const q = searchQuery.toLowerCase();
  const filtered = q ? neighbors.filter((n: any) => [n.name, n.section, n.show_address ? n.address : ""].some((f) => f?.toLowerCase().includes(q))) : neighbors;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Messages" actions={<Button size="sm" variant="secondary" icon="edit" onClick={openDirectory}>New message</Button>} />

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading messages" />
          ) : conversations.length === 0 ? (
            <EmptyState icon="message-circle" title="No messages yet" body="Message a neighbor about a listing, a post, or just to say hello." action={<Button icon="edit" onClick={openDirectory}>Find a neighbor</Button>} />
          ) : (
            <Panel>
              <ul>
                {conversations.map((conv: any) => {
                  const unread = conv.unreadCount > 0;
                  return (
                    <li key={conv.otherUser.id} className="ui-row">
                      <Link href={`/messages/${conv.otherUser.id}`} className="flex items-center gap-3.5 px-4 py-3.5 min-h-[64px]">
                        <Avatar initials={conv.otherUser.avatarInitials} src={conv.otherUser.avatarUrl} size={46} />
                        <span className="flex-1 min-w-0">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="text-[16px] truncate" style={{ color: "var(--text)", fontWeight: unread ? 700 : 600 }}>
                              {conv.otherUser.name}
                            </span>
                            <span className="text-[13px] shrink-0" style={{ color: unread ? "var(--primary)" : "var(--text-3)", fontWeight: unread ? 600 : 400 }}>
                              {shortTime(conv.lastMessageAt)}
                            </span>
                          </span>
                          <span className="block text-[15px] truncate mt-0.5" style={{ color: unread ? "var(--text)" : "var(--text-2)", fontWeight: unread ? 500 : 400 }}>
                            {conv.lastMessage}
                          </span>
                        </span>
                        {unread && (
                          <span className="min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0" style={{ background: "var(--primary)", color: "white" }} aria-label={`${conv.unreadCount} unread`}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}
        </main>

        {showDirectory && (
          <div role="dialog" aria-modal="true" aria-labelledby="dir-title" className="fixed inset-0 z-[60] flex flex-col md:left-64" style={{ background: "var(--bg)" }}>
            <div className="mx-auto w-full max-w-[640px] flex flex-col h-full">
              <header className="px-4 pt-[calc(env(safe-area-inset-top,0px)_+_20px)] pb-3 flex items-center gap-2">
                <button type="button" onClick={() => setShowDirectory(false)} className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg" style={{ color: "var(--text)" }} aria-label="Close">
                  <Icon name="x" size={24} />
                </button>
                <h2 id="dir-title" className="text-[22px] font-bold" style={{ color: "var(--text)" }}>
                  Message a neighbor
                </h2>
              </header>
              <div className="px-4 pb-3 relative">
                <Icon name="search" size={18} color="var(--text-3)" className="absolute left-7 top-1/2 -translate-y-1/2 -mt-1.5" />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search by name or section"
                  aria-label="Search neighbors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-[16px] outline-none"
                  style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
                />
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-8">
                {loadingNeighbors ? (
                  <Spinner label="Loading neighbors" />
                ) : filtered.length === 0 ? (
                  <EmptyState compact icon="users" title={searchQuery ? "No neighbors found" : "No approved neighbors yet"} />
                ) : (
                  <Panel>
                    <ul>
                      {filtered.map((n: any) => (
                        <li key={n.id} className="ui-row">
                          <button type="button" onClick={() => router.push(`/messages/${n.id}`)} className="flex items-center gap-3.5 px-4 py-3 w-full text-left min-h-[60px]">
                            <Avatar initials={n.avatar_initials} src={n.avatar_url} size={42} />
                            <span className="flex-1 min-w-0">
                              <span className="block text-[16px] font-semibold truncate" style={{ color: "var(--text)" }}>{n.name}</span>
                              <span className="block text-[14px]" style={{ color: "var(--text-2)" }}>
                                {n.section}{n.show_address && n.address ? ` · ${n.address}` : ""}
                              </span>
                            </span>
                            <Icon name="chevron-right" size={18} color="var(--text-3)" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
