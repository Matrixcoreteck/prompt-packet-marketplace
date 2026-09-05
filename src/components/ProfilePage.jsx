import React, { useState } from "react";
import { Check, Pencil, Store } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { SectionHeading, Tag_ } from "./ui";
import { CreatorAvatar } from "./ui";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long" });
  } catch {
    return "—";
  }
}

function ProfileStat({ label, value }) {
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

// MY PROFILE — the buyer's account page. Only non-sensitive info is shown
// (no password material ever leaves the auth service). SETTINGS is the
// display-name editor.
export default function ProfilePage({
  user,
  ownedCount,
  favoriteCount,
  isCreator,
  onUpdateDisplayName,
  onOpenCreator,
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.displayName);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    await onUpdateDisplayName(name.trim());
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="px-6 md:px-10 py-10" style={{ maxWidth: "760px", margin: "0 auto" }}>
      <SectionHeading kicker="YOUR ACCOUNT" title="My Profile" />

      {/* Identity card */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-4 p-6"
        style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
      >
        <CreatorAvatar name={user.displayName} size={54} />
        <div className="flex flex-col gap-1.5 min-w-0">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: "24px", fontWeight: 600, color: COLORS.textOnInk, lineHeight: 1.15 }}>
            {user.displayName}
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLORS.textOnInkDim }}>{user.email}</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag_>{isCreator ? "CREATOR" : "BUYER"}</Tag_>
            {isCreator && <Tag_ tone="oxblood">SELLING</Tag_>}
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", letterSpacing: "0.08em", color: COLORS.textOnInkDim }}>
            MEMBER SINCE {formatDate(user.createdAt).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mt-6">
        <ProfileStat label="PRODUCTS OWNED" value={ownedCount} />
        <ProfileStat label="FAVORITES" value={favoriteCount} />
      </div>

      {isCreator && user.creatorName && (
        <button
          onClick={() => onOpenCreator(user.creatorName)}
          className="inline-flex items-center gap-2 mt-6"
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13px",
            fontWeight: 600,
            color: COLORS.goldDim,
            background: "transparent",
            border: `1px solid ${COLORS.goldDim}`,
            borderRadius: "2px",
            padding: "9px 16px",
            cursor: "pointer",
          }}
        >
          <Store size={14} /> View my storefront — {user.creatorName}
        </button>
      )}

      {/* Settings — display name only */}
      <div className="mt-10">
        <div
          className="flex items-center justify-between gap-2 flex-wrap mb-4"
          style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.14em", color: COLORS.goldDim }}
        >
          <span>SETTINGS</span>
          <span style={{ color: COLORS.textOnInkDim, letterSpacing: "0.05em", fontSize: "10px" }}>
            DISPLAY NAME ONLY
          </span>
        </div>
        <div
          className="flex flex-col gap-3 p-5"
          style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
        >
          {editing ? (
            <>
              <label style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.12em", color: COLORS.goldDim }}>
                DISPLAY NAME
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: "13.5px",
                  color: COLORS.textOnInk,
                  background: COLORS.ink,
                  border: `1px solid ${COLORS.ink}`,
                  borderRadius: "2px",
                  padding: "10px 12px",
                  width: "100%",
                  maxWidth: "320px",
                  outline: "none",
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={save}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: COLORS.ink,
                    background: COLORS.gold,
                    border: "none",
                    borderRadius: "2px",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user.displayName);
                  }}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: "11px",
                    letterSpacing: "0.06em",
                    color: COLORS.textOnInkDim,
                    background: "transparent",
                    border: `1px solid ${COLORS.ink}`,
                    borderRadius: "2px",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  CANCEL
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <span style={{ fontFamily: FONT_SANS, fontSize: "14px", fontWeight: 600, color: COLORS.textOnInk }}>
                  {user.displayName}
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.textOnInkDim }}>
                  Your display name shows across your library and account.
                </span>
              </div>
              {saved ? (
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLORS.gold, letterSpacing: "0.06em" }}
                >
                  <Check size={13} /> SAVED
                </span>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2"
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: COLORS.ink,
                    background: COLORS.gold,
                    border: "none",
                    borderRadius: "2px",
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  <Pencil size={13} /> EDIT PROFILE
                </button>
              )}
            </div>
          )}
        </div>
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: "9.5px",
            color: COLORS.textOnInkDim,
            letterSpacing: "0.05em",
            marginTop: "10px",
          }}
        >
          DEMO ACCOUNT — YOUR DETAILS LIVE ONLY IN THIS BROWSER. NO SENSITIVE INFORMATION IS STORED OR SHOWN.
        </p>
      </div>
    </div>
  );
}
