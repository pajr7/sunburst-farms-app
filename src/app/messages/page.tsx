"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getConversations, getAllProfiles } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";

import AuthGuard from "@/components/AuthGuard";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDirectory, setShowDirectory] = useState(false);
  const [neighbors, setNeighbors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingNeighbors, setLoadingNeighbors] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  async function loadConversations() {
    try {
      const data = await getConversations(user!.id);
      setConversations(data ?? []);
    } catch {
      setConversations([]);
    }
    setLoading(false);
  }

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
  }

  const filtered = searchQuery
    ? neighbors.filter((n: any) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : neighbors;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-4 flex items-center justify-between" style={{ background: "var(--bg)" }}>
          <div>
            <h1 className="font-extrabold tracking-tight text-2xl" style={{ color: "var(--navy)" }}>
              Messages
            </h1>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Chat with your neighbors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openDirectory}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--navy)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </button>
            <Link
              href="/notifications"
              className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
              <span className="text-4xl mb-3">{"\u{1F4AC}"}</span>
              <p className="font-extrabold tracking-tight text-xl mb-1" style={{ color: "var(--navy)" }}>
                No messages yet
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Message a neighbor to get started
              </p>
              <button
                onClick={openDirectory}
                className="px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: "var(--navy)", color: "var(--white)" }}
              >
                Find a neighbor
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv: any, i: number) => (
                <Link
                  key={conv.otherUser.id}
                  href={`/messages/${conv.otherUser.id}`}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl transition-colors animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 5)}`}
                  style={{ background: conv.unreadCount > 0 ? "var(--card)" : "transparent" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "var(--accent-light)", color: "var(--navy)" }}
                  >
                    {conv.otherUser.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className="text-sm truncate"
                        style={{
                          color: "var(--text)",
                          fontWeight: conv.unreadCount > 0 ? 700 : 500,
                        }}
                      >
                        {conv.otherUser.name}
                      </span>
                      <span className="text-[10px] shrink-0 ml-2" style={{ color: "var(--text-muted)" }}>
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p
                      className="text-xs truncate"
                      style={{
                        color: conv.unreadCount > 0 ? "var(--text)" : "var(--text-muted)",
                        fontWeight: conv.unreadCount > 0 ? 600 : 400,
                      }}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: "var(--accent)", color: "var(--white)" }}
                    >
                      {conv.unreadCount}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </main>

        {showDirectory && (
          <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "var(--bg)" }}>
            <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3 flex items-center gap-3">
              <button
                onClick={() => { setShowDirectory(false); setSearchQuery(""); }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h2 className="font-extrabold tracking-tight text-xl" style={{ color: "var(--navy)" }}>
                Neighbors
              </h2>
            </header>

            <div className="px-4 pb-3">
              <input
                type="text"
                placeholder="Search by name, section, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              {loadingNeighbors ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading neighbors...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {searchQuery ? "No neighbors found" : "No approved neighbors yet"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filtered.map((neighbor: any) => (
                    <button
                      key={neighbor.id}
                      onClick={() => {
                        setShowDirectory(false);
                        setSearchQuery("");
                        router.push(`/messages/${neighbor.id}`);
                      }}
                      className="flex items-center gap-3 p-3.5 rounded-2xl text-left w-full transition-colors active:scale-[0.98]"
                      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ background: "var(--accent-light)", color: "var(--navy)" }}
                      >
                        {neighbor.avatar_initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                          {neighbor.name}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {neighbor.section}{neighbor.show_address && neighbor.address ? ` · ${neighbor.address}` : ""}
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}
