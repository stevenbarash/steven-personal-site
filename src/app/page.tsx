import type { Metadata } from 'next';
import { Avatar, Button, Column, Heading, Row, SmartLink, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { SocialIcon } from '@/components/ui/SocialIcon';
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
              <Button href={siteConfig.xUrl} size="l" rounded variant="tertiary" target="_blank" rel="noopener noreferrer" aria-label="X (opens in a new tab)">
                <SocialIcon service="x" />
              </Button>
              <Button href={siteConfig.githubUrl} size="l" rounded variant="tertiary" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
                <SocialIcon service="github" />
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
            <Text as="p" onBackground="neutral-weak">{profileContent.background}</Text>
            <Text as="p" onBackground="neutral-weak">{profileContent.protocols}</Text>
          </Column>
          <Column flex={1} gap="20">
            <Heading as="h3" variant="heading-strong-l">What I’m interested in</Heading>
            <Text as="p" onBackground="neutral-weak">{profileContent.interests}</Text>
            <Text as="p" onBackground="neutral-weak">{profileContent.prototyping}</Text>
          </Column>
        </Row>

        <Column as="section" gap="20" className={styles.personal} aria-labelledby="about-heading" data-home-about>
          <Heading as="h2" id="about-heading" variant="display-strong-xs">Outside of work</Heading>
          <Text as="p" onBackground="neutral-weak">{profileContent.personal}</Text>
          <Text as="p" onBackground="neutral-weak">{profileContent.languages}</Text>
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
