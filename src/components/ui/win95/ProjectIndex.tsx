import Link from 'next/link';
import { publishedProjects } from '@/content/projects';
import { Win95Icon } from './Win95Icon';

export function ProjectIndex() {
  return (
    <section className="win95-project-index" aria-labelledby="projects-title">
      <div className="win95-well win95-project-readme">
        <p className="win95-metadata">README.TXT</p>
        <h1 id="projects-title">Project Explorer</h1>
        <p className="win95-reading-copy">Four software projects covering native device control, editor tooling, a cycling CLI, and this site. Each folder opens a project page with design notes, current status, and links to the code.</p>
      </div>

      <div className="win95-project-explorer" aria-label="Project files">
        <div className="win95-group-box win95-project-files">
          <h2 className="win95-group-box-label">Project files</h2>
          <div className="win95-well">
            <div className="win95-explorer-columns win95-interface-label" aria-hidden="true">
              <span>Name</span><span>Status</span><span>Type</span>
            </div>
            <ul className="win95-project-file-list">
              {publishedProjects.map((project) => (
                <li key={project.slug} className="win95-project-file-row">
                  <Win95Icon name="folderOpen" size={32} />
                  <div className="win95-project-file-copy">
                    <Link className="win95-project-file-link" href={`/projects/${project.slug}`}>
                      <strong>{project.name}</strong>
                    </Link>
                    <p className="win95-reading-copy">{project.oneLiner}</p>
                    <p className="win95-metadata">{project.technologies.join(' · ')}</p>
                    <div className="win95-project-row-actions">
                      <Link className="win95-button win95-content-action" href={`/projects/${project.slug}`}>Open case study</Link>

                    </div>
                  </div>
                  <span className="win95-status-section win95-metadata">{project.status}</span>
                  <span className="win95-metadata">Case study</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="win95-group-box win95-project-properties" aria-labelledby="project-index-properties">
          <h2 id="project-index-properties" className="win95-group-box-label">Properties</h2>
          <div className="win95-well win95-properties-list">
            <p><strong>Location:</strong> C:\\STEVEN\\PROJECTS\\</p>
            <p><strong>Projects:</strong> {publishedProjects.length}</p>
            <p><strong>Code:</strong> Public on GitHub</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
