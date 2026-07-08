/**
 * Async facade over `data/documents/photos.ts` — the only thing screens
 * should import for photo interventions. Today it just wraps the mock array;
 * swapping in Supabase later means rewriting the inside of these functions
 * only, no screen changes.
 */
import * as PhotosData from '@/data/documents/photos';

export type { InterventionPhoto, PhotoCategory, PhotoIntervention } from '@/data/documents/photos';
export { PHOTO_CATEGORY_LABEL, PHOTO_CATEGORY_META, PHOTO_CATEGORY_ORDER, photoCategoryCounts } from '@/data/documents/photos';

export async function listPhotoInterventions(): Promise<PhotosData.PhotoIntervention[]> {
  return [...PhotosData.PHOTO_INTERVENTIONS];
}

export async function getPhotoIntervention(id: string): Promise<PhotosData.PhotoIntervention | undefined> {
  return PhotosData.getPhotoInterventionById(id);
}

export async function getOrCreatePhotoIntervention(
  id: string,
  meta: { label: string; clientId: string; clientName: string; date: string }
): Promise<PhotosData.PhotoIntervention> {
  return PhotosData.getOrCreatePhotoIntervention(id, meta);
}

export async function addInterventionPhoto(
  interventionId: string,
  input: { uri: string; category: PhotosData.PhotoCategory }
): Promise<PhotosData.InterventionPhoto | undefined> {
  return PhotosData.addInterventionPhoto(interventionId, input);
}

export async function removeInterventionPhoto(interventionId: string, photoId: string): Promise<void> {
  PhotosData.removeInterventionPhoto(interventionId, photoId);
}

export async function updateInterventionPhotoCategory(
  interventionId: string,
  photoId: string,
  category: PhotosData.PhotoCategory
): Promise<void> {
  PhotosData.updateInterventionPhotoCategory(interventionId, photoId, category);
}
