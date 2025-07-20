import { Suspense } from 'react';
import { Windows95Layout } from '@/components/layout/Windows95Layout';
import { ProfileSection, ProjectsSection, FileSystemExplorer, Terminal, Taskbar } from '@/components/ui/win95';
import { profileData, socialLinks, terminalCommands, projects } from '@/data/profile';
import { BACKGROUND_GRID } from '@/constants';

export default function Home() {
  return (
    <>
      <main 
        className="bg-[#008080] min-h-screen p-4 pb-20" 
        style={{ 
          backgroundImage: BACKGROUND_GRID
        }}
      >
        <div className="container mx-auto">
          <Windows95Layout>
            <ProfileSection profile={profileData} />
            
            <div className="win95-content">
              <FileSystemExplorer socialLinks={socialLinks} />
            </div>
            
            <ProjectsSection projects={projects} />
            
            <div className="win95-content">
              <Terminal commands={terminalCommands} />
            </div>
          </Windows95Layout>
        </div>
      </main>
      
      <Taskbar />
    </>
  );
} 