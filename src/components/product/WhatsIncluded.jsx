import React from "react";
import { ListChecks, Type, Folder } from "lucide-react";
import { FONT_SANS, FONT_MONO, COLORS } from "../../theme";
import { countLabel } from "../../data/marketplace";
import { SectionHeading } from "../ui";

// Product facts only — values the creator actually provided. No invented
// metadata (e.g. intended use or AI tools) unless the product data has it.
export default function WhatsIncluded({ pack }) {
  const rows = [
    { icon: ListChecks, label: `${pack.prompts.length} ${countLabel(pack)}`, note: "Included in this product" },
    { icon: Folder, label: pack.category, note: "Category" },
    { icon: Type, label: pack.type || "Prompt Pack", note: "Product type" },
  ];

  return (
    <section>
      <SectionHeading kicker="AT A GLANCE" title="What's Included" />
      <div className="grid gap-4 sm:grid-cols-3">
        {rows.map(({ icon: Icon, label, note }) => (
          <div
            key={note}
            className="flex items-center gap-3 p-4"
            style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ width: "32px", height: "32px", borderRadius: "3px", background: COLORS.ink, flexShrink: 0 }}
            >
              <Icon size={15} color={COLORS.gold} />
            </span>
            <div className="min-w-0">
              <div style={{ fontFamily: FONT_SANS, fontSize: "14px", fontWeight: 600, color: COLORS.textOnInk }}>
                {label}
              </div>
              <div style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.08em", color: COLORS.textOnInkDim }}>
                {note.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
