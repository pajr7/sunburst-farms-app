"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { COMMUNITY_NAME, SECTIONS } from "@/lib/data";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Field, TextInput, ChoiceChips } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Primitives";

export default function JoinPage() {
  const [step, setStep] = useState<"code" | "signup">("code");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [section, setSection] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  const errors = {
    name: !name.trim() ? "Enter your name" : undefined,
    email: !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email" : undefined,
    password: password.length < 6 ? "At least 6 characters" : undefined,
    address: !address.trim() ? "Enter your street address" : undefined,
    section: !section ? "Pick your section" : undefined,
    proof: !proofFile ? "Add a photo of a bill or statement" : undefined,
  };
  const valid = Object.values(errors).every((e) => !e);

  function handleProofSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function checkCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().toUpperCase() === "SBFE2026") {
      setError(null);
      setStep("signup");
    } else {
      setError("That code doesn't match. Check your welcome packet or ask a neighbor.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid || loading) return;
    setError(null);
    setLoading(true);

    const ext = proofFile!.name.split(".").pop();
    const path = `proof/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("post-images").upload(path, proofFile!);
    if (uploadError) {
      setError("The proof photo didn't upload. Try a smaller photo.");
      setLoading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);

    const { error } = await signUp(email.trim(), password, name.trim(), address.trim(), section!, urlData.publicUrl);
    setLoading(false);
    if (error) setError(error);
    else router.push("/");
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-5" style={{ background: "var(--bg)", paddingTop: "calc(env(safe-area-inset-top, 0px) + 32px)", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)" }}>
      <div className="max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <img src="/icon-192.png" alt="" className="w-16 h-16 rounded-full mx-auto mb-3" />
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
            {step === "code" ? COMMUNITY_NAME : "Request access"}
          </h1>
          <p className="text-[15px] mt-1" style={{ color: "var(--text-2)" }}>
            {step === "code" ? "A private app for residents" : "A board member verifies every request"}
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Notice tone="danger" icon="alert-triangle">{error}</Notice>
          </div>
        )}

        {step === "code" ? (
          <form onSubmit={checkCode} noValidate className="">
            <Field label="Community code" hint="It's in your welcome packet, or ask a neighbor who uses the app.">
              {(id, by) => <TextInput id={id} describedBy={by} value={code} onChange={(v) => setCode(v.toUpperCase())} placeholder="Enter code" autoComplete="off" autoFocus />}
            </Field>
            <Button type="submit" full size="lg" disabled={code.trim().length < 4}>
              Continue
            </Button>
            <p className="text-center mt-5 text-[15px]" style={{ color: "var(--text-2)" }}>
              Already a member?{" "}
              <Link href="/login" className="font-semibold" style={{ color: "var(--primary)" }}>
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="">
            <Field label="Your name" required hint="How neighbors will see you." error={tried ? errors.name : undefined}>
              {(id, by) => <TextInput id={id} describedBy={by} value={name} onChange={setName} autoComplete="name" invalid={tried && !!errors.name} />}
            </Field>
            <Field label="Email" required error={tried ? errors.email : undefined}>
              {(id, by) => <TextInput id={id} describedBy={by} type="email" inputMode="email" autoComplete="email" value={email} onChange={setEmail} invalid={tried && !!errors.email} />}
            </Field>
            <Field label="Password" required hint="At least 6 characters." error={tried ? errors.password : undefined}>
              {(id, by) => <TextInput id={id} describedBy={by} type="password" autoComplete="new-password" value={password} onChange={setPassword} invalid={tried && !!errors.password} />}
            </Field>
            <Field label="Street address" required hint="Hidden from neighbors unless you choose to share it." error={tried ? errors.address : undefined}>
              {(id, by) => <TextInput id={id} describedBy={by} value={address} onChange={setAddress} autoComplete="street-address" invalid={tried && !!errors.address} />}
            </Field>
            <div className="mb-4">
              <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
                Section <span style={{ color: "var(--danger)" }} aria-hidden>*</span>
              </p>
              <ChoiceChips label="Section" value={section} onChange={setSection} options={SECTIONS.map((s) => ({ value: s, label: s }))} />
              {tried && errors.section && <p role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>{errors.section}</p>}
            </div>

            <div className="mb-5">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>
                Proof of residence <span style={{ color: "var(--danger)" }} aria-hidden>*</span>
              </p>
              <p className="text-[14px] mb-2 leading-snug" style={{ color: "var(--text-2)" }}>
                A photo of a utility bill, HOA statement, or tax bill showing your name and address. Only board admins see it. It is never shown to neighbors.
              </p>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleProofSelect} className="sr-only" id="proof" />
              {proofPreview ? (
                <div className="relative">
                  <img src={proofPreview} alt="Proof preview" className="w-full rounded-xl object-cover" style={{ maxHeight: 200, border: "1px solid var(--border)" }} />
                  <button type="button" onClick={() => { setProofFile(null); setProofPreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--text)", color: "white" }} aria-label="Remove photo">
                    <Icon name="x" size={18} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <label htmlFor="proof" className="flex items-center gap-3 px-4 h-14 rounded-xl cursor-pointer" style={{ background: "var(--surface)", border: `1.5px dashed ${tried && errors.proof ? "var(--danger)" : "var(--border-strong)"}`, color: "var(--text-2)" }}>
                  <Icon name="image" size={22} />
                  <span className="text-[15px] font-semibold">Take or upload a photo</span>
                </label>
              )}
              {tried && errors.proof && <p role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>{errors.proof}</p>}
            </div>

            <Button type="submit" full size="lg" loading={loading}>
              {loading ? "Sending request" : "Request access"}
            </Button>
            <p className="text-[13px] text-center mt-3 leading-snug" style={{ color: "var(--text-3)" }}>
              You'll be able to sign in right away, and see the community once a board member approves you.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
