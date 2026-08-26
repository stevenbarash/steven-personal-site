import type { Metadata } from 'next';
import { DesktopEnvironment, type DesktopAppContentDefinition } from '@/components/layout/DesktopEnvironment';
import { AboutSiteSection, HelpSection } from '@/components/ui/win95/HelpSection';
import { HomeSection } from '@/components/ui/win95/HomeSection';
import { ContactSection } from '@/components/ui/win95/ContactSection';
import { PhotographySection } from '@/components/ui/win95/PhotographySection';
import { ProfileSection } from '@/components/ui/win95/ProfileSection';
import { ProjectIndex } from '@/components/ui/win95/ProjectIndex';
import { ResumeSection } from '@/components/ui/win95/ResumeSection';
import { Terminal } from '@/components/ui/win95/Terminal';
import { photoLibrary } from '@/data/photos';
import { profileData, terminalCommands } from '@/data/profile';
import { resumeData } from '@/data/resume';
import { createTwitterMetadata } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Windows 95 Version',
  description: 'A functional Windows 95 version of Steven Barash’s personal site.',
  alternates: { canonical: '/desktop' },
  robots: { index: false, follow: true },
  openGraph: {
    url: '/desktop',
    title: 'Windows 95 Version | Steven Barash',
    description: 'A functional Windows 95 version of Steven Barash’s personal site.',
  },
  twitter: createTwitterMetadata(
    'Windows 95 Version | Steven Barash',
    'A functional Windows 95 version of Steven Barash’s personal site.',
  ),
};

export default function DesktopPage() {
  const desktopApps: DesktopAppContentDefinition[] = [
    { id: 'profile', content: <ProfileSection profile={profileData} /> },
    { id: 'projects', content: <ProjectIndex /> },
    { id: 'contact', content: <ContactSection /> },
    { id: 'photos', content: <PhotographySection photos={photoLibrary} /> },
    { id: 'terminal', content: <Terminal commands={terminalCommands} /> },
    { id: 'resume', content: <ResumeSection resume={resumeData} /> },
    { id: 'help', content: <HelpSection /> },
    { id: 'about-site', content: <AboutSiteSection /> },
  ];

  return (
    <DesktopEnvironment desktopApps={desktopApps} defaultStatusText="7 objects">
      <HomeSection />
    </DesktopEnvironment>
  );
}
