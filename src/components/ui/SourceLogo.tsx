"use client";

import { useState } from "react";

/** Outlet logo with an initials fallback if the icon can't load. */
export default function SourceLogo({ src, name, size = 28, rounded = 8 }: { src?: string; name: string; size?: number; rounded?: number }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!src || failed) {
    return (
      <span
        className="inline-flex items-center justify-center font-bold shrink-0"
        style={{ width: size, height: size, borderRadius: rounded, background: "var(--surface-2)", color: "var(--text-2)", fontSize: Math.max(10, size * 0.36) }}
        aria-hidden
      >
        {initials}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="shrink-0 object-cover"
      style={{ width: size, height: size, borderRadius: rounded, background: "var(--surface)", border: "1px solid var(--border)" }}
      aria-hidden
    />
  );
}
