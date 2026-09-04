import React from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";

export default function Hero({ query, onQueryChange, onExplore, onSell, productCount }) {
  return (
    <section
      className="px-6 pt-14 pb-12 flex flex-col items-center text-center gap-4"
      style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}
    >
      <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.22em", color: COLORS.goldDim }}>
        THE MARKETPLACE FOR AI CREATORS
      </span>
      <h1
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(34px, 5vw, 52px)",
          fontWeight: 600,
          color: COLORS.textOnInk,
          lineHeight: 1.08,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        AI Products Made by Creators
      </h1>
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: "15.5px",
          color: COLORS.textOnInkDim,
          maxWidth: "520px",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Find prompts, workflows, templates and AI systems that help you get real work done.
      </p>

      <form
        className="flex items-center gap-2 w-full"
        style={{
          maxWidth: "560px",
          background: COLORS.inkRaised,
          borderRadius: "3px",
          padding: "5px 5px 5px 12px",
          marginTop: "6px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          onExplore();
        }}
      >
        <Search size={16} color={COLORS.textOnInkDim} style={{ flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search AI products..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: COLORS.textOnInk,
            fontFamily: FONT_SANS,
            fontSize: "14px",
            width: "100%",
            padding: "8px 0",
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: FONT_MONO,
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: COLORS.ink,
            background: COLORS.gold,
            borderRadius: "2px",
            padding: "9px 16px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          SEARCH
        </button>
      </form>

      <div className="flex items-center gap-3 flex-wrap justify-center" style={{ marginTop: "6px" }}>
        <button
          onClick={onExplore}
          className="flex items-center gap-2"
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13.5px",
            fontWeight: 600,
            color: COLORS.ink,
            background: COLORS.gold,
            borderRadius: "2px",
            padding: "10px 18px",
            cursor: "pointer",
            boxShadow: "2px 3px 0 rgba(16,21,31,0.5)",
          }}
        >
          Explore Marketplace <ArrowRight size={15} />
        </button>
        <button
          onClick={onSell}
          className="flex items-center gap-2"
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13.5px",
            fontWeight: 600,
            color: COLORS.gold,
            background: "transparent",
            border: `1px solid ${COLORS.goldDim}`,
            borderRadius: "2px",
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          <Sparkles size={15} /> Become a Creator
        </button>
      </div>

      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: "11px",
          color: COLORS.textOnInkDim,
          letterSpacing: "0.04em",
          marginTop: "8px",
        }}
      >
        {productCount} AI PRODUCTS · 7 CATEGORIES · NEW PRODUCTS WEEKLY
      </p>
    </section>
  );
}
