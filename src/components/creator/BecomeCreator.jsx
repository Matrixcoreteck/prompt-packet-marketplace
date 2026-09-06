import React, { useState } from "react";
import { Layers, UploadCloud, Store, DollarSign, ArrowRight } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { SectionHeading, Tag_ } from "../ui";
import CreatorProfileForm from "./CreatorProfileForm";

const BENEFITS = [
  {
    icon: Layers,
    title: "Create AI prompt packs",
    text: "Package your prompts, workflows and templates into products with the Create a Pack builder.",
  },
  {
    icon: UploadCloud,
    title: "Publish products",
    text: "Publish straight to the marketplace — buyers browse and unlock your products instantly.",
  },
  {
    icon: Store,
    title: "Build your creator storefront",
    text: "Every product you publish is grouped under your public storefront with your name and bio.",
  },
  {
    icon: DollarSign,
    title: "Earn from sales",
    text: "Sell the same product over and over — creators keep most of the revenue. (Real payments arrive soon.)",
  },
];

// The BECOME A CREATOR onboarding for buyers. Becoming a creator never
// removes buyer features — Library, favorites, purchases and recently
// viewed all stay tied to the account.
export default function BecomeCreator({ user, onSaveProfile, onGoDashboard, onBack }) {
  const [created, setCreated] = useState(null);

  const handleSave = async (fields) => {
    const updated = await onSaveProfile(fields);
    if (updated) setCreated(updated);
    return updated;
  };

  if (created) {
    return (
      <div className="px-6 py-16" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div
          className="flex flex-col items-center text-center gap-4 p-8"
          style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
            CREATOR STATUS ACTIVE
          </span>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "26px",
              fontWeight: 600,
              color: COLORS.textOnInk,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Creator profile created
          </h2>
          <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, lineHeight: 1.6, margin: 0 }}>
            You're now a creator, {user.displayName}. Your public storefront is live at
            <span style={{ fontFamily: FONT_MONO, color: COLORS.goldDim }}> {created.creatorName}</span> — and all your
            buyer features stay exactly as they were.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={onGoDashboard}
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: FONT_SANS,
                fontSize: "14px",
                fontWeight: 600,
                color: COLORS.ink,
                background: COLORS.gold,
                border: "none",
                borderRadius: "2px",
                padding: "11px 18px",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              Go to Creator Dashboard <ArrowRight size={15} />
            </button>
            <Tag_>CREATOR</Tag_>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10" style={{ maxWidth: "760px", margin: "0 auto" }}>
      <SectionHeading
        kicker="SELL ON THE PROMPT INDEX"
        title="Turn your AI knowledge into products and earn from every sale."
        right={<Tag_ tone={undefined}>BUYER → CREATOR</Tag_>}
      />
      <p style={{ fontFamily: FONT_SANS, fontSize: "13.5px", color: COLORS.textOnInkDim, lineHeight: 1.65, margin: "0 0 24px" }}>
        Your account stays the same — you keep your Library, favorites, purchases and recently
        viewed. Creating a creator profile simply adds selling to your account.
      </p>

      <div className="grid gap-3 sm:grid-cols-2" style={{ marginBottom: "28px" }}>
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-start gap-3 p-4"
            style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ width: "34px", height: "34px", borderRadius: "3px", background: COLORS.ink, flexShrink: 0 }}
            >
              <Icon size={16} color={COLORS.gold} />
            </span>
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: "13.5px", fontWeight: 600, color: COLORS.textOnInk }}>
                {title}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInkDim, lineHeight: 1.55, marginTop: "2px" }}>
                {text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreatorProfileForm mode="create" user={user} onSave={handleSave} />

      <button
        onClick={onBack}
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
        ← BACK TO THE MARKETPLACE
      </button>
    </div>
  );
}
