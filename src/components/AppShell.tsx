"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon, { type IconName } from "./ui/Icon";
import Avatar from "./ui/Avatar";
import { useAuth } from "@/lib/auth-context";
import { getUnreadCounts } from "@/lib/database";
import { COMMUNITY_NAME } from "@/lib/data";

interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  /** Other route prefixes that count as "inside" this destination */
  matches?: string[];
}

export const COMMUNITY_ROUTES = ["/community", "/events", "/irrigation", "/vendors", "/info", "/dues", "/realestate", "/news", "/admin"];

const NAV: NavItem[] = [
  { label: "Home", href: "/", icon: "home", matches: ["/posts", "/post", "/new"] },
  { label: "Marketplace", href: "/market", icon: "store" },
  { label: "Messages", href: "/messages", icon: "message-circle" },
  { label: "Community", href: "/community", icon: "users", matches: COMMUNITY_ROUTES },
];

const COMMUNITY_LINKS: NavItem[] = [
  { label: "Events", href: "/events", icon: "calendar" },
  { label: "Irrigation", href: "/irrigation", icon: "droplet" },
  { label: "Local services", href: "/vendors", icon: "wrench" },
  { label: "Association", href: "/info", icon: "building" },
  { label: "Dues", href: "/dues", icon: "credit-card" },
  { label: "Real estate", href: "/realestate", icon: "home" },
  { label: "Local news", href: "/news", icon: "newspaper" },
];

function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/" || (item.matches ?? []).some((m) => pathname.startsWith(m));
  return pathname.startsWith(item.href) || (item.matches ?? []).some((m) => pathname.startsWith(m));
}

function useUnread() {
  const { user } = useAuth();
  const [unread, setUnread] = useState({ messages: 0, notifications: 0 });
  const pathname = usePathname();
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = () => getUnreadCounts(user.id).then((c) => !cancelled && setUnread(c)).catch(() => {});
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [user, pathname]);
  return unread;
}

export function useUnreadCounts() {
  return useUnread();
}

