'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { decodeEmailHref } from '@/lib/email';
import type { ResumeData } from '@/types';
import { Win95Icon } from './Win95Icon';

interface ResumeSectionProps {
  resume: ResumeData;
}

type ResumeTab = 'experience' | 'education' | 'skills' | 'honors';

const resumeTabs: { id: ResumeTab; label: string }[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'honors', label: 'Honors' },
];

const companyLogos: Record<string, string> = {
  Descope: '/images/logos/descope.png',
  'ID.me': '/images/logos/idme.png',
  Okta: '/images/logos/okta.png',
  'University of Pittsburgh — Swanson School of Engineering': '/images/logos/pitt.png',
  'Innovative Systems, Inc.': '/images/logos/innovative.png',
  'Federated Hermes': '/images/logos/federated.png',
  'University of Pittsburgh': '/images/logos/pitt.png',
  'Carnegie Mellon University': '/images/logos/cmu.png',
};

const educationLogos: Record<string, string> = {
  'University of Pittsburgh — School of Computing and Information': '/images/logos/pitt.png',
};

const nextResumeTab = (currentTab: ResumeTab, key: string) => {
  const currentIndex = resumeTabs.findIndex((tab) => tab.id === currentTab);

  if (key === 'Home') return resumeTabs[0].id;
  if (key === 'End') return resumeTabs[resumeTabs.length - 1].id;
  if (key === 'ArrowLeft') return resumeTabs[(currentIndex - 1 + resumeTabs.length) % resumeTabs.length].id;
  if (key === 'ArrowRight') return resumeTabs[(currentIndex + 1) % resumeTabs.length].id;
  return undefined;
};

