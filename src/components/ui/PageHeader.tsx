"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "./Icon";

/**
 * Standard page header: safe-area aware, optional back control, title at
 * reading size, optional right-side actions, optional second row (filters,
 * search) rendered as children.
 */
export default function PageHeader({
  title,
  subtitle,
  back,
  actions,
  children,
  sticky = true,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  /** true = router.back(); string = link target */
  back?: boolean | string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  sticky?: boolean;
  eyebrow?: string;
}) {
  const router = useRouter();

  const backControl =
    back === undefined ? null : typeof back === "string" ? (
      <Link
        href={back}
        className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg shrink-0"
        style={{ color: "var(--text)" }}
        aria-label="Back"
      >
        <Icon name="chevron-left" size={24} />
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => router.back()}
        className="w-11 h-11 -ml-2 flex items-center justify-center rounded-lg shrink-0"
        style={{ color: "var(--text)" }}
        aria-label="Back"
      >
        <Icon name="chevron-left" size={24} />
      </button>
    );

  return (
    <header
      className={`${sticky ? "sticky top-0 z-40" : ""} px-4 md:px-6 pt-[calc(env(safe-area-inset-top,0px)_+_20px)] md:pt-7 pb-2`}
      style={{ background: "var(--bg)" }}
    >
      <div className="flex items-center gap-2 min-h-[44px]">
        {backControl}
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="text-[13px] font-semibold leading-tight mb-0.5" style={{ color: "var(--text-3)" }}>
              {eyebrow}
            </p>
          )}
          <h1 className="text-[24px] font-bold tracking-tight leading-tight" style={{ color: "var(--text)" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14px] leading-snug mt-0.5" style={{ color: "var(--text-2)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </header>
  );
}
