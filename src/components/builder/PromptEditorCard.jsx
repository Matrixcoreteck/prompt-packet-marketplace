import React from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";

const inputStyle = {
  fontFamily: FONT_SANS,
  fontSize: "13.5px",
  color: COLORS.textOnPaper,
  background: COLORS.paperShade,
  border: `1px solid ${COLORS.paperShade}`,
  borderRadius: "2px",
  padding: "8px 10px",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: FONT_MONO,
  fontSize: "10px",
  letterSpacing: "0.1em",
  color: COLORS.textOnInkDim,
};

// One editable prompt/workflow entry in the builder. The item's shape
// ({ id, name, type, text }) is what future prompt types build on —
// `type` is ready for PROMPT / WORKFLOW / TEMPLATE.
export default function PromptEditorCard({ index, total, prompt, onChange, onDelete, onMove }) {
  return (
    <div
      className="p-4 md:p-5 flex flex-col gap-3"
      style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.14em", color: COLORS.goldDim }}>
          PROMPT {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1.5">
          <select
            value={prompt.type}
            onChange={(e) => onChange({ ...prompt, type: e.target.value })}
            style={{
              fontFamily: FONT_MONO,
              fontSize: "10.5px",
              letterSpacing: "0.06em",
              color: COLORS.textOnInkDim,
              background: COLORS.ink,
              border: `1px solid ${COLORS.ink}`,
              borderRadius: "2px",
              padding: "3px 6px",
              cursor: "pointer",
            }}
          >
            <option value="prompt">PROMPT</option>
            <option value="workflow">WORKFLOW</option>
            <option value="template">TEMPLATE</option>
          </select>
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move up"
            style={{
              background: "transparent",
              border: "none",
              padding: "3px",
              cursor: index === 0 ? "default" : "pointer",
              opacity: index === 0 ? 0.3 : 1,
            }}
          >
            <ChevronUp size={14} color={COLORS.textOnInkDim} />
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move down"
            style={{
              background: "transparent",
              border: "none",
              padding: "3px",
              cursor: index === total - 1 ? "default" : "pointer",
              opacity: index === total - 1 ? 0.3 : 1,
            }}
          >
            <ChevronDown size={14} color={COLORS.textOnInkDim} />
          </button>
          <button
            onClick={onDelete}
            title="Delete prompt"
            style={{ background: "transparent", border: "none", padding: "3px", cursor: "pointer" }}
          >
            <Trash2 size={14} color={COLORS.oxblood} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label style={labelStyle}>NAME</label>
        <input
          style={inputStyle}
          value={prompt.name}
          onChange={(e) => onChange({ ...prompt, name: e.target.value })}
          placeholder="e.g. YouTube Hook Generator"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label style={labelStyle}>PROMPT</label>
        <textarea
          style={{ ...inputStyle, fontFamily: FONT_MONO, fontSize: "12.5px", minHeight: "90px", resize: "vertical" }}
          value={prompt.text}
          onChange={(e) => onChange({ ...prompt, text: e.target.value })}
          placeholder="Write 10 attention-grabbing YouTube hooks for {{TOPIC}}…"
        />
        <span style={{ fontFamily: FONT_MONO, fontSize: "10px", color: COLORS.textOnInkDim, letterSpacing: "0.03em" }}>
          TIP — USE {"{{TOPIC}}"}-STYLE VARIABLES. BUYERS FILL THEM IN WHEN THEY RUN THE PROMPT.
        </span>
      </div>
    </div>
  );
}
