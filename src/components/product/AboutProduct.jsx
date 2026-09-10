import React from "react";
import { FONT_SANS, COLORS } from "../../theme";
import { SectionHeading } from "../ui";

// Full product description from the creator. The hero shows a short excerpt;
// this section carries the complete text.
export default function AboutProduct({ pack }) {
  const text = pack.description || pack.shortDescription;
  if (!text) return null;
  return (
    <section>
      <SectionHeading kicker="THE DETAILS" title="About This Product" />
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: "14.5px",
          color: COLORS.textOnInkDim,
          lineHeight: 1.75,
          margin: 0,
          maxWidth: "720px",
        }}
      >
        {text}
      </p>
    </section>
  );
}
