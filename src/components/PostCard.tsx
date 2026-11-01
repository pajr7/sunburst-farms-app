"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Post, CATEGORY_LABELS, CATEGORY_ICON, postActions, postKind } from "@/lib/data";
import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import { StatusBadge, type Tone } from "./ui/Primitives";

interface PostCardProps {
  post: Post;
  index?: number;
  onLike?: () => void;
  isLiked?: boolean;
  isOwn?: boolean;
  /** Render without the clamp and with the full image: used on the detail page */
  expanded?: boolean;
}

export function kindTone(category: Post["category"]): Tone {
  switch (postKind(category)) {
    case "alert":
      return "danger";
    case "lost_found":
      return "warning";
    case "help":
      return "info";
    case "giveaway":
    case "borrow":
      return "success";
    default:
      return "neutral";
  }
}

const TONE_COLOR: Record<Tone, string> = {
  neutral: "var(--text-3)",
  success: "var(--primary-soft-text)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
};

export default function PostCard({ post, index = 0, onLike, isLiked = false, isOwn = false, expanded = false }: PostCardProps) {
  const [open, setOpen] = useState(expanded);
  const router = useRouter();
  const isLong = post.body.length > 220;
  const body = open || !isLong ? post.body : post.body.slice(0, 220).trimEnd() + "…";
  const kind = postKind(post.category);
  const tone = kindTone(post.category);
  const actions = postActions(post.category);
  const detailHref = `/posts/${post.id}`;
  const canMessage = !isOwn && !!post.author.id;

  function go(type: "message" | "reply") {
    if (type === "reply") {
      router.push(`${detailHref}#reply`);
      return;
    }
    if (!post.author.id) return;
    const about = encodeURIComponent(post.title);
    router.push(`/messages/${post.author.id}?about=${about}&kind=post`);
  }

  return (
    <article className="px-4 pt-4 pb-3" aria-labelledby={`post-${post.id}-title`} data-index={index}>
      {/* Author row */}
      <div className="flex items-start gap-3">
        <Avatar initials={post.author.avatar} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap leading-tight">
            <span className="text-[15px] font-bold truncate" style={{ color: "var(--text)" }}>
              {post.author.name}
            </span>
            <span className="text-[14px]" style={{ color: "var(--text-3)" }}>
              {post.author.address ? `${post.author.address} · ` : ""}
              <time>{post.timestamp}</time>
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold mt-0.5" style={{ color: TONE_COLOR[tone] }}>
            <Icon name={CATEGORY_ICON[post.category]} size={14} strokeWidth={2} />
            {CATEGORY_LABELS[post.category]}
          </span>
        </div>
        {kind === "giveaway" && (
          <StatusBadge tone={post.claimed ? "neutral" : "success"} icon={post.claimed ? "check" : undefined}>
            {post.claimed ? "Claimed" : "Available"}
          </StatusBadge>
        )}
      </div>

      {/* Content */}
      <div className="mt-2.5 pl-[52px]">
        {expanded ? (
          <h2 id={`post-${post.id}-title`} className="text-[20px] font-bold leading-snug" style={{ color: "var(--text)" }}>
            {post.title}
          </h2>
        ) : (
          <Link href={detailHref} className="block">
            <h2 id={`post-${post.id}-title`} className="text-[17px] font-bold leading-snug" style={{ color: "var(--text)" }}>
              {post.title}
            </h2>
          </Link>
        )}
        {post.body && (
          <p className="text-[16px] leading-[1.55] mt-1 whitespace-pre-line" style={{ color: "var(--text)" }}>
            {body}
            {isLong && !open && (
              <>
                {" "}
                <button type="button" onClick={() => setOpen(true)} className="font-semibold" style={{ color: "var(--primary)" }}>
                  See more
                </button>
              </>
            )}
          </p>
        )}
        {post.image && (
          <Link href={detailHref} className="block mt-3">
            <img
              src={post.image}
              alt=""
              className="w-full object-cover rounded-xl"
              style={{ maxHeight: expanded ? 560 : 380, border: "1px solid var(--border)" }}
              loading="lazy"
            />
          </Link>
        )}

        {/* Actions: full width under the content so labels fit on a phone */}
        <div className="flex items-center gap-1 mt-3 -ml-[52px] sm:ml-0">
          {actions.map((a) => {
            if (a.type === "message" && !canMessage) return null;
            if (expanded && a.type === "reply") return null;
            const count = a.type === "reply" && post.comments > 0 ? ` (${post.comments})` : "";
            return (
              <Button
                key={a.label}
                size="sm"
                variant={a.primary ? "soft" : "ghost"}
                icon={a.icon}
                onClick={() => go(a.type)}
                disabled={a.type === "message" && kind === "giveaway" && post.claimed}
                className="!px-2.5"
              >
                {a.label}
                {count}
              </Button>
            );
          })}
          <Button
            size="sm"
            variant="ghost"
            icon="heart"
            onClick={onLike}
            aria-pressed={isLiked}
            aria-label={`${isLiked ? "Unlike" : "Like"}${post.likes > 0 ? `, ${post.likes} likes` : ""}`}
            className={`ml-auto !px-2.5 ${isLiked ? "[&_svg]:fill-current" : ""}`}
          >
            {post.likes > 0 ? <span style={{ color: isLiked ? "var(--danger)" : undefined }}>{post.likes}</span> : null}
          </Button>
        </div>
      </div>
    </article>
  );
}