function SideNav({ unread }: { unread: { messages: number; notifications: number } }) {
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <nav
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-50"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
      aria-label="Main"
    >
      <div className="px-5 pt-7 pb-5">
        <Link href="/" className="block">
          <span className="block text-[17px] font-bold tracking-tight leading-tight" style={{ color: "var(--text)" }}>
            {COMMUNITY_NAME}
          </span>
          <span className="block text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>
            Phoenix, AZ
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-0.5 px-3">
        {NAV.map((item) => (
          <SideLink key={item.href} item={item} active={isActive(item, pathname)} badge={item.href === "/messages" ? unread.messages : 0} />
        ))}
      </div>

      <p className="px-6 mt-6 mb-1.5 text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
        Community
      </p>
      <div className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
        {COMMUNITY_LINKS.map((item) => (
          <SideLink key={item.href} item={item} active={pathname.startsWith(item.href)} small />
        ))}
        {profile?.role === "admin" && (
          <SideLink item={{ label: "Board tools", href: "/admin", icon: "shield" }} active={pathname.startsWith("/admin")} small />
        )}
      </div>

      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-1">
          <Link
            href="/profile"
            className="flex-1 flex items-center gap-3 px-2 py-2 rounded-lg min-w-0"
            style={{ background: pathname.startsWith("/profile") ? "var(--surface-2)" : "transparent" }}
          >
            <Avatar initials={profile?.avatar_initials ?? "?"} size={36} />
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold truncate" style={{ color: "var(--text)" }}>
                {profile?.name ?? "Your account"}
              </span>
              <span className="block text-[12px] truncate" style={{ color: "var(--text-3)" }}>
                {profile?.section ?? "Account"}
              </span>
            </span>
          </Link>
          <Link
            href="/notifications"
            className="relative w-11 h-11 flex items-center justify-center rounded-lg shrink-0"
            style={{ color: "var(--text-2)" }}
            aria-label={unread.notifications ? `Notifications, ${unread.notifications} unread` : "Notifications"}
          >
            <Icon name="bell" size={22} />
            {unread.notifications > 0 && <Dot />}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Dot() {
  return (
    <span
      className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
      style={{ background: "var(--danger)", boxShadow: "0 0 0 2px var(--surface)" }}
      aria-hidden
    />
  );
}

function SideLink({ item, active, small, badge = 0 }: { item: NavItem; active: boolean; small?: boolean; badge?: number }) {
  const color = active ? "var(--primary)" : "var(--text-2)";
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 rounded-lg transition-colors ${small ? "h-10" : "h-11"}`}
      style={{ background: active ? "var(--primary-soft)" : "transparent" }}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={item.icon} size={small ? 18 : 21} color={color} strokeWidth={active ? 2.1 : 1.75} />
      <span className={`${small ? "text-[14px]" : "text-[15px]"} flex-1`} style={{ color: active ? "var(--primary-soft-text)" : "var(--text)", fontWeight: active ? 700 : 500 }}>
        {item.label}
      </span>
      {badge > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[12px] font-bold flex items-center justify-center" style={{ background: "var(--danger)", color: "white" }}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

const NOTCH_RADIUS = 36; // cutout around the floating button
const FAB_SIZE = 58;

/**
 * Floating tab bar: white, rounded top corners, a notch at the center with a
 * raised green "+" that opens Share. Icons only, with accessible names.
 */
function MobileTabBar({ unread }: { unread: { messages: number } }) {
  const pathname = usePathname();
  const left = NAV.slice(0, 2);
  const right = NAV.slice(2);

  const tab = (item: NavItem) => {
    const active = isActive(item, pathname);
    const color = active ? "var(--primary)" : "var(--text-2)";
    const label = item.href === "/messages" && unread.messages ? `${item.label}, ${unread.messages} unread` : item.label;
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex-1 flex items-center justify-center relative"
        style={{ minHeight: 60 }}
        aria-current={active ? "page" : undefined}
        aria-label={label}
        title={item.label}
      >
        <span className="relative">
          <Icon name={item.icon} size={27} color={color} strokeWidth={active ? 2.2 : 1.7} />
          {item.href === "/messages" && unread.messages > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: "var(--danger)", boxShadow: "0 0 0 2px var(--surface)" }} aria-hidden />
          )}
        </span>
      </Link>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" aria-label="Main" style={{ pointerEvents: "none" }}>
      {/* Raised compose button, half above the bar */}
      <Link
        href="/post"
        aria-label="Share with neighbors"
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        style={{
          top: -FAB_SIZE / 2 + 4,
          width: FAB_SIZE,
          height: FAB_SIZE,
          background: "var(--primary)",
          color: "var(--text-on-primary)",
          boxShadow: "0 6px 18px oklch(0.42 0.1 160 / 0.35)",
          pointerEvents: "auto",
        }}
      >
        <Icon name="plus" size={28} strokeWidth={2.4} />
      </Link>

      <div
        className="flex items-stretch pb-[env(safe-area-inset-bottom,0px)]"
        style={{
          pointerEvents: "auto",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -6px 24px oklch(0 0 0 / 0.08)",
          // White bar with a circular notch cut out of the top center
          background: `radial-gradient(circle ${NOTCH_RADIUS}px at 50% 4px, transparent ${NOTCH_RADIUS - 1}px, var(--surface) ${NOTCH_RADIUS}px)`,
        }}
      >
        {left.map(tab)}
        <span aria-hidden style={{ width: FAB_SIZE + 24 }} />
        {right.map(tab)}
      </div>
    </nav>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === "/join" || pathname === "/login";
  const unread = useUnread();

  if (hideNav) return <>{children}</>;

  return (
    <>
      <SideNav unread={unread} />
      <div className="md:ml-64 min-h-screen">
        <div className="mx-auto w-full max-w-[640px] lg:max-w-[760px]">{children}</div>
      </div>
      <MobileTabBar unread={unread} />
    </>
  );
}
