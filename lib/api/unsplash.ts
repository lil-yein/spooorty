/**
 * Unsplash API helpers
 *
 * Used by:
 *   - CoverPhotoModal (cover photos for clubs/events) — landscape orientation
 *   - ProfilePhotoModal (avatars during onboarding) — square orientation
 *   - completeOnboarding fallback (auto-pick a sport photo if user skips photo)
 */

const UNSPLASH_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY ?? '';
const UNSPLASH_API = 'https://api.unsplash.com';

export type UnsplashPhoto = {
  id: string;
  urls: { small: string; regular: string };
  user: { name: string; links: { html: string } };
  width: number;
  height: number;
};

export type UnsplashOrientation = 'landscape' | 'portrait' | 'squarish';

/**
 * Search Unsplash for photos. Returns [] on error or missing key.
 *
 * Pass `orientation: undefined` (or omit) to get mixed orientations —
 * useful for masonry grids where varied aspect ratios make the layout
 * feel more dynamic.
 */
export async function searchUnsplash(
  query: string,
  page = 1,
  orientation?: UnsplashOrientation,
  perPage = 20,
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_KEY || !query.trim()) return [];
  let url =
    `${UNSPLASH_API}/search/photos` +
    `?query=${encodeURIComponent(query)}` +
    `&page=${page}` +
    `&per_page=${perPage}`;
  if (orientation) url += `&orientation=${orientation}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

/**
 * Pick a random Unsplash photo for a query — used as auto-photo fallback
 * when a user skips the profile photo step. Returns the first result's
 * `regular` URL, or null if nothing found.
 */
export async function pickRandomPhoto(
  query: string,
  orientation: UnsplashOrientation = 'squarish',
): Promise<string | null> {
  const results = await searchUnsplash(query, 1, orientation, 10);
  if (results.length === 0) return null;
  // Random pick from the first 10 results so users with the same sport
  // don't all get the same photo.
  const random = results[Math.floor(Math.random() * results.length)];
  return random.urls.regular;
}
