"use client";

import { useState, useEffect, useMemo } from "react";
import { getVendors } from "@/lib/database";
import { VENDOR_CATEGORIES, vendorCategoryLabel } from "@/lib/data";
import AuthGuard from "@/components/AuthGuard";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import FilterChips from "@/components/ui/FilterChips";
import EmptyState from "@/components/ui/EmptyState";
import { Panel, Spinner, StatusBadge, SectionTitle } from "@/components/ui/Primitives";

const OPTIONS = [{ value: "all", label: "All" }, ...VENDOR_CATEGORIES.map((c) => ({ value: c.key, label: c.label }))];

export default function VendorsPage() {
  const [filter, setFilter] = useState("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendors()
      .then(setVendors)
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => (filter === "all" ? vendors : vendors.filter((v) => v.category === filter)), [vendors, filter]);
  const featured = visible.filter((v) => v.tier === "featured");
  const recommended = visible.filter((v) => v.tier !== "featured");

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen pb-24 md:pb-8" style={{ background: "var(--bg)" }}>
        <PageHeader
          title="Local services"
          subtitle="Recommended by neighbors, reviewed by the board"
          back="/community"
          actions={<Button href="/vendors/recommend" size="sm" variant="secondary" icon="thumbs-up">Recommend</Button>}
        >
          <FilterChips options={OPTIONS} value={filter} onChange={setFilter} label="Filter by service" />
        </PageHeader>

        <main className="flex-1 px-4 md:px-6">
          {loading ? (
            <Spinner label="Loading services" />
          ) : visible.length === 0 ? (
            <EmptyState
              icon="wrench"
              title={filter === "all" ? "No services listed yet" : "None in this category yet"}
              body="Had a good experience with a plumber, landscaper, or handyman? Recommend them so neighbors can find them."
              action={<Button href="/vendors/recommend" icon="thumbs-up">Recommend a service</Button>}
            />
          ) : (
            <>
              {featured.length > 0 && (
                <>
                  <SectionTitle>Featured</SectionTitle>
                  <ul className="flex flex-col gap-3">
                    {featured.map((v) => (
                      <VendorCard key={v.id} vendor={v} featured />
                    ))}
                  </ul>
                </>
              )}
              {recommended.length > 0 && (
                <>
                  <SectionTitle>Neighbor recommended</SectionTitle>
                  <ul className="flex flex-col gap-3">
                    {recommended.map((v) => (
                      <VendorCard key={v.id} vendor={v} />
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <p className="text-[13px] mt-6 leading-relaxed" style={{ color: "var(--text-3)" }}>
            Listings are submitted by residents and approved by the board. A listing here is a neighbor&rsquo;s recommendation, not an association endorsement. Featured placements are chosen by the board.
          </p>
        </main>
      </div>
    </AuthGuard>
  );
}

function VendorCard({ vendor, featured = false }: { vendor: any; featured?: boolean }) {
  const site = vendor.website ? (vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`) : null;
  return (
    <li className="list-none">
      <Panel>
        {featured && vendor.image_url && <img src={vendor.image_url} alt="" className="w-full object-cover" style={{ height: 150 }} loading="lazy" />}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold leading-snug" style={{ color: "var(--text)" }}>
                {vendor.business_name}
              </h3>
              <p className="text-[14px] mt-0.5" style={{ color: "var(--text-2)" }}>
                {vendorCategoryLabel(vendor.category)}
              </p>
            </div>
            {featured && <StatusBadge tone="warning" icon="star">Featured</StatusBadge>}
          </div>
          {vendor.description && (
            <p className="text-[15px] leading-relaxed mt-2" style={{ color: "var(--text)" }}>
              {vendor.description}
            </p>
          )}
          {vendor.recommender?.name && (
            <p className="text-[14px] mt-2" style={{ color: "var(--text-3)" }}>
              Recommended by {vendor.recommender.name}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {vendor.phone && (
              <Button size="sm" icon="phone" href={`tel:${vendor.phone.replace(/\D/g, "")}`}>
                Call
              </Button>
            )}
            {vendor.email && (
              <Button size="sm" variant="secondary" icon="mail" href={`mailto:${vendor.email}`}>
                Email
              </Button>
            )}
            {site && (
              <Button size="sm" variant="secondary" icon="globe" href={site}>
                Website
              </Button>
            )}
          </div>
        </div>
      </Panel>
    </li>
  );
}
