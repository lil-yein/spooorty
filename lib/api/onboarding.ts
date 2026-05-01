/**
 * Onboarding API — completes the onboarding flow for the current user.
 *
 * Saves display_name + photo + preferred_sports + sets onboarding_completed=true
 * in a single update.
 *
 * Photo handling:
 *   - If photoUri is a remote URL (Unsplash) → store as-is.
 *   - If photoUri is a local file URI → upload to Supabase Storage avatars bucket.
 *   - If photoUri is null AND sports were selected → auto-pick a random
 *     Unsplash photo using one of the user's selected sports as the query.
 */

import { supabase } from '../supabase';
import { uploadAvatar, isRemoteUrl, uriToBlob, detectContentType } from './storage';
import { pickRandomPhoto } from './unsplash';
import type { DbUser } from '../database/types';

export type CompleteOnboardingInput = {
  displayName: string;
  photoUri: string | null;
  preferredSports: string[];
};

/**
 * Resolve the final profile_photo_url:
 *   1. If user provided a remote URL, return it.
 *   2. If user provided a local URI, upload to Storage and return public URL.
 *   3. If user provided nothing, fetch a random Unsplash photo for one of
 *      their sports and return that URL.
 *   4. If even Unsplash returns nothing, return null.
 */
async function resolvePhotoUrl(
  userId: string,
  photoUri: string | null,
  sports: string[],
): Promise<string | null> {
  // Case 1: Remote URL (Unsplash from picker) — store directly
  if (photoUri && isRemoteUrl(photoUri)) return photoUri;

  // Case 2: Local file URI — upload to Storage
  if (photoUri) {
    const contentType = detectContentType(photoUri);
    const blob = await uriToBlob(photoUri);
    return uploadAvatar(userId, blob, contentType);
  }

  // Case 3: No photo + sports selected — auto-pick from Unsplash
  if (sports.length > 0) {
    const randomSport = sports[Math.floor(Math.random() * sports.length)];
    return pickRandomPhoto(randomSport, 'squarish');
  }

  // Case 4: Nothing to use
  return null;
}

/**
 * Save onboarding answers to the user's row and mark onboarding complete.
 * Throws on auth or DB errors.
 */
export async function completeOnboarding(
  input: CompleteOnboardingInput,
): Promise<DbUser> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const photoUrl = await resolvePhotoUrl(user.id, input.photoUri, input.preferredSports);

  const { data, error } = await supabase
    .from('users')
    .update({
      display_name: input.displayName.trim(),
      profile_photo_url: photoUrl,
      preferred_sports: input.preferredSports,
      onboarding_completed: true,
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
