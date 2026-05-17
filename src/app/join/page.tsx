"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"code" | "name">("code");
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const router = useRouter();

  return (
    <div
      className="flex flex-col min-h-screen px-6 justify-center"
      style={{ background: "var(--warm-sand)" }}
    >
      <div className="max-w-sm mx-auto w-full">
        {/* Logo area */}
        <div className="text-center mb-10 animate-fade-up">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--sunburst)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          <h1 className="font-display text-3xl mb-1" style={{ color: "var(--charcoal)" }}>
            Sunburst Farms
          </h1>
          <p className="text-sm" style={{ color: "var(--stone)" }}>
            Your neighborhood, connected
          </p>
        </div>

        {step === "code" ? (
          <div className="animate-fade-up animate-fade-up-delay-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
              Community Code
            </label>
            <input
              type="text"
              placeholder="Enter your invite code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3.5 rounded-xl text-center text-lg font-semibold tracking-widest outline-none mb-3"
              style={{
                background: "var(--cream-wash)",
                color: "var(--charcoal)",
                letterSpacing: "0.15em",
              }}
              maxLength={8}
            />
            <p className="text-xs text-center mb-5" style={{ color: "var(--stone)" }}>
              Check your welcome packet or ask a neighbor
            </p>
            <button
              onClick={() => { if (code.length >= 4) setStep("name"); }}
              className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
              style={{
                background: code.length >= 4 ? "var(--sunburst)" : "var(--stone)",
                color: "var(--charcoal)",
                opacity: code.length >= 4 ? 1 : 0.5,
              }}
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="animate-fade-up">
            <div className="mb-4">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="How neighbors will know you"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none"
                style={{ background: "var(--cream-wash)", color: "var(--charcoal)" }}
              />
            </div>
            <div className="mb-6">
              <label className="text-[11px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "var(--stone)" }}>
                Section
              </label>
              <div className="flex flex-wrap gap-2">
                {["Section 2", "Section 3", "Section 4", "Section 7"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSection(s)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: section === s ? "var(--charcoal)" : "var(--cream-wash)",
                      color: section === s ? "var(--cream-wash)" : "var(--charcoal)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { if (name && section) router.push("/"); }}
              className="w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider"
              style={{
                background: name && section ? "var(--sunburst)" : "var(--stone)",
                color: "var(--charcoal)",
                opacity: name && section ? 1 : 0.5,
              }}
            >
              Join Sunburst Farms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
