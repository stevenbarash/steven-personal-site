import type { Metadata } from 'next';
import Image from 'next/image';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { createTwitterMetadata, siteConfig } from '@/constants/site';
import { archivePhotos, featuredPhotos } from '@/content/photography';
import type { PhotoItem } from '@/types';

const description = 'Photography by Steven Barash, with street, travel, and everyday scenes.';
const socialTitle = 'Photography | Steven Barash';

export const metadata: Metadata = {
  title: 'Photography',
  description,
  alternates: { canonical: '/photos' },
  openGraph: { url: '/photos', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

function PhotoFigure({ photo, eager = false }: { photo: PhotoItem; eager?: boolean }) {
  return (
    <figure>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1510px) 66vw, 944px"
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
            <PhotoFigure key={photo.id} photo={photo} eager={index === 0} />
          ))}
        </section>

        <section className="minimal-photo-archive" data-photo-archive aria-label="Photography archive">
          {archivePhotos.map((photo) => (
            <PhotoFigure key={photo.id} photo={photo} />
          ))}
        </section>
      </div>
    </MinimalSiteLayout>
  );
}
