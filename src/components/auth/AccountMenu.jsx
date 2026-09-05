import React, { useEffect, useRef, useState } from "react";
import { BookOpen, User, LayoutGrid, Settings, LogOut, ChevronDown } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";

// The signed-in account control in the navigation: avatar + display name,
// with a dropdown for the buyer's personal areas. CREATOR DASHBOARD only
// appears once the account has a creator identity (first published product).
export default function AccountMenu({
  user,
  isCreator,
  onLibrary,
  onProfile,
  onDashboard,
  onSettings,
  onLogOut,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const items = [
    { icon: BookOpen, label: "MY LIBRARY", onClick: onLibrary },
    { icon: User, label: "MY PROFILE", onClick: onProfile },
    isCreator && { icon: LayoutGrid, label: "CREATOR DASHBOARD", onClick: onDashboard },
    { icon: Settings, label: "SETTINGS", onClick: onSettings },
  ].filter(Boolean);

  const initial = (user.displayName || "?").trim()[0] || "?";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2.5 py-1.5"
        style={{
          fontFamily: FONT_SANS,
          fontSize: "13.5px",
          fontWeight: 600,
          color: COLORS.textOnInk,
          background: COLORS.inkRaised,
          border: `1px solid ${COLORS.ink}`,
          borderRadius: "2px",
          cursor: "pointer",
        }}
      >
        <span
          className="inline-flex items-center justify-center"
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: COLORS.gold,
            color: COLORS.ink,
            fontFamily: FONT_MONO,
            fontSize: "11px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {initial.toUpperCase()}
        </span>
        <span className="max-w-[120px] truncate">{user.displayName}</span>
        <ChevronDown size={13} color={COLORS.textOnInkDim} style={{ flexShrink: 0 }} />
      </button>

      {open && (
        <div
          className="flex flex-col"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: "210px",
            background: COLORS.inkRaised,
            border: `1px solid ${COLORS.ink}`,
            borderRadius: "2px",
            boxShadow: "2px 3px 0 rgba(16,21,31,0.5)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {items.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-left"
              style={{
                fontFamily: FONT_MONO,
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: COLORS.textOnInk,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.ink)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Icon size={14} color={COLORS.gold} /> {label}
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onLogOut();
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-left"
            style={{
              fontFamily: FONT_MONO,
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: COLORS.paper,
              background: COLORS.oxblood,
              border: "none",
              borderTop: `1px solid ${COLORS.ink}`,
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> LOG OUT
          </button>
        </div>
      )}
    </div>
  );
}
