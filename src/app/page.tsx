import type { Metadata } from 'next';
import { Avatar, Button, Column, Heading, Row, SmartLink, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { profileContent } from '@/content/profile';
import { createTwitterMetadata, siteConfig } from '@/constants/site';
import styles from './page.module.css';

const headline = profileContent.headline;
const socialTitle = `${profileContent.name} | ${profileContent.professionalLabel}`;

export const metadata: Metadata = {
  title: { absolute: socialTitle },
  description: headline,
  alternates: { canonical: '/' },
  openGraph: { url: '/', title: socialTitle, description: headline },
  twitter: createTwitterMetadata(socialTitle, headline),
};

// Homepage composition adapted from Once UI's Magic Portfolio (CC BY-NC 4.0).
export default function Home() {
  return (
    <PortfolioLayout>
      <Column className={styles.home} gap="104" s={{ gap: '64' }}>
        <Column as="section" className={styles.hero} horizontal="center" align="center" gap="32" s={{ gap: '20' }} aria-labelledby="home-headline" data-home-hero>
          <Column horizontal="center" gap="16" s={{ gap: '12' }}>
            <Avatar src={profileContent.portraitUrl} size={4.5} aria-label="Illustrated portrait of Steven Barash" className={styles.portrait} />
            <Heading id="home-headline" variant="display-strong-l" className={styles.headline} wrap="balance">Hi, I’m Steven Barash.</Heading>
            <Text as="p" variant="heading-default-xl" className={styles.introduction}>{headline}</Text>
          </Column>
          <Column gap="12" horizontal="center">
            <Column gap="4" horizontal="center">
              <Text as="p" variant="body-default-s">{profileContent.role} at {profileContent.company}</Text>
              <Text as="p" variant="body-default-s" onBackground="neutral-weak">Previously ID.me and Okta · {profileContent.location}</Text>
            </Column>
            <Row as="nav" className={styles.socials} gap="8" horizontal="center" aria-label="Social profiles">
              {/* Brand glyphs from Simple Icons (CC0). */}
              <Button href={siteConfig.xUrl} size="l" rounded variant="tertiary" target="_blank" rel="noopener noreferrer" aria-label="X (opens in a new tab)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                </svg>
              </Button>
              <Button href={siteConfig.githubUrl} size="l" rounded variant="tertiary" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </Button>
            </Row>
          </Column>
          <Row className={styles.primaryActions} gap="12" wrap horizontal="center" aria-label="Primary actions">
            <Button href="/resume" size="l" rounded arrowIcon>View experience</Button>
            <Button href="/contact" size="l" rounded variant="secondary">Get in touch</Button>
          </Row>
        </Column>

        <Row as="section" className={styles.about} gap="48" s={{ direction: 'column' }} aria-labelledby="background-heading">
          <Column flex={1} gap="20">
            <Heading as="h2" id="background-heading" variant="display-strong-xs">Identity &amp; developer platforms</Heading>
            <Text as="p" onBackground="neutral-weak">
              I’ve spent 6+ years in identity, developer platforms, and technical
              GTM. I work with early-stage startups, global enterprises,
              and government agencies.
            </Text>
            <Text as="p" onBackground="neutral-weak">
              My technical background includes OAuth 2.0, OpenID Connect, SAML,
              WebAuthn/passkeys, SCIM, identity federation, CIAM, RBAC,
              and fine-grained authorization.
            </Text>
          </Column>
          <Column flex={1} gap="20">
            <Heading as="h3" variant="heading-strong-l">What I’m interested in</Heading>
            <Text as="p" onBackground="neutral-weak">Developer-first platforms, AI-enabled GTM, building agents, demo engineering, and automation.</Text>
            <Text as="p" onBackground="neutral-weak">
              I like using rapid prototyping to make complex technical ideas
              tangible: something a team can build, try, and evaluate.
            </Text>
          </Column>
        </Row>

        <Column as="section" gap="20" className={styles.personal} aria-labelledby="about-heading" data-home-about>
          <Heading as="h2" id="about-heading" variant="display-strong-xs">Outside of work</Heading>
          <Text as="p" onBackground="neutral-weak">
            Outside of work, I’m usually cycling somewhere unnecessarily far
            away, learning a language (the human spoken kind), or exploring a new place.
          </Text>
          <Text as="p" onBackground="neutral-weak">I speak Russian, some Ukrainian and Spanish, and a little Korean.</Text>
          <SmartLink href="/photos" suffixIcon="arrowRight" className={styles.textLink}>View photography</SmartLink>
        </Column>

        <Column as="section" className={styles.contact} gap="20" horizontal="center" align="center" background="surface" radius="l" border padding="40" aria-labelledby="home-contact-heading" data-home-contact>
          <Heading as="h2" id="home-contact-heading" variant="display-strong-s">Say hello.</Heading>
          <SmartLink className={styles.email} href={`mailto:${siteConfig.emailDisplay}`}>{siteConfig.emailDisplay}</SmartLink>
          <Button href="/contact" size="l" variant="secondary" rounded>All contact links</Button>
        </Column>
      </Column>
    </PortfolioLayout>
  );
}
