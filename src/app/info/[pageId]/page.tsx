"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

export default function InfoDetailPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/info?page=${pageId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setTitle(data.title);
        setContent(data.content);
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, [pageId]);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-4" style={{ background: "var(--bg)" }}>
        <header className="px-4 pt-[env(safe-area-inset-top,12px)] pb-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium mb-3 pt-2"
            style={{ color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </header>

        <main className="flex-1 px-4">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>Couldn't load this page</p>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Check your connection and try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--navy)", color: "var(--white)" }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="animate-fade-up">
              <h1
                className="text-xl font-extrabold tracking-tight mb-4"
                style={{ color: "var(--navy)" }}
              >
                {title}
              </h1>
              <div
                className="rounded-2xl p-5 mb-5 info-content"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
