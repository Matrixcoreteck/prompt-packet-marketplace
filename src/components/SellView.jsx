import React from "react";
import { Zap, TrendingUp, Wallet } from "lucide-react";
import { FONT_DISPLAY, FONT_MONO, FONT_SANS, COLORS } from "../theme";
import SellForm from "./SellForm";

const PITCH_POINTS = [
  {
    icon: Zap,
    title: "Publish instantly",
    text: "Your product goes live in the marketplace the moment you submit it.",
  },
  {
    icon: TrendingUp,
    title: "Get discovered",
    text: "Popular products surface in Trending Now, in front of every visitor.",
  },
  {
    icon: Wallet,
    title: "Earn from every sale",
    text: "Sell the same product over and over — creators keep most of the revenue.",
  },
];

export default function SellView({ onSubmit, onDone }) {
  return (
    <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-10">
      <div className="flex flex-col gap-4" style={{ flex: "1 1 380px" }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.18em", color: COLORS.goldDim }}>
          CREATOR DASHBOARD
        </span>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 600,
            color: COLORS.textOnInk,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Create once. Sell repeatedly.
        </h2>
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: "14px",
            color: COLORS.textOnInkDim,
            lineHeight: 1.65,
            maxWidth: "440px",
          }}
        >
          Publish an AI product once and earn money from every sale. The Prompt Index handles
          discovery and checkout — you focus on making something people want.
        </p>
        <div className="flex flex-col gap-3" style={{ marginTop: "6px" }}>
          {PITCH_POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span
                className="inline-flex items-center justify-center"
                style={{ width: "34px", height: "34px", borderRadius: "3px", background: COLORS.inkRaised, flexShrink: 0 }}
              >
                <Icon size={16} color={COLORS.gold} />
              </span>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: "13.5px", fontWeight: 600, color: COLORS.textOnInk }}>
                  {title}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: "13px", color: COLORS.textOnInkDim, lineHeight: 1.5 }}>
                  {text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.inkRaised, borderRadius: "3px", padding: "12px 14px", marginTop: "4px" }}>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: "11px",
              color: COLORS.goldDim,
              lineHeight: 1.6,
              display: "block",
            }}
          >
            DEMO MODE — payouts aren't enabled yet. Real Stripe payments and creator payouts are coming.
          </span>
        </div>
      </div>

      <div style={{ flex: "1.2 1 420px" }}>
        <div style={{ background: COLORS.inkRaised, borderRadius: "3px", padding: "22px" }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: "11px",
              letterSpacing: "0.16em",
              color: COLORS.goldDim,
              marginBottom: "16px",
            }}
          >
            LIST YOUR PRODUCT
          </div>
          <SellForm onSubmit={onSubmit} onDone={onDone} />
        </div>
      </div>
    </div>
  );
}
