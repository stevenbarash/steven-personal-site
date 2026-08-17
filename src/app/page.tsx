import { DesktopEnvironment, type DesktopAppDefinition } from '@/components/layout/DesktopEnvironment';
import { FileSystemExplorer } from '@/components/ui/win95/FileSystemExplorer';
import { AboutSiteSection, HelpSection } from '@/components/ui/win95/HelpSection';
import { ProfileSection } from '@/components/ui/win95/ProfileSection';
import { ProjectsSection } from '@/components/ui/win95/ProjectsSection';
import { ResumeSection } from '@/components/ui/win95/ResumeSection';
import { Terminal } from '@/components/ui/win95/Terminal';
import { profileData, socialLinks, terminalCommands } from '@/data/profile';
import { resumeData } from '@/data/resume';

export default function Home() {
  const desktopApps: DesktopAppDefinition[] = [
    {
      id: 'profile',
      sectionId: 'section-profile',
      title: 'ABOUT.EXE - About Me',
      activeProgram: 'ABOUT.EXE',
      defaultStatusText: 'Profile ready',
      statusPaneLabel: 'C:\\STEVEN\\ABOUT\\',
      content: <ProfileSection profile={profileData} />,
    },
    {
      id: 'projects',
      sectionId: 'section-projects',
      title: 'PROJECTS - Windows Explorer',
      activeProgram: 'PROJECTS',
      defaultStatusText: 'Project portfolio ready',
      statusPaneLabel: 'C:\\STEVEN\\PROJECTS\\',
      content: <ProjectsSection showTopTabs={false} />,
    },
    {
      id: 'explorer',
      sectionId: 'section-explorer',
      title: 'INTERNET - Links Explorer',
      activeProgram: 'INTERNET',
      defaultStatusText: 'Links ready',
      statusPaneLabel: 'C:\\STEVEN\\LINKS\\',
      content: <FileSystemExplorer socialLinks={socialLinks} />,
    },
    {
      id: 'terminal',
      sectionId: 'section-terminal',
      title: 'MS-DOS Prompt',
      activeProgram: 'MS-DOS Prompt',
      defaultStatusText: 'Command prompt ready',
      statusPaneLabel: 'C:\\STEVEN\\',
      content: <Terminal commands={terminalCommands} />,
    },
    {
      id: 'resume',
      sectionId: 'section-resume',
      title: 'RESUME.DOC - WordPad',
      activeProgram: 'RESUME.DOC',
      defaultStatusText: 'Resume ready',
      statusPaneLabel: 'C:\\STEVEN\\RESUME.DOC',
      content: <ResumeSection resume={resumeData} />,
    },
    {
      id: 'help',
      sectionId: 'section-help',
      title: 'HELP - Using This Site',
      activeProgram: 'HELP',
      defaultStatusText: 'Help topics ready',
      statusPaneLabel: 'C:\\WINDOWS\\HELP\\',
      content: <HelpSection />,
    },
    {
      id: 'about-site',
      sectionId: 'section-about-site',
      title: 'ABOUT - This Site',
      activeProgram: 'ABOUT SITE',
      defaultStatusText: 'Site information ready',
      statusPaneLabel: 'C:\\STEVEN\\SITE\\',
      content: <AboutSiteSection />,
    },
  ];

  return (
    <DesktopEnvironment desktopApps={desktopApps}>
      <div id="section-profile">
        <ProfileSection profile={profileData} />
      </div>
      <div id="section-explorer">
        <FileSystemExplorer socialLinks={socialLinks} />
      </div>
      <div id="section-projects">
        <ProjectsSection />
      </div>
      <div id="section-terminal">
        <Terminal commands={terminalCommands} />
      </div>
    </DesktopEnvironment>
  );
}
