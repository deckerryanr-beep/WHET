export type Category =
  | "wine"
  | "whiskey"
  | "athletic_wear"
  | "going_out_wear";

export const CATEGORY_LABELS: Record<Category, string> = {
  wine: "Wine",
  whiskey: "Whiskey",
  athletic_wear: "Athletic Wear",
  going_out_wear: "Going Out Wear",
};

export const CATEGORY_SLUGS: Record<string, Category> = {
  wine: "wine",
  whiskey: "whiskey",
  "athletic-wear": "athletic_wear",
  "going-out-wear": "going_out_wear",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  wine: "Reds, whites, rosés, and sparkling",
  whiskey: "Bourbon, Scotch, Irish, Japanese & beyond",
  athletic_wear: "Performance gear that moves with you",
  going_out_wear: "Looks that turn heads",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  wine: "🍷",
  whiskey: "🥃",
  athletic_wear: "👟",
  going_out_wear: "👗",
};

// ── Database Types ──────────────────────────────────────────────

export interface Item {
  id: string;
  user_id: string;
  category: Category;
  name: string;
  brand?: string;
  rating: number;
  notes?: string;
  attributes: Record<string, unknown>;
  image_url?: string;
  price?: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  category: Category;
  name: string;
  brand?: string;
  description: string;
  reason: string;
  image_url?: string;
  price_range?: string;
  where_to_buy: WhereToBuy[];
  created_at: string;
  dismissed: boolean;
  saved: boolean;
}

export interface WhereToBuy {
  name: string;
  type: "online" | "local";
  url?: string;
  price?: string;
  address?: string;
  distance?: string;
}

export interface TasteProfile {
  id: string;
  user_id: string;
  wine_profile: WineProfile | null;
  whiskey_profile: WhiskeyProfile | null;
  athletic_wear_profile: AthleticWearProfile | null;
  going_out_wear_profile: GoingOutWearProfile | null;
  updated_at: string;
}

// ── Category-Specific Attribute Types ──────────────────────────

export interface WineAttributes {
  variety?: string;
  region?: string;
  vintage?: number;
  body?: "Light" | "Medium" | "Full";
  sweetness?: "Dry" | "Off-dry" | "Semi-sweet" | "Sweet";
  tannins?: number; // 1-5
  acidity?: number; // 1-5
  finish?: "Short" | "Medium" | "Long";
  aromas?: string[];
}

export interface WhiskeyAttributes {
  type?: "Bourbon" | "Scotch" | "Irish" | "Japanese" | "Rye" | "Other";
  distillery?: string;
  region?: string;
  age?: number;
  abv?: number;
  flavor_notes?: string[];
  smoke_level?: number; // 1-5
  sweetness?: number; // 1-5
  finish?: "Short" | "Medium" | "Long";
}

export interface AthleticWearAttributes {
  item_type?: string;
  activity?: string[];
  fit?: "Runs small" | "True to size" | "Runs large";
  material_feel?: "Soft" | "Technical" | "Compressive" | "Lightweight";
  style_rating?: number; // 1-10
  performance_rating?: number; // 1-10
  would_buy_again?: boolean;
}

export interface GoingOutWearAttributes {
  item_type?: string;
  occasion?: string[];
  fit_description?: string;
  comfort_rating?: number; // 1-10
  style_rating?: number; // 1-10
  received_compliments?: boolean;
  color?: string;
  season?: string[];
}

// ── Taste Profile Summary Types ─────────────────────────────────

export interface WineProfile {
  preferred_varieties: string[];
  preferred_regions: string[];
  preferred_body: string;
  preferred_sweetness: string;
  avg_rating: number;
  total_logged: number;
  top_flavor_notes: string[];
  price_range: { min: number; max: number };
}

export interface WhiskeyProfile {
  preferred_types: string[];
  preferred_regions: string[];
  smoke_preference: "low" | "medium" | "high";
  sweetness_preference: "low" | "medium" | "high";
  avg_rating: number;
  total_logged: number;
  top_flavor_notes: string[];
  price_range: { min: number; max: number };
}

export interface AthleticWearProfile {
  preferred_brands: string[];
  primary_activities: string[];
  preferred_fit: string;
  preferred_feel: string;
  avg_rating: number;
  total_logged: number;
  price_range: { min: number; max: number };
}

export interface GoingOutWearProfile {
  preferred_brands: string[];
  preferred_occasions: string[];
  style_descriptors: string[];
  avg_rating: number;
  total_logged: number;
  price_range: { min: number; max: number };
}

// ── Form Types ──────────────────────────────────────────────────

export interface LogItemForm {
  category: Category;
  name: string;
  brand: string;
  rating: number;
  notes: string;
  price: string;
  attributes: Record<string, unknown>;
}

export interface AdvisorRequest {
  category: Category;
  items: Item[];
  location?: string;
  budget?: string;
}

export interface AdvisorRecommendation {
  name: string;
  brand: string;
  description: string;
  reason: string;
  price_range: string;
  search_query: string;
  category: Category;
}
