import React from "react";
import { Package, Tag, Users, Sparkles } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { SectionHeading } from "../ui";

const BENEFITS = [
  { icon: Package, title: "Create your own AI products", text: "Package prompts, workflows and templates with the Create a Pack builder." },
  { icon: Tag, title: "Set your own prices", text: "You decide what each product is listed for in the marketplace." },
  { icon: Users, title: "Reach buyers through the marketplace", text: "Your products appear in the catalog and under your public creator storefront." },
];

export default function ForCreators({ onBecomeCreator }) {
  return (
    <section className="px-6 md:px-10 py-12" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionHeading
          kicker="FOR CREATORS"
          title="Turn Your AI Knowledge Into a Product"
          right={
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.05em", color: COLORS.textOnInkDim }}>
              SELL WHAT YOU KNOW
            </span>
          }
        />
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "13.5px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.65,
            margin: "0 0 20px",
            maxWidth: "640px",
          }}
        >
          If you've figured out a better way to use AI, package your knowledge into a prompt pack
          and sell it to people who need it.
        </p>
        <div className="grid gap-4 sm:grid-cols-3" style={{ marginBottom: "22px" }}>
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-4"
              style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{ width: "32px", height: "32px", borderRadius: "3px", background: COLORS.ink, flexShrink: 0 }}
              >
                <Icon size={15} color={COLORS.gold} />
              </span>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, color: COLORS.textOnInk }}>
                  {title}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: "12px", color: COLORS.textOnInkDim, lineHeight: 1.55, marginTop: "3px" }}>
                  {text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onBecomeCreator}
          className="inline-flex items-center gap-2"
          style={{
            fontFamily: FONT_SANS,
            fontSize: "14px",
            fontWeight: 600,
            color: COLORS.ink,
            background: COLORS.gold,
            border: "none",
            borderRadius: "2px",
            padding: "11px 20px",
            cursor: "pointer",
            boxShadow: "2px 3px 0 rgba(16,21,31,0.5)",
          }}
        >
          <Sparkles size={15} /> Become a Creator
        </button>
      </div>
    </section>
  );
}
