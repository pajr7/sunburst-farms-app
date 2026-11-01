"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getEvents, getLatestIrrigation, type IrrigationUpdate } from "@/lib/database";
import { irrigationIsCurrent, irrigationSummary } from "@/lib/irrigation";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import { Panel, ListRow, SectionTitle, timeAgo } from "@/components/ui/Primitives";
import { eventDateLine } from "@/components/EventCard";

export default function CommunityPage() {
  const { profile } = useAuth();
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [irrigation, setIrrigation] = useState<IrrigationUpdate | null | undefined>(undefined);

  useEffect(() => {
    getEvents().then((d) => setNextEvent(d?.[0] ?? null)).catch(() => {});
    getLatestIrrigation().then(setIrrigation).catch(() => {});
  }, []);

  const irrigationLine =
    irrigation && irrigationIsCurrent(irrigation)
      ? `${irrigationSummary(irrigation)} · updated ${timeAgo(irrigation.created_at)}`
      : "Schedule and updates from the coordinator";

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Community" subtitle="Events, irrigation, services, and the association" />

        <main className="flex-1 px-4 md:px-6">
          <SectionTitle>Happening</SectionTitle>
          <Panel>
            <ListRow
              href="/events"
              icon="calendar"
              iconTone="success"
              title="Events"
              description={nextEvent ? `Next: ${nextEvent.title}, ${eventDateLine(nextEvent.event_date, nextEvent.event_time)}` : "Potlucks, rides, meetings, and more"}
            />
            <ListRow href="/irrigation" icon="droplet" iconTone="info" title="Irrigation" description={irrigationLine} />
            <ListRow href="/news" icon="newspaper" title="Local news & sports" description="Arizona headlines, refreshed every 15 minutes" />
          </Panel>

          <SectionTitle>Around the neighborhood</SectionTitle>
          <Panel>
            <ListRow href="/vendors" icon="wrench" title="Local services" description="Plumbers, landscapers, and more recommended by neighbors" />
            <ListRow href="/realestate" icon="home" title="Real estate" description="Homes for sale and rent inside our boundaries" />
            <ListRow href="/market" icon="store" title="Marketplace" description="Buy, sell, and give away" />
          </Panel>

          <SectionTitle>Association</SectionTitle>
          <Panel>
            <ListRow href="/info/1095" icon="megaphone" iconTone="info" title="Announcements" description="Official updates from the board" />
            <ListRow href="/info/15" icon="file-text" title="Documents" description="CC&Rs, bylaws, and governing documents" />
            <ListRow href="/dues" icon="credit-card" title="Dues" description="$130 a month, due the 1st" />
            <ListRow href="/info/4" icon="mail" title="Contact the board" description="Board members and management" />
            <ListRow href="/info" icon="building" title="All association pages" description="Minutes, meetings, bulk trash, FAQ, and more" />
          </Panel>

          {profile?.role === "admin" && (
            <>
              <SectionTitle>Board</SectionTitle>
              <Panel>
                <ListRow href="/admin" icon="shield" iconTone="warning" title="Board tools" description="Approve members, review services, post irrigation updates" />
              </Panel>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
