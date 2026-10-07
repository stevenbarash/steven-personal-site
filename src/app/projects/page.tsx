import type { Metadata } from 'next';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { PortfolioProjectIndex } from '@/components/projects/PortfolioProjectIndex';
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
    <PortfolioLayout activeHref="/projects">
      <PortfolioProjectIndex />
    </PortfolioLayout>
  );
}
