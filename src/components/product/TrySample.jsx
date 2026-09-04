import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { extractVariables, generateSample } from "../../lib/sampleGenerator";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { SectionHeading } from "../ui";

export default function TrySample({ pack }) {
  const vars = useMemo(() => {
    const v = extractVariables(pack.prompts);
    return v.length ? v : ["topic"];
  }, [pack]);

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const out = await generateSample(pack, values);
    setResult(out);
    setLoading(false);
  };

  const inputStyle = {
    fontFamily: FONT_SANS,
    fontSize: "13.5px",
    color: COLORS.textOnInk,
    background: COLORS.ink,
    border: `1px solid ${COLORS.ink}`,
    borderRadius: "2px",
    padding: "10px 12px",
    width: "100%",
    outline: "none",
  };

  return (
    <section>
      <SectionHeading kicker="INTERACTIVE DEMO" title="Try This Product" />
      <div className="flex flex-col gap-4 p-6" style={{ background: COLORS.inkRaised, borderRadius: "3px" }}>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13.5px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: 0,
          }}
        >
          Fill in the blanks and see exactly what this product gives you — a prompt
          ready to run in any AI chat.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {vars.map((v) => (
            <div key={v} className="flex flex-col gap-1">
              <label style={{ fontFamily: FONT_MONO, fontSize: "10.5px", letterSpacing: "0.08em", color: COLORS.goldDim }}>
                {v.toUpperCase()}
              </label>
              <input
                style={inputStyle}
                value={values[v] || ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
                placeholder={v === "topic" ? "e.g. AI side hustles for beginners" : `Enter ${v}…`}
              />
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={generate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2"
            style={{
              fontFamily: FONT_MONO,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: COLORS.ink,
              background: COLORS.gold,
              border: "none",
              borderRadius: "2px",
              padding: "11px 20px",
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : null}
            {loading ? "GENERATING…" : "GENERATE SAMPLE"}
          </button>
        </div>

        {result && (
          <div
            className="flex flex-col gap-2 p-5"
            style={{ background: COLORS.paper, borderRadius: "2px", boxShadow: "2px 3px 0 rgba(16,21,31,0.35)" }}
          >
            <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.12em", color: COLORS.textOnPaperDim }}>
              SAMPLE RESULT — YOUR PROMPT, READY TO RUN
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: "12.5px",
                color: COLORS.textOnPaper,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {result}
            </span>
          </div>
        )}

        <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", color: COLORS.textOnInkDim, letterSpacing: "0.05em" }}>
          DEMO ONLY — NO AI API CONNECTED YET. THE SAMPLE IS GENERATED LOCALLY FROM THE PROMPT TEMPLATE.
        </span>
      </div>
    </section>
  );
}
