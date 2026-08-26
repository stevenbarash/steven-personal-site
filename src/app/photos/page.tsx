import type { Metadata } from 'next';
import Image from 'next/image';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { createTwitterMetadata, siteConfig } from '@/constants/site';
import { archivePhotos, featuredPhotos } from '@/content/photography';
import type { PhotoItem } from '@/types';

const description = 'Photography by Steven Barash, with street, travel, and everyday scenes.';
const socialTitle = 'Photography | Steven Barash';
const featuredPhotoSizes = [
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1586px) calc(66.6667vw - 62px), 995.33px',
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1586px) calc(33.3333vw - 48px), 480.67px',
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1586px) calc(41.6667vw - 51.5px), 609.33px',
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1586px) calc(50vw - 55px), 738px',
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1586px) calc(58.3333vw - 58.5px), 866.67px',
] as const;
const archivePhotoSizes = '(max-width: 767px) calc(100vw - 32px), (max-width: 1586px) calc(50vw - 55px), 738px';

export const metadata: Metadata = {
  title: 'Photography',
  description,
  alternates: { canonical: '/photos' },
  openGraph: { url: '/photos', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

function PhotoFigure({ photo, sizes, eager = false }: { photo: PhotoItem; sizes: string; eager?: boolean }) {
  return (
    <figure>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        loading={eager ? undefined : 'lazy'}
        preload={eager}
      />
      <figcaption>
        <p>{photo.title}</p>
        {photo.location && photo.location !== 'Unknown' && <p className="minimal-photo-location">{photo.location}</p>}
      </figcaption>
    </figure>
  );
}

export default function PhotosPage() {
  return (
    <MinimalSiteLayout activeHref="/photos">
      <div className="minimal-shell minimal-document minimal-photos-page">
        <header className="minimal-document-header">
          <h1>Photography</h1>
          <p className="minimal-document-lede">Street, travel, and everyday photographs.</p>
          <a className="minimal-primary-link" href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
        </header>

        <section className="minimal-photo-featured" data-photo-featured aria-label="Featured photographs">
          {featuredPhotos.map((photo, index) => (
            <PhotoFigure key={photo.id} photo={photo} sizes={featuredPhotoSizes[index]} eager={index === 0} />
          ))}
        </section>

        <section className="minimal-photo-archive" data-photo-archive aria-label="Photography archive">
          {archivePhotos.map((photo) => (
            <PhotoFigure key={photo.id} photo={photo} sizes={archivePhotoSizes} />
          ))}
        </section>
      </div>
    </MinimalSiteLayout>
  );
}
