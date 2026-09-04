import React, { useState } from "react";
import { Lock } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { countLabel } from "../../data/marketplace";
import { SectionHeading } from "../ui";

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONT_MONO,
        fontSize: "10.5px",
        letterSpacing: "0.06em",
        padding: "4px 10px",
        borderRadius: "2px",
        cursor: "pointer",
        flexShrink: 0,
        color: copied ? COLORS.ink : COLORS.goldDim,
        background: copied ? COLORS.gold : "transparent",
        border: `1px solid ${copied ? COLORS.gold : COLORS.goldDim}`,
      }}
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

function PromptCard({ prompt, index, showCopy, meta }) {
  return (
    <div
      className="flex items-start justify-between gap-3 p-4 md:p-5"
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.paperShade}`,
        borderRadius: "2px",
        boxShadow: "2px 3px 0 rgba(16,21,31,0.35)",
      }}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.goldDim, paddingTop: "2px" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          {meta?.name ? (
            <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.08em", color: COLORS.goldDim }}>
              {meta.name.toUpperCase()}
              {meta.type && meta.type !== "prompt" ? ` · ${meta.type.toUpperCase()}` : ""}
            </span>
          ) : null}
          <span
            className="min-w-0"
            style={{
              fontFamily: FONT_MONO,
              fontSize: "12.5px",
              color: COLORS.textOnPaper,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {prompt}
          </span>
        </div>
      </div>
      {showCopy && <CopyButton text={prompt} />}
    </div>
  );
}

function LockedCard({ prompt }) {
  return (
    <div
      style={{
        position: "relative",
        background: COLORS.paperShade,
        padding: "14px 16px",
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
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          filter: "blur(5px)",
          userSelect: "none",
        }}
      >
        {prompt}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center gap-1.5"
        style={{ fontFamily: FONT_SANS, fontSize: "12px", fontWeight: 600, color: COLORS.textOnPaperDim }}
      >
        <Lock size={13} /> Unlock to view
      </div>
    </div>
  );
}

export default function WhatsInside({ pack, owned }) {
  const visible = owned ? pack.prompts : pack.prompts.slice(0, 1);
  const locked = owned ? [] : pack.prompts.slice(1);

  return (
    <section>
      <SectionHeading
        kicker="PREVIEW THE GOODS"
        title="What's Inside"
        right={
          <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.05em", color: COLORS.textOnInkDim }}>
            {pack.prompts.length} {countLabel(pack).toUpperCase()} INCLUDED
          </span>
        }
      />
      <div className="flex flex-col gap-2.5">
        {visible.map((p, i) => (
          <PromptCard key={i} prompt={p} index={i} showCopy={owned} meta={pack.promptMeta?.[i]} />
        ))}
        {locked.map((p, i) => (
          <LockedCard key={i} prompt={p} />
        ))}
      </div>
      {!owned && (
        <p style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnInkDim, marginTop: "12px" }}>
          + {locked.length} more {countLabel(pack)} unlock after purchase
        </p>
      )}
    </section>
  );
}
