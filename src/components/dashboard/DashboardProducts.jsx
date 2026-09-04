import React, { useState } from "react";
import { Eye, Pencil, ArrowRight } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { formatSales } from "../../data/marketplace";

const FILTERS = [
  { key: "all", label: "ALL" },
  { key: "published", label: "PUBLISHED" },
  { key: "drafts", label: "DRAFTS" },
];

function StatusChip({ status }) {
  const isDraft = status === "DRAFT";
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: "9.5px",
        letterSpacing: "0.12em",
        padding: "2px 7px",
        borderRadius: "2px",
        color: isDraft ? COLORS.textOnInkDim : COLORS.goldDim,
        border: `1px solid ${isDraft ? COLORS.ink : COLORS.goldDim}`,
      }}
    >
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5"
      style={{
        fontFamily: FONT_MONO,
        fontSize: "10.5px",
        letterSpacing: "0.06em",
        color: primary ? COLORS.ink : COLORS.goldDim,
        background: primary ? COLORS.gold : "transparent",
        border: `1px solid ${COLORS.goldDim}`,
        borderRadius: "2px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={12} /> {label}
    </button>
  );
}

// Product management list for the creator dashboard. Published products
// come from the marketplace; the in-progress draft (private, never shown
// publicly) appears here with a CONTINUE EDITING action.
export default function DashboardProducts({ products, draft, hasDraft, onOpenProduct, onEdit, onEditDraft }) {
  const [filter, setFilter] = useState("all");

  const showPublished = filter !== "drafts";
  const showDraft = hasDraft && filter !== "published";

  let rows = [];
  if (showPublished) {
    rows = rows.concat(
      products.map((p) => ({
        key: p.id,
        kind: "published",
        title: p.title,
        category: p.category,
        price: `$${p.price}`,
        sales: formatSales(p.stats?.salesCount || 0),
        rating: p.stats?.rating != null ? `★ ${p.stats.rating.toFixed(1)}` : "—",
        status: "PUBLISHED",
        pack: p,
      }))
    );
  }
  if (showDraft) {
    rows = rows.concat([
      {
        key: "draft",
        kind: "draft",
        title: draft.title?.trim() || "Untitled draft",
        category: draft.category,
        price: draft.price !== "" ? `$${draft.price}` : "—",
        sales: "—",
        rating: "—",
        status: "DRAFT",
      },
    ]);
  }

  return (
    <section id="dashboard-products" className="flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.16em", color: COLORS.goldDim }}>
          YOUR PRODUCTS
        </span>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "10.5px",
                letterSpacing: "0.06em",
                padding: "4px 10px",
                borderRadius: "2px",
                color: filter === f.key ? COLORS.ink : COLORS.textOnInkDim,
                background: filter === f.key ? COLORS.gold : COLORS.inkRaised,
                border: "none",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div
          className="p-8 text-center"
          style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
        >
          <p style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.textOnInkDim, margin: 0 }}>
            Nothing here yet with this filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.map((r) => (
            <div
              key={r.key}
              className="flex items-center gap-4 flex-wrap p-4"
              style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
            >
              <div className="flex flex-col gap-1 min-w-0" style={{ flex: "1 1 200px" }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: "15.5px",
                      fontWeight: 600,
                      color: COLORS.textOnInk,
                      lineHeight: 1.3,
                    }}
                  >
                    {r.title}
                  </span>
                  <StatusChip status={r.status} />
                </div>
                <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: COLORS.textOnInkDim }}>
                  {r.category}
                </span>
              </div>

              <div
                className="flex items-center gap-5 flex-wrap"
                style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnInkDim }}
              >
                <span className="flex flex-col" style={{ minWidth: "48px" }}>
                  <span style={{ fontSize: "8.5px", letterSpacing: "0.12em" }}>PRICE</span>
                  <span style={{ color: COLORS.textOnInk, fontWeight: 600 }}>{r.price}</span>
                </span>
                <span className="flex flex-col" style={{ minWidth: "48px" }}>
                  <span style={{ fontSize: "8.5px", letterSpacing: "0.12em" }}>SALES</span>
                  <span style={{ color: COLORS.textOnInk }}>{r.sales}</span>
                </span>
                <span className="flex flex-col" style={{ minWidth: "48px" }}>
                  <span style={{ fontSize: "8.5px", letterSpacing: "0.12em" }}>RATING</span>
                  <span style={{ color: COLORS.goldDim }}>{r.rating}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {r.kind === "draft" ? (
                  <ActionButton icon={ArrowRight} label="CONTINUE EDITING" onClick={onEditDraft} primary />
                ) : (
                  <>
                    <ActionButton icon={Eye} label="VIEW PRODUCT" onClick={() => onOpenProduct(r.pack)} primary />
                    {r.pack.id.startsWith("pack-") && (
                      <ActionButton icon={Pencil} label="EDIT" onClick={() => onEdit(r.pack)} />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
