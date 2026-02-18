import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DesktopEnvironment } from '@/components/layout/DesktopEnvironment';
import { PhotographySection } from '@/components/ui/win95';
import { photoLibrary } from '@/data/photos';

/** Set to true to render the photography page; when false, /photos redirects to home */
const PHOTOS_PAGE_ENABLED = false;

export const metadata: Metadata = {
  title: 'Photography',
  description: 'Photography explorer featuring portrait and street collections by Steven Barash.',
  alternates: {
    canonical: '/photos',
  },
};

export default function PhotosPage() {
  if (!PHOTOS_PAGE_ENABLED) {
    redirect('/');
  }
  return (
    <DesktopEnvironment
      title="PHOTOS.EXE - Photography Explorer"
      activeProgram="PHOTOS.EXE"
      defaultStatusText="Ready to browse photos"
      statusPaneLabel="C:\\PHOTOS\\"
    >
      <div id="section-photos">
        <PhotographySection photos={photoLibrary} />
      </div>
    </DesktopEnvironment>
  );
}
