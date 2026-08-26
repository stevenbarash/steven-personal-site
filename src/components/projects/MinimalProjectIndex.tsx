import Link from 'next/link';
import { publishedProjects } from '@/content/projects';

const formatStatus = (status: string) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

export function MinimalProjectIndex() {
  return (
    <div className="minimal-shell minimal-projects-page">
      <header className="minimal-projects-intro">
        <h1>Projects</h1>
        <p>Software projects I have built and maintain, with notes on how they work and where they stand.</p>
      </header>

      <ul className="minimal-project-list" aria-label="Projects">
        {publishedProjects.map((project) => (
          <li key={project.slug}>
            <article aria-labelledby={`project-${project.slug}`}>
              <h2 id={`project-${project.slug}`}>
                <Link className="minimal-project-title-link" href={`/projects/${project.slug}`}>
                  {project.name}
                </Link>
              </h2>
              <p className="minimal-project-summary">{project.oneLiner}</p>
              <p className="minimal-project-differentiator">{project.approach[0]}</p>
              <div className="minimal-project-facts">
                <p><strong>Status:</strong> {formatStatus(project.status)}</p>
                <p><strong>Technologies:</strong> {project.technologyLine}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
