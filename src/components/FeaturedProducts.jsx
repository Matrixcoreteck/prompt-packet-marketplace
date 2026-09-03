import React from "react";
import { FONT_MONO, COLORS } from "../theme";
import ProductCard from "./ProductCard";
import { SectionHeading } from "./ui";

export default function FeaturedProducts({ packs, owned, onOpen }) {
  if (!packs || packs.length === 0) return null;
  const trending = [...packs]
    .sort((a, b) => (b.stats?.salesCount || 0) - (a.stats?.salesCount || 0))
    .slice(0, 4);
  const hasDemoStats = trending.some((p) => (p.stats?.salesCount || 0) > 0);

  return (
    <section className="px-6 py-10" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
      <SectionHeading kicker="WHAT'S HOT RIGHT NOW" title="Trending Now" />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {trending.map((p) => (
          <ProductCard key={p.id} pack={p} owned={owned.has(p.id)} onOpen={onOpen} />
        ))}
      </div>
      {hasDemoStats && (
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: "10.5px",
            color: COLORS.textOnInkDim,
            letterSpacing: "0.03em",
            marginTop: "14px",
          }}
        >
          Sample marketplace data — ratings and sales figures are demo values, not real transactions.
        </p>
      )}
    </section>
  );
}
