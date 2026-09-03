import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { CATEGORY_GROUPS, GROUP_NAMES, FONT_MONO, FONT_SANS, COLORS } from "../theme";

export default function SellForm({ onSubmit, onDone }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_GROUPS[GROUP_NAMES[0]][0]);
  const [price, setPrice] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [promptsText, setPromptsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const promptCount = promptsText.split("\n").map((s) => s.trim()).filter(Boolean).length;

  const inputStyle = {
    fontFamily: FONT_SANS,
    fontSize: "14px",
    color: COLORS.textOnPaper,
    background: COLORS.paperShade,
    border: `1px solid ${COLORS.paperShade}`,
    borderRadius: "2px",
    padding: "9px 11px",
    width: "100%",
  };
  const labelStyle = {
    fontFamily: FONT_MONO,
    fontSize: "11px",
    color: COLORS.textOnInkDim,
    letterSpacing: "0.02em",
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const prompts = promptsText.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!title.trim() || !sellerName.trim() || !price || prompts.length === 0) {
      setErr("Fill in a title, your creator name, a price, and at least one prompt.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || "No description provided.",
        category,
        price: Number(price),
        sellerName: sellerName.trim(),
        prompts,
      });
      onDone();
    } catch (e) {
      setErr("Couldn't publish the pack — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>PRODUCT TITLE</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. LinkedIn Post Prompts for Founders"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea
          style={{ ...inputStyle, minHeight: "60px" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's in the pack, who it's for"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label style={labelStyle}>CATEGORY</label>
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            {GROUP_NAMES.map((group) => (
              <optgroup key={group} label={group}>
                {CATEGORY_GROUPS[group].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1" style={{ width: "110px" }}>
          <label style={labelStyle}>PRICE (USD)</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="9"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>YOUR CREATOR NAME</label>
        <input
          style={inputStyle}
          value={sellerName}
          onChange={(e) => setSellerName(e.target.value)}
          placeholder="How buyers will see you"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>PROMPTS (ONE PER LINE)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "120px", fontFamily: FONT_MONO, fontSize: "12.5px" }}
          value={promptsText}
          onChange={(e) => setPromptsText(e.target.value)}
          placeholder={"Write a...\nGenerate 5...\nRewrite this..."}
        />
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.textOnInkDim }}>
          {promptCount} {promptCount === 1 ? "prompt" : "prompts"} detected
        </span>
      </div>
      {err && <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.oxblood }}>{err}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 px-4 py-2.5 mt-1"
        style={{
          fontFamily: FONT_SANS,
          fontSize: "14px",
          fontWeight: 600,
          color: COLORS.ink,
          background: COLORS.gold,
          borderRadius: "2px",
          cursor: submitting ? "default" : "pointer",
        }}
      >
        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        {submitting ? "Publishing…" : "Publish product"}
      </button>
    </form>
  );
}
