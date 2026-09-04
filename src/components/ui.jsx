import React from "react";
import { Star } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, COLORS } from "../theme";

export function Tag_({ children, tone = "gold" }) {
  const bg = tone === "gold" ? COLORS.gold : COLORS.oxblood;
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: "11px",
        letterSpacing: "0.02em",
        padding: "2px 8px",
        borderRadius: "3px",
        color: tone === "gold" ? COLORS.ink : COLORS.paper,
        background: bg,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

export function Stars({ rating }) {
  if (rating === null || rating === undefined) return null;
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={12} strokeWidth={0} fill={COLORS.gold} />
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "11.5px",
          fontWeight: 500,
          color: COLORS.textOnPaperDim,
        }}
      >
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export function CreatorAvatar({ name, size = 22 }) {
  const initials = (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLORS.gold,
        color: COLORS.ink,
        fontFamily: FONT_MONO,
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

export function BackButton({ onClick, label = "← BACK TO MARKETPLACE" }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONT_MONO,
        fontSize: "11px",
        letterSpacing: "0.08em",
        color: COLORS.goldDim,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// Section heading used on the dark ink surfaces (browse page, library).
export function SectionHeading({ kicker, title, right }) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap" style={{ marginBottom: "18px" }}>
      <div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: "11px",
            letterSpacing: "0.16em",
            color: COLORS.goldDim,
            marginBottom: "5px",
          }}
        >
          {kicker}
        </div>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "26px",
            fontWeight: 600,
            color: COLORS.textOnInk,
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}
