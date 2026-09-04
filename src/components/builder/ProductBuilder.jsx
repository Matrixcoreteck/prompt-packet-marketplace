import React, { useEffect, useMemo, useState } from "react";
import { Plus, Save, Eye, Rocket, AlertCircle } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS, CATEGORY_GROUPS, GROUP_NAMES } from "../../theme";
import { normalizePack } from "../../data/marketplace";
import ProductPage from "../ProductPage";
import PromptEditorCard from "./PromptEditorCard";
import BuilderSummary from "./BuilderSummary";
import PublishSuccess from "./PublishSuccess";

const DRAFT_KEY = "draft:product";

const newPrompt = () => ({
  id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  type: "prompt",
  text: "",
});

const emptyDraft = () => ({
  title: "",
  description: "",
  category: CATEGORY_GROUPS[GROUP_NAMES[0]][0],
  price: "",
  sellerName: "",
  prompts: [newPrompt()],
});

// Seed the builder from an existing published product (dashboard EDIT).
// Publishing with `sourceId` updates that product in place.
function seedDraftFromPack(p) {
  const prompts = (p.prompts || []).map((text, i) => ({
    id: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    name: p.promptMeta?.[i]?.name || "",
    type: p.promptMeta?.[i]?.type || "prompt",
    text,
  }));
  return {
    title: p.title || "",
    description: p.description || "",
    category: p.category || CATEGORY_GROUPS[GROUP_NAMES[0]][0],
    price: p.price != null ? String(p.price) : "",
    sellerName: p.sellerName || "",
    sourceId: p.id,
    prompts: prompts.length ? prompts : [newPrompt()],
  };
}

function StepHeader({ number, label, right }) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap" style={{ marginBottom: "14px" }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", letterSpacing: "0.16em", color: COLORS.goldDim }}>
        {number} — {label}
      </span>
      {right}
    </div>
  );
}

const inputStyle = {
  fontFamily: FONT_SANS,
  fontSize: "13.5px",
  color: COLORS.textOnPaper,
  background: COLORS.paperShade,
  border: `1px solid ${COLORS.paperShade}`,
  borderRadius: "2px",
  padding: "9px 11px",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: FONT_MONO,
  fontSize: "10px",
  letterSpacing: "0.1em",
  color: COLORS.textOnInkDim,
};

