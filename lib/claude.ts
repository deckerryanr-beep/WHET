import Anthropic from "@anthropic-ai/sdk";
import type {
  Item,
  Category,
  AdvisorRecommendation,
} from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = "claude-sonnet-4-5-20250514";

const CATEGORY_CONTEXT: Record<Category, string> = {
  wine: `You are a world-class sommelier and wine advisor with encyclopedic knowledge of wines from every
region. You understand grape varieties, terroir, vintage variation, winemaking techniques, and how to
pair wines with food and occasions. You have a gift for translating complex tasting notes into
recommendations that match exactly what someone will love.`,

  whiskey: `You are a master distiller and whiskey connoisseur with deep expertise across Bourbon, Scotch,
Irish, Japanese, and world whiskeys. You understand mash bills, aging, cask influence, regional styles,
and distillery signatures. You can identify exactly what flavor profiles someone gravitates toward and
guide them to their next perfect dram.`,

  athletic_wear: `You are a performance gear specialist and elite athletic fashion expert. You understand
fabric technologies, fit mechanics, activity-specific requirements, and the intersection of performance
and style. You know every major brand's strengths, how their sizing runs, and which pieces stand out
for both function and aesthetic.`,

  going_out_wear: `You are a top personal stylist and fashion editor who specializes in elevating women's
going-out looks. You have your finger on the pulse of current trends while understanding timeless style
principles. You understand body types, occasion dressing, what makes a piece truly special, and how to
help someone build a wardrobe that turns heads.`,
};

export async function generateRecommendations(
  category: Category,
  items: Item[],
  categoryLabel: string,
  count = 3
): Promise<AdvisorRecommendation[]> {
  const systemPrompt = `${CATEGORY_CONTEXT[category]}

You are part of WHET — "What's Hot, Expertly Tailored" — a personal taste advisory platform.
Your job is not to catalog what someone has tried, but to act as a knowledgeable friend who
knows their taste better than they do and steers them toward their next great find.

Be direct, confident, and specific. Never hedge. Explain exactly WHY each recommendation is
right for this specific person based on their history. Make them feel understood.

Always respond with valid JSON only — no markdown, no explanation outside the JSON.`;

  const userItems = items.map((item) => ({
    name: item.name,
    brand: item.brand,
    rating: item.rating,
    notes: item.notes,
    attributes: item.attributes,
    price: item.price,
  }));

  const userPrompt = `Based on this person's ${categoryLabel} history, give me ${count} highly personalized recommendations.

Their logged experiences:
${JSON.stringify(userItems, null, 2)}

Analyze their taste patterns — what ratings they give, what attributes appear in their favorites,
what they note in their reviews. Then recommend ${count} specific ${categoryLabel} items they haven't tried
that perfectly match their profile.

Return ONLY a JSON array with this exact structure:
[
  {
    "name": "Full product name",
    "brand": "Brand/producer name",
    "description": "2-3 sentences describing what makes this item special",
    "reason": "1-2 sentences explaining exactly why THIS person will love it based on their specific history",
    "price_range": "$XX - $XX",
    "search_query": "optimal search query to find this product online with images"
  }
]`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const parsed = JSON.parse(content.text) as (Omit<
    AdvisorRecommendation,
    "category"
  >)[];
  return parsed.map((r) => ({ ...r, category }));
}

export async function generateTasteInsight(
  category: Category,
  items: Item[],
  categoryLabel: string
): Promise<string> {
  const systemPrompt = `${CATEGORY_CONTEXT[category]}

You are the WHET advisor. Give a sharp, incisive 2-3 sentence analysis of someone's taste profile.
Be specific, confident, and flattering without being sycophantic. Sound like a knowledgeable friend,
not a product description. Return plain text only.`;

  const topItems = items
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      brand: item.brand,
      rating: item.rating,
      notes: item.notes,
      attributes: item.attributes,
    }));

  const userPrompt = `Analyze this person's ${categoryLabel} taste profile based on their top-rated items:
${JSON.stringify(topItems, null, 2)}

Write 2-3 sentences that capture their taste identity in a way that makes them feel truly seen and understood.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text.trim();
}
