import React from "react";
import { Lock } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";

// Shown when a logged-out visitor opens a protected page (Library, Profile,
// Dashboard, Sell a pack). Public pages — marketplace, product pages and
// creator storefronts — stay open to everyone.
export default function AuthPrompt({ message, onLogIn, onCreateAccount }) {
  return (
    <div className="px-6 py-20 flex justify-center">
      <div className="flex flex-col items-center gap-3 text-center" style={{ maxWidth: "420px" }}>
        <span
          className="inline-flex items-center justify-center"
          style={{ width: "48px", height: "48px", borderRadius: "3px", background: COLORS.inkRaised }}
        >
          <Lock size={20} color={COLORS.gold} />
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
          MEMBERS ONLY
        </span>
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
          Log in to continue
        </h2>
        <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, lineHeight: 1.6, margin: 0 }}>
          {message || "This area is available after signing in."}
        </p>
        <button
          onClick={onLogIn}
          style={{
            fontFamily: FONT_MONO,
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: COLORS.ink,
            background: COLORS.gold,
            border: "none",
            borderRadius: "2px",
            padding: "10px 22px",
            cursor: "pointer",
            marginTop: "6px",
          }}
        >
          LOG IN
        </button>
        <button
          onClick={onCreateAccount}
          style={{
            fontFamily: FONT_MONO,
            fontSize: "10.5px",
            letterSpacing: "0.06em",
            color: COLORS.goldDim,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          CREATE AN ACCOUNT
        </button>
      </div>
    </div>
  );
}
