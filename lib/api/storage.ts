/**
 * Storage API — Upload images to Supabase Storage
 *
 * Requires two storage buckets created in Supabase Dashboard:
 *   - "avatars" (public) — user profile photos
 *   - "covers" (public) — club/event cover photos
 *
 * Both buckets should be set to "Public" so images can be served via public URLs.
 */

import { Platform } from 'react-native';
import { supabase } from '../supabase';

type BucketName = 'avatars' | 'covers';

// ─── Helpers ─────────────────────────────────────────────

/**
 * Check whether a URI is a remote URL (https://) vs a local file URI.
 * Remote URLs (e.g. Unsplash) can be stored directly — no upload needed.
 */
export function isRemoteUrl(uri: string): boolean {
  return uri.startsWith('http://') || uri.startsWith('https://');
}

/**
 * Convert a local image URI (from expo-image-picker) to a Blob
 * suitable for Supabase Storage upload.
 *
 * - Native (iOS/Android): uses fetch() on the file:// URI
 * - Web: uses fetch() on the blob:// or data:// URI
 */
export async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

/**
 * Detect content type from a URI by extension.
 * Falls back to 'image/jpeg'.
 */
export function detectContentType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

// ─── Core upload ─────────────────────────────────────────

/** Upload a blob/file and return its public URL */
export async function uploadImage(
  bucket: BucketName,
  filePath: string,
  file: Blob | File | ArrayBuffer,
  contentType = 'image/jpeg',
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// ─── Typed uploaders ─────────────────────────────────────

/** Upload a user avatar from a local URI */
export async function uploadAvatar(
  userId: string,
  file: Blob | File | ArrayBuffer,
  contentType = 'image/jpeg',
): Promise<string> {
  const ext = contentType === 'image/png' ? 'png' : 'jpg';
  const filePath = `${userId}/avatar.${ext}`;
  return uploadImage('avatars', filePath, file, contentType);
}

/** Upload a club/event cover photo from a blob */
export async function uploadCoverPhoto(
  entityType: 'club' | 'event',
  entityId: string,
  file: Blob | File | ArrayBuffer,
  contentType = 'image/jpeg',
): Promise<string> {
  const ext = contentType === 'image/png' ? 'png' : 'jpg';
  const filePath = `${entityType}/${entityId}/cover.${ext}`;
  return uploadImage('covers', filePath, file, contentType);
}

// ─── High-level: URI → public URL ────────────────────────

/**
 * Upload a cover photo from a URI (local file or remote URL).
 *
 * - If the URI is a remote URL (Unsplash, etc.), it's returned as-is.
 * - If it's a local file URI, it's converted to a blob, uploaded to
 *   Supabase Storage, and the public URL is returned.
 *
 * Returns null if no URI is provided.
 */
export async function uploadCoverFromUri(
  entityType: 'club' | 'event',
  entityId: string,
  uri: string | null,
): Promise<string | null> {
  if (!uri) return null;

  // Remote URLs (e.g. Unsplash) — store directly, no upload needed
  if (isRemoteUrl(uri)) return uri;

  // Local file URI — upload to Supabase Storage
  const contentType = detectContentType(uri);
  const blob = await uriToBlob(uri);
  return uploadCoverPhoto(entityType, entityId, blob, contentType);
}

// ─── Delete ──────────────────────────────────────────────

/** Delete an image from storage */
export async function deleteImage(bucket: BucketName, filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw error;
}
