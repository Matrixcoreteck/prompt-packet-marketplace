import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, X, Library, Store, User, Tag, ChevronRight, Check, Loader2 } from "lucide-react";

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";
const FONT_SANS = "'Inter', system-ui, sans-serif";

const COLORS = {
  ink: "#10151F",
  inkRaised: "#161D2B",
  paper: "#F6F1E7",
  paperShade: "#EDE5D1",
  gold: "#D4A73E",
  goldDim: "#8A6E28",
  oxblood: "#8B3A3A",
  textOnInk: "#EDE6D6",
  textOnInkDim: "#9AA0AC",
  textOnPaper: "#1B1A17",
  textOnPaperDim: "#5B5648",
};

const CATEGORY_GROUPS = {
  "Content Creation": ["YouTube", "TikTok", "Instagram", "Blogging", "Podcasting", "Copywriting", "Newsletters"],
  "Business": ["Marketing", "Sales", "Customer service", "Business plans", "Market research", "Email campaigns"],
  "Creators": ["YouTube automation", "Thumbnail creation", "Social media calendars", "Video scripts", "Brand building"],
  "Career": ["Resume", "Cover letters", "Interview preparation", "LinkedIn"],
  "E-commerce": ["Product descriptions", "Ads", "Product research", "Store creation", "Email marketing"],
  "Real Estate": ["Listing descriptions", "Social media", "Lead generation", "Follow-up messages"],
  "AI Art": ["Character creation", "Product photography", "Logos", "Advertising", "Social media images"],
};
const GROUP_NAMES = Object.keys(CATEGORY_GROUPS);
function groupOf(subcategory) {
  return GROUP_NAMES.find((g) => CATEGORY_GROUPS[g].includes(subcategory)) || GROUP_NAMES[0];
}

const STARTER_PACKS = [
  {
    id: "seed-1",
    title: "Cold Email Openers That Get Replies",
    description:
      "20 opening lines tuned for B2B outreach, organized by objection type.",
    category: "Copywriting",
    price: 9,
    sellerName: "Spark Tools AI",
    prompts: [
      "Write a 2-line cold email opener referencing {{recent_event}} at {{company}}, no pleasantries.",
      "Rewrite this opener to sound like a peer, not a vendor: {{draft}}",
      "Generate 5 subject lines under 40 characters for an email about {{topic}}.",
    ],
  },
  {
    id: "seed-2",
    title: "Product Photography Prompts",
    description:
      "Midjourney prompts for clean studio-style product shots, e-commerce ready.",
    category: "Product photography",
    price: 12,
    sellerName: "Spark Tools AI",
    prompts: [
      "{{product}}, studio lighting, white seamless background, 85mm lens, product photography --ar 1:1",
      "{{product}} on a marble surface, soft natural light, shallow depth of field --ar 4:5",
    ],
  },
  {
    id: "seed-3",
    title: "YouTube Automation Starter Kit",
    description: "Scripting and channel-setup prompts for faceless YouTube channels.",
    category: "YouTube automation",
    price: 10,
    sellerName: "Spark Tools AI",
    prompts: [
      "Write a 60-second faceless YouTube script hook about {{topic}}, no fluff, first line must state the payoff.",
      "Generate 8 video title options for {{topic}} optimized for click-through, under 60 characters each.",
    ],
  },
];

function usePacks() {
  const [packs, setPacks] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const list = await window.storage.list("pack:", true);
      if (!list || !list.keys || list.keys.length === 0) {
        setPacks(STARTER_PACKS);
        return;
      }
      const loaded = [];
      for (const key of list.keys) {
        try {
          const res = await window.storage.get(key, true);
          if (res && res.value) loaded.push(JSON.parse(res.value));
        } catch (e) {
          /* skip unreadable entry */
        }
      }
      setPacks(loaded.length ? loaded : STARTER_PACKS);
    } catch (e) {
      setError("Couldn't load the catalog. Showing sample packs instead.");
      setPacks(STARTER_PACKS);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addPack = async (pack) => {
    const id = "pack-" + Date.now();
    const record = { ...pack, id };
    await window.storage.set("pack:" + id, JSON.stringify(record), true);
    setPacks((prev) => [record, ...(prev || [])]);
    return record;
  };

  return { packs, addPack, error };
}

