"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPost, getComments, addComment, toggleLike, markPostClaimed, deletePost } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import { postKind } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import PostCard from "@/components/PostCard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, Notice, SectionTitle, timeAgo } from "@/components/ui/Primitives";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    Promise.all([getPost(id), getComments(id)])
      .then(([p, c]) => {
        setPost(p);
        setComments(c ?? []);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.location.hash === "#reply") {
      replyRef.current?.focus();
    }
  }, [loading]);

  async function handleLike() {
    if (!user || !post) return;
    const liked = post.likes?.some((l: any) => l.user_id === user.id);
    setPost({ ...post, likes: liked ? post.likes.filter((l: any) => l.user_id !== user.id) : [...(post.likes ?? []), { user_id: user.id }] });
    await toggleLike(post.id, user.id);
  }

  async function handleSend() {
    if (!user || !reply.trim() || sending) return;
    setSending(true);
    setSendError(null);
    try {
      await addComment(post.id, user.id, reply.trim());
      setReply("");
      const c = await getComments(id);
      setComments(c ?? []);
    } catch {
      setSendError("Your reply didn't send. Check your connection and try again.");
    }
    setSending(false);
  }

  async function toggleClaimed() {
    if (!user || !post) return;
    setBusy(true);
    setOwnerError(null);
    try {
      await markPostClaimed(post.id, user.id, !post.claimed_by);
      setPost({ ...post, claimed_by: post.claimed_by ? null : user.id });
    } catch {
      setOwnerError("Couldn't update the status. Try again.");
    }
    setBusy(false);
  }

  async function handleDelete() {
    if (!user || !post) return;
    setBusy(true);
    setOwnerError(null);
    try {
      await deletePost(post.id, user.id);
      router.replace("/");
    } catch {
      setOwnerError("Couldn't delete this post. If this keeps happening, ask a board member to remove it.");
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <PageHeader title="Post" back="/" />
        <Spinner label="Loading post" />
      </AuthGuard>
    );
  }

  if (!post) {
    return (
      <AuthGuard>
        <PageHeader title="Post" back="/" />
        <EmptyState icon="message-circle" title="Post not found" body="It may have been removed." action={<Button href="/">Back to Home</Button>} />
      </AuthGuard>
    );
  }

  const isOwn = post.author_id === user?.id;
  const isGiveaway = postKind(post.category) === "giveaway";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-32 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Post" back="/" />

        <main className="flex-1 px-4 md:px-6">
          <Panel>
            <PostCard
              expanded
              post={{
                id: post.id,
                author: {
                  id: post.author?.id,
                  name: post.author?.name ?? "Neighbor",
                  avatar: post.author?.avatar_initials ?? "??",
                  address: post.author?.section ?? "",
                },
                category: post.category,
                title: post.title,
                body: post.body,
                image: post.image_url,
                timestamp: timeAgo(post.created_at),
                likes: post.likes?.length ?? 0,
                comments: comments.length,
                claimed: !!post.claimed_by,
              }}
              onLike={handleLike}
              isLiked={post.likes?.some((l: any) => l.user_id === user?.id) ?? false}
              isOwn={isOwn}
            />

            {isOwn && (
              <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 items-center" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="text-[14px] font-semibold mr-1 mt-3" style={{ color: "var(--text-3)" }}>
                  Your post
                </span>
                {isGiveaway && (
                  <Button size="sm" variant="secondary" icon={post.claimed_by ? "refresh" : "check"} onClick={toggleClaimed} loading={busy} className="mt-3">
                    {post.claimed_by ? "Mark available again" : "Mark as claimed"}
                  </Button>
                )}
                {!confirmDelete ? (
                  <Button size="sm" variant="danger" icon="trash" onClick={() => setConfirmDelete(true)} className="mt-3">
                    Delete
                  </Button>
                ) : (
                  <span className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="danger" onClick={handleDelete} loading={busy}>
                      Yes, delete
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                      Cancel
                    </Button>
                  </span>
                )}
              </div>
            )}
          </Panel>
          {ownerError && (
            <div className="mt-3">
              <Notice tone="danger" icon="alert-triangle">{ownerError}</Notice>
            </div>
          )}

          <SectionTitle>{comments.length === 0 ? "Replies" : `${comments.length} ${comments.length === 1 ? "reply" : "replies"}`}</SectionTitle>
          {comments.length === 0 ? (
            <EmptyState compact icon="reply" title="No replies yet" body="Be the first to respond." />
          ) : (
            <Panel>
              <ol>
                {comments.map((c) => (
                  <li key={c.id} className="ui-row flex gap-3 px-4 py-3.5">
                    <Avatar initials={c.author?.avatar_initials ?? "?"} size={34} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[15px] font-bold" style={{ color: "var(--text)" }}>
                          {c.author?.name ?? "Neighbor"}
                        </span>
                        <time className="text-[13px]" style={{ color: "var(--text-3)" }}>
                          {timeAgo(c.created_at)}
                        </time>
                      </div>
                      <p className="text-[16px] leading-[1.55] whitespace-pre-line mt-0.5" style={{ color: "var(--text)" }}>
                        {c.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          )}
        </main>

        {/* Reply composer, above the tab bar on mobile */}
        <div
          id="reply"
          className="fixed bottom-[calc(58px+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 right-0 md:left-64 z-40 px-4 md:px-6 pt-2.5 pb-2.5"
          style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
        >
          <div className="mx-auto w-full max-w-[640px] lg:max-w-[760px]">
            {sendError && (
              <div className="mb-2">
                <Notice tone="danger" icon="alert-triangle" action={<Button size="sm" variant="secondary" onClick={handleSend}>Try again</Button>}>
                  {sendError}
                </Notice>
              </div>
            )}
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <label htmlFor="reply-input" className="sr-only">
                Write a reply
              </label>
              <textarea
                id="reply-input"
                ref={replyRef}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={1}
                placeholder={postKind(post.category) === "lost_found" ? "Share a sighting or a tip" : "Write a reply"}
                className="flex-1 px-3.5 py-3 rounded-lg text-[16px] outline-none resize-none leading-snug"
                style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", color: "var(--text)", maxHeight: 120 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button type="submit" icon="send" aria-label="Send reply" disabled={!reply.trim()} loading={sending} />
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
