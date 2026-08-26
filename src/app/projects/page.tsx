import type { Metadata } from 'next';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { MinimalProjectIndex } from '@/components/projects/MinimalProjectIndex';
import { createTwitterMetadata } from '@/constants/site';

const description = 'Software projects by Steven Barash, with source code, design notes, and current status.';

export const metadata: Metadata = {
  title: 'Projects',
  description,
  alternates: { canonical: '/projects' },
  openGraph: {
    url: '/projects',
    title: 'Projects | Steven Barash',
    description,
  },
  twitter: createTwitterMetadata('Projects | Steven Barash', description),
};

export default function ProjectsPage() {
  return (
    <MinimalSiteLayout activeHref="/projects">
      <MinimalProjectIndex />
    </MinimalSiteLayout>
  );
}
