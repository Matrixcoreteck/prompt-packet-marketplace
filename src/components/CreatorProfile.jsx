import React from "react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { buildCreator, formatSales } from "../data/marketplace";
import { CreatorAvatar, SectionHeading, BackButton } from "./ui";
import ProductCard from "./ProductCard";

function StatChip({ children, tone = "dim" }) {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: "11px",
        letterSpacing: "0.05em",
        padding: "4px 10px",
        borderRadius: "2px",
        color: tone === "gold" ? COLORS.goldDim : COLORS.textOnInkDim,
        background: COLORS.inkRaised,
      }}
    >
      {children}
    </span>
  );
}

// Public creator storefront. Built on the lightweight buildCreator() model
// so real creator accounts (avatars, followers, payouts…) can replace it later
// without changing this page's contract.
export default function CreatorProfile({ name, packs, owned, onOpenProduct, onBack }) {
  const creator = buildCreator(name, packs || []);

  return (
    <div>
      <div className="px-6 md:px-10 pt-8 pb-6" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
        <div className="max-w-[1100px] mx-auto">
          <BackButton onClick={onBack} />
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <CreatorAvatar name={creator.name} size={64} />
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: "10.5px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
                CREATOR
              </div>
              <h1
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(26px, 4vw, 36px)",
                  fontWeight: 600,
                  color: COLORS.textOnInk,
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {creator.name}
              </h1>
            </div>
          </div>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "14px",
              color: COLORS.textOnInkDim,
              lineHeight: 1.65,
              maxWidth: "560px",
              marginTop: "12px",
              marginBottom: 0,
            }}
          >
            {creator.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: "12px" }}>
            {creator.rating != null ? (
              <StatChip tone="gold">★ {creator.rating.toFixed(1)} RATING</StatChip>
            ) : (
              <StatChip tone="gold">NEW CREATOR</StatChip>
            )}
            <StatChip>
              {creator.productCount} {creator.productCount === 1 ? "PRODUCT" : "PRODUCTS"}
            </StatChip>
            <StatChip>{formatSales(creator.sales)} SALES</StatChip>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-10 max-w-[1100px] mx-auto">
        <SectionHeading
          kicker="THE STOREFRONT"
          title="Products by This Creator"
          right={
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.05em", color: COLORS.textOnInkDim }}>
              {creator.productCount} {creator.productCount === 1 ? "ITEM" : "ITEMS"}
            </span>
          }
        />
        {creator.productCount === 0 ? (
          <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim }}>
            This creator hasn't published anything yet.
          </p>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {creator.products.map((p) => (
              <ProductCard key={p.id} pack={p} owned={owned.has(p.id)} onOpen={onOpenProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
