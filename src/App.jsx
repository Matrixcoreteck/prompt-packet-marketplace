import React, { useEffect, useState } from "react";
import { Store, Plus, Library as LibraryIcon, Search as SearchIcon, LayoutGrid, LogIn as LogInIcon } from "lucide-react";
import { FONT_DISPLAY, FONT_SANS, FONT_MONO, COLORS, GROUP_NAMES, CATEGORY_GROUPS, groupOf } from "./theme";
import { usePacks } from "./hooks/usePacks";
import { usePurchases } from "./hooks/usePurchases";
import { useFavorites } from "./hooks/useFavorites";
import { useRecentlyViewed } from "./hooks/useRecentlyViewed";
import { useAuth } from "./hooks/useAuth";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import CategorySection from "./components/CategorySection";
import ProductCard from "./components/ProductCard";
import ProductPage from "./components/ProductPage";
import CreatorProfile from "./components/CreatorProfile";
import ProductBuilder from "./components/builder/ProductBuilder";
import LibraryView from "./components/Library";
import CreatorDashboard from "./components/dashboard/CreatorDashboard";
import AuthPage from "./components/auth/AuthPage";
import AccountMenu from "./components/auth/AccountMenu";
import AuthPrompt from "./components/AuthPrompt";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import BecomeCreator from "./components/creator/BecomeCreator";
import CreatorProfileForm from "./components/creator/CreatorProfileForm";
import HowItWorks from "./components/home/HowItWorks";
import ForBuyers from "./components/home/ForBuyers";
import ForCreators from "./components/home/ForCreators";
import MarketplaceExplanation from "./components/home/MarketplaceExplanation";
import { SectionHeading } from "./components/ui";

// Pages that require an account. Everything else — marketplace, search,
// categories, product pages, public creator storefronts — stays open.
const PROTECTED_VIEWS = ["library", "dashboard", "sell", "profile", "settings", "becomeCreator", "editCreator"];

// Shown when a logged-out visitor taps a protected destination —
// after login they land back on what they asked for.
const LOGIN_NOTICES = {
  library: "LOG IN TO OPEN YOUR LIBRARY — YOUR PURCHASES AND FAVORITES LIVE THERE.",
  sell: "LOG IN TO START SELLING — CREATE AN ACCOUNT FIRST.",
  dashboard: "LOG IN TO OPEN YOUR CREATOR DASHBOARD.",
  profile: "LOG IN TO ACCESS YOUR PROFILE.",
  settings: "LOG IN TO ACCESS YOUR SETTINGS.",
};

