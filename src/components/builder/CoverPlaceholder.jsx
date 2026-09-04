import React from "react";
import { FONT_DISPLAY, FONT_MONO, COLORS } from "../../theme";
import { groupOf } from "../../theme";

// Deterministic "generated cover" — no external image services. A hash of
// the title picks one of a few ink/gold/oxblood gradient schemes, with the
// product's initials set in Fraunces. When real cover images arrive later,
// render `pack.coverImage` here instead.
const SCHEMES = [
  ["#161D2B", "#8A6E28"],
  ["#10151F", "#8B3A3A"],
  ["#1B2230", "#D4A73E"],
  ["#161D2B", "#5B5648"],
];

function hashOf(text) {
  let h = 0;
  for (const ch of text || "") h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h;
}

export default function CoverPlaceholder({ title, category, height = 150 }) {
  const scheme = SCHEMES[hashOf(title + category) % SCHEMES.length];
  const initials = (title || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        height,
        borderRadius: "2px",
        background: `linear-gradient(135deg, ${scheme[0]} 0%, ${scheme[1]} 130%)`,
        border: `1px solid ${COLORS.ink}`,
      }}
    >
      <span
        aria-hidden
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "44px",
          fontWeight: 600,
          color: COLORS.textOnInk,
          opacity: 0.55,
          letterSpacing: "0.04em",
        }}
      >
        {initials || "PI"}
      </span>
      <span
        className="absolute left-3 top-2.5"
        style={{ fontFamily: FONT_MONO, fontSize: "8.5px", letterSpacing: "0.16em", color: COLORS.goldDim }}
      >
        THE PROMPT INDEX
      </span>
      {category && (
        <span
          className="absolute right-3 bottom-2.5"
          style={{ fontFamily: FONT_MONO, fontSize: "9px", letterSpacing: "0.1em", color: COLORS.textOnInkDim }}
        >
          {groupOf(category).toUpperCase()}
        </span>
      )}
    </div>
  );
}
