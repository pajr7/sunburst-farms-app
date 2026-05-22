"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMessages, sendMessage, markMessagesRead, getProfile } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const otherUserId = params.userId as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && otherUserId) {
      loadMessages();
      loadOtherUser();
    }
  }, [user, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadOtherUser() {
    try {
      const data = await getProfile(otherUserId);
      setOtherUser(data);
    } catch {}
  }

  async function loadMessages() {
    try {
      const data = await getMessages(user!.id, otherUserId);
      setMessages(data ?? []);
      await markMessagesRead(user!.id, otherUserId);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!newMessage.trim() || !user || sending) return;
    setSending(true);
    try {
      await sendMessage(user.id, otherUserId, newMessage.trim());
      setNewMessage("");
      await loadMessages();
    } catch {}
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
        <header
          className="sticky top-0 z-40 px-4 pt-[env(safe-area-inset-top,12px)] pb-3 flex items-center gap-3"
          style={{ background: "var(--bg)", boxShadow: "0 1px 8px oklch(0.25 0.01 70 / 0.06)" }}
        >
          <button
            onClick={() => router.push("/messages")}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {otherUser && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "var(--accent-light)", color: "var(--navy)" }}
              >
                {otherUser.avatar_initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
                  {otherUser.name}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {otherUser.section}
                </p>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-3xl mb-2">{"\u{1F44B}"}</span>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Say hello to {otherUser?.name?.split(" ")[0] ?? "your neighbor"}!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((msg: any) => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[75%] px-4 py-2.5 rounded-2xl"
                      style={{
                        background: isMine ? "var(--navy)" : "var(--card)",
                        color: isMine ? "var(--white)" : "var(--text)",
                        border: isMine ? "none" : "1px solid var(--border)",
                        borderBottomRightRadius: isMine ? 4 : 16,
                        borderBottomLeftRadius: isMine ? 16 : 4,
                      }}
                    >
                      <p className="text-sm leading-relaxed">{msg.body}</p>
                      <p
                        className="text-[10px] mt-1"
                        style={{ opacity: 0.5 }}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <div
          className="px-4 pb-[env(safe-area-inset-bottom,12px)] pt-3"
          style={{ background: "var(--bg)", boxShadow: "0 -1px 8px oklch(0.25 0.01 70 / 0.06)" }}
        >
          <div className="flex items-end gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none resize-none"
              style={{
                background: "var(--card)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                maxHeight: 120,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-opacity"
              style={{
                background: "var(--navy)",
                opacity: newMessage.trim() && !sending ? 1 : 0.4,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
