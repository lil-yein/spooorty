/**
 * Google Places Autocomplete service
 *
 * Uses the Google Places API (New) for location search with optional
 * location biasing from the user's current GPS coordinates.
 */

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? '';
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// ─── Types ──────────────────────────────────────────────

export type PlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

export type PlaceDetail = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

// ─── Autocomplete ───────────────────────────────────────

export async function autocomplete(
  input: string,
  location?: LatLng | null,
): Promise<PlacePrediction[]> {
  if (!API_KEY || !input.trim()) return [];

  let url = `${BASE_URL}/autocomplete/json?input=${encodeURIComponent(input)}&key=${API_KEY}`;

  // Bias results near user's location (50km radius)
  if (location) {
    url += `&location=${location.latitude},${location.longitude}&radius=50000`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.predictions ?? [];
  } catch {
    return [];
  }
}

// ─── Place Details ──────────────────────────────────────

export async function getPlaceDetails(
  placeId: string,
): Promise<PlaceDetail | null> {
  if (!API_KEY || !placeId) return null;

  const url = `${BASE_URL}/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,geometry&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}
