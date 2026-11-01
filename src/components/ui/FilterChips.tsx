"use client";

/**
 * Filters, not navigation: small bordered toggles, text only, green when
 * selected. Scrolls horizontally when there are too many for one row, but
 * is visually distinct from the tab bar so the two are never confused.
 */
export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

export default function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
  wrap = false,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  /** Accessible group name, e.g. "Filter posts" */
  label: string;
  wrap?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={
        wrap
          ? "flex flex-wrap gap-2"
          : "flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 py-0.5"
      }
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className="shrink-0 px-3.5 h-9 rounded-lg text-[14px] font-semibold whitespace-nowrap transition-colors"
            style={{
              background: active ? "var(--primary)" : "var(--surface)",
              color: active ? "var(--text-on-primary)" : "var(--text-2)",
              border: `1px solid ${active ? "var(--primary)" : "var(--border-strong)"}`,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
