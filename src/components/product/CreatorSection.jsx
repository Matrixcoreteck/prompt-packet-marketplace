import React from "react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { creatorProfile } from "../../data/marketplace";
import { SectionHeading, CreatorAvatar } from "../ui";

export default function CreatorSection({ pack, allPacks, onOpenCreator }) {
  const profile = creatorProfile(pack.sellerName);
  const products = allPacks.filter((p) => p.sellerName === pack.sellerName);
  const rated = products.filter((p) => p.stats?.rating != null);
  const avgRating = rated.length
    ? (rated.reduce((s, p) => s + p.stats.rating, 0) / rated.length).toFixed(1)
    : null;

  return (
    <section>
      <SectionHeading kicker="THE MAKER" title="Created By" />
      <div
        className="flex items-center justify-between gap-4 flex-wrap p-6"
        style={{ background: COLORS.inkRaised, borderRadius: "3px" }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <CreatorAvatar name={pack.sellerName} size={48} />
          <div className="min-w-0">
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: "18px", fontWeight: 600, color: COLORS.textOnInk }}>
              {pack.sellerName}
            </div>
            <p
              style={{
                fontFamily: FONT_SANS,
                fontSize: "12.5px",
                color: COLORS.textOnInkDim,
                lineHeight: 1.5,
                maxWidth: "420px",
                margin: "2px 0 0 0",
              }}
            >
              {profile.description}
            </p>
            <div style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.goldDim, marginTop: "6px", letterSpacing: "0.04em" }}>
              {products.length} {products.length === 1 ? "PRODUCT" : "PRODUCTS"}
              {avgRating ? ` · ★ ${avgRating} AVG RATING` : ""}
            </div>
          </div>
        </div>
        <button
          onClick={() => onOpenCreator(pack.sellerName)}
          style={{
            fontFamily: FONT_MONO,
            fontSize: "11.5px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: COLORS.gold,
            background: "transparent",
            border: `1px solid ${COLORS.goldDim}`,
            borderRadius: "2px",
            padding: "9px 16px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          VIEW CREATOR
        </button>
      </div>
    </section>
  );
}
