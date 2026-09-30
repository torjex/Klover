import { api } from "../api/client";
import type { Zone } from "../api/types";

/** Zone artwork is assigned deterministically so a zone keeps the same photo. */
const IMAGES = ["/zone-lawn.jpg", "/zone-beds.jpg", "/zone-border.jpg"];

export function zoneImage(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return IMAGES[hash % IMAGES.length];
}

/**
 * The picture to show for a zone: the owner's own upload when there is one,
 * otherwise the stock artwork it was assigned.
 */
export function zonePhoto(zone: Pick<Zone, "id" | "photo_token">): string {
  return zone.photo_token ? api.zonePhotoUrl(zone.photo_token) : zoneImage(zone.id);
}

/** What the picker accepts, kept in step with the backend's own limits. */
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;

/** Rejects a pick before it reaches the network; null means it is fine. */
export function photoProblem(file: File): string | null {
  if (!PHOTO_ACCEPT.split(",").includes(file.type))
    return "Choose a JPEG, PNG or WebP image.";
  if (file.size > PHOTO_MAX_BYTES) return "That image is larger than 10 MB.";
  return null;
}
