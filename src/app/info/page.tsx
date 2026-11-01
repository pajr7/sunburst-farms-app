"use client";

import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import { Panel, ListRow, SectionTitle } from "@/components/ui/Primitives";
import type { IconName } from "@/components/ui/Icon";

const SECTIONS: { title: string; items: { label: string; description: string; pageId: string; icon: IconName }[] }[] = [
  {
    title: "Updates & meetings",
    items: [
      { label: "Announcements", description: "Latest notices from the board", pageId: "1095", icon: "megaphone" },
      { label: "Monthly minutes", description: "Board meeting minutes", pageId: "50", icon: "file-text" },
      { label: "Board meeting agenda & location", description: "Upcoming meeting details", pageId: "656", icon: "calendar" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Irrigation schedule", description: "Current service schedule", pageId: "1182", icon: "droplet" },
      { label: "Irrigation & bridle paths", description: "Service info and path maps", pageId: "154", icon: "map" },
      { label: "Bulk trash schedule", description: "Pickup dates and guidelines", pageId: "1086", icon: "truck" },
      { label: "Property services", description: "Services for your property", pageId: "1297", icon: "wrench" },
    ],
  },
  {
    title: "Documents & finance",
    items: [
      { label: "Community documents", description: "CC&Rs, bylaws, governing documents", pageId: "15", icon: "file-text" },
      { label: "Community finance", description: "Budget and financial reports", pageId: "83", icon: "dollar-sign" },
      { label: "FAQ about SBFE", description: "Frequently asked questions", pageId: "1344", icon: "help-circle" },
      { label: "HOA-organized events", description: "Events run by the association", pageId: "817", icon: "star" },
    ],
  },
  {
    title: "Contact & location",
    items: [
      { label: "Contact the board", description: "Board and management contacts", pageId: "4", icon: "mail" },
      { label: "Community location", description: "Map and section boundaries", pageId: "5", icon: "map-pin" },
    ],
  },
];

export default function InfoPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Association" subtitle="Official pages from sbfehome.com" back="/community" />
        <main className="flex-1 px-4 md:px-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <SectionTitle>{section.title}</SectionTitle>
              <Panel>
                {section.items.map((item) => (
                  <ListRow key={item.pageId} href={`/info/${item.pageId}`} icon={item.icon} title={item.label} description={item.description} />
                ))}
              </Panel>
            </div>
          ))}
        </main>
      </div>
    </AuthGuard>
  );
}
