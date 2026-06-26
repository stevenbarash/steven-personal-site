import { DesktopEnvironment } from '@/components/layout/DesktopEnvironment';
import { FileSystemExplorer } from '@/components/ui/win95/FileSystemExplorer';
import { ProfileSection } from '@/components/ui/win95/ProfileSection';
import { ProjectsSection } from '@/components/ui/win95/ProjectsSection';
import { Terminal } from '@/components/ui/win95/Terminal';
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
