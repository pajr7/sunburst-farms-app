"use client";

import { Suspense } from "react";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getMessages, sendMessage, markMessagesRead, getProfile } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/AuthGuard";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import { Spinner, Notice } from "@/components/ui/Primitives";

type LocalMsg = { id: string; body: string; sender_id: string; created_at: string; state?: "sending" | "failed" };

const KIND_LABEL: Record<string, string> = { listing: "listing", post: "post", event: "event" };

function ConversationPageInner() {
  const params = useParams();
  const search = useSearchParams();
  const otherUserId = params.userId as string;
  const about = search.get("about");
  const kind = search.get("kind") ?? "post";
  const [messages, setMessages] = useState<LocalMsg[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && otherUserId) {
      load();
      getProfile(otherUserId).then(setOtherUser).catch(() => {});
    }
  }, [user, otherUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pre-fill the first message with the thing the conversation is about
  useEffect(() => {
    if (!loading && about && messages.length === 0 && !draft) {
      setDraft(`Hi! About your ${KIND_LABEL[kind] ?? "post"} “${about}”: `);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, about, kind, messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    try {
      const data = await getMessages(user!.id, otherUserId);
      setMessages(data ?? []);
      await markMessagesRead(user!.id, otherUserId);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
    setLoading(false);
  }

  async function send(body: string, tempId?: string) {
    if (!user) return;
    const id = tempId ?? `tmp-${Date.now()}`;
    setMessages((prev) => {
      const without = prev.filter((m) => m.id !== id);
      return [...without, { id, body, sender_id: user.id, created_at: new Date().toISOString(), state: "sending" }];
    });
    try {
      const saved = await sendMessage(user.id, otherUserId, body);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...saved } : m)));
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, state: "failed" } : m)));
    }
  }

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    send(body);
  }

  const firstName = otherUser?.name?.split(" ")[0];

  return (
    <AuthGuard>
      <div className="flex flex-col" style={{ background: "var(--bg)", height: "100dvh" }}>
        <header className="shrink-0 px-4 md:px-6 pt-[calc(env(safe-area-inset-top,0px)_+_12px)] md:pt-5 pb-2.5 flex items-center gap-2" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <Link href="/messages" className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg shrink-0" style={{ color: "var(--text)" }} aria-label="Back to messages">
            <Icon name="chevron-left" size={24} />
          </Link>
          {otherUser ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar initials={otherUser.avatar_initials} size={40} />
              <div className="min-w-0">
                <h1 className="text-[17px] font-bold truncate leading-tight" style={{ color: "var(--text)" }}>
                  {otherUser.name}
                </h1>
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                  {otherUser.section}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 h-10" />
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {about && (
            <div className="mb-4">
              <Notice tone="neutral" icon={kind === "listing" ? "tag" : kind === "event" ? "calendar" : "message-circle"}>
                About {firstName ? `${firstName}'s` : "their"} {KIND_LABEL[kind] ?? "post"}: <strong>{about}</strong>
              </Notice>
            </div>
          )}
          {loading ? (
            <Spinner label="Loading conversation" />
          ) : loadError ? (
            <Notice tone="danger" icon="alert-triangle" title="Couldn't load messages" action={<Button size="sm" onClick={load}>Try again</Button>} />
          ) : messages.length === 0 ? (
            <p className="text-center text-[15px] py-10" style={{ color: "var(--text-2)" }}>
              Say hello to {firstName ?? "your neighbor"}. Only the two of you can see this conversation.
            </p>
          ) : (
            <ol className="flex flex-col gap-1.5" aria-label="Messages">
              {messages.map((msg) => {
                const mine = msg.sender_id === user?.id;
                return (
                  <li key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[80%]">
                      <div
                        className="px-3.5 py-2.5 rounded-2xl"
                        style={{
                          background: mine ? "var(--primary)" : "var(--surface)",
                          color: mine ? "var(--text-on-primary)" : "var(--text)",
                          border: mine ? "none" : "1px solid var(--border)",
                          borderBottomRightRadius: mine ? 6 : 16,
                          borderBottomLeftRadius: mine ? 16 : 6,
                          opacity: msg.state === "sending" ? 0.7 : 1,
                        }}
                      >
                        <p className="text-[16px] leading-relaxed whitespace-pre-line">{msg.body}</p>
                      </div>
                      <p className={`text-[12px] mt-1 ${mine ? "text-right" : ""}`} style={{ color: msg.state === "failed" ? "var(--danger)" : "var(--text-3)" }}>
                        {msg.state === "sending" ? "Sending…" : msg.state === "failed" ? (
                          <>
                            Not sent.{" "}
                            <button type="button" className="font-semibold underline" onClick={() => send(msg.body, msg.id)}>
                              Retry
                            </button>
                          </>
                        ) : (
                          new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
              <div ref={endRef} />
            </ol>
          )}
        </main>

        <form
          className="shrink-0 px-4 md:px-6 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+66px)] md:pb-4 flex items-end gap-2"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <label htmlFor="message-input" className="sr-only">Message</label>
          <textarea
            id="message-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message"
            rows={1}
            className="flex-1 px-3.5 py-3 rounded-lg text-[16px] outline-none resize-none leading-snug"
            style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border-strong)", maxHeight: 120 }}
          />
          <Button type="submit" icon="send" aria-label="Send" disabled={!draft.trim()} />
        </form>
      </div>
    </AuthGuard>
  );
}

export default function ConversationPage() {
  return (
    <Suspense fallback={null}>
      <ConversationPageInner />
    </Suspense>
  );
}
