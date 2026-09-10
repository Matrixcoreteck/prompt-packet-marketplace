import React from "react";
import { Search, BookOpen, Store } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../../theme";
import { SectionHeading } from "../ui";

const STEPS = [
  {
    icon: Search,
    num: "01",
    title: "Discover",
    text: "Find AI prompt packs and digital products built for specific goals.",
  },
  {
    icon: BookOpen,
    num: "02",
    title: "Use",
    text: "Buy a product, save it to your library, and start using it with your favorite AI tools.",
  },
  {
    icon: Store,
    num: "03",
    title: "Create & Sell",
    text: "Turn your own AI knowledge and workflows into products and sell them on The Prompt Index.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 md:px-10 py-12" style={{ borderBottom: `1px solid ${COLORS.inkRaised}` }}>
      <div className="max-w-[1100px] mx-auto">
        <SectionHeading
          kicker="HOW IT WORKS"
          title="A Marketplace, Start to Finish"
          right={
            <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.05em", color: COLORS.textOnInkDim }}>
              DISCOVER · USE · CREATE & SELL
            </span>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, num, title, text }) => (
            <div
              key={num}
              className="flex flex-col gap-3 p-5"
              style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center justify-center"
                  style={{ width: "34px", height: "34px", borderRadius: "3px", background: COLORS.ink }}
                >
                  <Icon size={16} color={COLORS.gold} />
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: "26px", fontWeight: 600, color: COLORS.goldDim }}>
                  {num}
                </span>
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: "15px", fontWeight: 600, color: COLORS.textOnInk }}>
                {title}
              </div>
              <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInkDim, lineHeight: 1.6, margin: 0 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
