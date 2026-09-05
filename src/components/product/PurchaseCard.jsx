import React from "react";
import { Check, Loader2, BookOpen } from "lucide-react";
import { FONT_MONO, FONT_SANS, FONT_DISPLAY, COLORS } from "../../theme";
import { countLabel } from "../../data/marketplace";

export default function PurchaseCard({ pack, owned, purchasing, onPurchase, onOpenInLibrary }) {
  return (
    <div
      className="flex flex-col gap-3 p-6"
      style={{ background: COLORS.inkRaised, borderRadius: "3px" }}
    >
      <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", letterSpacing: "0.14em", color: COLORS.goldDim }}>
        ONE-TIME PURCHASE
      </span>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: "42px", fontWeight: 600, color: COLORS.textOnInk, lineHeight: 1 }}>
        ${pack.price}
      </span>
      <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInkDim, lineHeight: 1.5, margin: 0 }}>
        Pay once. It's yours forever in your library.
      </p>

      {owned ? (
        <div className="flex flex-col gap-2 w-full">
          <div
            className="flex items-center justify-center gap-2 w-full"
            style={{
              border: `1px solid ${COLORS.goldDim}`,
              color: COLORS.gold,
              borderRadius: "2px",
              padding: "13px 16px",
              fontFamily: FONT_SANS,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <Check size={16} /> OWNED
          </div>
          {onOpenInLibrary && (
            <button
              onClick={onOpenInLibrary}
              className="flex items-center justify-center gap-2 w-full"
              style={{
                fontFamily: FONT_MONO,
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: COLORS.ink,
                background: COLORS.gold,
                border: "none",
                borderRadius: "2px",
                padding: "11px 16px",
                cursor: "pointer",
              }}
            >
              <BookOpen size={14} /> OPEN IN LIBRARY
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => onPurchase(pack.id)}
          disabled={purchasing}
          className="flex items-center justify-center gap-2 w-full"
          style={{
            fontFamily: FONT_MONO,
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: COLORS.ink,
            background: COLORS.gold,
            border: "none",
            borderRadius: "2px",
            padding: "13px 16px",
            cursor: purchasing ? "default" : "pointer",
          }}
        >
          {purchasing ? <Loader2 size={14} className="animate-spin" /> : null}
          {purchasing ? "PROCESSING…" : "UNLOCK THIS PACK"}
        </button>
      )}

      <div className="flex flex-col gap-1.5 pt-3" style={{ borderTop: `1px solid ${COLORS.ink}` }}>
        {[`${pack.prompts.length} ${countLabel(pack)}`, "Lifetime access", "Free updates"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2"
            style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.textOnInkDim, letterSpacing: "0.03em" }}
          >
            <Check size={12} color={COLORS.goldDim} /> {t.toUpperCase()}
          </span>
        ))}
      </div>

      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: "9.5px",
          color: COLORS.textOnInkDim,
          letterSpacing: "0.05em",
          textAlign: "center",
          margin: 0,
        }}
      >
        DEMO CHECKOUT — NO REAL PAYMENT IS TAKEN
      </p>
    </div>
  );
}