function usePurchases() {
  const [owned, setOwned] = useState(new Set());

  const load = useCallback(async () => {
    try {
      const list = await window.storage.list("purchase:", false);
      if (list && list.keys) {
        setOwned(new Set(list.keys.map((k) => k.replace("purchase:", ""))));
      }
    } catch (e) {
      /* no purchases yet */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const purchase = async (packId) => {
    await window.storage.set("purchase:" + packId, "1", false);
    setOwned((prev) => new Set([...prev, packId]));
  };

  return { owned, purchase };
}

function Tag_({ children, tone = "gold" }) {
  const bg = tone === "gold" ? COLORS.gold : COLORS.oxblood;
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: "11px",
        letterSpacing: "0.02em",
        padding: "2px 8px",
        borderRadius: "3px",
        color: tone === "gold" ? COLORS.ink : COLORS.paper,
        background: bg,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function PackCard({ pack, owned, onOpen }) {
  return (
    <button
      onClick={() => onOpen(pack)}
      className="text-left p-5 flex flex-col gap-3"
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.paperShade}`,
        borderRadius: "2px",
        boxShadow: "2px 3px 0 rgba(16,21,31,0.35)",
        cursor: "pointer",
        transition: "transform 120ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="flex items-start justify-between gap-2">
        <Tag_>{pack.category}</Tag_>
        {owned && <Tag_ tone="oxblood">OWNED</Tag_>}
      </div>
      <h3
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "20px",
          fontWeight: 600,
          color: COLORS.textOnPaper,
          lineHeight: 1.25,
        }}
      >
        {pack.title}
      </h3>
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: "13.5px",
          color: COLORS.textOnPaperDim,
          lineHeight: 1.5,
        }}
      >
        {pack.description}
      </p>
      <div className="flex items-center justify-between mt-1">
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: "12px",
            color: COLORS.textOnPaperDim,
          }}
        >
          by {pack.sellerName}
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "16px",
            fontWeight: 600,
            color: COLORS.textOnPaper,
          }}
        >
          ${pack.price}
        </span>
      </div>
    </button>
  );
}

function PackDetail({ pack, owned, onClose, onPurchase, purchasing }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: "rgba(16,21,31,0.75)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-4"
        style={{
          background: COLORS.paper,
          borderRadius: "3px",
          boxShadow: "4px 6px 0 rgba(16,21,31,0.5)",
        }}
      >
        <div className="flex items-start justify-between">
          <Tag_>{pack.category}</Tag_>
          <button onClick={onClose} aria-label="Close">
            <X size={18} color={COLORS.textOnPaperDim} />
          </button>
        </div>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "26px",
            fontWeight: 600,
            color: COLORS.textOnPaper,
          }}
        >
          {pack.title}
        </h2>
        <p style={{ fontFamily: FONT_SANS, fontSize: "14px", color: COLORS.textOnPaperDim }}>
          {pack.description}
        </p>
        <div style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.textOnPaperDim }}>
          by {pack.sellerName} · {pack.prompts.length} prompts
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {pack.prompts.slice(0, owned ? pack.prompts.length : 1).map((p, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "12.5px",
                color: COLORS.textOnPaper,
                background: COLORS.paperShade,
                padding: "10px 12px",
                borderRadius: "2px",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {p}
            </div>
          ))}
          {!owned && pack.prompts.length > 1 && (
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: "12.5px",
                color: COLORS.textOnPaperDim,
                padding: "10px 12px",
              }}
            >
              + {pack.prompts.length - 1} more prompts unlock after purchase
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-4" style={{ borderTop: `1px solid ${COLORS.paperShade}` }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: "20px", fontWeight: 600, color: COLORS.textOnPaper }}>
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
              className="flex items-center gap-2 px-4 py-2"
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

function SellForm({ onSubmit, onDone }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_GROUPS[GROUP_NAMES[0]][0]);
  const [price, setPrice] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [promptsText, setPromptsText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

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
    color: COLORS.textOnPaperDim,
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
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>PACK TITLE</label>
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. LinkedIn Post Prompts for Founders" />
      </div>
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea style={{ ...inputStyle, minHeight: "60px" }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's in the pack, who it's for" />
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label style={labelStyle}>CATEGORY</label>
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            {GROUP_NAMES.map((group) => (
              <optgroup key={group} label={group}>
                {CATEGORY_GROUPS[group].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1" style={{ width: "110px" }}>
          <label style={labelStyle}>PRICE (USD)</label>
          <input style={inputStyle} type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>YOUR CREATOR NAME</label>
        <input style={inputStyle} value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="How buyers will see you" />
      </div>
      <div className="flex flex-col gap-1">
        <label style={labelStyle}>PROMPTS (ONE PER LINE)</label>
        <textarea
          style={{ ...inputStyle, minHeight: "120px", fontFamily: FONT_MONO, fontSize: "12.5px" }}
          value={promptsText}
          onChange={(e) => setPromptsText(e.target.value)}
          placeholder={"Write a...\nGenerate 5...\nRewrite this..."}
        />
      </div>
      {err && (
        <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.oxblood }}>{err}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 px-4 py-2.5 mt-1"
        style={{
          fontFamily: FONT_SANS,
          fontSize: "14px",
          fontWeight: 600,
          color: COLORS.paper,
          background: COLORS.ink,
          borderRadius: "2px",
          cursor: submitting ? "default" : "pointer",
        }}
      >
        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        {submitting ? "Publishing…" : "Publish pack"}
      </button>
    </form>
  );
}

export default function App() {
  const { packs, addPack, error: packsError } = usePacks();
  const { owned, purchase } = usePurchases();
  const [view, setView] = useState("browse"); // browse | sell | library
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const selectGroup = (g) => {
    setActiveGroup(g);
    setActiveSubcategory("All");
  };

  const filtered = (packs || []).filter((p) => {
    const matchesGroup = activeGroup === "All" || groupOf(p.category) === activeGroup;
    const matchesSub = activeSubcategory === "All" || p.category === activeSubcategory;
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    return matchesGroup && matchesSub && matchesQuery;
  });

  const myLibrary = (packs || []).filter((p) => owned.has(p.id));

  const handlePurchase = async (packId) => {
    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 500));
    await purchase(packId);
    setPurchasing(false);
  };

  const navBtn = (key, label, Icon) => (
    <button
      onClick={() => setView(key)}
      className="flex items-center gap-2 px-3 py-2"
      style={{
        fontFamily: FONT_SANS,
        fontSize: "13.5px",
        fontWeight: 600,
        color: view === key ? COLORS.ink : COLORS.textOnInkDim,
        background: view === key ? COLORS.gold : "transparent",
        borderRadius: "2px",
        cursor: "pointer",
      }}
    >
      <Icon size={15} /> {label}
    </button>
  );

  return (
    <div style={{ background: COLORS.ink, minHeight: "600px", fontFamily: FONT_SANS }} className="w-full rounded-md overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: 600, color: COLORS.textOnInk }}>
            The Prompt Index
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.goldDim }}>
            a marketplace of AI prompt packs
          </span>
        </div>
        <div className="flex items-center gap-1">
          {navBtn("browse", "Browse", Store)}
          {navBtn("library", `Library (${myLibrary.length})`, Library)}
          {navBtn("sell", "Sell a pack", Plus)}
        </div>
      </div>

      <div className="p-6">
        {packsError && (
          <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.oxblood, marginBottom: "12px" }}>
            {packsError}
          </p>
        )}

        {view === "browse" && (
          <>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div
                className="flex items-center gap-2 px-3 py-2 flex-1"
                style={{ background: COLORS.inkRaised, borderRadius: "2px", minWidth: "220px" }}
              >
                <Search size={15} color={COLORS.textOnInkDim} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search packs…"
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: COLORS.textOnInk,
                    fontFamily: FONT_SANS,
                    fontSize: "13.5px",
                    width: "100%",
                  }}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {["All", ...GROUP_NAMES].map((g) => (
                  <button
                    key={g}
                    onClick={() => selectGroup(g)}
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: "11.5px",
                      padding: "5px 10px",
                      borderRadius: "2px",
                      color: activeGroup === g ? COLORS.ink : COLORS.textOnInkDim,
                      background: activeGroup === g ? COLORS.gold : COLORS.inkRaised,
                      cursor: "pointer",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {activeGroup !== "All" && (
              <div className="flex items-center gap-2 flex-wrap mb-5">
                {["All", ...CATEGORY_GROUPS[activeGroup]].map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSubcategory(s)}
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: "12px",
                      padding: "4px 9px",
                      borderRadius: "10px",
                      color: activeSubcategory === s ? COLORS.paper : COLORS.textOnInkDim,
                      background: activeSubcategory === s ? COLORS.oxblood : "transparent",
                      border: `1px solid ${activeSubcategory === s ? COLORS.oxblood : COLORS.inkRaised}`,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {packs === null ? (
              <p style={{ fontFamily: FONT_SANS, color: COLORS.textOnInkDim, fontSize: "13.5px" }}>Loading catalog…</p>
            ) : filtered.length === 0 ? (
              <p style={{ fontFamily: FONT_SANS, color: COLORS.textOnInkDim, fontSize: "13.5px" }}>
                No packs match — try a different search or category.
              </p>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                {filtered.map((p) => (
                  <PackCard key={p.id} pack={p} owned={owned.has(p.id)} onOpen={setSelected} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "library" && (
          <>
            {myLibrary.length === 0 ? (
              <p style={{ fontFamily: FONT_SANS, color: COLORS.textOnInkDim, fontSize: "13.5px" }}>
                Nothing here yet. Packs you unlock will show up in your library.
              </p>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                {myLibrary.map((p) => (
                  <PackCard key={p.id} pack={p} owned onOpen={setSelected} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "sell" && (
          <div>
            <div className="flex items-center gap-2 mb-5" style={{ color: COLORS.textOnInkDim }}>
              <ChevronRight size={14} />
              <span style={{ fontFamily: FONT_SANS, fontSize: "13px" }}>
                Anyone can list a pack — it publishes to the marketplace immediately.
              </span>
            </div>
            <SellForm onSubmit={addPack} onDone={() => setView("browse")} />
          </div>
        )}
      </div>

      {selected && (
        <PackDetail
          pack={selected}
          owned={owned.has(selected.id)}
          onClose={() => setSelected(null)}
          onPurchase={handlePurchase}
          purchasing={purchasing}
        />
      )}
    </div>
  );
}
