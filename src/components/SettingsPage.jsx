import React, { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../theme";
import { SectionHeading, CreatorAvatar } from "./ui";

const labelStyle = {
  fontFamily: FONT_MONO,
  fontSize: "10px",
  letterSpacing: "0.12em",
  color: COLORS.goldDim,
};

const inputStyle = {
  fontFamily: FONT_SANS,
  fontSize: "13.5px",
  color: COLORS.textOnInk,
  background: COLORS.ink,
  border: `1px solid ${COLORS.ink}`,
  borderRadius: "2px",
  padding: "9px 11px",
  width: "100%",
  outline: "none",
};

function SettingsSection({ kicker, title, children }) {
  return (
    <section style={{ marginBottom: "28px" }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.14em", color: COLORS.goldDim, marginBottom: "10px" }}>
        {kicker} — {title}
      </div>
      <div
        className="flex flex-col gap-4 p-5 md:p-6"
        style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
      >
        {children}
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.12em", color: COLORS.textOnInkDim }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInk }}>{value}</span>
    </div>
  );
}

// ACCOUNT SETTINGS — account info, a simple preference, password change
// (same salted-hash scheme as signup; current password required), and
// log out. Email changes aren't offered here since the account system
// doesn't support them safely yet.
export default function SettingsPage({ user, trackRecent, onToggleTrackRecent, onChangePassword, onLogOut, onGoProfile }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pwError, setPwError] = useState(null);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  const submitPassword = async (e) => {
    e.preventDefault();
    if (pwBusy) return;
    if (!current || !next) {
      setPwError("Enter your current and new password.");
      return;
    }
    if (next.length < 4) {
      setPwError("Pick a new password of at least 4 characters.");
      return;
    }
    setPwBusy(true);
    const err = await onChangePassword(current, next);
    setPwBusy(false);
    if (err) {
      setPwError(err);
      setPwSaved(false);
    } else {
      setPwError(null);
      setCurrent("");
      setNext("");
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    }
  };

  return (
    <div className="px-6 md:px-10 py-10" style={{ maxWidth: "640px", margin: "0 auto" }}>
      <SectionHeading kicker="YOUR ACCOUNT" title="Settings" />

      <SettingsSection kicker="ACCOUNT" title="BASIC INFORMATION">
        <div className="flex items-center gap-3">
          <CreatorAvatar name={user.displayName} size={40} />
          <div className="flex flex-col">
            <span style={{ fontFamily: FONT_SANS, fontSize: "14px", fontWeight: 600, color: COLORS.textOnInk }}>
              {user.displayName}
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.06em", color: COLORS.textOnInkDim }}>
              MEMBER SINCE {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }).toUpperCase()}
            </span>
          </div>
        </div>
        <Row label="DISPLAY NAME" value={user.displayName} />
        <Row label="EMAIL" value={user.email} />
        <button
          onClick={onGoProfile}
          style={{
            fontFamily: FONT_MONO,
            fontSize: "10.5px",
            letterSpacing: "0.06em",
            color: COLORS.goldDim,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          EDIT YOUR DISPLAY NAME ON MY PROFILE →
        </button>
      </SettingsSection>

      <SettingsSection kicker="PREFERENCES" title="HOW YOUR LIBRARY WORKS">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "13.5px", fontWeight: 600, color: COLORS.textOnInk }}>
              Recently viewed tracking
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInkDim, marginTop: "2px" }}>
              Keep a private Recently Viewed shelf in your Library.
            </div>
          </div>
          <button
            onClick={onToggleTrackRecent}
            className="inline-flex items-center gap-2"
            style={{
              fontFamily: FONT_MONO,
              fontSize: "11px",
              letterSpacing: "0.06em",
              color: trackRecent ? COLORS.ink : COLORS.textOnInkDim,
              background: trackRecent ? COLORS.gold : COLORS.ink,
              border: `1px solid ${trackRecent ? COLORS.gold : COLORS.ink}`,
              borderRadius: "2px",
              padding: "7px 14px",
              cursor: "pointer",
            }}
          >
            {trackRecent ? "ON" : "OFF"}
          </button>
        </div>
      </SettingsSection>

      <SettingsSection kicker="SECURITY" title="PASSWORD">
        <form onSubmit={submitPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>CURRENT PASSWORD</label>
            <input type="password" style={inputStyle} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>NEW PASSWORD</label>
            <input type="password" style={inputStyle} value={next} onChange={(e) => setNext(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
          </div>
          {pwError && (
            <div className="flex items-start gap-2" style={{ color: COLORS.oxblood }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: "12.5px" }}>{pwError}</span>
            </div>
          )}
          {pwSaved && (
            <div className="inline-flex items-center gap-1.5" style={{ color: COLORS.gold }}>
              <Check size={14} />
              <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.06em" }}>
                PASSWORD UPDATED — USE IT NEXT TIME YOU LOG IN
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="submit"
              disabled={pwBusy}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "11.5px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: COLORS.goldDim,
                background: "transparent",
                border: `1px solid ${COLORS.goldDim}`,
                borderRadius: "2px",
                padding: "9px 16px",
                cursor: pwBusy ? "default" : "pointer",
                alignSelf: "flex-start",
              }}
            >
              {pwBusy ? "UPDATING…" : "UPDATE PASSWORD"}
            </button>
          </div>
          <p style={{ fontFamily: FONT_MONO, fontSize: "9.5px", color: COLORS.textOnInkDim, letterSpacing: "0.05em", margin: 0 }}>
            PASSWORDS ARE STORED ONLY AS SALTED HASHES — NEVER AS TEXT.
          </p>
        </form>
      </SettingsSection>

      <SettingsSection kicker="ACCOUNT ACTIONS" title="SESSION">
        <button
          onClick={onLogOut}
          style={{
            fontFamily: FONT_MONO,
            fontSize: "11.5px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: COLORS.paper,
            background: COLORS.oxblood,
            border: "none",
            borderRadius: "2px",
            padding: "10px 18px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          LOG OUT
        </button>
      </SettingsSection>
    </div>
  );
}
