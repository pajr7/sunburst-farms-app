"use client";

import { useState, useEffect, useMemo } from "react";
import { type Category } from "@/lib/data";
import { getPosts, toggleLike } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import PostCard from "@/components/PostCard";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import FilterChips from "@/components/ui/FilterChips";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, timeAgo } from "@/components/ui/Primitives";

type Filter = "all" | "alerts" | "giveaways" | "help" | "recommendations" | "updates";

const FILTERS: { value: Filter; label: string; categories?: Category[] }[] = [
  { value: "all", label: "All" },
  { value: "alerts", label: "Alerts & lost pets", categories: ["safety", "lost_found"] },
  { value: "giveaways", label: "Free & to borrow", categories: ["produce", "eggs", "flowers", "seeds", "free", "tools"] },
  { value: "help", label: "Help needed", categories: ["help"] },
  { value: "recommendations", label: "Recommendations", categories: ["recommendation"] },
  { value: "updates", label: "Updates", categories: ["general", "events"] },
];

export default function PostsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getPosts()
      .then((d) => setPosts(d ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleLike(postId: string) {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes?.some((l: any) => l.user_id === user.id);
        return { ...p, likes: liked ? p.likes.filter((l: any) => l.user_id !== user.id) : [...(p.likes ?? []), { user_id: user.id }] };
      }),
    );
    await toggleLike(postId, user.id);
  }

  const visiblePosts = useMemo(() => {
    const cats = FILTERS.find((f) => f.value === filter)?.categories;
    let list = cats ? posts.filter((p) => cats.includes(p.category)) : posts;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => [p.title, p.body, p.author?.name, p.author?.section].filter(Boolean).some((f: string) => f.toLowerCase().includes(q)));
    return list;
  }, [posts, filter, query]);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader
          title="Neighbor posts"
          back="/"
          actions={
            <Button href="/post" size="sm" icon="edit">
              Share
            </Button>
          }
        >
          <div className="relative mb-3">
            <Icon name="search" size={18} color="var(--text-3)" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts and neighbors"
              aria-label="Search posts and neighbors"
              className="w-full h-11 pl-10 pr-4 rounded-lg text-[16px] outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)" }}
            />
          </div>
          <FilterChips options={FILTERS.map(({ value, label }) => ({ value, label }))} value={filter} onChange={setFilter} label="Filter posts" />
        </PageHeader>

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading posts" />
          ) : visiblePosts.length === 0 ? (
            <EmptyState
              icon={query ? "search" : "message-circle"}
              title={query ? "No matches" : "Nothing here yet"}
              body={query ? `Nothing found for “${query}”.` : filter === "all" ? "Be the first to share something with your neighbors." : "No posts in this group right now."}
              action={!query && filter === "all" ? <Button href="/post" icon="edit">Share with neighbors</Button> : undefined}
            />
          ) : (
            <Panel>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {visiblePosts.map((post: any, i: number) => (
                  <div key={post.id} style={{ borderColor: "var(--border)" }}>
                    <PostCard
                      post={{
                        id: post.id,
                        author: { id: post.author?.id, name: post.author?.name ?? "Neighbor", avatar: post.author?.avatar_initials ?? "??", address: post.author?.section ?? "" },
                        category: post.category,
                        title: post.title,
                        body: post.body,
                        image: post.image_url,
                        timestamp: timeAgo(post.created_at),
                        likes: post.likes?.length ?? 0,
                        comments: post.comments?.length ?? 0,
                        claimed: !!post.claimed_by,
                      }}
                      index={i}
                      onLike={() => handleLike(post.id)}
                      isLiked={post.likes?.some((l: any) => l.user_id === user?.id) ?? false}
                      isOwn={post.author_id === user?.id}
                    />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
