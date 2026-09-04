import React from "react";
import { BookOpen } from "lucide-react";
import { FONT_MONO, FONT_DISPLAY, FONT_SANS, COLORS } from "../theme";
import ProductCard from "./ProductCard";
import { SectionHeading } from "./ui";

export default function Library({ packs, owned, onOpen, onBrowse }) {
  const items = packs.filter((p) => owned.has(p.id));

  return (
    <div className="p-6 md:p-10">
      <SectionHeading
        kicker="YOUR COLLECTION"
        title="My Library"
        right={
          <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnInkDim }}>
            {items.length} {items.length === 1 ? "product" : "products"}
          </span>
        }
      />
      {items.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 text-center py-16 px-6"
          style={{ border: `1px dashed ${COLORS.inkRaised}`, borderRadius: "3px" }}
        >
          <BookOpen size={28} color={COLORS.goldDim} />
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: "18px", fontWeight: 600, color: COLORS.textOnInk }}>
            Your library is empty
          </p>
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13px",
              color: COLORS.textOnInkDim,
              maxWidth: "340px",
              lineHeight: 1.6,
            }}
          >
            Products you unlock are saved here, ready to use any time.
          </p>
          <button
            onClick={onBrowse}
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.ink,
              background: COLORS.gold,
              borderRadius: "2px",
              padding: "8px 16px",
              cursor: "pointer",
              marginTop: "4px",
            }}
          >
            Browse the marketplace
          </button>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {items.map((p) => (
            <ProductCard key={p.id} pack={p} owned onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
