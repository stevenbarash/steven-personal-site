import type { Metadata } from 'next';
import { Button, Heading, MasonryGrid, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { PhotoMedia } from '@/components/photos/PhotoMedia';
import { createTwitterMetadata, siteConfig } from '@/constants/site';
import { archivePhotos, featuredPhotos } from '@/content/photography';
import type { PhotoItem } from '@/types';
import styles from './photos.module.css';

const description = 'Photography by Steven Barash, with street, travel, and everyday scenes.';
const socialTitle = 'Photography | Steven Barash';
const galleryPhotos = [...featuredPhotos, ...archivePhotos];
const photoSizes = '(max-width: 768px) calc(100vw - 32px), (max-width: 1008px) calc(50vw - 36px), 468px';

export const metadata: Metadata = {
  title: 'Photography',
  description,
  alternates: { canonical: '/photos' },
  openGraph: { url: '/photos', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

function PhotoFigure({ photo, eager = false }: { photo: PhotoItem; eager?: boolean }) {
  return (
    <figure className={styles.photo}>
      <PhotoMedia photo={photo} sizes={photoSizes} priority={eager} className={styles.media} />
      <figcaption className={styles.caption}>
        <Text as="p" variant="body-default-m" onBackground="neutral-strong">{photo.title}</Text>
        {photo.location && photo.location !== 'Unknown' && (
          <Text as="p" variant="body-default-s" onBackground="neutral-weak">{photo.location}</Text>
        )}
      </figcaption>
    </figure>
  );
}

export default function PhotosPage() {
  return (
    <PortfolioLayout activeHref="/photos">
      <div className={`portfolio-shell ${styles.page}`}>
        <header className={styles.header}>
          <div className={styles.intro}>
            <Heading as="h1" variant="display-strong-s" className={styles.title}>Photography</Heading>
            <Text as="p" variant="body-default-l" onBackground="neutral-weak">
              I like to take photos sometimes.
            </Text>
          </div>
          <Button href={siteConfig.instagramUrl} variant="secondary" size="l" target="_blank" rel="noopener noreferrer">
            Instagram
          </Button>
        </header>

        <MasonryGrid as="section" columns={2} s={{ columns: 1 }} gap="24" aria-label="Photographs" data-photo-gallery>
          {galleryPhotos.map((photo, index) => (
            <PhotoFigure key={photo.id} photo={photo} eager={index === 0} />
          ))}
        </MasonryGrid>
      </div>
    </PortfolioLayout>
  );
}