export default function App() {
  const {
    user,
    busy: authBusy,
    authError,
    signUp,
    logIn,
    logOut,
    updateDisplayName,
    setCreatorName: setAccountCreatorName,
    saveCreatorProfile: saveCreatorProfileAuth,
    changePassword,
    clearAuthError,
  } = useAuth();
  const userId = user?.id || null;
  const isCreator = Boolean(user?.creatorName);

  const { packs, addPack, error: packsError } = usePacks();
  const { owned, records: purchaseRecords, purchase } = usePurchases(userId);
  const { favorites, toggleFavorite } = useFavorites(userId);
  const { recentIds, markViewed } = useRecentlyViewed(userId);

  const [view, setView] = useState("browse"); // browse | sell | library | product | creator | login | profile
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [authRedirect, setAuthRedirect] = useState("browse"); // view to return to after login
  const [loginNotice, setLoginNotice] = useState("");
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [trackRecent, setTrackRecent] = useState(true);

  // Preference: keep the Library's Recently Viewed shelf recording.
  useEffect(() => {
    if (!userId) {
      setTrackRecent(true);
      return;
    }
    window.storage
      .get(`pref:${userId}:trackRecent`, false)
      .then((res) => setTrackRecent(res && res.value === "off" ? false : true))
      .catch(() => setTrackRecent(true));
  }, [userId]);

  const toggleTrackRecent = async () => {
    const next = !trackRecent;
    setTrackRecent(next);
    if (userId) {
      await window.storage.set(`pref:${userId}:trackRecent`, next ? "on" : "off", false);
    }
  };

  const switchView = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // After a successful login/signup, return to whatever the buyer was doing.
  useEffect(() => {
    if (user && view === "login") {
      setLoginNotice("");
      let dest = authRedirect && authRedirect !== "login" ? authRedirect : "browse";
      setAuthRedirect("browse");
      // Sell is for creators — a buyer who asked to sell starts onboarding.
      if (dest === "sell" && !user.creatorName) dest = "becomeCreator";
      switchView(dest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, view]);

  // The builder is creator-only; non-creators land on BECOME A CREATOR.
  useEffect(() => {
    if (user && view === "sell" && !user.creatorName) switchView("becomeCreator");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, view]);

  // The moment onboarding succeeds the user IS a creator — the onboarding
  // screen unmounts, so drop them straight into the builder instead of a
  // blank view.
  useEffect(() => {
    if (user && view === "becomeCreator" && user.creatorName) switchView("sell");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, view]);

  // Nav destination handler: logged-out users asking for private pages go
  // straight to login and come back after signing in.
  const navGo = (key) => {
    if (!user && PROTECTED_VIEWS.includes(key)) {
      goLogin(LOGIN_NOTICES[key] || "", key);
      return;
    }
    if (key === "sell") {
      if (user && !isCreator) {
        switchView("becomeCreator");
        return;
      }
      setEditingPack(null);
    }
    switchView(key);
  };

  const goLogin = (notice, redirect) => {
    setLoginNotice(notice || "");
    setAuthRedirect(redirect || "browse");
    setAuthMode("login");
    clearAuthError();
    switchView("login");
  };

  const selectGroup = (g) => {
    setActiveGroup(g);
    setActiveSubcategory("All");
  };

  // "For Buyers" goal areas → existing catalog filtering. Group chips filter
  // by category group, subcategory chips go one level deeper, and areas with
  // no direct category yet run a catalog search (titles, descriptions,
  // categories).
  const selectBuyerArea = ({ group, subcategory, query: areaQuery }) => {
    setQuery(areaQuery || "");
    if (areaQuery) {
      selectGroup("All");
    } else if (group) {
      selectGroup(group);
      if (subcategory) setActiveSubcategory(subcategory);
    }
    setTimeout(scrollToCatalog, 0);
  };

  const openProduct = (pack) => {
    setSelectedId(pack.id);
    if (userId && trackRecent) markViewed(pack.id);
    switchView("product");
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
      p.category.toLowerCase().includes(q) ||
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
    if (!user) {
      goLogin("LOG IN TO UNLOCK THIS PACK — YOUR PURCHASES ARE SAVED TO YOUR ACCOUNT.", "product");
      return;
    }
    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 500));
    const pack = (packs || []).find((p) => p.id === packId);
    await purchase(packId, pack ? pack.price : null);
    setPurchasing(false);
  };

  const handleToggleFavorite = (packId) => {
    if (!user) {
      goLogin("LOG IN TO SAVE PRODUCTS — FAVORITES BELONG TO YOUR ACCOUNT.", view);
      return;
    }
    toggleFavorite(packId);
  };

  // Publishing associates the product with the signed-in creator and, on the
  // first product, locks the creator identity to the account.
  const publishPack = async (pack) => {
    const record = await addPack({ ...pack, creatorUserId: user?.id || undefined });
    if (user && !user.creatorName && record.sellerName) {
      await setAccountCreatorName(record.sellerName);
    }
    return record;
  };

  // Create or edit the creator profile. On rename, re-point this account's
  // published products to the new name — same identity, no duplicates.
  const saveCreatorProfile = async (fields) => {
    const oldName = user?.creatorName || null;
    const updated = await saveCreatorProfileAuth(fields);
    if (!updated) return null;
    if (oldName && oldName !== updated.creatorName) {
      const mine = (packs || []).filter((p) => p.creatorUserId === user.id || p.sellerName === oldName);
      for (const p of mine) {
        await addPack({ ...p, editSourceId: p.id, sellerName: updated.creatorName, creatorUserId: user.id });
      }
    }
    return updated;
  };

  const navBtn = (key, label, Icon) => (
    <button
      onClick={() => navGo(key)}
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

  const authBlocked = user === null && PROTECTED_VIEWS.includes(view);

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
        <div className="flex items-center gap-1 flex-wrap">
          {navBtn("browse", "Browse", Store)}
          {navBtn("library", user ? `Library (${myLibrary.length})` : "Library", LibraryIcon)}
          {isCreator && navBtn("dashboard", "Dashboard", LayoutGrid)}
          {navBtn("sell", "Sell a pack", Plus)}
          {user ? (
            <AccountMenu
              user={user}
              isCreator={isCreator}
              onLibrary={() => navGo("library")}
              onProfile={() => switchView("profile")}
              onDashboard={() => navGo("dashboard")}
              onSettings={() => switchView("settings")}
              onLogOut={async () => {
                await logOut();
                switchView("browse");
              }}
            />
          ) : (
            <button
              onClick={() => goLogin("", "browse")}
              className="flex items-center gap-2 px-3 py-2"
              style={{
                fontFamily: FONT_SANS,
                fontSize: "13.5px",
                fontWeight: 600,
                color: COLORS.goldDim,
                background: "transparent",
                border: `1px solid ${COLORS.goldDim}`,
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              <LogInIcon size={15} /> Log in
            </button>
          )}
        </div>
      </div>

      {packsError && (
        <div className="px-6 pt-4">
          <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.oxblood }}>
            {packsError}
          </p>
        </div>
      )}

      {authBlocked ? (
        <AuthPrompt
          message={
            view === "library"
              ? "Your Library and account information are available after signing in."
              : view === "sell"
              ? "Create an account to start selling your own AI products."
              : view === "dashboard"
              ? "Your Creator Dashboard is available after signing in."
              : "Your account information is available after signing in."
          }
          onLogIn={() => goLogin("", view)}
          onCreateAccount={() => {
            setAuthMode("signup");
            clearAuthError();
            switchView("login");
          }}
        />
      ) : (
        <>
          {view === "browse" && (
            <>
              <Hero
                query={query}
                onQueryChange={setQuery}
                onExplore={scrollToCatalog}
                onSell={() => navGo("sell")}
                productCount={packs ? packs.length : 0}
              />

              {!hasFilters && packs && (
                <FeaturedProducts packs={packs} owned={owned} onOpen={openProduct} />
              )}
              {!hasFilters && <HowItWorks />}
              {!hasFilters && <ForBuyers onSelectArea={selectBuyerArea} />}
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

              {!hasFilters && <ForCreators onBecomeCreator={() => navGo("sell")} />}
              {!hasFilters && <MarketplaceExplanation />}
            </>
          )}

          {view === "product" && selectedPack && (
            <ProductPage
              pack={selectedPack}
              allPacks={packs || []}
              owned={owned}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              purchasing={purchasing}
              onBack={() => switchView("browse")}
              onPurchase={handlePurchase}
              onOpenProduct={openProduct}
              onOpenCreator={openCreator}
              onOpenInLibrary={() => switchView("library")}
              ownProduct={Boolean(
                user &&
                  (selectedPack.creatorUserId === user.id ||
                    (user.creatorName && selectedPack.sellerName === user.creatorName))
              )}
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

          {view === "login" && user === null && (
            <AuthPage
              mode={authMode}
              notice={loginNotice}
              busy={authBusy}
              error={authError}
              onModeChange={(m) => {
                setAuthMode(m);
                clearAuthError();
              }}
              onLogIn={logIn}
              onSignUp={signUp}
            />
          )}

          {view === "library" && user && (
            <LibraryView
              packs={packs || []}
              owned={owned}
              purchaseRecords={purchaseRecords}
              favorites={favorites}
              recentIds={recentIds}
              onOpen={openProduct}
              onBrowse={() => switchView("browse")}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {view === "sell" && user && (
            <ProductBuilder
              packs={packs || []}
              owned={owned}
              user={user}
              initialPack={editingPack}
              onPublish={publishPack}
              onOpenProduct={openProduct}
              onOpenCreator={openCreator}
            />
          )}

          {view === "dashboard" && user && (
            <CreatorDashboard
              packs={packs || []}
              creator={user.creatorName || user.displayName}
              creatorUserId={user.id}
              userId={user.id}
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
              onEditCreator={() => switchView("editCreator")}
            />
          )}

          {view === "profile" && user && (
            <ProfilePage
              user={user}
              ownedCount={owned.size}
              favoriteCount={favorites.size}
              isCreator={isCreator}
              onUpdateDisplayName={updateDisplayName}
              onOpenCreator={openCreator}
              onBecomeCreator={() => switchView("becomeCreator")}
            />
          )}

          {view === "settings" && user && (
            <SettingsPage
              user={user}
              trackRecent={trackRecent}
              onToggleTrackRecent={toggleTrackRecent}
              onChangePassword={changePassword}
              onLogOut={async () => {
                await logOut();
                switchView("browse");
              }}
              onGoProfile={() => switchView("profile")}
            />
          )}

          {view === "becomeCreator" && user && !isCreator && (
            <BecomeCreator
              user={user}
              onSaveProfile={saveCreatorProfile}
              onGoDashboard={() => switchView("dashboard")}
              onBack={() => switchView("browse")}
            />
          )}

          {view === "editCreator" && user && isCreator && (
            <div className="px-6 md:px-10 py-10" style={{ maxWidth: "640px", margin: "0 auto" }}>
              <SectionHeading kicker="CREATOR PROFILE" title="Edit Creator Profile" />
              <p
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "13.5px",
                  color: COLORS.textOnInkDim,
                  lineHeight: 1.65,
                  margin: "0 0 24px",
                }}
              >
                Saving updates your public storefront. Products you've already published stay
                linked to this same profile.
              </p>
              <CreatorProfileForm mode="edit" user={user} onSave={saveCreatorProfile} />
              <button
                onClick={() => switchView("dashboard")}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "10.5px",
                  letterSpacing: "0.08em",
                  color: COLORS.textOnInkDim,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  marginTop: "18px",
                }}
              >
                ← BACK TO THE CREATOR DASHBOARD
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
