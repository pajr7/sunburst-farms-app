"use client";

import { Suspense } from "react";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPendingProfiles,
  approveProfile,
  denyProfile,
  getPendingVendors,
  approveVendor,
  denyVendor,
  publishIrrigationUpdate,
  notifyAllApproved,
  getLatestIrrigation,
  type IrrigationStatus,
  type IrrigationUpdate,
} from "@/lib/database";
import { vendorCategoryLabel } from "@/lib/data";
import { IRRIGATION_STATUS_LABEL, IRRIGATION_STATUS_HELP, irrigationSummary } from "@/lib/irrigation";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import FilterChips from "@/components/ui/FilterChips";
import EmptyState from "@/components/ui/EmptyState";
import { Field, TextInput, TextArea, ChoiceChips } from "@/components/ui/Field";
import { Panel, Spinner, Notice, StatusBadge, SectionTitle, timeAgo } from "@/components/ui/Primitives";

type Tab = "members" | "vendors" | "irrigation";

interface PendingProfile {
  id: string;
  name: string;
  address: string;
  section: string;
  avatar_initials: string;
  created_at: string;
  proof_image_url: string | null;
}

function AdminPageInner() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const [tab, setTab] = useState<Tab>((search.get("tab") as Tab) || "members");
  const [pending, setPending] = useState<PendingProfile[]>([]);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [viewingProof, setViewingProof] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!profile || profile.role !== "admin") {
      router.replace("/");
      return;
    }
    Promise.all([getPendingProfiles(), getPendingVendors()])
      .then(([m, v]) => {
        setPending(m ?? []);
        setPendingVendors(v ?? []);
      })
      .catch(() => setError("Couldn't load pending items."))
      .finally(() => setLoading(false));
  }, [profile, authLoading, router]);

  useEffect(() => {
    if (!viewingProof) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setViewingProof(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewingProof]);

  async function act(id: string, fn: () => Promise<void>, remove: () => void) {
    setActioning(id);
    setError(null);
    try {
      await fn();
      remove();
    } catch {
      setError("That didn't save. Try again.");
    }
    setActioning(null);
  }

  if (authLoading || loading) {
    return (
      <>
        <PageHeader title="Board tools" back="/community" />
        <Spinner />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
      <PageHeader title="Board tools" subtitle="Only board admins can see this" back="/community">
        <FilterChips
          label="Board section"
          value={tab}
          onChange={setTab}
          options={[
            { value: "members", label: `Members${pending.length ? ` (${pending.length})` : ""}` },
            { value: "vendors", label: `Services${pendingVendors.length ? ` (${pendingVendors.length})` : ""}` },
            { value: "irrigation", label: "Irrigation" },
          ]}
        />
      </PageHeader>

      <main className="flex-1 px-4 md:px-6">
        {error && (
          <div className="mb-3">
            <Notice tone="danger" icon="alert-triangle">{error}</Notice>
          </div>
        )}

        {tab === "members" &&
          (pending.length === 0 ? (
            <EmptyState icon="check-circle" title="No pending sign-ups" body="New residents who request access will appear here with their proof of residence." />
          ) : (
            <ul className="flex flex-col gap-3">
              {pending.map((p) => (
                <li key={p.id} className="list-none">
                  <Panel padded>
                    <div className="flex items-center gap-3">
                      <Avatar initials={p.avatar_initials} src={(p as any).avatar_url} size={44} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>{p.name}</p>
                        <p className="text-[14px]" style={{ color: "var(--text-2)" }}>{p.section} &middot; {p.address}</p>
                        <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Requested {timeAgo(p.created_at)}</p>
                      </div>
                    </div>
                    {p.proof_image_url ? (
                      <button type="button" onClick={() => setViewingProof(p.proof_image_url)} className="w-full mt-3 rounded-lg overflow-hidden text-left" style={{ border: "1px solid var(--border)" }}>
                        <img src={p.proof_image_url} alt="Proof of residence" className="w-full object-cover" style={{ maxHeight: 160 }} />
                        <span className="flex items-center gap-1.5 px-3 py-2 text-[14px] font-semibold" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                          <Icon name="eye" size={16} /> View proof of residence
                        </span>
                      </button>
                    ) : (
                      <div className="mt-3">
                        <Notice tone="warning" icon="alert-triangle">No proof of residence was uploaded.</Notice>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button className="flex-1" onClick={() => act(p.id, () => approveProfile(p.id), () => setPending((l) => l.filter((x) => x.id !== p.id)))} loading={actioning === p.id}>
                        Approve
                      </Button>
                      <Button className="flex-1" variant="danger" onClick={() => act(p.id, () => denyProfile(p.id), () => setPending((l) => l.filter((x) => x.id !== p.id)))} disabled={actioning === p.id}>
                        Deny
                      </Button>
                    </div>
                  </Panel>
                </li>
              ))}
            </ul>
          ))}

        {tab === "vendors" &&
          (pendingVendors.length === 0 ? (
            <EmptyState icon="check-circle" title="No pending recommendations" body="Services recommended by residents show up here for review." />
          ) : (
            <ul className="flex flex-col gap-3">
              {pendingVendors.map((v) => (
                <li key={v.id} className="list-none">
                  <Panel padded>
                    <p className="text-[17px] font-bold" style={{ color: "var(--text)" }}>{v.business_name}</p>
                    <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
                      {vendorCategoryLabel(v.category)}{v.phone ? ` · ${v.phone}` : ""}
                    </p>
                    {v.recommender?.name && <p className="text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>Recommended by {v.recommender.name}</p>}
                    {v.description && <p className="text-[15px] leading-relaxed mt-2" style={{ color: "var(--text)" }}>{v.description}</p>}
                    {(v.email || v.website) && (
                      <p className="text-[14px] mt-2" style={{ color: "var(--text-2)" }}>
                        {[v.email, v.website].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button size="sm" onClick={() => act(v.id, () => approveVendor(v.id, "free"), () => setPendingVendors((l) => l.filter((x) => x.id !== v.id)))} loading={actioning === v.id}>Approve</Button>
                      <Button size="sm" variant="secondary" icon="star" onClick={() => act(v.id, () => approveVendor(v.id, "featured"), () => setPendingVendors((l) => l.filter((x) => x.id !== v.id)))} disabled={actioning === v.id}>Approve as featured</Button>
                      <Button size="sm" variant="danger" onClick={() => act(v.id, () => denyVendor(v.id), () => setPendingVendors((l) => l.filter((x) => x.id !== v.id)))} disabled={actioning === v.id}>Deny</Button>
                    </div>
                  </Panel>
                </li>
              ))}
            </ul>
          ))}

        {tab === "irrigation" && <IrrigationForm authorId={profile!.id} authorName={profile!.name} />}
      </main>

      {viewingProof && (
        <div role="dialog" aria-modal="true" aria-label="Proof of residence" className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.92)" }} onClick={() => setViewingProof(null)}>
          <button type="button" className="absolute right-4 w-11 h-11 rounded-full flex items-center justify-center" style={{ top: "calc(env(safe-area-inset-top, 0px) + 16px)", background: "rgba(255,255,255,0.15)", color: "white" }} onClick={() => setViewingProof(null)} aria-label="Close" autoFocus>
            <Icon name="x" size={22} />
          </button>
          <img src={viewingProof} alt="Proof of residence" className="max-w-[92vw] max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function IrrigationForm({ authorId, authorName }: { authorId: string; authorName: string }) {
  const [status, setStatus] = useState<IrrigationStatus>("estimated");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [latest, setLatest] = useState<IrrigationUpdate | null | undefined>(undefined);

  useEffect(() => {
    getLatestIrrigation().then(setLatest);
  }, []);

  const needsDate = status !== "awaiting";
  const dateError = needsDate && !start ? "Enter a date or the start of the window" : end && start && end < start ? "End must be after start" : undefined;
  const draft: IrrigationUpdate = { id: "draft", status, window_start: start || null, window_end: end || null, note: note.trim() || null, created_at: new Date().toISOString(), author: { name: authorName } };
  const summary = irrigationSummary(draft);

  async function publish() {
    setBusy(true);
    setResult(null);
    try {
      await publishIrrigationUpdate(authorId, status, start || null, end || null, note.trim() || null);
      let notified = 0;
      if (notify) notified = await notifyAllApproved("irrigation", `Irrigation update: ${summary}`);
      setResult({ ok: true, text: notify ? `Published and ${notified} residents notified.` : "Published. Residents will see it under Irrigation and on Home." });
      setPreview(false);
      setNote("");
      getLatestIrrigation().then(setLatest);
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      setResult({
        ok: false,
        text: msg.includes("irrigation_updates") || msg.includes("relation") ? "The irrigation table isn't set up yet. Run migrations/2026-11-01-redesign.sql in Supabase, then try again." : "Couldn't publish. Try again.",
      });
    }
    setBusy(false);
  }

  return (
    <div>
      {latest === undefined && (
        <div className="mb-4">
          <Notice tone="warning" icon="alert-triangle" title="Irrigation updates need a one-time database setup">
            Run <code>migrations/2026-11-01-redesign.sql</code> in the Supabase SQL editor. Until then, publishing will fail.
          </Notice>
        </div>
      )}
      {latest && (
        <div className="mb-4">
          <Notice tone="neutral" icon="droplet" title="Current status">
            {irrigationSummary(latest)} &middot; posted {timeAgo(latest.created_at)}{latest.author?.name ? ` by ${latest.author.name}` : ""}
          </Notice>
        </div>
      )}

      {result && (
        <div className="mb-4">
          <Notice tone={result.ok ? "success" : "danger"} icon={result.ok ? "check-circle" : "alert-triangle"}>{result.text}</Notice>
        </div>
      )}

      <SectionTitle>Post an irrigation update</SectionTitle>
      <Panel padded>
        <p className="text-[15px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>Status</p>
        <ChoiceChips
          label="Status"
          value={status}
          onChange={(v) => setStatus(v as IrrigationStatus)}
          options={(Object.keys(IRRIGATION_STATUS_LABEL) as IrrigationStatus[]).map((s) => ({ value: s, label: IRRIGATION_STATUS_LABEL[s] }))}
        />
        <p className="text-[14px] mt-2 mb-4" style={{ color: "var(--text-2)" }}>{IRRIGATION_STATUS_HELP[status]}</p>

        {needsDate && (
          <div className="grid grid-cols-2 gap-3">
            <Field label={status === "estimated" ? "Earliest" : "Date"} required error={dateError}>
              {(id, by) => <TextInput id={id} describedBy={by} type="date" value={start} onChange={setStart} invalid={!!dateError} />}
            </Field>
            <Field label="Latest" optional hint="Leave blank for a single day">
              {(id, by) => <TextInput id={id} describedBy={by} type="date" value={end} onChange={setEnd} min={start || undefined} />}
            </Field>
          </div>
        )}

        <Field label="Note" optional hint="Anything residents should know: gate times, what changed, who to contact.">
          {(id, by) => <TextArea id={id} describedBy={by} value={note} onChange={setNote} rows={3} />}
        </Field>

        <label className="flex items-center gap-3 py-2 cursor-pointer">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="w-5 h-5 accent-[var(--primary)]" />
          <span className="text-[15px]" style={{ color: "var(--text)" }}>Notify all residents in the app</span>
        </label>

        {!preview ? (
          <div className="mt-3">
            <Button onClick={() => setPreview(true)} disabled={!!dateError} icon="eye">Preview</Button>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-lg" style={{ background: "var(--surface-2)" }}>
            <p className="text-[13px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--text-3)" }}>Residents will see</p>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge tone={status === "confirmed" ? "success" : status === "delayed" ? "danger" : status === "estimated" ? "warning" : "neutral"}>{IRRIGATION_STATUS_LABEL[status]}</StatusBadge>
              <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>{summary}</span>
            </div>
            {note.trim() && <p className="text-[15px] mt-2" style={{ color: "var(--text)" }}>{note}</p>}
            <p className="text-[13px] mt-2" style={{ color: "var(--text-3)" }}>Posted by {authorName} &middot; just now{notify ? " · notification sent to all residents" : ""}</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={publish} loading={busy}>Publish</Button>
              <Button variant="ghost" onClick={() => setPreview(false)} disabled={busy}>Edit</Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPageInner />
    </Suspense>
  );
}
