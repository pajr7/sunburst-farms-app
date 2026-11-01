"use client";

import { useState } from "react";

/**
 * Outlet logo with an initials fallback if the icon can't load.
 * With `bg`, the image is a wordmark drawn inside a colored tile.
 * With `crop`, only the left fraction of a wide wordmark is shown, so the
 * recognizable part (a station number, say) fills the tile.
 */
export default function SourceLogo({
  src,
  name,
  size = 28,
  rounded = 8,
  bg,
  crop,
}: {
  src?: string;
  name: string;
  size?: number;
  rounded?: number;
  bg?: string;
  crop?: number;
}) {
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

  if (bg) {
    const pad = Math.max(2, Math.round(size * 0.12));
    const inner = size - pad * 2;
    return (
      <span className="inline-flex items-center justify-center shrink-0 overflow-hidden" style={{ width: size, height: size, borderRadius: rounded, background: bg, padding: pad }} aria-hidden>
        {crop ? (
          <span className="flex items-center overflow-hidden" style={{ width: inner, height: inner }}>
            <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} style={{ width: inner / crop, maxWidth: "none", height: "auto" }} />
          </span>
        ) : (
          <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="max-w-full max-h-full object-contain" />
        )}
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
