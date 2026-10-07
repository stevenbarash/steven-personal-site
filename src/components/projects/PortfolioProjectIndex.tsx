import { Button, Heading, SmartLink, Text } from '@once-ui-system/core';
import { ProjectArtifact } from '@/components/projects/artifacts/ProjectArtifact';
import { publishedProjects } from '@/content/projects';
import styles from './Projects.module.css';

const formatStatus = (status: string) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

export function PortfolioProjectIndex() {
  return (
    <div className={`portfolio-shell ${styles.page}`}>
      <header className={styles.indexIntro}>
        <Heading as="h1" variant="display-strong-s" className={styles.title}>Projects</Heading>
        <Text as="p" variant="body-default-l" onBackground="neutral-weak" className={styles.lede}>
          Software projects I have built and maintain, with notes on how they work and where they stand.
        </Text>
      </header>

      <ul className={styles.projectList} aria-label="Projects">
        {publishedProjects.map((project) => (
          <li key={project.slug}>
            <article className={styles.projectPreview} aria-labelledby={`project-${project.slug}`}>
              <ProjectArtifact slug={project.slug} variant="preview" />
              <div className={styles.previewContent}>
                <Heading as="h2" variant="heading-strong-l" id={`project-${project.slug}`}>
                  <SmartLink unstyled className={styles.titleLink} href={`/projects/${project.slug}`}>
                    {project.name}
                  </SmartLink>
                </Heading>
                <Text as="p" variant="body-default-l">{project.oneLiner}</Text>
                <Text as="p" variant="body-default-m" onBackground="neutral-weak">{project.approach[0]}</Text>
                <dl className={styles.facts}>
                  <div><dt>Status</dt><dd>{formatStatus(project.status)}</dd></div>
                  <div><dt>Technologies</dt><dd>{project.technologyLine}</dd></div>
                </dl>
                <Button href={`/projects/${project.slug}`} variant="secondary" size="l" id={`read-${project.slug}`} arrowIcon>
                  Read the case study
                </Button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