export const ResumeSection: React.FC<ResumeSectionProps> = ({ resume }) => {
  const [activeTab, setActiveTab] = useState<ResumeTab>('experience');
  const tabIdPrefix = useId();

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTab: ResumeTab) => {
    const nextTab = nextResumeTab(currentTab, event.key);
    if (!nextTab) return;

    event.preventDefault();
    setActiveTab(nextTab);
    event.currentTarget
      .closest('[role="tablist"]')
      ?.querySelector<HTMLButtonElement>(`[data-tab-id="${nextTab}"]`)
      ?.focus();
  };

  return (
    <div>
      <div className="win95-well p-[8px]">
        <div className="flex items-start gap-[8px]">
          <div className="shrink-0 mt-px">
            <Win95Icon name="notepad" size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-bold text-black leading-tight">RESUME.DOC</h2>
            <p className="text-[11px] text-black mt-[4px] leading-normal">{resume.summary}</p>
            <div className="flex flex-wrap gap-[8px] mt-[6px]">
              <a href={decodeEmailHref(resume.contact.email)} className="win95-link text-[11px]">
                {resume.contact.email}
              </a>
              <span className="text-[11px] text-[#808080]">|</span>
              <a
                href={resume.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="win95-link text-[11px]"
              >
                LinkedIn
              </a>
              <span className="text-[11px] text-[#808080]">|</span>
              <a
                href={resume.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="win95-link text-[11px]"
              >
                barash.me
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[6px]">
        <div className="win95-tab-strip" role="tablist" aria-label="Resume sections">
          {resumeTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const tabId = `${tabIdPrefix}-resume-${tab.id}-tab`;
            const panelId = `${tabIdPrefix}-resume-${tab.id}-panel`;

            return (
              <button
                key={tab.id}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                data-tab-id={tab.id}
                className={`win95-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
              >
                <span className="win95-tab-face">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`${tabIdPrefix}-resume-experience-panel`}
          className="win95-tab-panel"
          role="tabpanel"
          aria-labelledby={`${tabIdPrefix}-resume-experience-tab`}
          hidden={activeTab !== 'experience'}
        >
          <ExperiencePanel experience={resume.experience} />
        </div>
        <div
          id={`${tabIdPrefix}-resume-education-panel`}
          className="win95-tab-panel"
          role="tabpanel"
          aria-labelledby={`${tabIdPrefix}-resume-education-tab`}
          hidden={activeTab !== 'education'}
        >
          <EducationPanel education={resume.education} languages={resume.languages} />
        </div>
        <div
          id={`${tabIdPrefix}-resume-skills-panel`}
          className="win95-tab-panel"
          role="tabpanel"
          aria-labelledby={`${tabIdPrefix}-resume-skills-tab`}
          hidden={activeTab !== 'skills'}
        >
          <SkillsPanel skills={resume.skills} />
        </div>
        <div
          id={`${tabIdPrefix}-resume-honors-panel`}
          className="win95-tab-panel"
          role="tabpanel"
          aria-labelledby={`${tabIdPrefix}-resume-honors-tab`}
          hidden={activeTab !== 'honors'}
        >
          <HonorsPanel honors={resume.honors} />
        </div>
      </div>
    </div>
  );
};

const ExperiencePanel: React.FC<{ experience: ResumeData['experience'] }> = ({ experience }) => (
  <div className="flex flex-col gap-[2px]">
    {experience.map((job, jobIndex) => {
      const logoSrc = companyLogos[job.company];

      return (
        <div key={`${job.company}-${jobIndex}`} className="win95-group-box">
          <span className="win95-group-box-label">
            {job.companyUrl ? (
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="win95-link font-bold">
                {job.company}
              </a>
            ) : (
              job.company
            )}
          </span>
          <div className="flex gap-[6px]">
            {logoSrc && <img src={logoSrc} alt="" className="w-[16px] h-[16px] shrink-0 mt-px" />}
            <div className="flex-1 min-w-0">
              {job.roles.map((role, roleIndex) => (
                <div
                  key={`${role.title}-${roleIndex}`}
                  className={roleIndex > 0 ? 'mt-[6px] pt-[6px]' : ''}
                  style={roleIndex > 0 ? { borderTop: '1px dotted #808080' } : undefined}
                >
                  <div className="flex items-start justify-between gap-[8px] flex-wrap">
                    <span className="text-[11px] font-bold text-black">{role.title}</span>
                    <span className="text-[11px] text-[color:var(--win95-text)] shrink-0">
                      {role.startDate} — {role.endDate}
                    </span>
                  </div>
                  <div className="text-[11px] text-[color:var(--win95-text)]">{role.location}</div>
                </div>
              ))}
            </div>
          </div>
          {job.bullets.length > 0 && (
            <ul className="mt-[4px] flex flex-col gap-[2px]">
              {job.bullets.map((bullet, index) => (
                <li key={index} className="text-[11px] text-black pl-[12px] relative leading-normal">
                  <span className="absolute left-0 top-0">•</span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
  </div>
);

const EducationPanel: React.FC<{
  education: ResumeData['education'];
  languages: ResumeData['languages'];
}> = ({ education, languages }) => (
  <div className="flex flex-col gap-[2px]">
    <div className="win95-group-box">
      <span className="win95-group-box-label">Education</span>
      <div className="win95-well">
        {education.map((educationEntry, index) => {
          const logoSrc = educationLogos[educationEntry.institution];

          return (
            <div
              key={educationEntry.institution}
              className={`flex items-start gap-[8px] p-[6px] ${
                index < education.length - 1 ? 'border-b border-[#c0c0c0]' : ''
              }`}
            >
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt=""
                  className="w-[16px] h-[16px] mt-px shrink-0"
                  style={{ imageRendering: 'auto' }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-black">{educationEntry.institution}</div>
                <div className="text-[11px] text-black">
                  {educationEntry.degree}, {educationEntry.field}
                </div>
                <div className="text-[11px] text-[color:var(--win95-text)]">{educationEntry.dates}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    <div className="win95-group-box">
      <span className="win95-group-box-label">Languages</span>
      <div className="win95-well">
        {languages.map((language, index) => (
          <div
            key={language.name}
            className={`flex items-center justify-between p-[4px_6px] ${
              index < languages.length - 1 ? 'border-b border-[#c0c0c0]' : ''
            }`}
          >
            <span className="text-[11px] font-bold text-black">{language.name}</span>
            <span className="win95-badge text-[10px]">{language.proficiency}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkillsPanel: React.FC<{ skills: string[] }> = ({ skills }) => (
  <div className="win95-group-box">
    <span className="win95-group-box-label">Technical Skills</span>
    <div className="win95-well p-[8px]">
      <div className="flex flex-wrap gap-[4px]">
        {skills.map((skill) => (
          <span key={skill} className="win95-badge text-[11px] px-[6px] py-px">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const HonorsPanel: React.FC<{ honors: string[] }> = ({ honors }) => (
  <div className="win95-group-box">
    <span className="win95-group-box-label">Awards &amp; Honors</span>
    <div className="win95-well">
      {honors.map((honor, index) => (
        <div
          key={honor}
          className={`flex items-center gap-[8px] p-[6px] ${
            index < honors.length - 1 ? 'border-b border-[#c0c0c0]' : ''
          }`}
        >
          <span className="text-[14px]">★</span>
          <span className="text-[11px] text-black">{honor}</span>
        </div>
      ))}
    </div>
  </div>
);
