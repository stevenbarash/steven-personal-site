import { Button, Column, Heading, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';

export default function NotFound() {
  return (
    <PortfolioLayout activeHref="/404">
      <Column className="portfolio-shell" gap="24" horizontal="center" align="center" paddingY="64">
        <Heading as="h1" variant="display-strong-s">Page not found</Heading>
        <Text as="p" variant="body-default-l" onBackground="neutral-weak">This page does not exist. Head home to find what you’re looking for.</Text>
        <Button href="/" size="l" rounded>Back to home</Button>
      </Column>
    </PortfolioLayout>
  );
}
