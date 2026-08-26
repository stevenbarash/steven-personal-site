import type { ComponentType } from 'react';
import { PultProtocolArtifact } from '@/components/projects/PultProtocolArtifact';
import { BikeCliArtifact } from './BikeCliArtifact';
import { PersonalSiteArchitectureArtifact } from './PersonalSiteArchitectureArtifact';
import { UptickFlowArtifact } from './UptickFlowArtifact';

export type ProjectArtifactVariant = 'preview' | 'detail';
export type ProjectArtifactSlug = 'pult' | 'uptick' | 'bike-cli' | 'personal-site';
type ArtifactComponent = ComponentType<{ variant: ProjectArtifactVariant }>;

const PultArtifact: ArtifactComponent = ({ variant }) => (
  <PultProtocolArtifact className={`pult-protocol-flow project-artifact-${variant}`} />
);

const artifactRegistry = {
  pult: PultArtifact,
  uptick: UptickFlowArtifact,
  'bike-cli': BikeCliArtifact,
  'personal-site': PersonalSiteArchitectureArtifact,
} satisfies Record<ProjectArtifactSlug, ArtifactComponent>;

export function isProjectArtifactSlug(slug: string): slug is ProjectArtifactSlug {
  return Object.prototype.hasOwnProperty.call(artifactRegistry, slug);
}

export function ProjectArtifact({ slug, variant }: { slug: string; variant: ProjectArtifactVariant }) {
  if (!isProjectArtifactSlug(slug)) return null;
  const Artifact = artifactRegistry[slug];
  return (
    <div data-project-artifact={slug} data-project-artifact-variant={variant}>
      <Artifact variant={variant} />
    </div>
  );
}
