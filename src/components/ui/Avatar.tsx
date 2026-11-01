"use client";

import { useState } from "react";

export default function Avatar({
  initials,
  src,
  size = 40,
  tone = "soft",
  className = "",
}: {
  initials: string;
  /** Optional photo; falls back to initials if missing or it fails to load */
  src?: string | null;
  size?: number;
  tone?: "soft" | "solid";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const solid = tone === "solid";

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size, background: "var(--surface-2)" }}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.round(size * 0.36)),
        background: solid ? "var(--primary)" : "var(--primary-soft)",
        color: solid ? "var(--text-on-primary)" : "var(--primary-soft-text)",
        letterSpacing: "0.02em",
      }}
      aria-hidden
    >
      {(initials || "?").slice(0, 2).toUpperCase()}
    </span>
  );
}
