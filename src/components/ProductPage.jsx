import React from "react";
import { Check } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { formatSales, countLabel } from "../data/marketplace";
import { Tag_, SectionHeading, BackButton } from "./ui";
import CreatorPreview from "./CreatorPreview";
import PurchaseCard from "./product/PurchaseCard";
import WhatsInside from "./product/WhatsInside";
import TrySample from "./product/TrySample";
import CreatorSection from "./product/CreatorSection";
import Reviews from "./product/Reviews";
import RelatedProducts from "./product/RelatedProducts";

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

function WhatYouGet({ pack }) {
  const items = [
    `The complete ${(pack.type || "Prompt Pack").toLowerCase()} — all ${pack.prompts.length} ${countLabel(pack)} included`,
    "Ready-to-use AI prompts, formatted for copy and paste",
    "Lifetime access — saved to your library",
    "Free future product updates",
  ];
  return (
    <section>
      <SectionHeading kicker="EVERY PURCHASE INCLUDES" title="What You Get" />
      <div className="grid gap-2.5 md:grid-cols-2">
        {items.map((t) => (
          <div
            key={t}
            className="flex items-center gap-2.5 p-3.5"
            style={{ background: COLORS.inkRaised, borderRadius: "3px" }}
          >
            <Check size={15} color={COLORS.gold} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.textOnInk }}>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProductPage({
  pack,
  allPacks,
  owned,
  purchasing,
  onBack,
  onPurchase,
  onOpenProduct,
  onOpenCreator,
}) {
  const stats = pack.stats || {};
  const isOwned = owned.has(pack.id);

  return (
    <div>
      {/* Hero */}
      <div className="px-6 md:px-10 pt-8 pb-8" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
        <div className="max-w-[1100px] mx-auto">
          <BackButton onClick={onBack} />
          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            <div className="flex flex-col gap-3 min-w-0" style={{ flex: "1.6 1 0" }}>
              <div className="flex items-center gap-2 flex-wrap">
                <Tag_>{pack.category}</Tag_>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "10.5px",
                    letterSpacing: "0.08em",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    color: COLORS.textOnInkDim,
                    border: `1px solid ${COLORS.inkRaised}`,
                  }}
                >
                  {(pack.type || "Prompt Pack").toUpperCase()}
                </span>
              </div>
              <h1
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(30px, 4vw, 42px)",
                  fontWeight: 600,
                  color: COLORS.textOnInk,
                  lineHeight: 1.12,
                  margin: 0,
                }}
              >
                {pack.title}
              </h1>
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "15px",
                  color: COLORS.textOnInkDim,
                  lineHeight: 1.65,
                  maxWidth: "560px",
                  margin: 0,
                }}
              >
                {pack.description}
              </p>
              <div style={{ marginTop: "4px" }}>
                <CreatorPreview name={pack.sellerName} dark onClick={() => onOpenCreator(pack.sellerName)} />
              </div>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: "8px" }}>
                <StatChip tone="gold">
                  {stats.rating != null ? `★ ${stats.rating.toFixed(1)}` : "JUST PUBLISHED"}
                </StatChip>
                <StatChip>{formatSales(stats.salesCount)} SALES</StatChip>
                <StatChip>
                  {pack.prompts.length} {countLabel(pack).toUpperCase()}
                </StatChip>
              </div>
            </div>
            <div style={{ flex: "1 1 340px", maxWidth: "420px" }}>
              <PurchaseCard pack={pack} owned={isOwned} purchasing={purchasing} onPurchase={onPurchase} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className="px-6 md:px-10 py-12 max-w-[1100px] mx-auto flex flex-col"
        style={{ gap: "56px" }}
      >
        <WhatsInside pack={pack} owned={isOwned} />
        <TrySample pack={pack} />
        <WhatYouGet pack={pack} />
        <CreatorSection pack={pack} allPacks={allPacks} onOpenCreator={onOpenCreator} />
        <Reviews pack={pack} />
        <RelatedProducts pack={pack} packs={allPacks} owned={owned} onOpenProduct={onOpenProduct} />
      </div>
    </div>
  );
}
