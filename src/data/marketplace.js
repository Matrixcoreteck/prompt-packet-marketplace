import { groupOf } from "../theme";

// ---------------------------------------------------------------------------
// Sample marketplace data.
//
// The `stats` figures (rating, ratingCount, salesCount) and `reviews` are
// DEMO DATA, not real transactions or real customers. They live in optional
// structures on each product so they can be swapped for real database values
// later without touching components.
//
// Products created through the Sell-a-pack form get empty stats and render
// as "NEW" until real data exists.
//
// Future-ready fields: `type` ("Prompt Pack" | "Workflow" | "Template") leaves
// room for a wider catalog, and `stats` can grow reviews/favorites/analytics
// without reshaping the product record.
// ---------------------------------------------------------------------------

export const STARTER_PACKS = [
  {
    id: "seed-1",
    title: "Cold Email Openers That Get Replies",
    description:
      "20 opening lines tuned for B2B outreach, organized by objection type.",
    category: "Copywriting",
    price: 9,
    sellerName: "Spark Tools AI",
    type: "Prompt Pack",
    stats: { rating: 4.8, ratingCount: 214, salesCount: 342 },
    prompts: [
      "Write a 2-line cold email opener referencing {{recent_event}} at {{company}}, no pleasantries.",
      "Rewrite this opener to sound like a peer, not a vendor: {{draft}}",
      "Generate 5 subject lines under 40 characters for an email about {{topic}}.",
    ],
    reviews: [
      { id: "r1-1", author: "Marcus T.", rating: 5, date: "Aug 2026", text: "Saved me hours of work. The prompts were much more useful than generic ChatGPT prompts." },
      { id: "r1-2", author: "Dana R.", rating: 5, date: "Jul 2026", text: "Reply rates went up on my very first campaign. The organization by objection type is genuinely smart." },
    ],
  },
  {
    id: "seed-2",
    title: "Product Photography Prompts",
    description:
      "Midjourney prompts for clean studio-style product shots, e-commerce ready.",
    category: "Product photography",
    price: 12,
    sellerName: "Spark Tools AI",
    type: "Prompt Pack",
    stats: { rating: 4.9, ratingCount: 178, salesCount: 506 },
    prompts: [
      "{{product}}, studio lighting, white seamless background, 85mm lens, product photography --ar 1:1",
      "{{product}} on a marble surface, soft natural light, shallow depth of field --ar 4:5",
    ],
    reviews: [
      { id: "r2-1", author: "Priya S.", rating: 5, date: "Aug 2026", text: "Very easy to use and the workflow actually makes sense. My product shots finally look professional." },
      { id: "r2-2", author: "Leo K.", rating: 5, date: "Jul 2026", text: "Plug in the product name, get a shot I can actually put in the store. Worth every dollar." },
      { id: "r2-3", author: "Sam W.", rating: 4, date: "Jun 2026", text: "Great formulas. Would love a few more lifestyle-scene variations." },
    ],
  },
  {
    id: "seed-3",
    title: "YouTube Automation Starter Kit",
    description: "Scripting and channel-setup prompts for faceless YouTube channels.",
    category: "YouTube automation",
    price: 10,
    sellerName: "Spark Tools AI",
    type: "Workflow",
    stats: { rating: 4.7, ratingCount: 156, salesCount: 421 },
    prompts: [
      "Write a 60-second faceless YouTube script hook about {{topic}}, no fluff, first line must state the payoff.",
      "Generate 8 video title options for {{topic}} optimized for click-through, under 60 characters each.",
    ],
    reviews: [
      { id: "r3-1", author: "Jules A.", rating: 5, date: "Aug 2026", text: "The script hook prompt alone was worth the price. My retention graph finally looks normal." },
      { id: "r3-2", author: "Renee P.", rating: 4, date: "Jul 2026", text: "Solid system for starting a faceless channel without wading through fluff." },
    ],
  },
  {
    id: "seed-4",
    title: "The Newsletter Growth Engine",
    description:
      "A full workflow for turning a quiet newsletter into a growing, paying audience.",
    category: "Newsletters",
    price: 14,
    sellerName: "Rift Creative",
    type: "Workflow",
    stats: { rating: 4.9, ratingCount: 96, salesCount: 388 },
    prompts: [
      "Turn this week's topic {{topic}} into a 5-section newsletter outline with a hook, 3 takeaways, and a CTA.",
      "Write 3 subject lines for an issue of {{newsletter_name}} about {{topic}}, each under 45 characters, curiosity-driven.",
      "Draft a 3-email welcome sequence for new subscribers of {{newsletter_name}}, warm and personal tone.",
      "Suggest 5 lead-magnet ideas for a newsletter about {{niche}}, ranked by perceived value.",
      "Rewrite this paragraph to be 40% shorter without losing the voice: {{paragraph}}",
    ],
    reviews: [
      { id: "r4-1", author: "Alicia M.", rating: 5, date: "Aug 2026", text: "My open rates are the best they've ever been. The welcome-sequence workflow is genuinely good." },
      { id: "r4-2", author: "Tom H.", rating: 5, date: "Jul 2026", text: "Feels like a course I can run in any AI chat. The lead-magnet prompt was an unexpected favorite." },
    ],
  },
  {
    id: "seed-5",
    title: "Ultimate Brand Voice Builder",
    description:
      "Templates for defining, documenting, and enforcing a consistent brand voice.",
    category: "Brand building",
    price: 11,
    sellerName: "Atelier Nova",
    type: "Template",
    stats: { rating: 4.6, ratingCount: 74, salesCount: 203 },
    prompts: [
      "Analyze this copy and describe the brand voice in 5 adjectives: {{copy_samples}}",
      "Create a brand voice chart with do/don't examples for a {{industry}} brand that sounds {{tone}}.",
      "Write 3 tagline options for {{brand}} that are under 8 words.",
      "Generate a one-page brand messaging framework: promise, proof, personality.",
      "Rewrite this LinkedIn post in our brand voice: {{post}}",
      "Audit these 5 social captions for voice consistency and flag mismatches: {{captions}}",
    ],
    reviews: [
      { id: "r5-1", author: "Nadia F.", rating: 5, date: "Aug 2026", text: "Finally got our voice down on paper. The audit prompt is sneaky useful — it catches things our whole team missed." },
      { id: "r5-2", author: "Chris D.", rating: 4, date: "Jun 2026", text: "Good framework. Took a bit of tweaking for our niche, but that's expected." },
    ],
  },
  {
    id: "seed-6",
    title: "Real Estate Listing Descriptions That Sell",
    description:
      "Listing copy prompts that turn property features into lifestyle stories buyers want.",
    category: "Listing descriptions",
    price: 8,
    sellerName: "Keystone Studio",
    type: "Prompt Pack",
    stats: { rating: 4.7, ratingCount: 61, salesCount: 176 },
    prompts: [
      "Write a 150-word listing description for a {{property_type}} in {{neighborhood}}, highlighting {{feature_1}} and {{feature_2}}.",
      "Generate 5 attention-grabbing opening lines for a {{price_range}} {{property_type}} listing.",
      "Turn these bullet points into flowing marketing copy: {{features}}",
      "Write a neighborhood guide intro for {{neighborhood}} that sells the lifestyle, 100 words.",
    ],
    reviews: [
      { id: "r6-1", author: "Derrick B.", rating: 5, date: "Jul 2026", text: "Listings write themselves now. My agent clients think I hired a copywriter." },
    ],
  },
  {
    id: "seed-7",
    title: "Interview Prep Power Pack",
    description:
      "From \"tell me about yourself\" to salary talks — prompts that make prep fast.",
    category: "Interview preparation",
    price: 7,
    sellerName: "CareerCraft AI",
    type: "Prompt Pack",
    stats: { rating: 4.8, ratingCount: 88, salesCount: 149 },
    prompts: [
      "Give me 10 likely interview questions for a {{role}} role at a {{company_type}}, ranked by difficulty.",
      "Help me answer 'Tell me about yourself' for a {{role}} position in under 90 seconds using this resume: {{resume}}",
      "Turn this experience into a STAR-format story: {{experience}}",
      "Generate 5 smart questions I should ask the interviewer about the {{role}} role.",
      "Do a mock interview: ask me one question at a time for a {{role}} role, wait for my answer, then give feedback.",
    ],
    reviews: [
      { id: "r7-1", author: "Maya C.", rating: 5, date: "Aug 2026", text: "Landed the job. The STAR-format prompt made interview prep way less painful than it usually is." },
      { id: "r7-2", author: "Owen L.", rating: 5, date: "Jul 2026", text: "The mock interview prompt is brilliant — it actually waits for your answer and gives feedback." },
    ],
  },
  {
    id: "seed-8",
    title: "Logo Concepts for Midjourney",
    description:
      "Tested logo prompt formulas — minimalist, vintage badge, monogram, and mascot.",
    category: "Logos",
    price: 13,
    sellerName: "Atelier Nova",
    type: "Prompt Pack",
    stats: { rating: 4.5, ratingCount: 52, salesCount: 118 },
    prompts: [
      "Minimalist vector logo for {{brand}}, {{industry}} industry, single color, flat design, negative space --no text --ar 1:1",
      "Vintage badge logo for {{brand}}, circular emblem, 2-color palette, engraving style --ar 1:1",
      "Modern geometric monogram for the letters {{initials}}, gold on dark background, luxury feel --ar 1:1",
      "Mascot logo concept for {{brand}}, friendly character, bold outlines, sticker style --ar 1:1",
    ],
    reviews: [
      { id: "r8-1", author: "Freya N.", rating: 4, date: "Jun 2026", text: "Presented four strong concepts to the client in one afternoon. The monogram formula is my favorite." },
    ],
  },
];

