import { photoLibrary } from '@/data/photos';
import type { PhotoItem } from '@/types';

export const photographyContent = {
  introduction: 'I like to take photos sometimes, mostly street and travel, in New York and wherever else I end up.',
} as const;

/**
 * Curated captions and descriptive alt text, keyed by imported photo ID.
 * The Instagram import only produces caption-derived titles, so accessibility
 * copy lives here and survives re-imports. Both public and desktop surfaces
 * render `photographs`, never the raw import.
 */
const photoCopy: Record<string, Partial<Pick<PhotoItem, 'title' | 'alt' | 'camera'>>> = {
  'ig-DTM8x-XjH87': {
    alt: 'A woman in a white hijab buys bread from a street cart stacked with ka’ak rings outside Damascus Gate.',
  },
  'ig-DTLPyoODImw': {
    alt: 'A man in a black hat and coat walks a path on the Mount of Olives, overlooking Jerusalem’s Old City walls and the Dome of the Rock.',
  },
  'ig-DC4r__8xPDU': {
    title: 'Found where all the taxis go to sleep at LGA',
    alt: 'Rows of yellow taxis wait in a holding lot at LaGuardia Airport, seen from an elevated roadway.',
  },
  'ig-DAhYCEQsyG2': {
    alt: 'A tabby-and-white cat presses its face to a windowpane at night, its reflection visible in the glass.',
  },
  'ig-C4COXHbOslT': {
    title: 'Mexican tomatoes hit different',
    alt: 'A woman selects tomatoes from wooden shelves stacked with fruit and vegetables at a small market stall.',
  },
  'ig-C3yfRWMMYaM': {
    alt: 'A marshrutka driver leans out of a white Damas minivan with his hand on the passenger door, on a dusty street in Nukus.',
  },
  'ig-CoQuyVsOJJA': {
    title: '¿Qué estás mirando, parce?',
    alt: 'Binoculars hang in the foreground over the brick hillside homes of Medellín, with green mountains behind them.',
  },
  'ig-Cn-S9S4O_Of': {
    alt: 'Looking up at the colorful Art Deco ornament on the upper floors of a brick building against an evening sky.',
  },
  'ig-Cn5Wr9Wu6IT': {
    title: 'Through the kitchen window at Tarim',
    alt: 'Seen through the restaurant window, a cook prepares food at a counter beside a tray of baked goods, under a red neon sign.',
    camera: 'Sony a7C · 80mm f/1.8',
  },
  'ig-Cn4XiyTOD9f': {
    alt: 'A cook in a skullcap and apron rolls out dough on a floured counter.',
  },
};

export const photographs: PhotoItem[] = photoLibrary.map((photo) => {
  const copy = photoCopy[photo.id];
  return copy ? { ...photo, ...copy, camera: copy.camera } : { ...photo, camera: undefined };
});

export const featuredPhotoIds = [
  'ig-DTM8x-XjH87',
  'ig-DC4r__8xPDU',
  'ig-Cz83QsPOSTh',
  'ig-CoQuyVsOJJA',
  'ig-Cn-S9S4O_Of',
] as const;

export const featuredPhotos = featuredPhotoIds.map((id) => {
  const photo = photographs.find((candidate) => candidate.id === id);
  if (!photo) throw new Error(`Featured photograph ${id} is missing from the verified library.`);
  return photo;
});

export const archivePhotos = photographs.filter(({ id }) => !(featuredPhotoIds as readonly string[]).includes(id));
