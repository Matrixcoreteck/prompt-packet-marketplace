import React from "react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { Tag_, Stars, CreatorAvatar } from "./ui";
import { formatSales, countLabel } from "../data/marketplace";

// The marketplace product card — evolved from the original PackCard.
// Shows: category, title, description, creator, item count, rating,
// sales, price, and owned/new status.
export default function ProductCard({ pack, owned, onOpen }) {
  const stats = pack.stats || {};
  const isNew = !stats.rating && !stats.salesCount;

  return (
    <button
      onClick={() => onOpen(pack)}
      className="text-left p-5 flex flex-col gap-2.5"
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.paperShade}`,
        borderRadius: "2px",
        boxShadow: "2px 3px 0 rgba(16,21,31,0.35)",
        cursor: "pointer",
        transition: "transform 120ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="flex items-start justify-between gap-2">
        <Tag_>{pack.category}</Tag_>
        {owned ? (
          <Tag_ tone="oxblood">OWNED</Tag_>
        ) : isNew ? (
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "11px",
              letterSpacing: "0.02em",
              padding: "2px 8px",
              borderRadius: "3px",
              color: COLORS.goldDim,
              border: `1px solid ${COLORS.goldDim}`,
            }}
          >
            NEW
          </span>
        ) : null}
      </div>

      <h3
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "19px",
          fontWeight: 600,
          color: COLORS.textOnPaper,
          lineHeight: 1.25,
        }}
      >
        {pack.title}
      </h3>

      <p
        className="line-clamp-2"
        style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.textOnPaperDim, lineHeight: 1.5 }}
      >
        {pack.description}
      </p>

      <div className="flex items-center gap-1.5 mt-1">
        <CreatorAvatar name={pack.sellerName} size={20} />
        <span style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.textOnPaperDim }}>
          {pack.sellerName}
        </span>
      </div>

      <div
        className="flex items-center justify-between gap-2 pt-2.5 mt-1"
        style={{ borderTop: `1px solid ${COLORS.paperShade}` }}
      >
        {isNew ? (
          <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnPaperDim }}>
            Just published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <Stars rating={stats.rating} />
            <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnPaperDim }}>
              · {formatSales(stats.salesCount)} sales
            </span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnPaperDim }}>
            {pack.prompts.length} {countLabel(pack)}
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "16px",
              fontWeight: 600,
              color: COLORS.textOnPaper,
            }}
          >
            ${pack.price}
          </span>
        </span>
      </div>
    </button>
  );
}
