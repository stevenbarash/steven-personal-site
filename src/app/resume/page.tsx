import type { Metadata } from 'next';
import Image from 'next/image';
import { Button, Heading, SmartLink, Text } from '@once-ui-system/core';
import { PortfolioLayout } from '@/components/layout/PortfolioLayout';
import { profileContent } from '@/content/profile';
import { resumeData, resumeSkillGroups } from '@/data/resume';
import { decodeEmailHref } from '@/lib/email';
import { createTwitterMetadata } from '@/constants/site';
import styles from './resume.module.css';

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

function CompanyHeading({ job }: { job: (typeof resumeData.experience)[number] }) {
  return (
    <div className={styles.companyHeading}>
      <Image
        className={styles.companyLogo}
        src={job.logoSrc}
        alt=""
        width={40}
        height={40}
        unoptimized
      />
      <Heading as="h3" className={styles.companyName}>
        {job.companyUrl ? (
          <SmartLink unstyled href={job.companyUrl} target="_blank" rel="noopener noreferrer">
            {job.company}
          </SmartLink>
        ) : job.company}
      </Heading>
    </div>
  );
}

function RoleList({ job }: { job: (typeof resumeData.experience)[number] }) {
  return (
    <div className={styles.roles}>
      {job.roles.map((role) => (
        <div className={styles.role} key={`${role.title}-${role.startDate}`}>
          <Text as="p" className={styles.roleTitle}><strong>{role.title}</strong></Text>
          <Text as="p" className={styles.dates}>{role.startDate} to {role.endDate}</Text>
          <Text as="p" className={styles.location}>{role.location}</Text>
        </div>
      ))}
    </div>
  );
}

export default function ResumePage() {
  return (
    <PortfolioLayout activeHref="/resume">
      <article className={styles.document}>
        <aside className={styles.profile} aria-label="Profile and contact">
          <Image
            className={styles.portrait}
            src={profileContent.portraitUrl}
            alt={`Illustrated portrait of ${profileContent.name}`}
            width={112}
            height={112}
            sizes="112px"
          />
          <Text as="p" className={styles.name}>{profileContent.name}</Text>
          <Text as="p" className={styles.profileLocation}>{profileContent.location}</Text>
          <nav className={styles.contactLinks} aria-label="Resume contact links">
            <Button size="s" variant="secondary" href={decodeEmailHref(resumeData.contact.email)}>
              {resumeData.contact.email}
            </Button>
            <SmartLink href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</SmartLink>
            <SmartLink href={resumeData.contact.website}>barash.me</SmartLink>
          </nav>
        </aside>
        <div className={styles.content}>
          <header className={styles.hero}>
            <Heading as="h1" className={styles.pageHeading}>Experience</Heading>
            <Text as="p" className={styles.currentRole}>{profileContent.role} at {profileContent.company}</Text>
            <Text as="p" className={styles.summary}>{resumeData.summary}</Text>
          </header>

        <section className={styles.career} aria-labelledby="resume-career-heading">
          <Heading as="h2" id="resume-career-heading" className={styles.sectionHeading}>Career</Heading>
          <div data-resume-recent>
            {recentExperience.map((job) => (
              <article className={styles.job} key={job.company}>
                <CompanyHeading job={job} />
                <div className={styles.jobDetail}>
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

        <section className={styles.earlier} aria-labelledby="resume-earlier-heading">
          <Heading as="h2" id="resume-earlier-heading" className={styles.sectionHeading}>Earlier experience</Heading>
          <div data-resume-earlier>
            {earlierExperience.map((job) => (
              <article className={`${styles.job} ${styles.earlierJob}`} key={job.company}>
                <CompanyHeading job={job} />
                <div className={styles.jobDetail}>
                  <RoleList job={job} />
                  {job.bullets.length > 0 && (
                    <details>
                      <summary>Work at {job.company}</summary>
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

        <div className={styles.support} data-resume-support>
          <section className={styles.capabilities} aria-labelledby="resume-capabilities">
            <Heading as="h2" id="resume-capabilities" className={styles.sectionHeading}>Capabilities</Heading>
            <div className={styles.skillGroups}>
              {resumeSkillGroups.map((group) => (
                <section key={group.name}>
                  <Heading as="h3" className={styles.supportHeading}>{group.name}</Heading>
                  <ul className={styles.plainList}>
                    {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.supportSection} aria-labelledby="resume-education">
            <Heading as="h2" id="resume-education" className={styles.sectionHeading}>Education</Heading>
            {resumeData.education.map((entry) => (
              <div className={styles.educationEntry} key={entry.institution}>
                <Heading as="h3" className={styles.supportHeading}>{entry.institution}</Heading>
                <Text as="p">{entry.degree}, {entry.field}</Text>
                <Text as="p" className={styles.dates}>{entry.dates}</Text>
              </div>
            ))}
          </section>

          <section className={styles.supportSection} aria-labelledby="resume-languages">
            <Heading as="h2" id="resume-languages" className={styles.sectionHeading}>Languages</Heading>
            <ul className={styles.plainList}>
              {resumeData.languages.map((language) => <li key={language.name}>{language.name}: {language.proficiency}</li>)}
            </ul>
          </section>

          <section className={styles.supportSection} aria-labelledby="resume-honors">
            <Heading as="h2" id="resume-honors" className={styles.sectionHeading}>Honors</Heading>
            <ul className={styles.plainList}>
              {resumeData.honors.map((honor) => <li key={honor}>{honor}</li>)}
            </ul>
          </section>
        </div>
        </div>
      </article>
    </PortfolioLayout>
  );
}
