import Link from 'next/link';
import type { ProjectCaseStudy } from '@/content/projects';
import { PultProtocolArtifact } from '@/components/projects/PultProtocolArtifact';

const formatStatus = (status: string) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

function TextList({ items }: { items: string[] }) {
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function MinimalProjectDetail({ project }: { project: ProjectCaseStudy }) {
  const mechanismItems = [...project.approach, ...project.constraints];

  return (
    <div className="minimal-shell minimal-project-page">
      <nav className="minimal-project-breadcrumb" aria-label="Breadcrumb">
        <Link href="/projects">Projects</Link>
        <span aria-hidden="true">/</span>
        <span>{project.name}</span>
      </nav>

      <article className="minimal-project-document" aria-labelledby="project-title">
        <header className="minimal-project-header">
          <h1 id="project-title">{project.name}</h1>
          <p className="minimal-project-lede">{project.oneLiner}</p>
          <div className="minimal-project-facts">
            <p><strong>Role:</strong> {project.role}</p>
            <p><strong>Status:</strong> {formatStatus(project.status)}</p>
            <p><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
          </div>
          <div className="minimal-project-header-notes">
            {project.outcomes.map((outcome) => <p key={outcome}>{outcome}</p>)}
            {project.limitations && <p>{project.limitations}</p>}
          </div>
          <div className="minimal-project-actions" aria-label="Project links">
            {project.sourceUrl && (
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">View source on GitHub</a>
            )}
            {project.liveUrl && <a href={project.liveUrl}>Open the live site</a>}
          </div>
        </header>

        {project.slug === 'pult' && <PultProtocolArtifact className="pult-protocol-flow" />}

        <div className="minimal-project-prose">
          <section>
            <h2>{project.sectionHeadings.motivation}</h2>
            <p>{project.problem}</p>
            <p>{project.motivationAudience}</p>
          </section>

          {mechanismItems.length > 0 && (
            <section>
              <h2>{project.sectionHeadings.mechanism}</h2>
              <TextList items={mechanismItems} />
            </section>
          )}

          {project.hardestDecisions.length > 0 && (
            <section>
              <h2>{project.sectionHeadings.decisions}</h2>
              <TextList items={project.hardestDecisions} />
            </section>
          )}
        </div>

        <Link className="minimal-project-back" href="/projects">Back to projects</Link>
      </article>
    </div>
  );
}