// Creator profile demo data — keyed by creator name so it joins to any
// product by `sellerName`. Replace with real creator accounts later.
export const CREATOR_PROFILES = {
  "Spark Tools AI":
    "A small studio building no-fluff prompt systems for marketers and B2B teams. Every pack is tested on real campaigns before it ships.",
  "Rift Creative":
    "Newsletter strategists turned prompt makers. They build workflows that turn quiet audiences into growing, paying ones.",
  "Atelier Nova":
    "A design-led studio crafting prompt kits for brand identity work — from voice to visual identity.",
  "Keystone Studio":
    "Real-estate marketing specialists writing prompts that sell homes, not just describe them.",
  "CareerCraft AI":
    "Career coaches and recruiters building interview and job-search prompts that get people hired.",
};

export function creatorProfile(name) {
  return {
    name,
    description:
      CREATOR_PROFILES[name] ||
      "An independent creator selling AI products on The Prompt Index.",
  };
}

// Fill in defaults for products that predate the stats/type/reviews fields
// (e.g. packs loaded from storage or created before this upgrade).
export function normalizePack(p) {
  return {
    type: "Prompt Pack",
    ...p,
    stats: { rating: null, ratingCount: 0, salesCount: 0, ...(p.stats || {}) },
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
  };
}

export function formatSales(n) {
  return (n || 0).toLocaleString("en-US");
}

export function countLabel(pack) {
  if (pack.type === "Workflow") return "steps";
  if (pack.type === "Template") return "sections";
  return "prompts";
}

// Related products: same subcategory first, then same category group,
// then anything else. Used by the product page's "You May Also Like".
export function relatedPacks(packs, pack) {
  const others = packs.filter((p) => p.id !== pack.id);
  const sameCategory = others.filter((p) => p.category === pack.category);
  const sameGroup = others.filter(
    (p) => p.category !== pack.category && groupOf(p.category) === groupOf(pack.category)
  );
  const seen = new Set([...sameCategory, ...sameGroup].map((p) => p.id));
  const rest = others.filter((p) => !seen.has(p.id));
  return [...sameCategory, ...sameGroup, ...rest].slice(0, 3);
}
