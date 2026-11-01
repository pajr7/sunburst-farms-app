"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getLatestIrrigation, getIrrigationHistory, type IrrigationUpdate } from "@/lib/database";
import { IRRIGATION_STATUS_LABEL, IRRIGATION_STATUS_HELP, irrigationWindow, irrigationIsCurrent } from "@/lib/irrigation";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Panel, Spinner, Notice, StatusBadge, SectionTitle, timeAgo, type Tone } from "@/components/ui/Primitives";

const OFFICIAL_PAGE_ID = "1182";

const TONE: Record<IrrigationUpdate["status"], Tone> = {
  awaiting: "neutral",
  estimated: "warning",
  confirmed: "success",
  delayed: "danger",
};

export default function IrrigationPage() {
  const { profile } = useAuth();
  const [latest, setLatest] = useState<IrrigationUpdate | null | undefined>(undefined);
  const [history, setHistory] = useState<IrrigationUpdate[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [official, setOfficial] = useState<{ title: string; content: string } | null>(null);
  const [officialError, setOfficialError] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    getLatestIrrigation()
      .then((u) => {
        setLatest(u);
        if (u !== undefined) getIrrigationHistory().then(setHistory);
      })
      .finally(() => setLoadingStatus(false));
    fetch(`/api/info?page=${OFFICIAL_PAGE_ID}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setOfficial(d);
        setCheckedAt(new Date().toISOString());
      })
      .catch(() => setOfficialError(true));
  }, []);

  const current = latest && irrigationIsCurrent(latest) ? latest : null;
  const stale = latest && !current ? latest : null;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader
          title="Irrigation"
          back="/community"
          actions={profile?.role === "admin" ? <Button href="/admin?tab=irrigation" size="sm" variant="secondary" icon="edit">Post update</Button> : undefined}
        />

        <main className="flex-1 px-4 md:px-6">
          {loadingStatus ? (
            <Spinner label="Checking status" />
          ) : latest === undefined ? (
            <Notice tone="info" icon="info" title="Coordinator updates aren't set up yet">
              Once the board turns on irrigation updates in the app, the current status will show here. Until then, use the association page below.
            </Notice>
          ) : current ? (
            <Panel padded>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge tone={TONE[current.status]} icon={current.status === "confirmed" ? "check" : current.status === "delayed" ? "alert-triangle" : undefined}>
                  {IRRIGATION_STATUS_LABEL[current.status]}
                </StatusBadge>
              </div>
              <p className="text-[26px] font-bold leading-tight mt-2" style={{ color: "var(--text)" }}>
                {current.status === "awaiting" ? "No date yet" : irrigationWindow(current)}
              </p>
              <p className="text-[15px] mt-1" style={{ color: "var(--text-2)" }}>
                {IRRIGATION_STATUS_HELP[current.status]}
              </p>
              {current.note && (
                <p className="text-[16px] leading-relaxed mt-3 whitespace-pre-line" style={{ color: "var(--text)" }}>
                  {current.note}
                </p>
              )}
              <p className="text-[14px] mt-3 pt-3" style={{ color: "var(--text-3)", borderTop: "1px solid var(--border)" }}>
                Posted by {current.author?.name ?? "the coordinator"} · {timeAgo(current.created_at)}
              </p>
            </Panel>
          ) : (
            <Notice tone="neutral" icon="clock" title="No current schedule posted">
              {stale ? `The last update (${IRRIGATION_STATUS_LABEL[stale.status].toLowerCase()}, ${irrigationWindow(stale)}) has passed.` : "The coordinator hasn't posted a schedule yet."} Check the association page below or watch for the next update.
            </Notice>
          )}

          {history.length > 1 && (
            <>
              <SectionTitle>Earlier updates</SectionTitle>
              <Panel>
                <ul>
                  {history.slice(1).map((u) => (
                    <li key={u.id} className="ui-row px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge tone={TONE[u.status]}>{IRRIGATION_STATUS_LABEL[u.status]}</StatusBadge>
                        <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>{u.status === "awaiting" ? "No date" : irrigationWindow(u)}</span>
                        <span className="text-[13px]" style={{ color: "var(--text-3)" }}>{timeAgo(u.created_at)}</span>
                      </div>
                      {u.note && <p className="text-[14px] mt-1" style={{ color: "var(--text-2)" }}>{u.note}</p>}
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          )}

          <SectionTitle>From the association website</SectionTitle>
          {officialError ? (
            <Notice tone="warning" icon="alert-triangle" title="Couldn't load the association page" action={<Button size="sm" variant="secondary" href={`https://sbfehome.com/?page_id=${OFFICIAL_PAGE_ID}`}>Open sbfehome.com</Button>}>
              Check your connection, or open the page directly.
            </Notice>
          ) : !official ? (
            <Spinner label="Loading association page" />
          ) : (
            <Panel padded>
              <p className="flex items-center gap-1.5 text-[13px] font-semibold mb-3" style={{ color: "var(--text-3)" }}>
                <Icon name="globe" size={14} />
                sbfehome.com · {official.title}
                {checkedAt ? ` · checked ${timeAgo(checkedAt)}` : ""}
              </p>
              <div className="info-content" dangerouslySetInnerHTML={{ __html: official.content }} />
              <a href={`https://sbfehome.com/?page_id=${OFFICIAL_PAGE_ID}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-semibold mt-3" style={{ color: "var(--primary)" }}>
                Open on sbfehome.com <Icon name="external-link" size={15} />
              </a>
            </Panel>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
