import React from "react";
import { FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { CreatorAvatar } from "./ui";

export default function CreatorPreview({ name }) {
  return (
    <div className="flex items-center gap-2.5">
      <CreatorAvatar name={name} size={34} />
      <div>
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13.5px",
            fontWeight: 600,
            color: COLORS.textOnPaper,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: COLORS.textOnPaperDim,
          }}
        >
          CREATOR
        </div>
      </div>
    </div>
  );
}
