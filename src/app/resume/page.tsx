import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { profileContent } from '@/content/profile';
import { publishedProjects } from '@/content/projects';
import { resumeData, resumeSkillGroups } from '@/data/resume';
import { decodeEmailHref } from '@/lib/email';
import { createTwitterMetadata } from '@/constants/site';

const description = 'Experience, education, skills, languages, and honors for Steven Barash.';
const socialTitle = 'Resume | Steven Barash';

export const metadata: Metadata = {
  title: 'Resume',
  description,
  alternates: { canonical: '/resume' },
  openGraph: { url: '/resume', title: socialTitle, description },
  twitter: createTwitterMetadata(socialTitle, description),
};

const recentExperience = resumeData.experience.slice(0, 3);
const earlierExperience = resumeData.experience.slice(3);
const selectedProof = publishedProjects.filter(({ slug }) => (
  slug === 'pult' || slug === 'uptick' || slug === 'personal-site'
));

function CompanyHeading({ job }: { job: (typeof resumeData.experience)[number] }) {
  return (
    <div className="minimal-company-heading">
      <Image
        className="minimal-company-logo"
        src={job.logoSrc}
        alt=""
        width={40}
        height={40}
        unoptimized
      />
      <h3>
        {job.companyUrl ? (
          <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
            {job.company}
          </a>
        ) : job.company}
      </h3>
    </div>
  );
}

function RoleList({ job }: { job: (typeof resumeData.experience)[number] }) {
  return (
    <div className="minimal-role-list">
      {job.roles.map((role) => (
        <div className="minimal-role-entry" key={`${role.title}-${role.startDate}`}>
          <p><strong>{role.title}</strong></p>
          <p>{role.startDate} to {role.endDate}</p>
          <p>{role.location}</p>
        </div>
      ))}
    </div>
  );
}

function CompanyTenure({ job }: { job: (typeof resumeData.experience)[number] }) {
  const newestRole = job.roles[0];
  const oldestRole = job.roles[job.roles.length - 1];

  return (
    <p className="resume-company-tenure" aria-hidden="true">
      <span>{oldestRole.startDate}</span>
      <span>/</span>
      <span>{newestRole.endDate}</span>
    </p>
  );
}

export default function ResumePage() {
  return (
    <MinimalSiteLayout activeHref="/resume">
      <article className="minimal-shell minimal-document minimal-resume">
        <header className="resume-hero">
          <div className="resume-hero-copy">
            <h1>Experience</h1>
            <p className="resume-current-role">{profileContent.role} at {profileContent.company}</p>
            <p className="minimal-document-lede">{resumeData.summary}</p>
          </div>
          <div className="resume-hero-meta">
            <nav className="minimal-inline-links" aria-label="Resume contact links">
              <a href={decodeEmailHref(resumeData.contact.email)}>{resumeData.contact.email}</a>
              <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={resumeData.contact.website}>barash.me</a>
            </nav>
            <nav className="resume-proof-index" aria-label="Selected proof">
              <p>Selected proof</p>
              <ul>
                {selectedProof.map((project) => (
                  <li key={project.slug}>
                    <Link href={`/projects/${project.slug}`}>
                      <span>{project.name}</span>
                      <span>{project.technologyLine}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <section className="resume-career" aria-labelledby="resume-career-heading">
          <div className="resume-section-heading">
            <h2 id="resume-career-heading">Career</h2>
            <p>Current work and the identity path that led here.</p>
          </div>
          <div className="resume-recent-list" data-resume-recent>
            {recentExperience.map((job, index) => (
              <article className="minimal-experience resume-career-entry" key={job.company}>
                <div className="resume-company-rail">
                  <p className="resume-sequence" aria-hidden="true">0{index + 1}</p>
                  <CompanyHeading job={job} />
                  <CompanyTenure job={job} />
                </div>
                <div className="resume-career-detail">
                  <RoleList job={job} />
                  {job.bullets.length > 0 && (
                    <ul>
                      {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-earlier" aria-labelledby="resume-earlier-heading">
          <div className="resume-section-heading">
            <h2 id="resume-earlier-heading">Earlier experience</h2>
            <p>Engineering, web, research, and support foundations.</p>
          </div>
          <div className="resume-earlier-list" data-resume-earlier>
            {earlierExperience.map((job) => (
              <article className="minimal-experience" key={job.company}>
                <div className="resume-earlier-company">
                  <CompanyHeading job={job} />
                  <CompanyTenure job={job} />
                </div>
                <div className="resume-earlier-detail">
                  <RoleList job={job} />
                  {job.bullets.length > 0 && (
                    <details>
                      <summary>Selected work</summary>
                      <ul>
                        {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    </details>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="resume-support-grid" data-resume-support>
          <section className="resume-support-section resume-capabilities" aria-labelledby="resume-capabilities">
            <h2 id="resume-capabilities">Capabilities</h2>
            <div className="resume-skill-groups">
              {resumeSkillGroups.map((group) => (
                <section key={group.name}>
                  <h3>{group.name}</h3>
                  <ul className="minimal-plain-list">
                    {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section className="resume-support-section resume-education" aria-labelledby="resume-education">
            <h2 id="resume-education">Education</h2>
            {resumeData.education.map((entry) => (
              <div className="minimal-education-entry" key={entry.institution}>
                <h3>{entry.institution}</h3>
                <p>{entry.degree}, {entry.field}</p>
                <p>{entry.dates}</p>
              </div>
            ))}
          </section>

          <section className="resume-support-section resume-languages" aria-labelledby="resume-languages">
            <h2 id="resume-languages">Languages</h2>
            <ul className="minimal-plain-list">
              {resumeData.languages.map((language) => <li key={language.name}>{language.name}: {language.proficiency}</li>)}
            </ul>
          </section>

          <section className="resume-support-section resume-honors" aria-labelledby="resume-honors">
            <h2 id="resume-honors">Honors</h2>
            <ul className="minimal-plain-list">
              {resumeData.honors.map((honor) => <li key={honor}>{honor}</li>)}
            </ul>
          </section>
        </div>
      </article>
    </MinimalSiteLayout>
  );
}
