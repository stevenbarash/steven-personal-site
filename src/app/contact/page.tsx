import type { Metadata } from 'next';
import { Button, Heading, SmartLink, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
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
  const socialLinks = contactContent.socialLinks.filter(({ kind }) => kind !== 'website');

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

        <section className={styles.otherLinks} data-contact-secondary aria-labelledby="contact-elsewhere">
          <Heading as="h2" id="contact-elsewhere" className={styles.sectionHeading}>You can also find me on</Heading>
          <ul>
            {socialLinks.map((contact) => (
              <li key={contact.kind}>
                <SmartLink unstyled className={styles.socialLink} href={contact.url} target="_blank" rel="noopener noreferrer">
                  <span className={styles.linkCopy}>
                    <Text as="strong" className={styles.linkLabel}>{contact.label}</Text>
                    <Text as="span" className={styles.linkDescription}>{contact.description}</Text>
                  </span>
                  <span className={styles.linkAction} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PortfolioLayout>
  );
}
