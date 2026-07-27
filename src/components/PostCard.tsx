"use client";

import { Post } from "@/lib/data";
import CategoryTag from "./CategoryTag";

interface PostCardProps {
  post: Post;
  index?: number;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function PostCard({ post, index = 0, onLike, isLiked = false }: PostCardProps) {
  return (
    <article
      className={`rounded-3xl overflow-hidden animate-fade-up animate-fade-up-delay-${Math.min(index + 1, 5)}`}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover"
            style={{ height: 220 }}
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <CategoryTag category={post.category} />
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ background: "var(--accent-light)", color: "var(--navy)" }}
          >
            {post.author.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--text)" }}>
              {post.author.name}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {post.author.address} &middot; {post.timestamp}
            </p>
          </div>
          {!post.image && <CategoryTag category={post.category} />}
        </div>

        <h3 className="font-bold text-[15px] mb-1 leading-snug" style={{ color: "var(--navy)" }}>
          {post.title}
        </h3>
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
          {post.body}
        </p>

        <div className="flex items-center gap-1 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold transition-all active:scale-95"
            style={{
              color: isLiked ? "var(--danger)" : "var(--text-muted)",
              background: isLiked ? "oklch(0.95 0.03 25)" : "transparent",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "var(--danger)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {post.likes}
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {post.comments}
          </button>
          <div className="flex-1" />
          {!post.claimed && (
            <button
              className="text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all active:scale-95"
              style={{ background: "var(--navy)", color: "white" }}
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
