import React from "react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { formatSales } from "../../data/marketplace";
import { SectionHeading, CreatorAvatar } from "../ui";

function Stars5({ rating, size = 14 }) {
  const full = Math.round(rating);
  return (
    <span style={{ fontFamily: FONT_MONO, fontSize: size, letterSpacing: "2px", lineHeight: 1 }}>
      <span style={{ color: COLORS.gold }}>{"★".repeat(full)}</span>
      <span style={{ color: COLORS.paperShade }}>{"☆".repeat(5 - full)}</span>
    </span>
  );
}

export default function Reviews({ pack }) {
  const stats = pack.stats || {};
  const reviews = pack.reviews || [];

  return (
    <section>
      <SectionHeading
        kicker="WHAT BUYERS SAY"
        title="Reviews"
        right={
          stats.ratingCount > 0 ? (
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.05em", color: COLORS.textOnInkDim }}>
              {formatSales(stats.ratingCount)} RATINGS
            </span>
          ) : null
        }
      />

      {stats.rating != null && (
        <div className="flex items-center gap-4" style={{ marginBottom: "20px" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: "44px", fontWeight: 600, color: COLORS.textOnInk, lineHeight: 1 }}>
            {stats.rating.toFixed(1)}
          </span>
          <div className="flex flex-col gap-1">
            <Stars5 rating={stats.rating} size={16} />
            <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: COLORS.textOnInkDim, letterSpacing: "0.04em" }}>
              BASED ON {formatSales(stats.ratingCount)} DEMO RATINGS
            </span>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, margin: 0 }}>
          No reviews yet — this product is brand new.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-2 p-5"
              style={{
                background: COLORS.paper,
                border: `1px solid ${COLORS.paperShade}`,
                borderRadius: "2px",
                boxShadow: "2px 3px 0 rgba(16,21,31,0.35)",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <Stars5 rating={r.rating} />
                <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: COLORS.textOnPaperDim }}>{r.date}</span>
              </div>
              <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnPaper, lineHeight: 1.6, margin: 0 }}>
                "{r.text}"
              </p>
              <div className="flex items-center gap-2">
                <CreatorAvatar name={r.author} size={18} />
                <span style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.textOnPaperDim }}>{r.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontFamily: FONT_MONO, fontSize: "10px", color: COLORS.textOnInkDim, letterSpacing: "0.04em", marginTop: "14px" }}>
        DEMO REVIEWS — SAMPLE DATA, NOT FROM REAL CUSTOMERS.
      </p>
    </section>
  );
}
