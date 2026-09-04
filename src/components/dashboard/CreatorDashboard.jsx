import React, { useEffect, useMemo, useState } from "react";
import { Plus, Store, LayoutGrid, ListChecks, Rocket, DollarSign, Star, Inbox } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { formatSales } from "../../data/marketplace";
import DashboardProducts from "./DashboardProducts";
import ActivityFeed from "./ActivityFeed";

function StatCard({ label, value, sub, demo }) {
  return (
    <div
      className="p-5 flex flex-col gap-1.5"
      style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.16em", color: COLORS.textOnInkDim }}>
          {label}
        </span>
        {demo && (
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "8.5px",
              letterSpacing: "0.1em",
              color: COLORS.goldDim,
              border: `1px solid ${COLORS.goldDim}`,
              borderRadius: "2px",
              padding: "1px 5px",
            }}
          >
            DEMO DATA
          </span>
        )}
      </div>
      <span
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "30px",
          fontWeight: 600,
          color: COLORS.textOnInk,
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      {sub && <span style={{ fontFamily: FONT_MONO, fontSize: "10px", color: COLORS.textOnInkDim }}>{sub}</span>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-3 text-left"
      style={{
        fontFamily: FONT_SANS,
        fontSize: "13px",
        fontWeight: 600,
        color: primary ? COLORS.ink : COLORS.textOnInk,
        background: primary ? COLORS.gold : COLORS.inkRaised,
        border: primary ? "none" : `1px solid ${COLORS.ink}`,
        borderRadius: "3px",
        cursor: "pointer",
      }}
    >
      <Icon size={15} color={primary ? COLORS.ink : COLORS.gold} /> {label}
    </button>
  );
}

// The creator's home base: products, demo performance, and quick actions.
// All figures are DEMO values derived from the demo product stats —
// structured so real sales/earnings can replace them later.
export default function CreatorDashboard({
  packs,
  creator,
  onCreatorChange,
  onOpenProduct,
  onOpenCreator,
  onBrowse,
  onCreate,
  onEdit,
  onEditDraft,
}) {
  const [draft, setDraft] = useState(null);

  // The single builder draft lives under "draft:" (personal scope) —
  // it never appears in the public marketplace, only here.
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("draft:product", false);
        if (res && res.value) setDraft(JSON.parse(res.value));
      } catch {
        /* no draft */
      }
    })();
  }, []);

  const published = useMemo(() => packs.filter((p) => p.sellerName === creator), [packs, creator]);
  const hasDraft = Boolean(draft && ((!draft.sellerName || !draft.sellerName.trim()) || draft.sellerName === creator));
  const creators = useMemo(() => {
    const names = [...new Set([...packs.map((p) => p.sellerName), creator])];
    if (draft?.sellerName?.trim() && !names.includes(draft.sellerName)) names.push(draft.sellerName);
    return names.filter(Boolean);
  }, [packs, creator, draft]);

  const stats = useMemo(() => {
    const sales = published.reduce((s, p) => s + (p.stats?.salesCount || 0), 0);
    const earnings = published.reduce((s, p) => s + (p.stats?.salesCount || 0) * (p.price || 0), 0);
    const rated = published.filter((p) => p.stats?.rating != null);
    const rating = rated.length ? rated.reduce((s, p) => s + p.stats.rating, 0) / rated.length : null;
    return { sales, earnings, rating };
  }, [published]);

  const switcher = (
    <div className="flex items-center gap-2">
      <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", letterSpacing: "0.14em", color: COLORS.textOnInkDim }}>
        VIEWING AS
      </span>
      <select
        value={creator}
        onChange={(e) => onCreatorChange(e.target.value)}
        style={{
          fontFamily: FONT_MONO,
          fontSize: "11.5px",
          color: COLORS.textOnInk,
          background: COLORS.inkRaised,
          border: `1px solid ${COLORS.ink}`,
          borderRadius: "2px",
          padding: "5px 8px",
          cursor: "pointer",
        }}
      >
        {creators.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );

  // Empty state: no products and no draft — no meaningless statistics.
  if (published.length === 0 && !hasDraft) {
    return (
      <div className="px-6 md:px-10 py-16" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div
          className="flex flex-col items-center text-center gap-4 p-8"
          style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ width: "48px", height: "48px", borderRadius: "3px", background: COLORS.ink }}
          >
            <Inbox size={22} color={COLORS.gold} />
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
            YOUR STORE IS EMPTY
          </span>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "24px",
              fontWeight: 600,
              color: COLORS.textOnInk,
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Create your first AI product and start building your storefront.
          </h2>
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5"
            style={{
              fontFamily: FONT_SANS,
              fontSize: "14px",
              fontWeight: 600,
              color: COLORS.ink,
              background: COLORS.gold,
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            <Plus size={15} /> Create your first product
          </button>
          <div style={{ marginTop: "8px" }}>{switcher}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex flex-col gap-2.5 min-w-0">
          <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
            CREATOR DASHBOARD
          </span>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(26px, 4vw, 34px)",
              fontWeight: 600,
              color: COLORS.textOnInk,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Welcome back, {creator}.
          </h2>
          <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, margin: 0, lineHeight: 1.6 }}>
            Manage your AI products, track sales, and grow your storefront.
          </p>
          {switcher}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5"
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13.5px",
              fontWeight: 600,
              color: COLORS.ink,
              background: COLORS.gold,
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            <Plus size={15} /> Create new product
          </button>
          <button
            onClick={() => onOpenCreator(creator)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5"
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13.5px",
              fontWeight: 600,
              color: COLORS.goldDim,
              background: "transparent",
              border: `1px solid ${COLORS.goldDim}`,
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            <Store size={15} /> View my store
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginTop: "28px" }}>
        <StatCard label="TOTAL SALES" value={formatSales(stats.sales)} demo />
        <StatCard label="EARNINGS" value={`$${Math.round(stats.earnings).toLocaleString("en-US")}`} demo />
        <StatCard
          label="PRODUCTS"
          value={published.length + (hasDraft ? 1 : 0)}
          sub={hasDraft ? "INCLUDES 1 DRAFT IN PROGRESS" : null}
        />
        <StatCard
          label="AVERAGE RATING"
          value={stats.rating != null ? `★ ${stats.rating.toFixed(1)}` : "—"}
          sub="BASED ON DEMO RATINGS"
        />
      </div>

      {/* Products + side rail */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start" style={{ marginTop: "28px" }}>
        <DashboardProducts
          products={published}
          draft={draft}
          hasDraft={hasDraft}
          onOpenProduct={onOpenProduct}
          onEdit={onEdit}
          onEditDraft={onEditDraft}
        />

        <div className="flex flex-col gap-8">
          <section>
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.16em", color: COLORS.goldDim }}>
              QUICK ACTIONS
            </span>
            <div className="grid grid-cols-2 gap-2.5" style={{ marginTop: "12px" }}>
              <QuickAction icon={Plus} label="Create product" onClick={onCreate} primary />
              <QuickAction icon={Store} label="View my store" onClick={() => onOpenCreator(creator)} />
              <QuickAction icon={LayoutGrid} label="View marketplace" onClick={onBrowse} />
              <QuickAction
                icon={ListChecks}
                label="Manage products"
                onClick={() => {
                  const el = document.getElementById("dashboard-products");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
          </section>
          <ActivityFeed products={published} />
        </div>
      </div>
    </div>
  );
}
