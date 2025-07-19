import { Windows95Layout } from '@/components/layout/Windows95Layout';
import { ProfileSection, FileSystemExplorer, Terminal, Taskbar } from '@/components/ui/win95';
import { profileData, socialLinks, terminalCommands } from '@/data/profile';
import { BACKGROUND_GRID } from '@/constants';

export default function Home() {
  return (
    <>
      <main 
        className="bg-[#008080] min-h-screen p-4" 
        style={{ 
          backgroundImage: BACKGROUND_GRID
        }}
      >
        <div className="container mx-auto">
          <Windows95Layout>
            <ProfileSection profile={profileData} />
            <FileSystemExplorer socialLinks={socialLinks} />
            <Terminal commands={terminalCommands} />
          </Windows95Layout>
        </div>
      </main>
      
      <Taskbar />
    </>
  );
} 