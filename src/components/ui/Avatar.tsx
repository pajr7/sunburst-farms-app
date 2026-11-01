export default function Avatar({
  initials,
  size = 40,
  tone = "soft",
  className = "",
}: {
  initials: string;
  size?: number;
  tone?: "soft" | "solid";
  className?: string;
}) {
  const solid = tone === "solid";
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
