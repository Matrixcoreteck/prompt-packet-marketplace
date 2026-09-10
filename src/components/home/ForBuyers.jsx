import React from "react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { SectionHeading } from "../ui";

// Goal areas buyers come looking for. Each chip connects to the existing
// marketplace filtering: a category group, a group + subcategory, or a
// catalog search when no direct category exists yet.
const AREAS = [
  { label: "Business", group: "Business" },
  { label: "Marketing", group: "Business", subcategory: "Marketing" },
  { label: "Social Media", query: "social media" },
  { label: "Content Creation", group: "Content Creation" },
  { label: "YouTube", group: "Content Creation", subcategory: "YouTube" },
  { label: "Copywriting", group: "Content Creation", subcategory: "Copywriting" },
  { label: "Sales", group: "Business", subcategory: "Sales" },
  { label: "Job Hunting", group: "Career" },
  { label: "Productivity", query: "productivity" },
  { label: "Coding", query: "coding" },
  { label: "Image Generation", group: "AI Art" },
  { label: "Small Business", group: "Business" },
];

export default function ForBuyers({ onSelectArea }) {
  return (
    <section className="px-6 md:px-10 py-12" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionHeading
          kicker="FOR BUYERS"
          title="Find AI Help for Almost Anything"
          right={
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.05em", color: COLORS.textOnInkDim }}>
              PICK AN AREA TO BROWSE
            </span>
          }
        />
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13.5px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.65,
            margin: "0 0 18px",
            maxWidth: "620px",
          }}
        >
          Discover products for the work you're actually doing — each area below filters the live
          marketplace catalog.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {AREAS.map((area) => (
            <button
              key={area.label}
              onClick={() => onSelectArea(area)}
              style={{
                fontFamily: FONT_SANS,
                fontSize: "12.5px",
                padding: "6px 12px",
                borderRadius: "12px",
                color: COLORS.textOnInk,
                background: COLORS.inkRaised,
                border: `1px solid ${COLORS.ink}`,
                cursor: "pointer",
              }}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
