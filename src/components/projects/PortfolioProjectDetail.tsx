import { Button, Column, Heading, SmartLink, Text } from '@once-ui-system/core';
import type { ProjectCaseStudy } from '@/content/projects';
import { ProjectArtifact } from '@/components/projects/artifacts/ProjectArtifact';
import styles from './Projects.module.css';

const formatStatus = (status: string) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

function TextList({ items }: { items: string[] }) {
  return (
    <ul className={styles.textList}>
      {items.map((item) => <Text as="li" variant="body-default-m" key={item}>{item}</Text>)}
    </ul>
  );
}

export function PortfolioProjectDetail({ project }: { project: ProjectCaseStudy }) {
  const mechanismItems = [...project.approach, ...project.constraints];

  return (
    <div className={`portfolio-shell ${styles.page}`}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <SmartLink href="/projects">Projects</SmartLink>
        <span aria-hidden="true">/</span>
        <Text as="span" variant="body-default-s" onBackground="neutral-weak" aria-current="page">{project.name}</Text>
      </nav>

      <article className={styles.document} aria-labelledby="project-title">
        <header className={styles.detailHeader}>
          <Heading as="h1" variant="display-strong-s" className={styles.title} id="project-title">{project.name}</Heading>
          <Text as="p" variant="body-default-l" onBackground="neutral-weak" className={styles.lede}>{project.oneLiner}</Text>
          <dl className={styles.facts}>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Status</dt><dd>{formatStatus(project.status)}</dd></div>
            <div><dt>Technologies</dt><dd>{project.technologies.join(', ')}</dd></div>
          </dl>
          <Column className={styles.notes} gap="12">
            {project.outcomes.map((outcome) => <Text as="p" variant="body-default-m" key={outcome}>{outcome}</Text>)}
            {project.limitations && <Text as="p" variant="body-default-m" onBackground="neutral-weak">{project.limitations}</Text>}
          </Column>
          <div className={styles.actions} aria-label="Project links">
            {project.sourceUrl && (
              <Button href={project.sourceUrl} variant="secondary" size="l" target="_blank" rel="noopener noreferrer">
                View source on GitHub
              </Button>
            )}
            {project.liveUrl && <Button href={project.liveUrl} variant="primary" size="l">Open the live site</Button>}
          </div>
        </header>

        <ProjectArtifact slug={project.slug} variant="detail" />

        <Column className={styles.prose}>
          <section>
            <Heading as="h2" variant="heading-strong-l">{project.sectionHeadings.motivation}</Heading>
            <Text as="p" variant="body-default-m">{project.problem}</Text>
            <Text as="p" variant="body-default-m">{project.motivationAudience}</Text>
          </section>

          {mechanismItems.length > 0 && (
            <section>
              <Heading as="h2" variant="heading-strong-l">{project.sectionHeadings.mechanism}</Heading>
              <TextList items={mechanismItems} />
            </section>
          )}

          {project.hardestDecisions.length > 0 && (
            <section>
              <Heading as="h2" variant="heading-strong-l">{project.sectionHeadings.decisions}</Heading>
              <TextList items={project.hardestDecisions} />
            </section>
          )}
        </Column>

        <Button className={styles.back} href="/projects" variant="tertiary" size="l">Back to projects</Button>
      </article>
    </div>
  );
}