// The creator product builder: enter product info, build prompts,
// preview the real product page, save a draft, publish to the marketplace.
// Drafts live under "draft:" in storage (personal scope) — the marketplace
// only ever reads "pack:", so drafts never appear publicly.
export default function ProductBuilder({ packs, owned, initialPack, onPublish, onOpenProduct, onOpenCreator }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [savedFlash, setSavedFlash] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mode, setMode] = useState("edit"); // edit | preview | published
  const [published, setPublished] = useState(null);

  // When opened for EDIT, seed from the published product. Otherwise
  // restore an unfinished draft when the creator returns.
  useEffect(() => {
    (async () => {
      if (initialPack) {
        setDraft(seedDraftFromPack(initialPack));
        setDraftLoaded(true);
        return;
      }
      try {
        const res = await window.storage.get(DRAFT_KEY, false);
        if (res && res.value) {
          const d = JSON.parse(res.value);
          if (d && Array.isArray(d.prompts) && d.prompts.length) {
            setDraft({ ...emptyDraft(), ...d, prompts: d.prompts.map((p) => ({ ...newPrompt(), ...p })) });
          }
        }
      } catch {
        /* no draft */
      }
      setDraftLoaded(true);
    })();
  }, [initialPack]);

  const promptItems = useMemo(
    () =>
      draft.prompts
        .map((p) => ({ name: (p.name || "").trim(), type: p.type || "prompt", text: (p.text || "").trim() }))
        .filter((i) => i.text),
    [draft.prompts]
  );

  const missing = useMemo(() => {
    const list = [];
    if (!draft.title.trim()) list.push("a product title");
    if (!draft.description.trim()) list.push("a description");
    if (!draft.sellerName.trim()) list.push("your creator name");
    if (draft.price === "" || Number.isNaN(Number(draft.price)) || Number(draft.price) < 0)
      list.push("a valid price");
    if (promptItems.length === 0) list.push("at least one completed prompt");
    return list;
  }, [draft, promptItems]);

  const productType = useMemo(() => {
    if (promptItems.length && promptItems.every((i) => i.type === "workflow")) return "Workflow";
    if (promptItems.length && promptItems.every((i) => i.type === "template")) return "Template";
    return "Prompt Pack";
  }, [promptItems]);

  const setField = (field, value) => setDraft((d) => ({ ...d, [field]: value }));

  const setPrompt = (index, prompt) =>
    setDraft((d) => ({ ...d, prompts: d.prompts.map((p, i) => (i === index ? prompt : p)) }));
  const deletePrompt = (index) =>
    setDraft((d) => ({ ...d, prompts: d.prompts.filter((_, i) => i !== index) }));
  const movePrompt = (index, dir) =>
    setDraft((d) => {
      const prompts = [...d.prompts];
      const j = index + dir;
      if (j < 0 || j >= prompts.length) return d;
      [prompts[index], prompts[j]] = [prompts[j], prompts[index]];
      return { ...d, prompts };
    });
  const addPrompt = () => setDraft((d) => ({ ...d, prompts: [...d.prompts, newPrompt()] }));

  const saveDraft = async () => {
    try {
      await window.storage.set(DRAFT_KEY, JSON.stringify(draft), false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1600);
    } catch {
      /* storage unavailable — draft just won't persist */
    }
  };

  const publish = async () => {
    if (missing.length) {
      setErrors(missing);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors([]);
    setPublishing(true);
    try {
      const record = await onPublish({
        title: draft.title.trim(),
        description: draft.description.trim(),
        category: draft.category,
        price: Number(draft.price),
        sellerName: draft.sellerName.trim(),
        prompts: promptItems.map((i) => i.text),
        promptMeta: promptItems.map((i) => ({ name: i.name, type: i.type })),
        type: productType,
        status: "published",
        createdAt: Date.now(),
        editSourceId: draft.sourceId || undefined,
      });
      if (!draft.sourceId) {
        try {
          await window.storage.delete(DRAFT_KEY, false);
        } catch {
          /* ignore */
        }
      }
      setPublished(record);
      setMode("published");
      window.scrollTo({ top: 0 });
    } finally {
      setPublishing(false);
    }
  };

  const resetBuilder = () => {
    setDraft(emptyDraft());
    setErrors([]);
    setMode("edit");
    setPublished(null);
  };

  // ---- Published: success state ------------------------------------------
  if (mode === "published" && published) {
    return (
      <PublishSuccess
        pack={published}
        onViewProduct={() => onOpenProduct(published)}
        onViewCreatorStore={() => onOpenCreator(published.sellerName)}
        onCreateAnother={resetBuilder}
      />
    );
  }

  // ---- Preview: the real product page fed with the current draft ---------
  if (mode === "preview") {
    const previewPack = normalizePack({
      id: "preview-draft",
      title: draft.title.trim() || "Untitled AI Product",
      description: draft.description.trim() || "A short description of your product will appear here for buyers.",
      category: draft.category,
      price: draft.price !== "" && !Number.isNaN(Number(draft.price)) ? Number(draft.price) : 0,
      sellerName: draft.sellerName.trim() || "Your Creator Name",
      prompts: promptItems.map((i) => i.text),
      promptMeta: promptItems.map((i) => ({ name: i.name, type: i.type })),
      type: productType,
    });
    return (
      <div>
        <div className="px-6 md:px-10 pt-6" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            className="flex items-center justify-between gap-3 flex-wrap p-4"
            style={{ border: `1px solid ${COLORS.goldDim}`, background: COLORS.inkRaised, borderRadius: "3px" }}
          >
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.12em", color: COLORS.goldDim }}>
              PREVIEW MODE — EXACTLY WHAT BUYERS WILL SEE. NOT PUBLISHED YET.
            </span>
            <button
              onClick={() => setMode("edit")}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "11px",
                letterSpacing: "0.06em",
                color: COLORS.textOnInk,
                background: COLORS.gold,
                border: "none",
                borderRadius: "2px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              ← BACK TO BUILDER
            </button>
          </div>
        </div>
        <ProductPage
          pack={previewPack}
          allPacks={packs}
          owned={owned}
          purchasing={false}
          onPurchase={() => {}}
          onBack={() => setMode("edit")}
          onOpenProduct={() => {}}
          onOpenCreator={() => {}}
        />
      </div>
    );
  }

  // ---- Edit mode ----------------------------------------------------------
  return (
    <div className="px-6 md:px-10 py-10" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div className="flex flex-col gap-3" style={{ marginBottom: "28px" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
          CREATOR DASHBOARD
        </span>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 600,
            color: COLORS.textOnInk,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Create your AI product
        </h2>
        <span style={{ fontFamily: FONT_MONO, fontSize: "12px", letterSpacing: "0.1em", color: COLORS.goldDim }}>
          CREATE ONCE. SELL REPEATEDLY.
        </span>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "14px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.65,
            maxWidth: "560px",
            margin: 0,
          }}
        >
          Build a useful AI product, preview exactly what buyers will see, then publish it to
          The Prompt Index. Sell the same product over and over — creators keep most of the revenue.
        </p>
        {draft.sourceId && (
          <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: COLORS.goldDim }}>
            EDITING A PUBLISHED PRODUCT — PUBLISHING UPDATES IT IN PLACE.
          </span>
        )}
        {!draft.sourceId && draftLoaded && draft.prompts.some((p) => p.text || p.name) && (
          <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", color: COLORS.textOnInkDim }}>
            DRAFT RESTORED — CONTINUE WHERE YOU LEFT OFF.
          </span>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-start gap-3 p-4 mb-6"
          style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.oxblood}`, borderRadius: "3px" }}
        >
          <AlertCircle size={16} color={COLORS.oxblood} style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "13.5px", fontWeight: 600, color: COLORS.textOnInk }}>
              Fix these before publishing:
            </div>
            <ul style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.textOnInkDim, margin: "4px 0 0", paddingLeft: "16px" }}>
              {errors.map((e) => (
                <li key={e} style={{ lineHeight: 1.6 }}>
                  Add {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start">
        {/* LEFT — the builder */}
        <div className="flex flex-col gap-8 min-w-0">
          {/* Step 1 */}
          <section
            className="p-5 md:p-6"
            style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
          >
            <StepHeader number="01" label="PRODUCT INFORMATION" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>PRODUCT TITLE</label>
                <input
                  style={inputStyle}
                  value={draft.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="YouTube Creator Machine"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
                  value={draft.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="A complete AI workflow for generating YouTube ideas, hooks, scripts and titles."
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="flex flex-col gap-1 flex-1" style={{ minWidth: "180px" }}>
                  <label style={labelStyle}>CATEGORY</label>
                  <select
                    style={inputStyle}
                    value={draft.category}
                    onChange={(e) => setField("category", e.target.value)}
                  >
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
                <div className="flex flex-col gap-1" style={{ width: "130px" }}>
                  <label style={labelStyle}>PRICE (USD)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    step="1"
                    value={draft.price}
                    onChange={(e) => setField("price", e.target.value)}
                    placeholder="9"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label style={labelStyle}>CREATOR NAME</label>
                <input
                  style={inputStyle}
                  value={draft.sellerName}
                  onChange={(e) => setField("sellerName", e.target.value)}
                  placeholder="How buyers will see you"
                />
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="flex flex-col gap-4">
            <StepHeader
              number="02"
              label="BUILD YOUR PRODUCT"
              right={
                <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.06em", color: COLORS.textOnInkDim }}>
                  {draft.prompts.length} PROMPT{draft.prompts.length === 1 ? "" : "S"} CREATED
                </span>
              }
            />
            {draft.prompts.map((p, i) => (
              <PromptEditorCard
                key={p.id}
                index={i}
                total={draft.prompts.length}
                prompt={p}
                onChange={(np) => setPrompt(i, np)}
                onDelete={() => deletePrompt(i)}
                onMove={(dir) => movePrompt(i, dir)}
              />
            ))}
            <button
              onClick={addPrompt}
              className="flex items-center justify-center gap-2 px-4 py-3"
              style={{
                fontFamily: FONT_MONO,
                fontSize: "11.5px",
                letterSpacing: "0.08em",
                color: COLORS.goldDim,
                background: "transparent",
                border: `1px dashed ${COLORS.goldDim}`,
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> ADD PROMPT
            </button>
          </section>

          {/* Step 3 */}
          <section
            className="p-5 md:p-6 flex flex-col gap-4"
            style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
          >
            <StepHeader number="03" label="PREVIEW & PUBLISH" />
            <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, lineHeight: 1.6, margin: 0 }}>
              Preview the exact page buyers will see — then save a draft to continue later, or
              publish straight to the marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 flex-wrap">
              <button
                onClick={() => setMode("preview")}
                disabled={promptItems.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: COLORS.goldDim,
                  background: "transparent",
                  border: `1px solid ${COLORS.goldDim}`,
                  borderRadius: "2px",
                  cursor: promptItems.length === 0 ? "default" : "pointer",
                  opacity: promptItems.length === 0 ? 0.4 : 1,
                }}
              >
                <Eye size={14} /> PREVIEW PRODUCT
              </button>
              <button
                onClick={saveDraft}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: COLORS.textOnInkDim,
                  background: "transparent",
                  border: `1px solid ${COLORS.ink}`,
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                <Save size={14} /> {savedFlash ? "DRAFT SAVED" : "SAVE DRAFT"}
              </button>
              <button
                onClick={publish}
                disabled={publishing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:ml-auto"
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: COLORS.ink,
                  background: COLORS.gold,
                  border: "none",
                  borderRadius: "2px",
                  cursor: publishing ? "default" : "pointer",
                }}
              >
                <Rocket size={15} /> {publishing ? "PUBLISHING…" : "Publish product"}
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT — live summary */}
        <BuilderSummary draft={draft} promptCount={draft.prompts.length} />
      </div>
    </div>
  );
}
