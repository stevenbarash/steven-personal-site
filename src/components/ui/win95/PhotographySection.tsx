'use client';

import { useMemo, useState } from 'react';
import type { PhotoItem } from '@/types';

interface PhotographySectionProps {
  photos: PhotoItem[];
}

const ALL_ALBUMS = 'All Photos';

export const PhotographySection: React.FC<PhotographySectionProps> = ({ photos }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<string>(ALL_ALBUMS);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>(photos[0]?.id ?? '');

  const albums = useMemo(() => {
    return [ALL_ALBUMS, ...new Set(photos.map((photo) => photo.album))];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (selectedAlbum === ALL_ALBUMS) return photos;
    return photos.filter((photo) => photo.album === selectedAlbum);
  }, [photos, selectedAlbum]);

  const selectedPhoto = useMemo(() => {
    const fromFiltered = filteredPhotos.find((photo) => photo.id === selectedPhotoId);
    if (fromFiltered) return fromFiltered;
    return filteredPhotos[0] ?? null;
  }, [filteredPhotos, selectedPhotoId]);

  return (
    <section className="win95-tab-panel" aria-label="Photography Explorer">
      <div className="mb-[6px] text-[11px]">
        <strong>Photography Explorer</strong> - Albums and contact sheets.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-[6px]">
        <aside className="win95-well p-[4px]">
          <div className="text-[11px] font-bold mb-[4px]">Albums</div>
          <div className="flex flex-col gap-[2px] max-h-[200px] overflow-auto">
            {albums.map((album) => {
              const isActive = selectedAlbum === album;
              return (
                <button
                  key={album}
                  type="button"
                  className="text-left px-[4px] py-[2px] text-[11px]"
                  style={{
                    background: isActive ? '#000080' : 'transparent',
                    color: isActive ? '#ffffff' : '#000000',
                  }}
                  onClick={() => {
                    setSelectedAlbum(album);
                    setSelectedPhotoId('');
                  }}
                >
                  {album}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="win95-well p-[4px]">
          {filteredPhotos.length === 0 && (
            <div className="p-[8px] text-[11px]">
              No photos in this album yet. Add files under <code>/public/images/photos</code> and update <code>src/data/photos.ts</code>.
            </div>
          )}

          {filteredPhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[6px] max-h-[280px] overflow-auto">
              {filteredPhotos.map((photo) => {
                const isSelected = selectedPhoto?.id === photo.id;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    className="p-[3px] text-left"
                    style={{
                      background: isSelected ? '#000080' : '#c0c0c0',
                      color: isSelected ? '#ffffff' : '#000000',
                    }}
                    onClick={() => setSelectedPhotoId(photo.id)}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full aspect-square object-cover mb-[4px]"
                    />
                    <span className="block text-[10px] truncate">{photo.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div className="win95-group-box mt-[8px]">
          <span className="win95-group-box-label">Photo Details</span>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,220px)_1fr] gap-[8px]">
            <div className="win95-well p-[2px]">
              <img src={selectedPhoto.src} alt={selectedPhoto.alt} className="w-full h-auto object-cover" />
            </div>

            <div className="text-[11px] space-y-[2px]">
              <p><strong>Title:</strong> {selectedPhoto.title}</p>
              <p><strong>Album:</strong> {selectedPhoto.album}</p>
              <p><strong>Taken:</strong> {selectedPhoto.takenAt}</p>
              <p><strong>Location:</strong> {selectedPhoto.location}</p>
              <p><strong>Camera:</strong> {selectedPhoto.camera}</p>
              <p><strong>Resolution:</strong> {selectedPhoto.width}x{selectedPhoto.height}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
