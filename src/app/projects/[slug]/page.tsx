import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { MinimalProjectDetail } from '@/components/projects/MinimalProjectDetail';
import { publishedProjects } from '@/content/projects';
import { createTwitterMetadata, siteConfig } from '@/constants/site';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Published paths remain prerendered by generateStaticParams. Allowing unmatched
// params to reach the catalog guard produces a clean notFound() response on
// Next 16 instead of its internal NoFallbackError log.
export const dynamicParams = true;

export function generateStaticParams() {
  return publishedProjects.map(({ slug }) => ({ slug }));
}

const getPublishedProject = (slug: string) => publishedProjects.find((project) => project.slug === slug);

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) {
    return {
      title: 'Project not found',
      robots: { index: false, follow: true },
    };
  }

  const path = `/projects/${project.slug}`;
  const title = `${project.name} Project`;
  const socialTitle = `${title} | ${siteConfig.siteName}`;
  return {
    title,
    description: project.oneLiner,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: socialTitle,
      description: project.oneLiner,
    },
    twitter: createTwitterMetadata(socialTitle, project.oneLiner),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getPublishedProject(slug);
  if (!project) notFound();

  const path = `/projects/${project.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.name,
    description: project.oneLiner,
    url: new URL(path, `${siteConfig.canonicalOrigin}/`).href,
    author: { '@id': `${siteConfig.canonicalOrigin}/#person` },
    codeRepository: project.sourceUrl,
    programmingLanguage: project.technologies,
    sameAs: [project.sourceUrl, project.liveUrl].filter(Boolean),
    creativeWorkStatus: project.status,
  };

  return (
    <MinimalSiteLayout activeHref="/projects">
      <script
        data-project-json-ld
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll('<', '\\u003c') }}
      />
      <MinimalProjectDetail project={project} />
    </MinimalSiteLayout>
  );
}
