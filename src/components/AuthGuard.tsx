"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (profile?.status === "pending") return;
    if (profile?.status === "denied") return;
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: "var(--warm-sand)" }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
          style={{ background: "var(--sunburst)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (profile?.status === "pending") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6" style={{ background: "var(--warm-sand)" }}>
        <div className="text-center max-w-sm animate-fade-up">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: "var(--sunburst)" }}
          >
            <span className="text-3xl">&#9203;</span>
          </div>
          <h1 className="font-display text-2xl mb-2" style={{ color: "var(--charcoal)" }}>
            Hang tight, neighbor
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--stone)" }}>
            Your account is being reviewed by a community admin. You'll get a notification once you're approved.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full font-semibold text-sm"
            style={{ background: "var(--cream-wash)", color: "var(--charcoal)" }}
          >
            Check again
          </button>
        </div>
      </div>
    );
  }

  if (profile?.status === "denied") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6" style={{ background: "var(--warm-sand)" }}>
        <div className="text-center max-w-sm animate-fade-up">
          <h1 className="font-display text-2xl mb-2" style={{ color: "var(--charcoal)" }}>
            Access not approved
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--stone)" }}>
            Your request to join Sunburst Farms was not approved. If you think this is a mistake, reach out to a community admin.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
