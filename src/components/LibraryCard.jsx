import React from "react";
import { Bookmark, ExternalLink } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { Tag_, CreatorAvatar } from "./ui";
import { countLabel } from "../data/marketplace";

// A purchased product card for the buyer's Library. Uses the same paper
// surface + shadow language as the marketplace ProductCard, but shows
// ownership detail (price paid, prompt count, OWNED status) and Library
// actions: OPEN PRODUCT and FAVORITE.
export default function LibraryCard({ pack, favorite, onOpen, onToggleFavorite }) {
  const isFav = !!favorite;

  return (
    <div
      className="flex flex-col gap-2.5 p-5"
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.paperShade}`,
        borderRadius: "2px",
        boxShadow: "2px 3px 0 rgba(16,21,31,0.35)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <Tag_>{pack.category}</Tag_>
        <Tag_ tone="oxblood">OWNED</Tag_>
      </div>

      <h3
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "19px",
          fontWeight: 600,
          color: COLORS.textOnPaper,
          lineHeight: 1.25,
        }}
      >
        {pack.title}
      </h3>

      <div className="flex items-center gap-1.5">
        <CreatorAvatar name={pack.sellerName} size={20} />
        <span style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.textOnPaperDim }}>
          {pack.sellerName}
        </span>
      </div>

      <div
        className="flex items-center justify-between gap-2 pt-2.5"
        style={{ borderTop: `1px solid ${COLORS.paperShade}` }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnPaperDim }}>
          {pack.prompts.length} {countLabel(pack)}
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnPaperDim }}>
          {pack.price != null ? `$${pack.price} paid` : "Unlocked"}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onOpen(pack)}
          className="flex items-center justify-center gap-1.5 flex-1"
          style={{
            fontFamily: FONT_MONO,
            fontSize: "11.5px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: COLORS.ink,
            background: COLORS.gold,
            border: "none",
            borderRadius: "2px",
            padding: "9px 12px",
            cursor: "pointer",
          }}
        >
          <ExternalLink size={13} /> OPEN PRODUCT
        </button>
        <button
          onClick={() => onToggleFavorite(pack.id)}
          aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          title={isFav ? "Saved" : "Save"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: isFav ? COLORS.oxblood : COLORS.textOnPaperDim,
            background: "transparent",
            border: `1px solid ${isFav ? COLORS.oxblood : COLORS.paperShade}`,
            borderRadius: "2px",
            padding: "9px 11px",
            cursor: "pointer",
          }}
        >
          <Bookmark size={14} fill={isFav ? COLORS.oxblood : "none"} />
        </button>
      </div>
    </div>
  );
}
