"use client";

import Link from "next/link";
import Icon, { type IconName } from "./Icon";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
      <span
        className="w-7 h-7 rounded-full animate-spin"
        style={{ border: "2.5px solid var(--border)", borderTopColor: "var(--primary)" }}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: "var(--surface-2)", fg: "var(--text-2)" },
  success: { bg: "var(--success-soft)", fg: "var(--primary-soft-text)" },
  warning: { bg: "var(--warning-soft)", fg: "var(--warning)" },
  danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  info: { bg: "var(--info-soft)", fg: "var(--info)" },
};

/** Status is communicated by text, never color alone. */
export function StatusBadge({ tone = "neutral", icon, children }: { tone?: Tone; icon?: IconName; children: React.ReactNode }) {
  const t = TONES[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 h-6 rounded-md text-[13px] font-semibold whitespace-nowrap"
      style={{ background: t.bg, color: t.fg }}
    >
      {icon && <Icon name={icon} size={13} strokeWidth={2.2} />}
      {children}
    </span>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-2.5 mt-6 first:mt-0">
      <h2 className="text-[17px] font-bold leading-tight" style={{ color: "var(--text)" }}>
        {children}
      </h2>
      {action}
    </div>
  );
}

/** White panel with a 1px border. The only container we use. */
export function Panel({ children, className = "", padded = false }: { children: React.ReactNode; className?: string; padded?: boolean }) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${padded ? "p-4" : ""} ${className}`}
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

/** Row inside a Panel list: icon, title, optional description, chevron. */
export function ListRow({
  href,
  onClick,
  icon,
  iconTone = "neutral",
  title,
  description,
  trailing,
  external,
}: {
  href?: string;
  onClick?: () => void;
  icon?: IconName;
  iconTone?: Tone;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  external?: boolean;
}) {
  const t = TONES[iconTone];
  const inner = (
    <>
      {icon && (
        <span
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: t.bg, color: iconTone === "neutral" ? "var(--text-2)" : t.fg }}
        >
          <Icon name={icon} size={20} />
        </span>
      )}
      <span className="flex-1 min-w-0 text-left">
        <span className="block text-[16px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
          {title}
        </span>
        {description && (
          <span className="block text-[14px] leading-snug mt-0.5" style={{ color: "var(--text-2)" }}>
            {description}
          </span>
        )}
      </span>
      {trailing ?? (
        (href || onClick) && (
          <Icon name={external ? "external-link" : "chevron-right"} size={18} color="var(--text-3)" className="shrink-0" />
        )
      )}
    </>
  );
  const cls = "ui-row flex items-center gap-3.5 px-4 py-3.5 min-h-[56px] w-full transition-colors active:bg-[var(--surface-2)]";

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  }
  return (
    <div className={cls}>
      {inner}
    </div>
  );
}

/** Inline message for errors, confirmations, and official notes. */
export function Notice({ tone = "info", icon, title, children, action }: { tone?: Tone; icon?: IconName; title?: string; children?: React.ReactNode; action?: React.ReactNode }) {
  const t = TONES[tone];
  const role = tone === "danger" ? "alert" : "status";
  return (
    <div role={role} className="flex gap-3 p-3.5 rounded-xl" style={{ background: t.bg, border: `1px solid ${t.fg}22` }}>
      {icon && (
        <span className="shrink-0 mt-0.5" style={{ color: t.fg }}>
          <Icon name={icon} size={20} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-[15px] font-bold leading-snug" style={{ color: t.fg }}>
            {title}
          </p>
        )}
        {children && (
          <div className="text-[14px] leading-relaxed mt-0.5" style={{ color: "var(--text)" }}>
            {children}
          </div>
        )}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
    </div>
  );
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function formatTime12(t: string): string {
  // "18:30" -> "6:30 PM"; passes through anything already formatted
  if (!t || /[ap]\.?m\.?/i.test(t)) return t;
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return t;
  const h = parseInt(m[1], 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m[2]} ${suffix}`;
}
