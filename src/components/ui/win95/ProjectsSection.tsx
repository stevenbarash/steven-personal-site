'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { projects } from '@/data/profile';
import { resumeData } from '@/data/resume';
import type { Project } from '@/types';
import { ResumeSection } from './ResumeSection';
import { Win95Icon } from './Win95Icon';

type TopTab = 'projects' | 'resume';

interface ProjectsSectionProps {
  initialTab?: TopTab;
  showTopTabs?: boolean;
}

const portfolioTabs: { id: TopTab; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
];

const nextTabId = <T extends string>(
  tabs: { id: T }[],
  currentTab: T,
  key: string,
) => {
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTab);

  if (key === 'Home') return tabs[0].id;
  if (key === 'End') return tabs[tabs.length - 1].id;
  if (key === 'ArrowLeft') return tabs[(currentIndex - 1 + tabs.length) % tabs.length].id;
  if (key === 'ArrowRight') return tabs[(currentIndex + 1) % tabs.length].id;
  return undefined;
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  initialTab = 'projects',
  showTopTabs = true,
}) => {
  const [topTab, setTopTab] = useState<TopTab>(initialTab);
  const tabIdPrefix = useId();

  const handleTopTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTab: TopTab) => {
    const nextTab = nextTabId(portfolioTabs, currentTab, event.key);
    if (!nextTab) return;

    event.preventDefault();
    setTopTab(nextTab);
    event.currentTarget
      .closest('[role="tablist"]')
      ?.querySelector<HTMLButtonElement>(`[data-tab-id="${nextTab}"]`)
      ?.focus();
  };

  if (!showTopTabs) {
    return <ProjectsContent projects={projects} />;
  }

  return (
    <div>
      <div className="win95-tab-strip" role="tablist" aria-label="Portfolio content">
        {portfolioTabs.map((tab) => {
          const isActive = topTab === tab.id;
          const tabId = `${tabIdPrefix}-portfolio-${tab.id}-tab`;
          const panelId = `${tabIdPrefix}-portfolio-${tab.id}-panel`;

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
              onClick={() => setTopTab(tab.id)}
              onKeyDown={(event) => handleTopTabKeyDown(event, tab.id)}
            >
              <span className="win95-tab-face">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${tabIdPrefix}-portfolio-projects-panel`}
        className="win95-tab-panel"
        role="tabpanel"
        aria-labelledby={`${tabIdPrefix}-portfolio-projects-tab`}
        hidden={topTab !== 'projects'}
      >
        <ProjectsContent projects={projects} />
      </div>
      <div
        id={`${tabIdPrefix}-portfolio-resume-panel`}
        className="win95-tab-panel"
        role="tabpanel"
        aria-labelledby={`${tabIdPrefix}-portfolio-resume-tab`}
        hidden={topTab !== 'resume'}
      >
        {topTab === 'resume' && <ResumeSection resume={resumeData} />}
      </div>
    </div>
  );
};

const ProjectsContent: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <>
      <div className="win95-group-box">
        <span className="win95-group-box-label">Featured Projects</span>
        <div className="win95-well">
          {featuredProjects.map((project, index) => (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-[8px] p-[6px] cursor-pointer hover:bg-[#000080] hover:text-white group"
              aria-label={`View ${project.name}`}
              style={{
                borderBottom: index < featuredProjects.length - 1 ? '1px solid #c0c0c0' : 'none',
              }}
            >
              <div className="shrink-0 mt-[2px]">
                <Win95Icon name={project.icon} size={32} />
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
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="win95-badge text-[10px] text-black group-hover:text-white"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {otherProjects.length > 0 && (
        <div className="win95-group-box mt-[4px]">
          <span className="win95-group-box-label">Other Projects</span>
          <div className="win95-well p-[8px]">
            <div className="flex flex-wrap gap-[16px]">
              {otherProjects.map((project) => (
                <a
                  key={project.name}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win95-desktop-icon"
                  aria-label={`View ${project.name}`}
                >
                  <Win95Icon name={project.icon} size={32} />
                  <span className="win95-icon-label text-black">{project.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
