'use client';

import { useState } from 'react';
import { FileEarmarkTextFill } from 'react-bootstrap-icons';
import { decodeEmailHref } from '@/lib/email';
import type { ResumeData } from '@/types';

interface ResumeSectionProps {
  resume: ResumeData;
}

type ResumeTab = 'experience' | 'education' | 'skills' | 'honors';

export const ResumeSection: React.FC<ResumeSectionProps> = ({ resume }) => {
  const [activeTab, setActiveTab] = useState<ResumeTab>('experience');

  const tabs: { id: ResumeTab; label: string }[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'honors', label: 'Honors' },
  ];

  return (
    <div>
      {/* Summary / Header */}
      <div className="win95-well p-[8px]">
        <div className="flex items-start gap-[8px]">
          <div className="shrink-0 mt-px">
            <FileEarmarkTextFill size={32} className="text-[#000080]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-bold text-black leading-tight">
              RESUME.DOC
            </h2>
            <p className="text-[11px] text-black mt-[4px] leading-normal">
              {resume.summary}
            </p>
            <div className="flex flex-wrap gap-[8px] mt-[6px]">
              <a
                href={decodeEmailHref(resume.contact.email)}
                className="win95-link text-[11px]"
              >
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

      {/* Tabbed Content */}
      <div className="mt-[6px]">
        <div className="win95-tab-strip">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`win95-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="win95-tab-panel">
          {activeTab === 'experience' && (
            <ExperiencePanel experience={resume.experience} />
          )}
          {activeTab === 'education' && (
            <EducationPanel
              education={resume.education}
              languages={resume.languages}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsPanel skills={resume.skills} />
          )}
          {activeTab === 'honors' && (
            <HonorsPanel honors={resume.honors} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ---- Sub-panels ---- */

const ExperiencePanel: React.FC<{ experience: ResumeData['experience'] }> = ({
  experience,
}) => (
  <div className="flex flex-col gap-[2px]">
    {experience.map((job, jobIdx) => (
      <div key={`${job.company}-${jobIdx}`} className="win95-group-box">
        <span className="win95-group-box-label">
          {job.companyUrl ? (
            <a
              href={job.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="win95-link font-bold"
            >
              {job.company}
            </a>
          ) : (
            job.company
          )}
        </span>

        {job.roles.map((role, roleIdx) => (
          <div
            key={`${role.title}-${roleIdx}`}
            className={`${roleIdx > 0 ? 'mt-[6px] pt-[6px]' : ''}`}
            style={
              roleIdx > 0
                ? {
                    borderTop: '1px dotted #808080',
                  }
                : undefined
            }
          >
            <div className="flex items-start justify-between gap-[8px] flex-wrap">
              <span className="text-[11px] font-bold text-black">
                {role.title}
              </span>
              <span className="text-[11px] text-[#808080] shrink-0">
                {role.startDate} — {role.endDate}
              </span>
            </div>
            <div className="text-[11px] text-[#808080]">{role.location}</div>
          </div>
        ))}

        {job.bullets.length > 0 && (
          <ul className="mt-[4px] flex flex-col gap-[2px]">
            {job.bullets.map((bullet, i) => (
              <li
                key={i}
                className="text-[11px] text-black pl-[12px] relative leading-normal"
              >
                <span className="absolute left-0 top-0">•</span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
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
        {education.map((edu, idx) => (
          <div
            key={edu.institution}
            className={`p-[6px] ${
              idx < education.length - 1 ? 'border-b border-[#c0c0c0]' : ''
            }`}
          >
            <div className="text-[11px] font-bold text-black">
              {edu.institution}
            </div>
            <div className="text-[11px] text-black">
              {edu.degree}, {edu.field}
            </div>
            <div className="text-[11px] text-[#808080]">{edu.dates}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="win95-group-box">
      <span className="win95-group-box-label">Languages</span>
      <div className="win95-well">
        {languages.map((lang, idx) => (
          <div
            key={lang.name}
            className={`flex items-center justify-between p-[4px_6px] ${
              idx < languages.length - 1 ? 'border-b border-[#c0c0c0]' : ''
            }`}
          >
            <span className="text-[11px] font-bold text-black">
              {lang.name}
            </span>
            <span className="win95-badge text-[10px]">{lang.proficiency}</span>
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
      {honors.map((honor, idx) => (
        <div
          key={honor}
          className={`flex items-center gap-[8px] p-[6px] ${
            idx < honors.length - 1 ? 'border-b border-[#c0c0c0]' : ''
          }`}
        >
          <span className="text-[14px]">★</span>
          <span className="text-[11px] text-black">{honor}</span>
        </div>
      ))}
    </div>
  </div>
);
