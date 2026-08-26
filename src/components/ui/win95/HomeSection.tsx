import Image from 'next/image';
import { getAppsForPlacement } from '@/features/desktop/app-catalog';
import { profileContent } from '@/content/profile';

import { siteConfig } from '@/constants/site';
import { AppLink } from './AppLink';
import { DecodedEmailLink } from './DecodedEmailLink';
import { Win95Icon } from './Win95Icon';

const homeApps = getAppsForPlacement('home');
const primaryApps = homeApps.filter(({ placement }) => placement.group === 0);
const supportingApps = homeApps.filter(({ placement }) => placement.group === 1);

const LauncherList = ({ apps, label }: { apps: typeof homeApps; label: string }) => (
  <ul className="win95-home-file-list" aria-label={label}>
    {apps.map((app) => (
      <li key={app.id}>
        <AppLink href={app.href} className="win95-home-file-row" data-launcher-for={app.id}>
          <Win95Icon name={app.icon} size={32} />
          <span>
            <strong>{app.placement.label}</strong>
            <small className="win95-metadata">{app.chrome.statusText}</small>
          </span>
        </AppLink>
      </li>
    ))}
  </ul>
);

export function HomeSection() {
  return (
    <section className="win95-home-section" aria-labelledby="home-headline">
      <div className="win95-well win95-home-summary">
        <Image
          src={profileContent.portraitUrl}
          alt={profileContent.name}
          width={80}
          height={80}
          priority
          className="win95-home-portrait"
        />
        <div>
          <p className="win95-metadata"><strong>{profileContent.name}</strong> · {profileContent.role} at {profileContent.company} · {profileContent.location}</p>
          <h1 id="home-headline">{profileContent.headline}</h1>
          <p>{profileContent.summary}</p>
          <p className="win95-home-capabilities"><strong>{profileContent.capabilityLine}</strong></p>
        </div>
      </div>

      <div className="win95-home-actions" aria-label="Primary actions">
        <AppLink href="/desktop?app=resume" className="win95-button win95-content-action" data-focus-launcher="resume">Open Resume</AppLink>
        <DecodedEmailLink displayEmail={siteConfig.emailDisplay} className="win95-button win95-content-action">Email Steven</DecodedEmailLink>
      </div>

      <div className="win95-group-box win95-home-programs">
        <h2 className="win95-group-box-label">Programs and Files</h2>
        <div className="win95-well">
          <LauncherList apps={primaryApps} label="Programs and Files" />
          <div className="win95-separator" />
          <LauncherList apps={supportingApps} label="Supporting programs" />
        </div>
      </div>

    </section>
  );
}
