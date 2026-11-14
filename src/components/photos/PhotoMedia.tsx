'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import type { PhotoItem } from '@/types';
import styles from '@/app/photos/photos.module.css';
import { PhotoDetails } from './PhotoDetails';

export function PhotoMedia({ photo, sizes, priority, className }: {
  photo: PhotoItem;
  sizes: string;
  priority: boolean;
  className: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = triggerRef.current;

    const root = document.documentElement;
    const body = document.body;
    const previousOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousGutter = root.style.scrollbarGutter;

    // Modal dialogs make the rest of the document inert; scroll locking is separate.
    root.style.scrollbarGutter = 'stable';
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      root.style.overflow = previousOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.scrollbarGutter = previousGutter;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        aria-label={`Enlarge ${photo.title}`}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
        />
      </button>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-labelledby={titleId}
          onCancel={(event) => {
            // Close through React before another activation can observe stale open state.
            event.preventDefault();
            setIsOpen(false);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
          onKeyDown={(event) => {
            // Close is the only interactive control; retain Tab in both directions.
            if (event.key === 'Tab') {
              event.preventDefault();
              closeRef.current?.focus({ preventScroll: true });
            }
          }}
        >
          <div className={styles.dialogHeader}>
            <div className={styles.dialogCaption}>
              <h2 id={titleId}>{photo.title}</h2>
              <PhotoDetails photo={photo} />
            </div>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              aria-label="Close enlarged photograph"
              onClick={() => setIsOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className={styles.enlargedFrame}>
            <Image
              className={styles.enlargedImage}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 1312px) calc(100vw - 64px), 1248px"
              loading="eager"
            />
          </div>
        </dialog>
      )}
    </>
  );
}
