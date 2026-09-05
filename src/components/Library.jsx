import React, { useMemo, useState } from "react";
import { Search as SearchIcon, BookOpen, Bookmark, Clock, Receipt } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { SectionHeading } from "./ui";
import LibraryCard from "./LibraryCard";
import { countLabel } from "../data/marketplace";

function SummaryStat({ label, value }) {
  return (
    <div
      className="flex flex-col gap-1 px-4 py-3"
      style={{ background: COLORS.inkRaised, borderRadius: "2px" }}
    >
      <span style={{ fontFamily: FONT_MONO, fontSize: "18px", fontWeight: 600, color: COLORS.gold }}>
        {value}
      </span>
      <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.12em", color: COLORS.textOnInkDim }}>
        {label}
      </span>
    </div>
  );
}

function FilterTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: FONT_MONO,
        fontSize: "11.5px",
        letterSpacing: "0.06em",
        padding: "6px 14px",
        borderRadius: "2px",
        color: active ? COLORS.ink : COLORS.textOnInkDim,
        background: active ? COLORS.gold : COLORS.inkRaised,
        border: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function EmptyState({ icon: Icon, title, children }) {
  return (
    <div
      className="flex flex-col items-center gap-3 text-center py-14 px-6"
      style={{ border: `1px dashed ${COLORS.inkRaised}`, borderRadius: "3px" }}
    >
      <Icon size={26} color={COLORS.goldDim} />
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: "18px", fontWeight: 600, color: COLORS.textOnInk }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function Library({
  packs,
  owned,
  purchaseRecords,
  favorites,
  recentIds,
  onOpen,
  onBrowse,
  onToggleFavorite,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | favorites | recent

  const ownedPacks = useMemo(() => packs.filter((p) => owned.has(p.id)), [packs, owned]);

  const totalPrompts = useMemo(
    () => ownedPacks.reduce((s, p) => s + (p.prompts?.length || 0), 0),
    [ownedPacks]
  );
  const favoriteCount = useMemo(
    () => ownedPacks.filter((p) => favorites.has(p.id)).length,
    [ownedPacks, favorites]
  );

  const recentOwned = useMemo(
    () => recentIds.map((id) => packs.find((p) => p.id === id)).filter((p) => p && owned.has(p.id)),
    [recentIds, packs, owned]
  );

  const filtered = useMemo(() => {
    let list = ownedPacks;
    if (filter === "favorites") list = list.filter((p) => favorites.has(p.id));
    if (filter === "recent") {
      const order = new Map(recentIds.map((id, i) => [id, i]));
      list = list
        .filter((p) => order.has(p.id))
        .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.sellerName || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [ownedPacks, favorites, recentIds, filter, query]);

  const purchaseHistory = useMemo(
    () =>
      ownedPacks
        .map((p) => ({
          pack: p,
          record: purchaseRecords[p.id] || { purchasedAt: null, pricePaid: null },
        }))
        .sort((a, b) => {
          const ta = a.record.purchasedAt ? new Date(a.record.purchasedAt).getTime() : 0;
          const tb = b.record.purchasedAt ? new Date(b.record.purchasedAt).getTime() : 0;
          return tb - ta;
        }),
    [ownedPacks, purchaseRecords]
  );

  const hasAnyPurchases = ownedPacks.length > 0;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <SectionHeading
        kicker="YOUR COLLECTION"
        title="My Library"
        right={
          <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnInkDim }}>
            {ownedPacks.length} {ownedPacks.length === 1 ? "product" : "products"}
          </span>
        }
      />
      <p
        style={{
          fontFamily: FONT_SANS,
          fontSize: "14px",
          color: COLORS.textOnInkDim,
          lineHeight: 1.6,
          maxWidth: "520px",
          margin: "-6px 0 18px",
        }}
      >
        Your AI products, ready whenever you need them.
      </p>

      {/* Summary */}
      <div className="flex flex-wrap gap-3 mb-8">
        <SummaryStat label="PRODUCTS" value={ownedPacks.length} />
        <SummaryStat label="PROMPTS" value={totalPrompts} />
        <SummaryStat label="FAVORITES" value={favoriteCount} />
      </div>

      {!hasAnyPurchases ? (
        <EmptyState icon={BookOpen} title="Your library is empty">
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "13px",
              color: COLORS.textOnInkDim,
              maxWidth: "360px",
              lineHeight: 1.6,
            }}
          >
            Find AI products, workflows and templates built by creators.
          </p>
          <button
            onClick={onBrowse}
            style={{
              fontFamily: FONT_MONO,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: COLORS.ink,
              background: COLORS.gold,
              borderRadius: "2px",
              padding: "9px 18px",
              cursor: "pointer",
              border: "none",
              marginTop: "4px",
            }}
          >
            BROWSE MARKETPLACE
          </button>
        </EmptyState>
      ) : (
        <>
          {/* Search + Filters */}
          <div className="flex flex-col gap-3 mb-6">
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: COLORS.inkRaised, borderRadius: "2px" }}
            >
              <SearchIcon size={15} color={COLORS.textOnInkDim} style={{ flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search my library — title, creator, category…"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: COLORS.textOnInk,
                  fontFamily: FONT_SANS,
                  fontSize: "13.5px",
                  width: "100%",
                  minWidth: "0",
                }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>
                ALL
              </FilterTab>
              <FilterTab active={filter === "favorites"} onClick={() => setFilter("favorites")}>
                FAVORITES
              </FilterTab>
              <FilterTab active={filter === "recent"} onClick={() => setFilter("recent")}>
                RECENT
              </FilterTab>
            </div>
          </div>

          {/* Recently viewed (only when there is history and not already filtered to it) */}
          {filter !== "recent" && recentOwned.length > 1 && (
            <div className="mb-8">
              <div
                className="flex items-center gap-2 mb-3"
                style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.12em", color: COLORS.goldDim }}
              >
                <Clock size={13} /> RECENTLY VIEWED
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
                {recentOwned.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onOpen(p)}
                    className="flex-shrink-0 text-left p-3"
                    style={{
                      background: COLORS.inkRaised,
                      borderRadius: "2px",
                      border: `1px solid ${COLORS.ink}`,
                      cursor: "pointer",
                      width: "200px",
                    }}
                  >
                    <div style={{ fontFamily: FONT_MONO, fontSize: "10px", color: COLORS.goldDim, marginBottom: "4px" }}>
                      {p.category.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: COLORS.textOnInk,
                        lineHeight: 1.25,
                      }}
                    >
                      {p.title}
                    </div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: "11px", color: COLORS.textOnInkDim, marginTop: "4px" }}>
                      {p.sellerName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered results */}
          {filter === "favorites" && ownedPacks.filter((p) => favorites.has(p.id)).length === 0 ? (
            <EmptyState icon={Bookmark} title="No saved products">
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "13px",
                  color: COLORS.textOnInkDim,
                  maxWidth: "340px",
                  lineHeight: 1.6,
                }}
              >
                Save products you want to come back to later.
              </p>
            </EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState icon={SearchIcon} title="No matches">
              <p style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.textOnInkDim }}>
                Try a different search or filter.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "11.5px",
                  color: COLORS.goldDim,
                  background: "transparent",
                  border: `1px solid ${COLORS.goldDim}`,
                  borderRadius: "2px",
                  padding: "6px 14px",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
              >
                CLEAR
              </button>
            </EmptyState>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
            >
              {filtered.map((p) => (
                <LibraryCard
                  key={p.id}
                  pack={p}
                  favorite={favorites.has(p.id)}
                  onOpen={onOpen}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}

          {/* Purchase history */}
          <div className="mt-12">
            <div
              className="flex items-center gap-2 mb-4"
              style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.12em", color: COLORS.goldDim }}
            >
              <Receipt size={13} /> PURCHASE HISTORY
            </div>
            <div
              className="overflow-x-auto"
              style={{ background: COLORS.inkRaised, borderRadius: "2px", border: `1px solid ${COLORS.ink}` }}
            >
              <table className="w-full" style={{ borderCollapse: "collapse", minWidth: "480px" }}>
                <thead>
                  <tr>
                    {["Product", "Creator", "Date", "Price"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          fontFamily: FONT_MONO,
                          fontSize: "10.5px",
                          letterSpacing: "0.1em",
                          color: COLORS.textOnInkDim,
                          padding: "10px 14px",
                          borderBottom: `1px solid ${COLORS.ink}`,
                        }}
                      >
                        {h.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.map(({ pack, record }) => (
                    <tr key={pack.id}>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.ink}` }}>
                        <span style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, color: COLORS.textOnInk }}>
                          {pack.title}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.ink}` }}>
                        <span style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInkDim }}>
                          {pack.sellerName}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.ink}` }}>
                        <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnInkDim }}>
                          {record.purchasedAt ? formatDate(record.purchasedAt) : "Demo"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.ink}` }}>
                        <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnInk }}>
                          {record.pricePaid != null ? `$${record.pricePaid}` : `$${pack.price}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontFamily: FONT_MONO, fontSize: "9.5px", color: COLORS.textOnInkDim, letterSpacing: "0.05em", marginTop: "8px" }}>
              DEMO DATA — NO REAL PAYMENT IS PROCESSED. PURCHASES WITHOUT A TIMESTAMP ARE FROM EARLIER DEMO SESSIONS.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
