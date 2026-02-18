import { DesktopEnvironment } from '@/components/layout/DesktopEnvironment';
import { ProfileSection, ProjectsSection, FileSystemExplorer, Terminal } from '@/components/ui/win95';
import { profileData, socialLinks, terminalCommands } from '@/data/profile';

export default function Home() {
  return (
    <DesktopEnvironment>
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
