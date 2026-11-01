"use client";

import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import { Panel, ListRow, Notice, SectionTitle } from "@/components/ui/Primitives";

export default function DuesPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader title="HOA dues" back="/community" />

        <main className="flex-1 px-4 md:px-6">
          <Panel padded>
            <p className="text-[14px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Monthly assessment
            </p>
            <p className="text-[40px] font-bold leading-none mt-1" style={{ color: "var(--text)" }}>
              $130
            </p>
            <p className="text-[15px] mt-1.5" style={{ color: "var(--text-2)" }}>
              Due the 1st of each month. $1,560 a year.
            </p>
          </Panel>

          <div className="mt-4">
            <Notice tone="info" icon="info" title="Paying in the app isn't available yet">
              The association hasn't connected a payment service, so nothing in this app can take a payment. When it does, you'll see the payment service named here and a clear confirmation after each payment.
            </Notice>
          </div>

          <SectionTitle>How to pay now</SectionTitle>
          <Panel>
            <ListRow icon="mail" title="Mail a check" description="Payable to SBFE HOA. The mailing address is on your statement." />
            <ListRow href="/info/4" icon="phone" title="Questions about your balance" description="Contact the board or management" />
          </Panel>

          <SectionTitle>Good to know</SectionTitle>
          <Panel>
            <ListRow icon="calendar" title="Due date" description="1st of every month" />
            <ListRow icon="alert-triangle" title="Late fees" description="See your statement for the current late fee policy" />
            <ListRow href="/info/83" icon="file-text" title="Where dues go" description="Community budget and financial reports" />
          </Panel>
        </main>
      </div>
    </AuthGuard>
  );
}
