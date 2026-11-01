"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { COMMUNITY_NAME } from "@/lib/data";
import Button from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Primitives";

type Mode = "signin" | "forgot" | "reset";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // Supabase sends a recovery link that lands here with a recovery session
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) setError(error.toLowerCase().includes("invalid") ? "That email and password don't match. Try again or reset your password." : error);
    else router.push("/");
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/login` });
    setLoading(false);
    if (error) setError(error.message);
    else setInfo(`If an account exists for ${email.trim()}, a reset link is on its way. Open it on this device.`);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/");
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 justify-center" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="max-w-sm mx-auto w-full py-8">
        <div className="text-center mb-8">
          <img src="/icon-192.png" alt="" className="w-20 h-20 rounded-full mx-auto mb-4" style={{ boxShadow: "var(--shadow-sm)" }} />
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
            {mode === "reset" ? "Set a new password" : mode === "forgot" ? "Reset your password" : COMMUNITY_NAME}
          </h1>
          <p className="text-[15px] mt-1" style={{ color: "var(--text-2)" }}>
            {mode === "reset" ? "Choose a password you'll remember." : mode === "forgot" ? "We'll email you a link to set a new one." : "Sign in to your neighborhood"}
          </p>
        </div>

        {info && (
          <div className="mb-4">
            <Notice tone="success" icon="mail">{info}</Notice>
          </div>
        )}
        {error && (
          <div className="mb-4">
            <Notice tone="danger" icon="alert-triangle">{error}</Notice>
          </div>
        )}

        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="" noValidate>
            <Field label="Email">
              {(id, by) => <TextInput id={id} describedBy={by} type="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@email.com" />}
            </Field>
            <Field label="Password">
              {(id, by) => <TextInput id={id} describedBy={by} type="password" autoComplete="current-password" value={password} onChange={setPassword} placeholder="Your password" />}
            </Field>
            <Button type="submit" full size="lg" loading={loading} disabled={!email || !password}>
              Sign in
            </Button>
            <div className="flex flex-col items-center gap-3 mt-5 text-[15px]">
              <button type="button" onClick={() => { setMode("forgot"); setError(null); }} className="font-semibold" style={{ color: "var(--primary)" }}>
                Forgot your password?
              </button>
              <p style={{ color: "var(--text-2)" }}>
                New to the neighborhood?{" "}
                <Link href="/join" className="font-semibold" style={{ color: "var(--primary)" }}>
                  Request access
                </Link>
              </p>
            </div>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} noValidate>
            <Field label="Email">
              {(id, by) => <TextInput id={id} describedBy={by} type="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} placeholder="you@email.com" autoFocus />}
            </Field>
            <Button type="submit" full size="lg" loading={loading} disabled={!email}>
              Email me a reset link
            </Button>
            <div className="text-center mt-5">
              <button type="button" onClick={() => { setMode("signin"); setInfo(null); setError(null); }} className="text-[15px] font-semibold" style={{ color: "var(--primary)" }}>
                Back to sign in
              </button>
            </div>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleReset} noValidate>
            <Field label="New password" hint="At least 6 characters.">
              {(id, by) => <TextInput id={id} describedBy={by} type="password" autoComplete="new-password" value={newPassword} onChange={setNewPassword} autoFocus />}
            </Field>
            <Button type="submit" full size="lg" loading={loading} disabled={!newPassword}>
              Save password and sign in
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
