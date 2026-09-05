import React, { useState } from "react";
import { Store, Plus, Library as LibraryIcon, Search as SearchIcon, LayoutGrid } from "lucide-react";
import { FONT_DISPLAY, FONT_SANS, FONT_MONO, COLORS, GROUP_NAMES, CATEGORY_GROUPS, groupOf } from "./theme";
import { usePacks } from "./hooks/usePacks";
import { usePurchases } from "./hooks/usePurchases";
import { useFavorites } from "./hooks/useFavorites";
import { useRecentlyViewed } from "./hooks/useRecentlyViewed";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import CategorySection from "./components/CategorySection";
import ProductCard from "./components/ProductCard";
import ProductPage from "./components/ProductPage";
import CreatorProfile from "./components/CreatorProfile";
import ProductBuilder from "./components/builder/ProductBuilder";
import LibraryView from "./components/Library";
import CreatorDashboard from "./components/dashboard/CreatorDashboard";
import { SectionHeading } from "./components/ui";

export default function App() {
  const { packs, addPack, error: packsError } = usePacks();
  const { owned, records: purchaseRecords, purchase } = usePurchases();
  const { favorites, toggleFavorite } = useFavorites();
  const { recentIds, markViewed } = useRecentlyViewed();
  const [view, setView] = useState("browse"); // browse | sell | library | product | creator
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [dashboardCreator, setDashboardCreator] = useState("Spark Tools AI");
  const [editingPack, setEditingPack] = useState(null);

  const switchView = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectGroup = (g) => {
    setActiveGroup(g);
    setActiveSubcategory("All");
  };

  const openProduct = (pack) => {
    setSelectedId(pack.id);
    markViewed(pack.id);
    switchView("product");
  };

  const openLibrary = () => {
    setSelectedId(null);
    switchView("library");
  };

  const openCreator = (name) => {
    setCreatorName(name);
    switchView("creator");
  };

  const filtered = (packs || []).filter((p) => {
    const matchesGroup = activeGroup === "All" || groupOf(p.category) === activeGroup;
    const matchesSub = activeSubcategory === "All" || p.category === activeSubcategory;
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.sellerName || "").toLowerCase().includes(q);
    return matchesGroup && matchesSub && matchesQuery;
  });

  const myLibrary = (packs || []).filter((p) => owned.has(p.id));
  const hasFilters = Boolean(query.trim()) || activeGroup !== "All";
  const selectedPack = (packs || []).find((p) => p.id === selectedId);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePurchase = async (packId) => {
    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 500));
    const pack = (packs || []).find((p) => p.id === packId);
    await purchase(packId, pack ? pack.price : null);
    setPurchasing(false);
  };

  // Publishing makes that creator the dashboard's active creator, so new
  // products automatically show up in their dashboard and storefront.
  const publishPack = async (pack) => {
    const record = await addPack(pack);
    setDashboardCreator(record.sellerName);
    return record;
  };

  const navBtn = (key, label, Icon) => (
    <button
      onClick={() => {
        if (key === "sell") setEditingPack(null);
        switchView(key);
      }}
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
    <div style={{ background: COLORS.ink, fontFamily: FONT_SANS }} className="w-full rounded-md overflow-hidden">
      <div
        className="px-6 py-5 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: 600, color: COLORS.textOnInk }}>
            The Prompt Index
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.goldDim }}>
            prompt packs · workflows · templates
          </span>
        </div>
        <div className="flex items-center gap-1">
          {navBtn("browse", "Browse", Store)}
          {navBtn("library", `Library (${myLibrary.length})`, LibraryIcon)}
          {navBtn("dashboard", "Dashboard", LayoutGrid)}
          {navBtn("sell", "Sell a pack", Plus)}
        </div>
      </div>

      {packsError && (
        <div className="px-6 pt-4">
          <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.oxblood }}>
            {packsError}
          </p>
        </div>
      )}

      {view === "browse" && (
        <>
          <Hero
            query={query}
            onQueryChange={setQuery}
            onExplore={scrollToCatalog}
            onSell={() => switchView("sell")}
            productCount={packs ? packs.length : 0}
          />

          {!hasFilters && packs && (
            <FeaturedProducts packs={packs} owned={owned} onOpen={openProduct} />
          )}
          {!hasFilters && (
            <CategorySection
              onSelect={(g) => {
                selectGroup(g);
                setTimeout(scrollToCatalog, 0);
              }}
            />
          )}

          <section id="catalog" className="px-6 py-10" style={{ borderTop: `1px solid ${COLORS.inkRaised}` }}>
            <SectionHeading
              kicker={hasFilters ? "SEARCH & FILTER" : "THE CATALOG"}
              title="Browse All Products"
              right={
                <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnInkDim }}>
                  {packs === null ? "…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
                </span>
              }
            />

            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div
                className="flex items-center gap-2 px-3 py-2 flex-1"
                style={{ background: COLORS.inkRaised, borderRadius: "2px", minWidth: "220px" }}
              >
                <SearchIcon size={15} color={COLORS.textOnInkDim} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
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
              <p style={{ fontFamily: FONT_SANS, color: COLORS.textOnInkDim, fontSize: "13.5px" }}>
                Loading catalog…
              </p>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <SearchIcon size={22} color={COLORS.goldDim} />
                <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim }}>
                  No products match — try a different search or category.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    selectGroup("All");
                  }}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "11.5px",
                    color: COLORS.goldDim,
                    background: "transparent",
                    border: `1px solid ${COLORS.goldDim}`,
                    borderRadius: "2px",
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} pack={p} owned={owned.has(p.id)} onOpen={openProduct} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {view === "product" && selectedPack && (
        <ProductPage
          pack={selectedPack}
          allPacks={packs || []}
          owned={owned}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          purchasing={purchasing}
          onBack={() => switchView("browse")}
          onPurchase={handlePurchase}
          onOpenProduct={openProduct}
          onOpenCreator={openCreator}
          onOpenInLibrary={openLibrary}
        />
      )}

      {view === "creator" && creatorName && (
        <CreatorProfile
          name={creatorName}
          packs={packs || []}
          owned={owned}
          onOpenProduct={openProduct}
          onBack={() => switchView("browse")}
        />
      )}

      {view === "library" && (
        <LibraryView
          packs={packs || []}
          owned={owned}
          purchaseRecords={purchaseRecords}
          favorites={favorites}
          recentIds={recentIds}
          onOpen={openProduct}
          onBrowse={() => switchView("browse")}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {view === "sell" && (
        <ProductBuilder
          packs={packs || []}
          owned={owned}
          initialPack={editingPack}
          onPublish={publishPack}
          onOpenProduct={openProduct}
          onOpenCreator={openCreator}
        />
      )}

      {view === "dashboard" && (
        <CreatorDashboard
          packs={packs || []}
          creator={dashboardCreator}
          onCreatorChange={setDashboardCreator}
          onOpenProduct={openProduct}
          onOpenCreator={openCreator}
          onBrowse={() => switchView("browse")}
          onCreate={() => {
            setEditingPack(null);
            switchView("sell");
          }}
          onEdit={(pack) => {
            setEditingPack(pack);
            switchView("sell");
          }}
          onEditDraft={() => {
            setEditingPack(null);
            switchView("sell");
          }}
        />
      )}
    </div>
  );
}
