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
 * Camera credits were checked against the matching @steven.photography post
 * captions on 2026-11-14; each ig- key contains that post's Instagram shortcode.
 */
const photoCopy: Record<string, Partial<Pick<PhotoItem, 'title' | 'alt' | 'camera' | 'location'>>> = {
  'ig-DTM8x-XjH87': {
    alt: 'A woman in a white hijab buys bread from a street cart stacked with ka’ak rings outside Damascus Gate.',
    camera: 'Sony a7IV · Sony 24–105mm f/4',
  },
  'ig-DTLPyoODImw': {
    alt: 'A man in a black hat and coat walks a path on the Mount of Olives, overlooking Jerusalem’s Old City walls and the Dome of the Rock.',
    camera: 'Sony a7IV · Sony 24–105mm G f/4',
  },
  'ig-DC4r__8xPDU': {
    title: 'Found where all the taxis go to sleep at LGA',
    alt: 'Rows of yellow taxis wait in a holding lot at LaGuardia Airport, seen from an elevated roadway.',
    location: 'LaGuardia Airport, New York',
    camera: 'iPhone 15 Pro Max · Halide',
  },
  'ig-DAhYCEQsyG2': {
    alt: 'A tabby-and-white cat presses its face to a windowpane at night, its reflection visible in the glass.',
  },
  'ig-C4COXHbOslT': {
    title: 'Mexican tomatoes hit different',
    alt: 'A woman selects tomatoes from wooden shelves stacked with fruit and vegetables at a small market stall.',
    location: 'Mexico City, Mexico',
    camera: 'Sony a7C',
  },
  'ig-C3yfRWMMYaM': {
    alt: 'A marshrutka driver leans out of a white Damas minivan with his hand on the passenger door, on a dusty street in Nukus.',
    camera: 'Sony a7R II',
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
    location: 'Tarim Uyghur Food, New York',
  },
  'ig-Cn4XiyTOD9f': {
    alt: 'A cook in a skullcap and apron rolls out dough on a floured counter.',
    location: 'Tarim Uyghur Food, New York',
  },
  'ig-Ck1OENvvUum': {
    camera: 'Sony a7C · Sony 85mm f/1.8',
  },
};

// Local uploads survive regeneration of the Instagram catalog.
const localPhotos: PhotoItem[] = [
  {
    id: 'local-amsterdam-cyclists',
    title: 'Side by side in Amsterdam',
    src: '/images/photos/uploads/amsterdam.jpg',
    alt: 'Two cyclists ride side by side along a sunlit bike path, their long shadows stretching behind them.',
    album: 'Travel',
    takenAt: '',
    location: 'Amsterdam, Netherlands',
    camera: 'Fujifilm X100VI · 23mm · f/11',
    width: 2400,
    height: 1600,
  },
  {
    id: 'local-tashkent-watermelons',
    title: 'Fun fact: Uzbekistan exports 200+ tons of watermelons annually.',
    src: '/images/photos/uploads/tashkent-watermelons.jpg',
    alt: 'A woman moves a cart piled with watermelons beside an open white van on a sunny street.',
    album: 'Travel',
    takenAt: '',
    location: 'Tashkent, Uzbekistan',
    width: 1440,
    height: 1440,
  },
];

export const photographs: PhotoItem[] = [
  ...photoLibrary.map((photo) => {
    const copy = photoCopy[photo.id];
    return copy ? { ...photo, ...copy, camera: copy.camera } : { ...photo, camera: undefined };
  }),
  ...localPhotos,
];

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
