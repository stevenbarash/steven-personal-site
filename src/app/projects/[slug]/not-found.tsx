import { Button, Heading, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import styles from '@/components/projects/Projects.module.css';

export default function ProjectNotFound() {
  return (
    <PortfolioLayout activeHref="/projects">
      <div className={`portfolio-shell ${styles.notFound}`}>
        <Heading as="h1" variant="display-strong-s" className={styles.title}>Project not found</Heading>
        <Text as="p" variant="body-default-l" onBackground="neutral-weak">
          This project does not exist or is not available.
        </Text>
        <Button href="/projects" variant="secondary" size="m">Back to projects</Button>
      </div>
    </PortfolioLayout>
  );
}
