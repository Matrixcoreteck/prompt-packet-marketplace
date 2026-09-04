import React from "react";
import { Check, Circle } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS, groupOf } from "../../theme";
import CoverPlaceholder from "./CoverPlaceholder";

// Live summary — the right rail of the builder. Mirrors what the product
// will look like at a glance and tracks what's still missing.
export default function BuilderSummary({ draft, promptCount }) {
  const checks = [
    { ok: Boolean(draft.title.trim()), label: "Product title" },
    { ok: Boolean(draft.description.trim()), label: "Description" },
    { ok: Boolean(draft.sellerName.trim()), label: "Creator name" },
    { ok: Boolean(draft.price !== "" && Number(draft.price) >= 0), label: "Price" },
    { ok: promptCount > 0, label: "At least one prompt" },
  ];
  const done = checks.filter((c) => c.ok).length;

  const row = (label, value) => (
    <div className="flex flex-col gap-0.5">
      <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", letterSpacing: "0.14em", color: COLORS.textOnInkDim }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, color: COLORS.textOnInk }}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-6" style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px", padding: "18px" }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
        LIVE SUMMARY
      </span>
      <CoverPlaceholder title={draft.title} category={draft.category} />
      <h3
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "19px",
          fontWeight: 600,
          color: COLORS.textOnInk,
          lineHeight: 1.25,
          margin: 0,
          minHeight: "24px",
        }}
      >
        {draft.title.trim() || "Untitled AI product"}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {row("CATEGORY", draft.category)}
        {row("GROUP", groupOf(draft.category))}
        {row("CREATOR", draft.sellerName.trim() || "—")}
        {row("PRICE", draft.price !== "" ? `$${draft.price}` : "—")}
      </div>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: COLORS.ink, borderRadius: "2px" }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.06em", color: COLORS.textOnInkDim }}>
          {promptCount} PROMPT{promptCount === 1 ? "" : "S"} CREATED
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.goldDim }}>
          {done}/{checks.length} READY
        </span>
      </div>
      <div className="flex flex-col gap-1.5" style={{ borderTop: `1px solid ${COLORS.ink}`, paddingTop: "12px" }}>
        {checks.map((c) => (
          <span key={c.label} className="inline-flex items-center gap-2">
            {c.ok ? <Check size={13} color={COLORS.gold} /> : <Circle size={13} color={COLORS.textOnInkDim} />}
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: "12.5px",
                color: c.ok ? COLORS.textOnInk : COLORS.textOnInkDim,
              }}
            >
              {c.label}
            </span>
          </span>
        ))}
      </div>
      <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", color: COLORS.textOnInkDim, lineHeight: 1.6 }}>
        DEMO MODE — PAYOUTS AREN'T ENABLED YET. SELL THE SAME PRODUCT OVER AND OVER; CREATORS KEEP MOST OF THE REVENUE.
      </span>
    </div>
  );
}
