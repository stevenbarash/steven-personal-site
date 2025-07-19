'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Windows95Layout } from '@/components/layout/Windows95Layout';
import { ProfileSection } from '@/components/ui/win95';
import { profileData, socialLinks, terminalCommands } from '@/data/profile';
import { BACKGROUND_GRID } from '@/constants';
import { SEOContent } from '@/components/SEOContent';
import { StructuredData } from '@/components/StructuredData';
import { GEOOptimizer } from '@/components/GEOOptimizer';

// Lazy load heavy components for better performance
const FileSystemExplorer = dynamic(() => import('@/components/ui/win95').then(mod => ({ default: mod.FileSystemExplorer })), {
  loading: () => <div className="win95-content p-4">Loading Explorer...</div>,
  ssr: false
});

const Terminal = dynamic(() => import('@/components/ui/win95').then(mod => ({ default: mod.Terminal })), {
  loading: () => <div className="win95-content p-4">Loading Terminal...</div>,
  ssr: false
});

const Taskbar = dynamic(() => import('@/components/ui/win95').then(mod => ({ default: mod.Taskbar })), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <SEOContent />
      <StructuredData />
      <GEOOptimizer />
      <main 
        className="bg-[#008080] min-h-screen p-4" 
        style={{ 
          backgroundImage: BACKGROUND_GRID
        }}
      >
        <div className="container mx-auto">
          <Windows95Layout>
            <ProfileSection profile={profileData} />
            
            <Suspense fallback={<div className="win95-content p-4">Loading Explorer...</div>}>
              <FileSystemExplorer socialLinks={socialLinks} />
            </Suspense>
            
            <Suspense fallback={<div className="win95-content p-4">Loading Terminal...</div>}>
              <Terminal commands={terminalCommands} />
            </Suspense>
          </Windows95Layout>
        </div>
      </main>
      
      <Suspense fallback={null}>
        <Taskbar />
      </Suspense>
    </>
  );
} 