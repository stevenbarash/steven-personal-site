import Link from 'next/link';
import type { ProjectCaseStudy as Project } from '@/content/projects';

function ProseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="win95-project-readme-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TextList({ items }: { items: string[] }) {
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <article className="win95-project-case-study" aria-labelledby="project-title">
      <nav className="win95-project-breadcrumb win95-interface-label" aria-label="Project breadcrumb">
        <Link href="/projects">Projects</Link><span aria-hidden="true"> › </span><span>{project.name}</span>
      </nav>

      <div className="win95-project-detail-layout">
        <div className="win95-well win95-project-readme">
          <header className="win95-project-readme-header">
            <p className="win95-metadata">README.TXT</p>
            <h1 id="project-title">{project.name}</h1>
            <p className="win95-reading-copy"><strong>{project.oneLiner}</strong></p>
          </header>

          <ProseSection title="Why I built it"><p className="win95-reading-copy">{project.problem}</p></ProseSection>
          <ProseSection title="Who it is for"><p className="win95-reading-copy">{project.motivationAudience}</p></ProseSection>
          <ProseSection title="Role"><p className="win95-reading-copy">{project.role}</p></ProseSection>
          <ProseSection title="Constraints"><TextList items={project.constraints} /></ProseSection>
          <ProseSection title="How it works"><TextList items={project.approach} /></ProseSection>
          <ProseSection title="Tradeoffs"><TextList items={project.hardestDecisions} /></ProseSection>
          <ProseSection title="Current status">
            <TextList items={project.outcomes} />
            <p className="win95-reading-copy"><strong>Status: {project.status}</strong></p>
          </ProseSection>
          <ProseSection title="Technologies">
            <ul className="win95-technology-list" aria-label="Technologies">
              {project.technologies.map((technology) => <li key={technology} className="win95-badge">{technology}</li>)}
            </ul>
          </ProseSection>
          <ProseSection title="Code and demo">
            <div className="win95-project-evidence-links">
              {project.sourceUrl && <a className="win95-button win95-content-action" href={project.sourceUrl} target="_blank" rel="noopener noreferrer">View source repository</a>}
              {project.liveUrl && <a className="win95-button win95-content-action" href={project.liveUrl}>Open live project</a>}
            </div>
          </ProseSection>
          <ProseSection title="Caveats"><p className="win95-reading-copy">{project.limitations}</p></ProseSection>
        </div>

        <aside className="win95-group-box win95-project-properties" aria-labelledby="project-properties-title">
          <h2 id="project-properties-title" className="win95-group-box-label">Properties</h2>
          <div className="win95-well win95-properties-list">
            <p><strong>Name:</strong> {project.name}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Role:</strong> {project.role}</p>
            <p><strong>Code:</strong> Public GitHub repository</p>
            <p><strong>Path:</strong> C:\\STEVEN\\PROJECTS\\{project.slug.toUpperCase()}\\</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
