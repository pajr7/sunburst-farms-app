"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { recommendVendor } from "@/lib/database";
import { VENDOR_CATEGORIES } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Field, TextInput, TextArea, ChoiceChips } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Primitives";

export default function RecommendVendorPage() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tried, setTried] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const errors = {
    name: !businessName.trim() ? "Enter the business name" : undefined,
    category: !category ? "Pick a category" : undefined,
    phone: phone.replace(/\D/g, "").length < 10 ? "Enter a phone number with area code" : undefined,
  };
  const valid = !errors.name && !errors.category && !errors.phone;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid || !user || loading) return;
    setError(null);
    setLoading(true);
    try {
      await recommendVendor(user.id, businessName.trim(), category!, phone.trim(), description.trim(), email.trim(), website.trim());
      setSubmitted(true);
    } catch {
      setError("Couldn't submit. Check your connection and try again.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <AuthGuard>
        <PageHeader title="Recommendation sent" back="/vendors" />
        <EmptyState icon="check-circle" title="Thanks for the recommendation" body="A board member will review it. Once approved, it appears under Local services with your name as the recommender." action={<Button href="/vendors">Back to Local services</Button>} />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-28 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Recommend a service" subtitle="Reviewed by the board before it's listed" back="/vendors" sticky={false} />
        <form onSubmit={handleSubmit} noValidate className="flex-1 px-4 md:px-6">
          <Field label="Business name" required error={tried ? errors.name : undefined}>
            {(id, by) => <TextInput id={id} describedBy={by} value={businessName} onChange={setBusinessName} placeholder="Desert Sun Landscaping" invalid={tried && !!errors.name} />}
          </Field>
          <div className="mb-4">
            <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>
              Category <span style={{ color: "var(--danger)" }} aria-hidden>*</span>
            </p>
            <ChoiceChips label="Category" value={category} onChange={setCategory} options={VENDOR_CATEGORIES.map((c) => ({ value: c.key, label: c.label }))} />
            {tried && errors.category && (
              <p role="alert" className="text-[14px] mt-1.5 font-medium" style={{ color: "var(--danger)" }}>{errors.category}</p>
            )}
          </div>
          <Field label="Phone" required error={tried ? errors.phone : undefined}>
            {(id, by) => <TextInput id={id} describedBy={by} type="tel" inputMode="tel" autoComplete="off" value={phone} onChange={setPhone} placeholder="(480) 555-1234" invalid={tried && !!errors.phone} />}
          </Field>
          <Field label="Why you recommend them" optional hint="What did they do for you? Would you hire them again?">
            {(id, by) => <TextArea id={id} describedBy={by} value={description} onChange={setDescription} rows={3} />}
          </Field>
          <Field label="Email" optional>
            {(id, by) => <TextInput id={id} describedBy={by} type="email" inputMode="email" value={email} onChange={setEmail} placeholder="hello@business.com" />}
          </Field>
          <Field label="Website" optional>
            {(id, by) => <TextInput id={id} describedBy={by} type="url" inputMode="url" value={website} onChange={setWebsite} placeholder="www.business.com" />}
          </Field>
          {error && (
            <div className="mb-4">
              <Notice tone="danger" icon="alert-triangle">{error}</Notice>
            </div>
          )}
          <Button type="submit" full size="lg" loading={loading}>
            {loading ? "Sending" : "Send recommendation"}
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
