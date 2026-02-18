'use client';

import { useState } from 'react';
import { projects } from '@/data/profile';
import { resumeData } from '@/data/resume';
import { decodeEmailHref } from '@/lib/email';
import { Project, ResumeData } from '@/types';

type TopTab = 'projects' | 'resume';
type ResumeSubTab = 'experience' | 'education' | 'skills' | 'honors';

const companyLogos: Record<string, string> = {
  'Descope': '/images/logos/descope.png',
  'ID.me': '/images/logos/idme.png',
  'Okta': '/images/logos/okta.png',
  'University of Pittsburgh — Swanson School of Engineering': '/images/logos/pitt.png',
  'Innovative Systems, Inc.': '/images/logos/innovative.png',
  'Federated Hermes': '/images/logos/federated.png',
  'University of Pittsburgh': '/images/logos/pitt.png',
  'Carnegie Mellon University': '/images/logos/cmu.png',
};

const educationLogos: Record<string, string> = {
  'University of Pittsburgh — School of Computing and Information': '/images/logos/pitt.png',
};

export const ProjectsSection: React.FC = () => {
  const resume = resumeData;
  const [topTab, setTopTab] = useState<TopTab>('projects');
  const [resumeSubTab, setResumeSubTab] = useState<ResumeSubTab>('experience');

  return (
    <div>
      <div className="win95-tab-strip">
        <button
          className={`win95-tab ${topTab === 'projects' ? 'active' : ''}`}
          onClick={() => setTopTab('projects')}
        >
          Projects
        </button>
        <button
          className={`win95-tab ${topTab === 'resume' ? 'active' : ''}`}
          onClick={() => setTopTab('resume')}
        >
          Resume
        </button>
      </div>

      <div className="win95-tab-panel">
        {topTab === 'projects' && <ProjectsContent projects={projects} />}
        {topTab === 'resume' && (
          <ResumeContent
            resume={resume}
            activeSubTab={resumeSubTab}
            onSubTabChange={setResumeSubTab}
          />
        )}
      </div>
    </div>
  );
};

/* ---- Projects content (unchanged from original) ---- */

