import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateRecommendations, generateTasteInsight } from "@/lib/claude";
import type { Category, Item } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category, items, location } = body as {
      category: Category;
      items: Item[];
      location?: string;
    };

    if (!category || !items || items.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 logged items to generate recommendations" },
        { status: 400 }
      );
    }

    const categoryLabel = CATEGORY_LABELS[category];

    // Generate recommendations and taste insight in parallel
    const [recs, insight] = await Promise.all([
      generateRecommendations(category, items, categoryLabel, 3),
      generateTasteInsight(category, items, categoryLabel),
    ]);

    // Fetch product images and where-to-buy data
    const enrichedRecs = await Promise.all(
      recs.map(async (rec) => {
        let imageUrl: string | undefined;
        let whereToBuy: Array<{
          name: string;
          type: "online" | "local";
          url?: string;
          price?: string;
          address?: string;
          distance?: string;
        }> = [];

        // Fetch product image via SerpApi
        try {
          const imageRes = await fetch(
            `${request.nextUrl.origin}/api/products?q=${encodeURIComponent(rec.search_query)}`
          );
          if (imageRes.ok) {
            const imageData = await imageRes.json();
            imageUrl = imageData.image_url;
            if (imageData.shopping_results) {
              whereToBuy = imageData.shopping_results.slice(0, 2).map(
                (r: { source: string; link?: string; price?: string }) => ({
                  name: r.source,
                  type: "online" as const,
                  url: r.link,
                  price: r.price,
                })
              );
            }
          }
        } catch {
          // Image fetch failure is non-fatal
        }

        // Fetch local stores if location provided
        if (location && category !== "wine" && category !== "whiskey") {
          try {
            const storeType =
              category === "athletic_wear" ? "athletic store" : "clothing boutique";
            const placesRes = await fetch(
              `${request.nextUrl.origin}/api/places?q=${encodeURIComponent(storeType)}&location=${encodeURIComponent(location)}`
            );
            if (placesRes.ok) {
              const placesData = await placesRes.json();
              const localStores = (placesData.results || [])
                .slice(0, 2)
                .map((p: { name: string; vicinity?: string; distance?: string }) => ({
                  name: p.name,
                  type: "local" as const,
                  address: p.vicinity,
                  distance: p.distance,
                }));
              whereToBuy = [...whereToBuy, ...localStores];
            }
          } catch {
            // Places fetch failure is non-fatal
          }
        } else if (location && (category === "wine" || category === "whiskey")) {
          try {
            const storeType =
              category === "wine" ? "wine shop" : "whiskey bar liquor store";
            const placesRes = await fetch(
              `${request.nextUrl.origin}/api/places?q=${encodeURIComponent(storeType)}&location=${encodeURIComponent(location)}`
            );
            if (placesRes.ok) {
              const placesData = await placesRes.json();
              const localStores = (placesData.results || [])
                .slice(0, 2)
                .map((p: { name: string; vicinity?: string; distance?: string }) => ({
                  name: p.name,
                  type: "local" as const,
                  address: p.vicinity,
                  distance: p.distance,
                }));
              whereToBuy = [...whereToBuy, ...localStores];
            }
          } catch {
            // Non-fatal
          }
        }

        return {
          category: rec.category,
          name: rec.name,
          brand: rec.brand,
          description: rec.description,
          reason: rec.reason,
          price_range: rec.price_range,
          image_url: imageUrl || null,
          where_to_buy: whereToBuy,
        };
      })
    );

    return NextResponse.json({
      recommendations: enrichedRecs,
      insight,
    });
  } catch (error) {
    console.error("Advisor API error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
