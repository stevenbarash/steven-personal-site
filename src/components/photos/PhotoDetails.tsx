import type { PhotoItem } from '@/types';
import styles from '@/app/photos/photos.module.css';

export function PhotoDetails({ photo }: { photo: PhotoItem }) {
  return (
    <dl className={styles.metadata}>
      {photo.location && photo.location !== 'Unknown' && (
        <div className={styles.metadataRow}>
          <dt>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className={styles.metadataLabel}>Location</span>
          </dt>
          <dd>{photo.location}</dd>
        </div>
      )}
      {photo.camera && (
        <div className={styles.metadataRow}>
          <dt>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 5 6 8H3v12h18V8h-3l-2-3Z" />
              <circle cx="12" cy="14" r="3.5" />
            </svg>
            <span className={styles.metadataLabel}>Camera</span>
          </dt>
          <dd>{photo.camera}</dd>
        </div>
      )}
    </dl>
  );
}