const ProjectsContent: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <>
      <div className="win95-group-box">
        <span className="win95-group-box-label">Featured Projects</span>
        <div className="win95-well">
          {featuredProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <a
                key={project.name}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-[8px] p-[6px] cursor-pointer hover:bg-[#000080] hover:text-white group"
                aria-label={`View ${project.name}`}
                style={{
                  borderBottom: index < featuredProjects.length - 1 ? '1px solid #c0c0c0' : 'none'
                }}
              >
                <div className="shrink-0 mt-[2px]">
                  <IconComponent size={24} className="text-black group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-black group-hover:text-white">
                    {project.name}
                  </div>
                  <div className="text-[11px] text-black group-hover:text-white mt-px">
                    {project.description}
                  </div>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-[4px] mt-[4px]">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="win95-badge text-[10px] text-black group-hover:text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {otherProjects.length > 0 && (
        <div className="win95-group-box mt-[4px]">
          <span className="win95-group-box-label">Other Projects</span>
          <div className="win95-well p-[8px]">
            <div className="flex flex-wrap gap-[16px]">
              {otherProjects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <a
                    key={project.name}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="win95-desktop-icon"
                    aria-label={`View ${project.name}`}
                  >
                    <IconComponent size={32} className="text-black" />
                    <span className="win95-icon-label text-black">{project.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ---- Resume content ---- */

const resumeSubTabs: { id: ResumeSubTab; label: string }[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'honors', label: 'Honors' },
];

const ResumeContent: React.FC<{
  resume: ResumeData;
  activeSubTab: ResumeSubTab;
  onSubTabChange: (tab: ResumeSubTab) => void;
}> = ({ resume, activeSubTab, onSubTabChange }) => (
  <div className="flex flex-col gap-[6px]">
    {/* Summary header */}
    <div className="win95-well p-[8px]">
      <p className="text-[11px] text-black leading-normal">{resume.summary}</p>
      <div className="flex flex-wrap gap-[8px] mt-[6px]">
        <a href={decodeEmailHref(resume.contact.email)} className="win95-link text-[11px]">
          {resume.contact.email}
        </a>
        <span className="text-[11px] text-[#808080]">|</span>
        <a href={resume.contact.linkedin} target="_blank" rel="noopener noreferrer" className="win95-link text-[11px]">
          LinkedIn
        </a>
        <span className="text-[11px] text-[#808080]">|</span>
        <a href={resume.contact.website} target="_blank" rel="noopener noreferrer" className="win95-link text-[11px]">
          barash.me
        </a>
      </div>
    </div>

    {/* Sub-tabs */}
    <div>
      <div className="flex gap-[2px]">
        {resumeSubTabs.map((tab) => (
          <button
            key={tab.id}
            className={`win95-button text-[11px] ${activeSubTab === tab.id ? 'win95-button-pressed font-bold' : ''}`}
            onClick={() => onSubTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-[4px]">
        {activeSubTab === 'experience' && <ExperiencePanel experience={resume.experience} />}
        {activeSubTab === 'education' && <EducationPanel education={resume.education} languages={resume.languages} />}
        {activeSubTab === 'skills' && <SkillsPanel skills={resume.skills} />}
        {activeSubTab === 'honors' && <HonorsPanel honors={resume.honors} />}
      </div>
    </div>
  </div>
);

/* ---- Resume sub-panels ---- */

const ExperiencePanel: React.FC<{ experience: ResumeData['experience'] }> = ({ experience }) => (
  <div className="flex flex-col gap-[2px]">
    {experience.map((job, jobIdx) => {
      const logoSrc = companyLogos[job.company];
      return (
      <div key={`${job.company}-${jobIdx}`} className="win95-group-box">
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
          {logoSrc && (
            <img
              src={logoSrc}
              alt=""
              className="w-[16px] h-[16px] shrink-0 mt-px"
            />
          )}
          <div className="flex-1 min-w-0">
            {job.roles.map((role, roleIdx) => (
              <div
                key={`${role.title}-${roleIdx}`}
                className={roleIdx > 0 ? 'mt-[6px] pt-[6px]' : ''}
                style={roleIdx > 0 ? { borderTop: '1px dotted #808080' } : undefined}
              >
                <div className="flex items-start justify-between gap-[8px] flex-wrap">
                  <span className="text-[11px] font-bold text-black">{role.title}</span>
                  <span className="text-[11px] text-[#808080] shrink-0">
                    {role.startDate} — {role.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-[#808080]">{role.location}</div>
              </div>
            ))}
          </div>
        </div>

        {job.bullets.length > 0 && (
          <ul className="mt-[4px] flex flex-col gap-[2px]">
            {job.bullets.map((bullet, i) => (
              <li key={i} className="text-[11px] text-black pl-[12px] relative leading-normal">
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
        {education.map((edu, idx) => {
          const eduLogo = educationLogos[edu.institution];
          return (
          <div key={edu.institution} className={`flex items-start gap-[8px] p-[6px] ${idx < education.length - 1 ? 'border-b border-[#c0c0c0]' : ''}`}>
            {eduLogo && (
              <img
                src={eduLogo}
                alt=""
                className="w-[16px] h-[16px] mt-px shrink-0"
                style={{ imageRendering: 'auto' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-black">{edu.institution}</div>
              <div className="text-[11px] text-black">{edu.degree}, {edu.field}</div>
              <div className="text-[11px] text-[#808080]">{edu.dates}</div>
            </div>
          </div>
          );
        })}
      </div>
    </div>

    <div className="win95-group-box">
      <span className="win95-group-box-label">Languages</span>
      <div className="win95-well">
        {languages.map((lang, idx) => (
          <div key={lang.name} className={`flex items-center justify-between p-[4px_6px] ${idx < languages.length - 1 ? 'border-b border-[#c0c0c0]' : ''}`}>
            <span className="text-[11px] font-bold text-black">{lang.name}</span>
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
          <span key={skill} className="win95-badge text-[11px] px-[6px] py-px">{skill}</span>
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
        <div key={honor} className={`flex items-center gap-[8px] p-[6px] ${idx < honors.length - 1 ? 'border-b border-[#c0c0c0]' : ''}`}>
          <span className="text-[14px]">★</span>
          <span className="text-[11px] text-black">{honor}</span>
        </div>
      ))}
    </div>
  </div>
);
