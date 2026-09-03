import React from "react";
import { X, Check, Loader2, Lock } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { Tag_, Stars } from "./ui";
import CreatorPreview from "./CreatorPreview";
import { formatSales, countLabel } from "../data/marketplace";

function PromptRow({ prompt, index }) {
  return (
    <div
      className="flex items-start gap-2.5"
      style={{ background: COLORS.paperShade, padding: "10px 12px", borderRadius: "2px" }}
    >
      <span style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.goldDim, paddingTop: "2px" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: "12.5px",
          color: COLORS.textOnPaper,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {prompt}
      </span>
    </div>
  );
}

function LockedRow({ prompt }) {
  return (
    <div
      style={{
        position: "relative",
        background: COLORS.paperShade,
        padding: "10px 12px",
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          fontFamily: FONT_MONO,
          fontSize: "12.5px",
          color: COLORS.textOnPaper,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          filter: "blur(4px)",
          userSelect: "none",
        }}
      >
        {prompt}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center gap-1.5"
        style={{
          fontFamily: FONT_SANS,
          fontSize: "12px",
          fontWeight: 600,
          color: COLORS.textOnPaperDim,
        }}
      >
        <Lock size={13} /> Unlock to view
      </div>
    </div>
  );
}

// The marketplace product page — evolved from the original PackDetail.
// Free users see a small preview; owners see the full pack.
export default function ProductDetail({ pack, owned, onClose, onPurchase, purchasing }) {
  const stats = pack.stats || {};
  const isNew = !stats.rating && !stats.salesCount;
  const visible = owned ? pack.prompts : pack.prompts.slice(0, 1);
  const locked = owned ? [] : pack.prompts.slice(1);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: "rgba(16,21,31,0.78)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-4"
        style={{
          background: COLORS.paper,
          borderRadius: "3px",
          boxShadow: "4px 6px 0 rgba(16,21,31,0.5)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag_>{pack.category}</Tag_>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "10.5px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "2px 8px",
                borderRadius: "3px",
                color: COLORS.textOnPaperDim,
                border: `1px solid ${COLORS.paperShade}`,
              }}
            >
              {pack.type || "Prompt Pack"}
            </span>
            {owned && <Tag_ tone="oxblood">OWNED</Tag_>}
          </div>
          <button onClick={onClose} aria-label="Close">
            <X size={18} color={COLORS.textOnPaperDim} />
          </button>
        </div>

        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "28px",
            fontWeight: 600,
            color: COLORS.textOnPaper,
            lineHeight: 1.15,
          }}
        >
          {pack.title}
        </h2>
        <p style={{ fontFamily: FONT_SANS, fontSize: "14px", color: COLORS.textOnPaperDim, lineHeight: 1.6 }}>
          {pack.description}
        </p>

        <div
          className="flex items-center justify-between gap-3 flex-wrap pt-4"
          style={{ borderTop: `1px solid ${COLORS.paperShade}` }}
        >
          <CreatorPreview name={pack.sellerName} />
          <div className="inline-flex items-center gap-2 flex-wrap">
            {isNew ? (
              <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnPaperDim }}>
                Just published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Stars rating={stats.rating} />
                <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnPaperDim }}>
                  ({stats.ratingCount}) · {formatSales(stats.salesCount)} sales
                </span>
              </span>
            )}
            <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnPaperDim }}>
              · {pack.prompts.length} {countLabel(pack)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: "10.5px",
              letterSpacing: "0.14em",
              color: COLORS.textOnPaperDim,
              marginBottom: "2px",
            }}
          >
            {owned ? "FULL PACK — ALL PROMPTS UNLOCKED" : "FREE PREVIEW"}
          </div>
          {visible.map((p, i) => (
            <PromptRow key={i} prompt={p} index={i} />
          ))}
          {locked.map((p, i) => (
            <LockedRow key={i} prompt={p} />
          ))}
        </div>

        <div
          className="flex items-center justify-between gap-3 mt-2 pt-4"
          style={{ borderTop: `1px solid ${COLORS.paperShade}` }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: "22px", fontWeight: 600, color: COLORS.textOnPaper }}>
            ${pack.price}
          </span>
          {owned ? (
            <span
              className="flex items-center gap-1"
              style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.oxblood, fontWeight: 600 }}
            >
              <Check size={16} /> In your library
            </span>
          ) : (
            <button
              onClick={() => onPurchase(pack.id)}
              disabled={purchasing}
              className="flex items-center gap-2 px-5 py-2.5"
              style={{
                fontFamily: FONT_SANS,
                fontSize: "13.5px",
                fontWeight: 600,
                color: COLORS.paper,
                background: COLORS.ink,
                borderRadius: "2px",
                cursor: purchasing ? "default" : "pointer",
              }}
            >
              {purchasing ? <Loader2 size={14} className="animate-spin" /> : null}
              {purchasing ? "Processing…" : "Unlock pack"}
            </button>
          )}
        </div>
        {!owned && (
          <p style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.textOnPaperDim }}>
            Demo checkout — no real payment is taken. A live version would run this through Stripe.
          </p>
        )}
      </div>
    </div>
  );
}
