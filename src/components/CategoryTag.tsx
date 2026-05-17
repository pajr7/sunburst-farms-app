"use client";

import { Category, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/data";

const categoryStyles: Record<Category, { bg: string; color: string }> = {
  produce: { bg: "var(--cat-produce-bg)", color: "var(--cat-produce-text)" },
  eggs: { bg: "var(--cat-eggs-bg)", color: "var(--cat-eggs-text)" },
  flowers: { bg: "var(--cat-flowers-bg)", color: "var(--cat-flowers-text)" },
  seeds: { bg: "var(--cat-seeds-bg)", color: "var(--cat-seeds-text)" },
  tools: { bg: "var(--cat-tools-bg)", color: "var(--cat-tools-text)" },
  events: { bg: "var(--cat-events-bg)", color: "var(--cat-events-text)" },
  general: { bg: "var(--cat-general-bg)", color: "var(--cat-general-text)" },
};

export default function CategoryTag({
  category,
  size = "sm",
}: {
  category: Category;
  size?: "sm" | "md";
}) {
  const style = categoryStyles[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider ${
        size === "sm" ? "text-[10px] px-2.5 py-0.5" : "text-[11px] px-3 py-1"
      }`}
      style={{ background: style.bg, color: style.color }}
    >
      <span>{CATEGORY_EMOJI[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
