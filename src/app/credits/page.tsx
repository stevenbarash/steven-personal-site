import type { Metadata } from 'next';
import { Column, Heading, Row, SmartLink, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { createTwitterMetadata } from '@/constants/site';

const description = 'Design attribution and template license for Steven Barash’s personal site.';
const socialTitle = 'Credits | Steven Barash';

export const metadata: Metadata = {
  title: 'Credits',
  description,
  alternates: { canonical: '/credits' },
  robots: { index: false, follow: true },
  openGraph: { url: '/credits', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

export default function CreditsPage() {
  return (
    <PortfolioLayout activeHref="/credits">
      <Column as="article" maxWidth="s" gap="32">
        <Heading as="h1" variant="display-strong-s">Credits</Heading>
        <Column as="section" gap="16" aria-labelledby="template-credit-heading">
          <Heading as="h2" id="template-credit-heading" variant="heading-strong-l">Magic Portfolio by Once UI</Heading>
          <Text as="p" variant="body-default-l">
            This site is adapted from Magic Portfolio, created by Once UI. Navigation,
            styling, and page layouts have been customized for Steven Barash.
          </Text>
          <Text as="p" onBackground="neutral-weak">
            The original template is licensed under Creative Commons
            Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
          </Text>
          <Row gap="24" wrap>
            <SmartLink className="portfolio-credits-link" href="https://github.com/once-ui-system/magic-portfolio" target="_blank" rel="noopener noreferrer">
              Template source
            </SmartLink>
            <SmartLink className="portfolio-credits-link" href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
              License terms
            </SmartLink>
          </Row>
        </Column>
      </Column>
    </PortfolioLayout>
  );
}
