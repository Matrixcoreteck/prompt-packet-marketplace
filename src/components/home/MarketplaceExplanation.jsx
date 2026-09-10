import React from "react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";

// Plain-language explanation of what The Prompt Index actually is —
// no invented numbers, no payment claims.
export default function MarketplaceExplanation() {
  return (
    <section className="px-6 md:px-10 py-12">
      <div className="max-w-[720px] mx-auto text-center">
        <div style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.16em", color: COLORS.goldDim, marginBottom: "8px" }}>
          WHAT IS THE PROMPT INDEX?
        </div>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "clamp(24px, 3.4vw, 32px)",
            fontWeight: 600,
            color: COLORS.textOnInk,
            lineHeight: 1.15,
            margin: "0 0 14px",
          }}
        >
          A Marketplace for AI Prompt Packs and Digital AI Products
        </h2>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "14px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.7,
            margin: "0 0 12px",
          }}
        >
          The Prompt Index is a marketplace for AI prompt packs and digital AI products. Creators
          package their knowledge, prompts, workflows, and strategies into useful digital products.
        </p>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "14px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Buyers can discover products built for specific goals, purchase them, and access them
          from their personal library.
        </p>
      </div>
    </section>
  );
}
