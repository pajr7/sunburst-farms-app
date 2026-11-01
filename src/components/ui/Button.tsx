"use client";

import Link from "next/link";
import Icon, { type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  href?: string;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
  title?: string;
}

const SIZES: Record<Size, { h: number; px: number; text: number; icon: number }> = {
  sm: { h: 36, px: 12, text: 14, icon: 16 },
  md: { h: 44, px: 16, text: 15, icon: 18 },
  lg: { h: 50, px: 20, text: 16, icon: 20 },
};

function styles(variant: Variant): React.CSSProperties {
  switch (variant) {
    case "primary":
      return { background: "var(--primary)", color: "var(--text-on-primary)", border: "1px solid var(--primary)" };
    case "secondary":
      return { background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border-strong)" };
    case "soft":
      return { background: "var(--primary-soft)", color: "var(--primary-soft-text)", border: "1px solid transparent" };
    case "danger":
      return { background: "var(--surface)", color: "var(--danger)", border: "1px solid var(--border-strong)" };
    case "ghost":
    default:
      return { background: "transparent", color: "var(--text-2)", border: "1px solid transparent" };
  }
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  full,
  href,
  icon,
  iconRight,
  loading,
  disabled,
  type = "button",
  onClick,
  className = "",
  title,
  ...aria
}: ButtonProps) {
  const s = SIZES[size];
  const iconOnly = !children && (icon || iconRight);
  const style: React.CSSProperties = {
    ...styles(variant),
    height: s.h,
    minWidth: iconOnly ? s.h : undefined,
    paddingLeft: iconOnly ? 0 : s.px,
    paddingRight: iconOnly ? 0 : s.px,
    fontSize: s.text,
    borderRadius: "var(--r-sm)",
    opacity: disabled || loading ? 0.55 : 1,
    width: full ? "100%" : undefined,
  };
  const cls = `inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none transition-[background,opacity,transform] active:scale-[0.98] ${className}`;

  const content = (
    <>
      {loading ? (
        <span
          className="inline-block rounded-full animate-spin"
          style={{ width: s.icon, height: s.icon, border: "2px solid currentColor", borderTopColor: "transparent" }}
          aria-hidden
        />
      ) : (
        icon && <Icon name={icon} size={s.icon} />
      )}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={s.icon} />}
    </>
  );

  if (href && !disabled) {
    const internal = href.startsWith("/") || href.startsWith("#");
    if (!internal) {
      const external = /^https?:/i.test(href);
      return (
        <a href={href} className={cls} style={style} onClick={onClick} title={title} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...aria}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={style} onClick={onClick} title={title} {...aria}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      style={style}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      title={title}
      {...aria}
    >
      {content}
    </button>
  );
}
