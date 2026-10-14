import type { Metadata } from 'next';
import { Button, Heading, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { contactContent } from '@/content/contact';
import { decodeEmailHref } from '@/lib/email';
import { createTwitterMetadata } from '@/constants/site';
import styles from './contact.module.css';

const description = contactContent.description;
const socialTitle = 'Contact | Steven Barash';

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

export default function ContactPage() {
  return (
    <PortfolioLayout activeHref="/contact">
      <div className={styles.document}>
        <header className={styles.header}>
          <Heading as="h1" className={styles.pageHeading}>Contact</Heading>
          <div className={styles.primary} data-contact-primary>
            <Text as="p" className={styles.introduction}>{contactContent.introduction}</Text>
            <Button className={styles.email} size="l" variant="primary" href={decodeEmailHref(contactContent.emailDisplay)} aria-label={`Email ${contactContent.emailDisplay}`}>
              {contactContent.emailDisplay}
            </Button>
          </div>
        </header>

        <nav className={styles.otherLinks} data-contact-secondary aria-label="Social profiles">
          {contactContent.socialLinks.map((contact) => contact.kind === 'website' ? null : (
            <Button
              key={contact.kind}
              className={styles.socialLink}
              href={contact.url}
              size="l"
              variant="tertiary"
              rounded
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${contact.label} (opens in a new tab)`}
              title={contact.label}
            >
              <SocialIcon service={contact.kind} />
            </Button>
          ))}
        </nav>
      </div>
    </PortfolioLayout>
  );
}
