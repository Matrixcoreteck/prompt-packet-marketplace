import React, { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";

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
  padding: "10px 12px",
  width: "100%",
  outline: "none",
};

// The sign-up / log-in page. One component, two modes — the buyer only ever
// needs email + password (+ display name on signup), no role selection:
// every account starts as a buyer and can become a creator later by
// publishing a first product.
export default function AuthPage({ mode, notice, busy, error, onModeChange, onLogIn, onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [localError, setLocalError] = useState(null);
  const [showForgot, setShowForgot] = useState(false);

  const isSignup = mode === "signup";
  const shownError = localError || error;

  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    if (!email.trim() || !password) {
      setLocalError("Enter your email and password.");
      return;
    }
    if (isSignup && !displayName.trim()) {
      setLocalError("Enter a display name.");
      return;
    }
    setLocalError(null);
    if (isSignup) onSignUp(email.trim(), password, displayName.trim());
    else onLogIn(email.trim(), password);
  };

  return (
    <div className="px-6 py-14 md:py-20 flex justify-center">
      <div
        className="w-full flex flex-col gap-4 p-6 md:p-8"
        style={{ maxWidth: "440px", background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
      >
        <div className="flex flex-col gap-1.5">
          <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
            THE PROMPT INDEX
          </span>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "30px",
              fontWeight: 600,
              color: COLORS.textOnInk,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, lineHeight: 1.6, margin: 0 }}>
            {isSignup
              ? "Build your AI library or start selling your own AI products."
              : "Log in to access your library, favorites and creator tools."}
          </p>
        </div>

        {notice && (
          <div
            className="flex items-start gap-2 p-3"
            style={{ background: COLORS.ink, border: `1px solid ${COLORS.goldDim}`, borderRadius: "2px" }}
          >
            <span style={{ fontFamily: FONT_MONO, fontSize: "10.5px", letterSpacing: "0.06em", color: COLORS.goldDim, lineHeight: 1.6 }}>
              {notice}
            </span>
          </div>
        )}

        {shownError && (
          <div
            className="flex items-start gap-2 p-3"
            style={{ background: COLORS.ink, border: `1px solid ${COLORS.oxblood}`, borderRadius: "2px" }}
          >
            <AlertCircle size={14} color={COLORS.oxblood} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInk, lineHeight: 1.5 }}>
              {shownError}
            </span>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>EMAIL</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label style={labelStyle}>PASSWORD</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>
          {isSignup && (
            <div className="flex flex-col gap-1">
              <label style={labelStyle}>DISPLAY NAME</label>
              <input
                style={inputStyle}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How we'll greet you"
                autoComplete="name"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex items-center justify-center gap-2 w-full"
            style={{
              fontFamily: FONT_MONO,
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: COLORS.ink,
              background: COLORS.gold,
              border: "none",
              borderRadius: "2px",
              padding: "12px 16px",
              cursor: busy ? "default" : "pointer",
              marginTop: "4px",
            }}
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {busy ? "ONE MOMENT…" : isSignup ? "CREATE ACCOUNT" : "LOG IN"}
          </button>
        </form>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {!isSignup && (
            <button
              onClick={() => setShowForgot(true)}
              style={{
                fontFamily: FONT_MONO,
                fontSize: "10.5px",
                letterSpacing: "0.06em",
                color: COLORS.goldDim,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              FORGOT PASSWORD?
            </button>
          )}
          <button
            onClick={() => onModeChange(isSignup ? "login" : "signup")}
            style={{
              fontFamily: FONT_MONO,
              fontSize: "10.5px",
              letterSpacing: "0.06em",
              color: COLORS.goldDim,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            {isSignup ? "ALREADY HAVE AN ACCOUNT? LOG IN" : "CREATE AN ACCOUNT"}
          </button>
        </div>

        {showForgot && (
          <p
            style={{
              fontFamily: FONT_SANS,
              fontSize: "12px",
              color: COLORS.textOnInkDim,
              lineHeight: 1.6,
              margin: 0,
              borderTop: `1px solid ${COLORS.ink}`,
              paddingTop: "12px",
            }}
          >
            Password reset is handled by the platform sign-in system and isn't wired up in this
            demo build yet — accounts live only in your browser. If you can't log in, create a
            new account.
          </p>
        )}

        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: "9.5px",
            color: COLORS.textOnInkDim,
            letterSpacing: "0.05em",
            textAlign: "center",
            margin: 0,
          }}
        >
          DEMO AUTH — NO REAL PAYMENTS. YOUR DETAILS STAY IN THIS BROWSER.
        </p>
      </div>
    </div>
  );
}
