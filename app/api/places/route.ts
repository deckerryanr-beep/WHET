import { NextRequest, NextResponse } from "next/server";

interface PlacesResult {
  name: string;
  place_id: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GeocodingResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const location = searchParams.get("location");

  if (!query || !location) {
    return NextResponse.json(
      { error: "Missing query or location" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Places API key not configured" },
      { status: 503 }
    );
  }

  try {
    // First geocode the location to get lat/lng
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();

    if (!geocodeData.results?.length) {
      return NextResponse.json({ results: [] });
    }

    const { lat, lng } = (geocodeData.results[0] as GeocodingResult).geometry.location;

    // Then find nearby places
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=${encodeURIComponent(query)}&key=${apiKey}`;
    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();

    const results = (placesData.results || [])
      .slice(0, 5)
      .map((place: PlacesResult) => ({
        name: place.name,
        place_id: place.place_id,
        vicinity: place.vicinity,
        rating: place.rating,
        total_ratings: place.user_ratings_total,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby places" },
      { status: 500 }
    );
  }
}
