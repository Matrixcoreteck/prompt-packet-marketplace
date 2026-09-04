import React from "react";
import { FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { CreatorAvatar } from "./ui";

// Creator identity block. `dark` renders for ink surfaces (product page),
// the default renders for paper surfaces. Pass `onClick` to make the whole
// block open the creator's profile.
export default function CreatorPreview({ name, dark = false, onClick }) {
  const titleColor = dark ? COLORS.textOnInk : COLORS.textOnPaper;
  const labelColor = dark ? COLORS.textOnInkDim : COLORS.textOnPaperDim;
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "transparent",
        border: "none",
        padding: 0,
        textAlign: "left",
        cursor: onClick ? "pointer" : "default",
      }}
      title={onClick ? `View ${name}'s profile` : undefined}
    >
      <CreatorAvatar name={name} size={34} />
      <div>
        <div style={{ fontFamily: FONT_SANS, fontSize: "13.5px", fontWeight: 600, color: titleColor }}>
          {name}
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.1em", color: labelColor }}>
          CREATOR
        </div>
      </div>
    </div>
  );
}
