"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="flex flex-col min-h-[100dvh] px-6 justify-center"
      style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-10 animate-fade-up">
          <img
            src="/icon-192.png"
            alt="Sunburst Farms East"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h1 className="font-extrabold tracking-tight text-3xl mb-1" style={{ color: "var(--navy)" }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Sign in to Sunburst Farms
          </p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-up animate-fade-up-delay-1">
          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              required
            />
          </div>

          {error && (
            <p className="text-sm mb-4 text-center" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
            style={{
              background: "var(--navy)",
              color: "var(--white)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
            New to the neighborhood?{" "}
            <Link href="/join" className="font-semibold" style={{ color: "var(--navy)" }}>
              Join here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
