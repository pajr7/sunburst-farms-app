"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Panel, Spinner, Notice, timeAgo } from "@/components/ui/Primitives";

export default function InfoDetailPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const sourceUrl = `https://sbfehome.com/?page_id=${pageId}`;

  useEffect(() => {
    load();
  }, [pageId]);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/info?page=${pageId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTitle(data.title);
      setContent(data.content);
      setCheckedAt(new Date().toISOString());
    } catch {
      setError(true);
    }
    setLoading(false);
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title={loading ? "Association" : title || "Association"} eyebrow="From sbfehome.com" back="/info" />

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading page" />
          ) : error ? (
            <Notice
              tone="warning"
              icon="alert-triangle"
              title="Couldn't load this page"
              action={
                <div className="flex gap-2">
                  <Button size="sm" onClick={load}>Try again</Button>
                  <Button size="sm" variant="secondary" href={sourceUrl} iconRight="external-link">Open the website</Button>
                </div>
              }
            >
              Check your connection, or open it on the association website.
            </Notice>
          ) : (
            <Panel padded>
              <div className="info-content" dangerouslySetInnerHTML={{ __html: content }} />
              <p className="flex items-center gap-1.5 text-[13px] mt-5 pt-4" style={{ color: "var(--text-3)", borderTop: "1px solid var(--border)" }}>
                <Icon name="globe" size={14} />
                Official content from sbfehome.com{checkedAt ? `, checked ${timeAgo(checkedAt)}` : ""}.
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold ml-1" style={{ color: "var(--primary)" }}>
                  Open original
                </a>
              </p>
            </Panel>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
