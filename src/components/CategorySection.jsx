import React from "react";
import {
  PenTool,
  Briefcase,
  Sparkles,
  GraduationCap,
  ShoppingBag,
  Home,
  Palette,
} from "lucide-react";
import { CATEGORY_GROUPS, GROUP_NAMES, FONT_DISPLAY, FONT_MONO, COLORS } from "../theme";
import { SectionHeading } from "./ui";

const CATEGORY_ICONS = {
  "Content Creation": PenTool,
  "Business": Briefcase,
  "Creators": Sparkles,
  "Career": GraduationCap,
  "E-commerce": ShoppingBag,
  "Real Estate": Home,
  "AI Art": Palette,
};

export default function CategorySection({ onSelect }) {
  return (
    <section className="px-6 py-10">
      <SectionHeading kicker="FIND YOUR NICHE" title="Popular Categories" />
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {GROUP_NAMES.map((g) => {
          const Icon = CATEGORY_ICONS[g];
          const subs = CATEGORY_GROUPS[g];
          return (
            <button
              key={g}
              onClick={() => onSelect(g)}
              className="text-left p-4 flex flex-col gap-2"
              style={{
                background: COLORS.inkRaised,
                border: "1px solid transparent",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "transform 120ms ease, border-color 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = COLORS.goldDim;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              <Icon size={20} color={COLORS.gold} />
              <span
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "16px",
                  fontWeight: 600,
                  color: COLORS.textOnInk,
                  lineHeight: 1.2,
                }}
              >
                {g}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: COLORS.textOnInkDim }}>
                {subs.length} subcategories
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
