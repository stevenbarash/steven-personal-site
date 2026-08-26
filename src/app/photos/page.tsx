import type { Metadata } from 'next';
import Image from 'next/image';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { createTwitterMetadata, siteConfig } from '@/constants/site';
import { photoLibrary } from '@/data/photos';

const description = 'Photography by Steven Barash, with street, travel, and everyday scenes.';
const socialTitle = 'Photography | Steven Barash';

export const metadata: Metadata = {
  title: 'Photography',
  description,
  alternates: { canonical: '/photos' },
  openGraph: { url: '/photos', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

export default function PhotosPage() {
  return (
    <MinimalSiteLayout activeHref="/photos">
      <div className="minimal-shell minimal-document minimal-photos-page">
        <header className="minimal-document-header">
          <h1>Photography</h1>
          <p className="minimal-document-lede">Street, travel, and everyday photographs.</p>
          <a className="minimal-primary-link" href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
        </header>

        <section className="minimal-photo-gallery" aria-label="Photographs">
          {photoLibrary.map((photo, index) => (
            <figure key={photo.id}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1168px) calc((100vw - 66px) / 2), 527px"
                loading={index === 0 ? 'eager' : 'lazy'}
                preload={index === 0}
              />
              <figcaption>
                <p>{photo.title}</p>
                {photo.location && photo.location !== 'Unknown' && <p className="minimal-photo-location">{photo.location}</p>}
              </figcaption>
            </figure>
          ))}
        </section>
      </div>
    </MinimalSiteLayout>
  );
}
