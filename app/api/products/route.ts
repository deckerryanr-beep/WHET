import { NextRequest, NextResponse } from "next/server";

interface SerpApiShoppingResult {
  source: string;
  link?: string;
  price?: string;
  thumbnail?: string;
  title?: string;
  rating?: number;
}

interface SerpApiImageResult {
  original: string;
  thumbnail: string;
  title?: string;
}

interface SerpApiResponse {
  inline_shopping_results?: SerpApiShoppingResult[];
  shopping_results?: SerpApiShoppingResult[];
  images_results?: SerpApiImageResult[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    return NextResponse.json(
      { error: "SerpApi key not configured" },
      { status: 503 }
    );
  }

  try {
    // Fetch product shopping results + images
    const shoppingUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=5`;
    const shoppingRes = await fetch(shoppingUrl);
    const shoppingData: SerpApiResponse = await shoppingRes.json();

    const shoppingResults = (
      shoppingData.inline_shopping_results ||
      shoppingData.shopping_results ||
      []
    )
      .slice(0, 5)
      .map((r: SerpApiShoppingResult) => ({
        source: r.source,
        link: r.link,
        price: r.price,
        thumbnail: r.thumbnail,
        title: r.title,
        rating: r.rating,
      }));

    // Try to get the best product image
    let imageUrl: string | null = null;

    // First try from shopping results
    if (shoppingResults.length > 0 && shoppingResults[0].thumbnail) {
      imageUrl = shoppingResults[0].thumbnail;
    }

    // Fallback: fetch image search results
    if (!imageUrl) {
      const imageUrl2 = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=3`;
      const imageRes = await fetch(imageUrl2);
      const imageData: SerpApiResponse = await imageRes.json();
      const firstImage = imageData.images_results?.[0];
      if (firstImage) {
        imageUrl = firstImage.original || firstImage.thumbnail;
      }
    }

    return NextResponse.json({
      image_url: imageUrl,
      shopping_results: shoppingResults,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product data" },
      { status: 500 }
    );
  }
}
