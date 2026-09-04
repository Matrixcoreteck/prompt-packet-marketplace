// Shared design system — the visual identity of The Prompt Index.
// Keep these values stable: dark ink surfaces, cream paper products,
// gold accents, oxblood highlights. Editorial, premium, slightly vintage.

export const FONT_DISPLAY = "'Fraunces', Georgia, serif";
export const FONT_MONO = "'IBM Plex Mono', 'Courier New', monospace";
export const FONT_SANS = "'Inter', system-ui, sans-serif";

export const COLORS = {
  ink: "#10151F",
  inkRaised: "#161D2B",
  paper: "#F6F1E7",
  paperShade: "#EDE5D1",
  gold: "#D4A73E",
  goldDim: "#8A6E28",
  oxblood: "#8B3A3A",
  textOnInk: "#EDE6D6",
  textOnInkDim: "#9AA0AC",
  textOnPaper: "#1B1A17",
  textOnPaperDim: "#5B5648",
};

export const CATEGORY_GROUPS = {
  "Content Creation": ["YouTube", "TikTok", "Instagram", "Blogging", "Podcasting", "Copywriting", "Newsletters"],
  "Business": ["Marketing", "Sales", "Customer service", "Business plans", "Market research", "Email campaigns"],
  "Creators": ["YouTube automation", "Thumbnail creation", "Social media calendars", "Video scripts", "Brand building"],
  "Career": ["Resume", "Cover letters", "Interview preparation", "LinkedIn"],
  "E-commerce": ["Product descriptions", "Ads", "Product research", "Store creation", "Email marketing"],
  "Real Estate": ["Listing descriptions", "Social media", "Lead generation", "Follow-up messages"],
  "AI Art": ["Character creation", "Product photography", "Logos", "Advertising", "Social media images"],
};

export const GROUP_NAMES = Object.keys(CATEGORY_GROUPS);

export function groupOf(subcategory) {
  return GROUP_NAMES.find((g) => CATEGORY_GROUPS[g].includes(subcategory)) || GROUP_NAMES[0];
}
