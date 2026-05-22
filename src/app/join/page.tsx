"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function JoinPage() {
  const [step, setStep] = useState<"code" | "signup">("code");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [section, setSection] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  function handleProofSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!name || !email || !password || !address || !section) return;
    if (!proofFile) {
      setError("Please upload proof of residence");
      return;
    }
    setError(null);
    setLoading(true);

    let proofImageUrl: string | undefined;
    const ext = proofFile.name.split(".").pop();
    const path = `proof/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("post-images").upload(path, proofFile);
    if (uploadError) {
      setError("Failed to upload proof image. Try again.");
      setLoading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
    proofImageUrl = urlData.publicUrl;

    const { error } = await signUp(email, password, name, address, section, proofImageUrl);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen px-6 justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-10 animate-fade-up">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--navy)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          <h1 className="font-extrabold tracking-tight text-3xl mb-1" style={{ color: "var(--navy)" }}>
            Sunburst Farms
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Your neighborhood, connected
          </p>
        </div>

        {step === "code" ? (
          <div className="animate-fade-up animate-fade-up-delay-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
              Community Code
            </label>
            <input
              type="text"
              placeholder="Enter your invite code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3.5 rounded-xl text-center text-lg font-semibold tracking-widest outline-none mb-3"
              style={{
                background: "var(--card)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                letterSpacing: "0.15em",
              }}
              maxLength={8}
            />
            <p className="text-xs text-center mb-5" style={{ color: "var(--text-muted)" }}>
              Check your welcome packet or ask a neighbor
            </p>
            <button
              onClick={() => { if (code === "SBFE2026") setStep("signup"); else if (code.length >= 4) setError("Invalid code. Try again."); }}
              className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
              style={{
                background: code.length >= 4 ? "var(--navy)" : "var(--text-muted)",
                color: "var(--white)",
                opacity: code.length >= 4 ? 1 : 0.5,
              }}
            >
              Continue
            </button>
            {error && (
              <p className="text-sm mt-3 text-center" style={{ color: "var(--danger)" }}>{error}</p>
            )}
            <p className="text-center mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
              Already a member?{" "}
              <Link href="/login" className="font-semibold" style={{ color: "var(--navy)" }}>
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="animate-fade-up">
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="How neighbors will know you"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Street Address
              </label>
              <input
                type="text"
                placeholder="Your home address in SBFE"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Section
              </label>
              <div className="flex flex-wrap gap-2">
                {["Section 2", "Section 3", "Section 4", "Section 7"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSection(s)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: section === s ? "var(--navy)" : "var(--card)",
                      color: section === s ? "var(--white)" : "var(--text)",
                      border: section === s ? "none" : "1px solid var(--border)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Proof of residence */}
            <div className="mb-5">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--text-muted)" }}>
                Proof of Residence
              </label>
              <p className="text-[11px] mb-2.5" style={{ color: "var(--text-muted)" }}>
                Upload a photo of a utility bill, HOA statement, or property tax bill showing your name and SBFE address.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleProofSelect}
                className="hidden"
              />
              {proofPreview ? (
                <div className="relative">
                  <img
                    src={proofPreview}
                    alt="Proof preview"
                    className="w-full rounded-xl object-cover"
                    style={{ maxHeight: 200, border: "1px solid var(--border)" }}
                  />
                  <button
                    onClick={() => { setProofFile(null); setProofPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-4 rounded-xl flex flex-col items-center gap-1.5"
                  style={{ background: "var(--card)", border: "2px dashed var(--border)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
                    Tap to upload photo
                  </span>
                </button>
              )}
            </div>

            {error && (
              <p className="text-sm mb-3 text-center" style={{ color: "var(--danger)" }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
              style={{
                background: name && email && password && address && section ? "var(--navy)" : "var(--text-muted)",
                color: "var(--white)",
                opacity: name && email && password && address && section && !loading ? 1 : 0.5,
              }}
            >
              {loading ? "Creating account..." : "Join Sunburst Farms"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
