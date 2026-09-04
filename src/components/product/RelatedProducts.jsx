import React from "react";
import { COLORS } from "../../theme";
import { relatedPacks } from "../../data/marketplace";
import ProductCard from "../ProductCard";
import { SectionHeading } from "../ui";

export default function RelatedProducts({ pack, packs, owned, onOpenProduct }) {
  const related = relatedPacks(packs, pack);
  if (related.length === 0) return null;

  return (
    <section>
      <SectionHeading kicker="KEEP EXPLORING" title="You May Also Like" />
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {related.map((p) => (
          <ProductCard key={p.id} pack={p} owned={owned.has(p.id)} onOpen={onOpenProduct} />
        ))}
      </div>
    </section>
  );
}
