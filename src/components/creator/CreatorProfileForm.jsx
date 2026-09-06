import React, { useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { CreatorAvatar } from "../ui";

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

// One form, two modes:
//   create — the BECOME A CREATOR onboarding (first profile)
//   edit   — EDIT CREATOR PROFILE from the dashboard/settings
// Saving goes through the account service, which keeps the profile linked
// to the same account — no duplicate creator identities.
export default function CreatorProfileForm({ mode, user, onSave }) {
  const [name, setName] = useState(user.creatorName || "");
  const [bio, setBio] = useState(user.creatorBio || "");
  const [initials, setInitials] = useState(user.creatorInitials || "");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const isEdit = mode === "edit";

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!name.trim()) {
      setError("A creator name is required.");
      return;
    }
    setError(null);
    setBusy(true);
    const updated = await onSave({ name, bio, initials });
    setBusy(false);
    if (updated) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-5 p-6"
      style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
    >
      <div className="flex items-center gap-4">
        <CreatorAvatar name={name || user.displayName} size={48} initials={initials} />
        <span style={{ fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.06em", color: COLORS.textOnInkDim, lineHeight: 1.6 }}>
          YOUR STOREFRONT AVATAR — INITIALS FROM YOUR NAME,
          <br />
          OR SET YOUR OWN BELOW.
        </span>
      </div>

      {error && (
        <div
          className="flex items-start gap-2 p-3"
          style={{ background: COLORS.ink, border: `1px solid ${COLORS.oxblood}`, borderRadius: "2px" }}
        >
          <AlertCircle size={14} color={COLORS.oxblood} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInk, lineHeight: 1.5 }}>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label style={labelStyle}>CREATOR NAME</label>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="How buyers will see you"
        />
        {isEdit && (
          <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", letterSpacing: "0.06em", color: COLORS.goldDim }}>
            YOUR PUBLISHED PRODUCTS STAY LINKED TO THIS PROFILE — NO DUPLICATES ARE CREATED.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label style={labelStyle}>CREATOR BIO</label>
        <textarea
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="What you build and who it's for — shown on your public storefront."
        />
      </div>

      <div className="flex flex-col gap-1" style={{ maxWidth: "120px" }}>
        <label style={labelStyle}>CREATOR INITIALS</label>
        <input
          style={{ ...inputStyle, fontFamily: FONT_MONO, textTransform: "uppercase" }}
          value={initials}
          onChange={(e) => setInitials(e.target.value.slice(0, 2))}
          placeholder={user.displayName.slice(0, 2)}
        />
        <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", color: COLORS.textOnInkDim, letterSpacing: "0.06em" }}>
          OPTIONAL — MAX 2 CHARACTERS
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={busy}
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
            cursor: busy ? "default" : "pointer",
          }}
        >
          {busy ? "SAVING…" : isEdit ? "SAVE CHANGES" : "CREATE CREATOR PROFILE"}
        </button>
        {saved && (
          <span
            className="inline-flex items-center gap-1.5"
            style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.06em", color: COLORS.gold }}
          >
            <Check size={13} /> {isEdit ? "SAVED — YOUR STOREFRONT IS UPDATED" : "CREATOR PROFILE CREATED"}
          </span>
        )}
      </div>
    </form>
  );
}
