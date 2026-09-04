import React, { useMemo } from "react";
import { DollarSign, Rocket, Star } from "lucide-react";
import { FONT_MONO, FONT_SANS, COLORS } from "../../theme";

const ICONS = { sale: DollarSign, published: Rocket, review: Star };

// Recent activity. The events are DEMO events derived from the creator's
// demo product stats — shaped as plain event records ({ type, title, detail,
// time }) so real events from a backend can replace them later.
export default function ActivityFeed({ products }) {
  const events = useMemo(() => {
    const list = [];
    const withSales = products.filter((p) => p.stats?.salesCount > 0);
    if (withSales.length) {
      const top = withSales.reduce((a, b) => (b.stats.salesCount > a.stats.salesCount ? b : a));
      list.push({ type: "sale", title: top.title, detail: `$${top.price}`, time: "2H AGO" });
    }
    const newest = products.find((p) => p.stats?.rating == null) || products[0];
    if (newest) {
      list.push({ type: "published", title: newest.title, detail: "NOW LIVE", time: "YESTERDAY" });
    }
    const reviewed = products.find((p) => p.reviews?.length);
    if (reviewed) {
      const review = reviewed.reviews[reviewed.reviews.length - 1];
      list.push({ type: "review", title: reviewed.title, detail: "★".repeat(review.rating || 5), time: "2 DAYS AGO" });
    }
    return list;
  }, [products]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: FONT_MONO, fontSize: "11px", letterSpacing: "0.16em", color: COLORS.goldDim }}>
          RECENT ACTIVITY
        </span>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: "8.5px",
            letterSpacing: "0.1em",
            color: COLORS.goldDim,
            border: `1px solid ${COLORS.goldDim}`,
            borderRadius: "2px",
            padding: "1px 5px",
          }}
        >
          DEMO ACTIVITY
        </span>
      </div>

      {events.length === 0 ? (
        <p style={{ fontFamily: FONT_SANS, fontSize: "12.5px", color: COLORS.textOnInkDim, margin: 0 }}>
          No activity yet — publish a product to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {events.map((e, i) => {
            const Icon = ICONS[e.type];
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5"
                style={{ background: COLORS.inkRaised, border: `1px solid ${COLORS.ink}`, borderRadius: "3px" }}
              >
                <span
                  className="inline-flex items-center justify-center flex-shrink-0"
                  style={{ width: "30px", height: "30px", borderRadius: "3px", background: COLORS.ink }}
                >
                  <Icon size={14} color={COLORS.gold} />
                </span>
                <div className="flex flex-col min-w-0" style={{ flex: 1 }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: "9.5px", letterSpacing: "0.14em", color: COLORS.goldDim }}>
                    {e.type === "sale" ? "NEW SALE" : e.type === "published" ? "PRODUCT PUBLISHED" : "NEW REVIEW"}
                  </span>
                  <span
                    className="truncate"
                    style={{ fontFamily: FONT_SANS, fontSize: "13px", fontWeight: 600, color: COLORS.textOnInk }}
                  >
                    {e.title}
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span style={{ fontFamily: FONT_MONO, fontSize: "11.5px", color: COLORS.textOnInk }}>{e.detail}</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: "8.5px", letterSpacing: "0.1em", color: COLORS.textOnInkDim }}>
                    {e.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
