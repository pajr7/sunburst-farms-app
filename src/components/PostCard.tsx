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
      className={`animate-fade-up animate-fade-up-delay-${Math.min(index + 1, 5)}`}
      style={{
        background: "var(--card)",
        borderRadius: 16,
        padding: 16,
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "var(--accent-light)", color: "var(--navy)" }}
        >
          {post.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>
              {post.author.name}
            </span>
            <CategoryTag category={post.category} />
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {post.author.address} &middot; {post.timestamp}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-[15px] mb-1.5" style={{ color: "var(--text)" }}>
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
        {post.body}
      </p>

      {post.image && (
        <div className="mb-3 -mx-1">
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-xl object-cover"
            style={{ maxHeight: 240 }}
            loading="lazy"
          />
        </div>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={onLike}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: isLiked ? "var(--danger)" : "var(--text-muted)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "var(--danger)" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.comments}
        </button>
        <div className="flex-1" />
        {!post.claimed && (
          <button
            className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors"
            style={{ background: "var(--navy)", color: "var(--white)" }}
          >
            Claim
          </button>
        )}
      </div>
    </article>
  );
}
