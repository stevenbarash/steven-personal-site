import { contactContent } from '@/content/contact';
import { DecodedEmailLink } from './DecodedEmailLink';
import { Win95Icon } from './Win95Icon';

const iconByKind = {
  linkedin: 'network',
  github: 'folderOpen',
  instagram: 'camera',
  x: 'url',
  website: 'globe',
} as const;

export function ContactSection() {
  return (
    <section aria-labelledby="contact-title">
      <div className="win95-well p-[8px]">
        <h1 id="contact-title" className="text-[16px] font-bold">Contact Steven</h1>
        <p className="win95-reading-copy mt-[4px]">{contactContent.introduction}</p>
      </div>
      <div className="win95-group-box">
        <span className="win95-group-box-label">Contact options</span>
        <div className="win95-well p-[6px]">
          <ul className="win95-contact-list">
            <li>
              <DecodedEmailLink displayEmail={contactContent.emailDisplay} className="win95-contact-row win95-content-action">
                <Win95Icon name="mail" size={32} />
                <span><strong>Email Steven</strong><small className="win95-metadata">{contactContent.emailDisplay}</small></span>
              </DecodedEmailLink>
            </li>
            {contactContent.socialLinks.filter(({ kind }) => kind !== 'website').map((contact) => (
              <li key={contact.kind}>
                <a className="win95-contact-row win95-content-action" href={contact.url} target="_blank" rel="noopener noreferrer" aria-label={contact.label}>
                  <Win95Icon name={iconByKind[contact.kind]} size={32} />
                  <span><strong>{contact.label}</strong><small className="win95-metadata">{contact.description}</small></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
