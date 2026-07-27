"use client";

import { useState } from "react";
import { Post, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";

interface PostCardProps {
  post: Post;
  index?: number;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function PostCard({ post, index = 0, onLike, isLiked = false }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.body.length > 180;
  const body = expanded || !isLong ? post.body : post.body.slice(0, 180).trimEnd() + "…";

  return (
    <article
      className={`animate-fade-up animate-fade-up-delay-${Math.min(index + 1, 5)}`}
      style={{
        background: "var(--card)",
        borderRadius: 14,
        border: "1px solid var(--border)",
      }}
    >
      {/* Author row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2.5">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
          style={{ background: "var(--accent-light)", color: "var(--navy)" }}
        >
          {post.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold leading-tight truncate" style={{ color: "var(--text)" }}>
            {post.author.name}
          </p>
          <p className="text-[12px] leading-tight mt-0.5" style={{ color: "var(--text-muted)" }}>
            {post.author.address}
            {post.author.address ? " · " : ""}
            {post.timestamp}
          </p>
        </div>
        <span
          className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{
            background: `var(--cat-${post.category}-bg)`,
            color: `var(--cat-${post.category}-text)`,
          }}
        >
          {CATEGORY_EMOJI[post.category]} {CATEGORY_LABELS[post.category]}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-3">
        <h3 className="text-[16px] font-bold mb-1 leading-snug" style={{ color: "var(--text)" }}>
          {post.title}
        </h3>
        <p className="text-[14px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>
          {body}
          {isLong && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="ml-1 font-semibold"
              style={{ color: "var(--accent)" }}
            >
              See more
            </button>
          )}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt={post.title}
            className="w-full object-cover"
            style={{ maxHeight: 320, borderRadius: 10 }}
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-stretch mx-4 mb-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <ActionButton
          active={isLiked}
          onClick={onLike}
          label={post.likes > 0 ? String(post.likes) : "Like"}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          }
        />
        <ActionButton
          label={post.comments > 0 ? String(post.comments) : "Comment"}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
            </svg>
          }
        />
        {post.claimed ? (
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[13px] font-semibold" style={{ color: "var(--success)" }}>
              Claimed
            </span>
          </div>
        ) : (
          <ActionButton
            label="Claim"
            highlight
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            }
          />
        )}
      </div>
    </article>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  highlight?: boolean;
}) {
  const color = active
    ? "var(--accent)"
    : highlight
      ? "var(--navy)"
      : "var(--text-muted)";

  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-opacity active:opacity-50"
      style={{ color }}
    >
      {icon}
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}
