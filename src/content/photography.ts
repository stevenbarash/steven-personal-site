import { photoLibrary } from '@/data/photos';

export const photographyContent = {
  introduction: 'I like to take photos sometimes.',
} as const;

export const featuredPhotoIds = [
  'ig-DTM8x-XjH87',
  'ig-DC4r__8xPDU',
  'ig-Cz83QsPOSTh',
  'ig-CoQuyVsOJJA',
  'ig-Cn-S9S4O_Of',
] as const;

export const featuredPhotos = featuredPhotoIds.map((id) => {
  const photo = photoLibrary.find((candidate) => candidate.id === id);
  if (!photo) throw new Error(`Featured photograph ${id} is missing from the verified library.`);
  return photo;
});

const featuredSet = new Set<string>(featuredPhotoIds);
export const archivePhotos = photoLibrary.filter(({ id }) => !featuredSet.has(id));
