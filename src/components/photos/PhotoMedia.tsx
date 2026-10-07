'use client';

import { createContext, useContext, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { AdapterProvider, Media, type AdapterImageProps } from '@once-ui-system/core';
import type { PhotoItem } from '@/types';

const PhotoDimensions = createContext<Pick<PhotoItem, 'width' | 'height'> | null>(null);

function PhotoImage({ alt, priority, ...props }: AdapterImageProps) {
  const dimensions = useContext(PhotoDimensions);
  if (!dimensions) throw new Error('PhotoImage must render within PhotoMedia.');

  // Media supplies zero dimensions; retain the catalog dimensions and Next 16 preload.
  return (
    <Image
      {...props}
      alt={alt}
      fill={false}
      width={dimensions.width}
      height={dimensions.height}
      preload={priority}
      loading={priority ? undefined : 'lazy'}
    />
  );
}

const photoAdapters = { Image: PhotoImage };

function handlePhotoKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

export function PhotoMedia({ photo, sizes, priority, className }: {
  photo: PhotoItem;
  sizes: string;
  priority: boolean;
  className: string;
}) {
  return (
    <PhotoDimensions.Provider value={photo}>
      <AdapterProvider adapters={photoAdapters}>
        <Media
          src={photo.src}
          alt={photo.alt}
          aspectRatio={`${photo.width} / ${photo.height}`}
          objectFit="contain"
          sizes={sizes}
          priority={priority}
          radius="l"
          enlarge
          role="button"
          tabIndex={0}
          aria-label={`Toggle enlarged view of ${photo.title}`}
          onKeyDown={handlePhotoKeyDown}
          className={className}
        />
      </AdapterProvider>
    </PhotoDimensions.Provider>
  );
}
