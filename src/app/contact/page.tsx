import type { Metadata } from 'next';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { contactContent } from '@/content/contact';
import { decodeEmailHref } from '@/lib/email';
import { createTwitterMetadata } from '@/constants/site';

const description = 'Email Steven Barash or find him on LinkedIn, GitHub, Instagram, and X.';
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
    <MinimalSiteLayout activeHref="/contact">
      <div className="minimal-shell minimal-document minimal-contact-page">
        <header className="minimal-document-header">
          <h1>Contact</h1>
          <div className="minimal-contact-primary" data-contact-primary>
            <p className="minimal-document-lede">Email me about identity architecture, agentic systems, technical evaluations, or workshops.</p>
            <p className="minimal-contact-invitation">Email is the best place to start.</p>
            <a className="minimal-email-link" href={decodeEmailHref(contactContent.emailDisplay)} aria-label={`Email ${contactContent.emailDisplay}`}>
              {contactContent.emailDisplay}
            </a>
          </div>
        </header>

        <section className="minimal-contact-list" data-contact-secondary aria-label="Other places to find Steven">
          <ul>
            {socialLinks.map((contact) => (
              <li key={contact.kind}>
                <a href={contact.url} target="_blank" rel="noopener noreferrer" aria-label={contact.label}>
                  <strong>{contact.label}</strong>
                  <span>{contact.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MinimalSiteLayout>
  );
}
