import React from "react";
import { Rocket } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import CoverPlaceholder from "./CoverPlaceholder";

// Success state after publishing. Hands the creator off to the live
// product page or their storefront, or starts a fresh product.
export default function PublishSuccess({ pack, onViewProduct, onViewCreatorStore, onCreateAnother }) {
  return (
    <div className="px-6 md:px-10 py-16">
      <div
        className="max-w-[560px] mx-auto flex flex-col items-center text-center gap-4 p-8"
        style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{ width: "52px", height: "52px", borderRadius: "50%", background: COLORS.gold }}
        >
          <Rocket size={22} color={COLORS.ink} />
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
          PRODUCT PUBLISHED
        </span>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "26px",
            fontWeight: 600,
            color: COLORS.textOnInk,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Your product is now live on The Prompt Index.
        </h2>
        <div className="w-full" style={{ maxWidth: "320px" }}>
          <CoverPlaceholder title={pack.title} category={pack.category} height={110} />
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: "14px", fontWeight: 600, color: COLORS.textOnInk }}>
          {pack.title}
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnInkDim }}>
          ${pack.price} · {pack.prompts.length} {pack.prompts.length === 1 ? "PROMPT" : "PROMPTS"}
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
          <button
            onClick={onViewProduct}
            className="flex-1 px-4 py-2.5"
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13.5px",
              fontWeight: 600,
              color: COLORS.ink,
              background: COLORS.gold,
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            View product
          </button>
          <button
            onClick={onViewCreatorStore}
            className="flex-1 px-4 py-2.5"
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13.5px",
              fontWeight: 600,
              color: COLORS.goldDim,
              background: "transparent",
              border: `1px solid ${COLORS.goldDim}`,
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            View creator store
          </button>
        </div>
        <button
          onClick={onCreateAnother}
          style={{
            fontFamily: FONT_MONO,
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: COLORS.textOnInkDim,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            marginTop: "2px",
          }}
        >
          + CREATE ANOTHER PRODUCT
        </button>
      </div>
    </div>
  );
}
