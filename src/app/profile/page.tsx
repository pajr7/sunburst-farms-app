"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { updateProfileVisibility } from "@/lib/database";
import { COMMUNITY_NAME } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import { Panel, ListRow, SectionTitle, Notice } from "@/components/ui/Primitives";

export default function ProfilePage() {
  const { profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [toggling, setToggling] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const [shared, setShared] = useState<string | null>(null);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  async function handleToggleAddress() {
    if (!profile || toggling) return;
    setToggling(true);
    await updateProfileVisibility(profile.id, !profile.show_address);
    await refreshProfile();
    setToggling(false);
  }

  async function invite() {
    const url = `${window.location.origin}/join`;
    const text = `Join the ${COMMUNITY_NAME} neighborhood app: ${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: COMMUNITY_NAME, text, url });
        setShared("Invite shared.");
      } else {
        await navigator.clipboard.writeText(text);
        setShared("Invite link copied. Paste it in a text or email.");
      }
    } catch {
      /* user canceled */
    }
  }

  const showAddress = !!profile?.show_address;

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="Account" back="/" />

        <main className="flex-1 px-4 md:px-6">
          <Panel padded>
            <div className="flex items-center gap-4">
              <Avatar initials={profile?.avatar_initials ?? "?"} size={64} tone="solid" />
              <div className="min-w-0">
                <h2 className="text-[20px] font-bold leading-tight" style={{ color: "var(--text)" }}>
                  {profile?.name ?? "Neighbor"}
                </h2>
                <p className="text-[15px] mt-0.5" style={{ color: "var(--text-2)" }}>
                  {profile?.section}
                  {profile?.role === "admin" ? " · Board admin" : ""}
                </p>
              </div>
            </div>
          </Panel>

          <SectionTitle>Household</SectionTitle>
          <Panel>
            <ListRow icon="home" title={profile?.address ?? "Address on file"} description={`${profile?.section ?? ""}. To change your address, contact the board.`} />
            <div className="ui-row flex items-center gap-3.5 px-4 py-3.5">
              <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                <Icon name={showAddress ? "eye" : "lock"} size={20} />
              </span>
              <label htmlFor="show-address" className="flex-1 min-w-0 cursor-pointer">
                <span className="block text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                  Show my street address to neighbors
                </span>
                <span className="block text-[14px] mt-0.5" style={{ color: "var(--text-2)" }}>
                  {showAddress ? "Neighbors can see your address in the directory." : "Only your section is shown. Your address stays private."}
                </span>
              </label>
              <button
                id="show-address"
                type="button"
                role="switch"
                aria-checked={showAddress}
                onClick={handleToggleAddress}
                disabled={toggling}
                className="relative w-[52px] h-8 rounded-full shrink-0 transition-colors"
                style={{ background: showAddress ? "var(--primary)" : "var(--border-strong)", opacity: toggling ? 0.6 : 1 }}
              >
                <span className="absolute top-1 w-6 h-6 rounded-full transition-[left]" style={{ background: "white", left: showAddress ? 24 : 4, boxShadow: "var(--shadow-sm)" }} />
                <span className="sr-only">{showAddress ? "On" : "Off"}</span>
              </button>
            </div>
          </Panel>

          <SectionTitle>Neighbors</SectionTitle>
          <Panel>
            <ListRow onClick={invite} icon="users" title="Invite a neighbor" description="Share the link to join. New members are verified by the board." />
            <ListRow href="/messages" icon="message-circle" title="Messages" description="Your conversations" />
          </Panel>
          {shared && (
            <div className="mt-2">
              <Notice tone="success" icon="check-circle">{shared}</Notice>
            </div>
          )}

          <SectionTitle>Community</SectionTitle>
          <Panel>
            <ListRow href="/community" icon="building" title="Community hub" description="Events, irrigation, services, association" />
            <ListRow href="/market/mine" icon="tag" title="Your listings" description="Update or remove items you've listed" />
            {profile?.role === "admin" && <ListRow href="/admin" icon="shield" iconTone="warning" title="Board tools" description="Approvals, services, irrigation updates" />}
          </Panel>

          <SectionTitle>Help</SectionTitle>
          <Panel>
            <ListRow href="/info/1344" icon="help-circle" title="FAQ about Sunburst Farms East" />
            <ListRow href="/info/4" icon="mail" title="Contact the board" description="Questions about the community or this app" />
          </Panel>

          <div className="mt-6">
            {!confirmOut ? (
              <Button variant="danger" icon="log-out" onClick={() => setConfirmOut(true)}>
                Sign out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="danger" onClick={handleSignOut}>Yes, sign out</Button>
                <Button variant="ghost" onClick={() => setConfirmOut(false)}>Stay signed in</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
