import type { Metadata } from 'next';
import { DesktopEnvironment } from '@/components/layout/DesktopEnvironment';
import { PhotographySection } from '@/components/ui/win95/PhotographySection';
import { photoLibrary } from '@/data/photos';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'Photography explorer featuring portrait and street collections by Steven Barash.',
  alternates: {
    canonical: '/photos',
  },
};

export default function PhotosPage() {
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
