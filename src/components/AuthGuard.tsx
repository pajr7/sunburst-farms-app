"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }} role="status" aria-live="polite">
        <span className="w-8 h-8 rounded-full animate-spin" style={{ border: "3px solid var(--border)", borderTopColor: "var(--primary)" }} aria-hidden />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!user) return null;

  if (profile?.status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <EmptyState
          icon="clock"
          title="Your request is being reviewed"
          body="A board member checks every request against the proof of residence you sent. You'll get a notification once you're approved, usually within a day or two."
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Button onClick={() => window.location.reload()} icon="refresh">Check again</Button>
              <Button variant="ghost" onClick={() => signOut().then(() => router.push("/login"))}>Sign out</Button>
            </div>
          }
        />
      </div>
    );
  }

  if (profile?.status === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <EmptyState
          icon="lock"
          title="Access not approved"
          body="The board couldn't verify this request. If you live in Sunburst Farms East and think this is a mistake, contact the board."
          action={
            <div className="flex gap-2 flex-wrap justify-center">
              <Button href="https://sbfehome.com/?page_id=4" iconRight="external-link">Contact the board</Button>
              <Button variant="ghost" onClick={() => signOut().then(() => router.push("/login"))}>Sign out</Button>
            </div>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
