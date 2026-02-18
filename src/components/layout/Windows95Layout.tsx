'use client';

import { ReactNode } from 'react';
import { WindowTitleBar, MenuBar } from '@/components/ui/win95';
import { APP_CONFIG } from '@/constants';

interface Windows95LayoutProps {
  children: ReactNode;
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  className?: string;
}

export const Windows95Layout: React.FC<Windows95LayoutProps> = ({
  children,
  title = APP_CONFIG.title,
  onMinimize,
  onMaximize,
  onClose,
  isMaximized = false,
  className = ""
}) => {
  return (
    <div className={`${isMaximized ? 'w-full' : 'max-w-4xl mx-auto'} ${className}`}>
      <div className={`win95-window ${isMaximized ? 'min-h-[calc(100vh-40px)] flex flex-col' : ''}`}>
        <WindowTitleBar
          title={title}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
        />
        
        <MenuBar />
        
        <div className={`p-[6px] flex flex-col gap-[6px] ${isMaximized ? 'flex-1' : ''}`}>
          {children}
        </div>

        <div className="win95-status-bar">
          <div className="win95-status-section flex-1">
            Ready
          </div>
          <div className="win95-status-section w-[120px]">
            My Computer
          </div>
        </div>
      </div>
    </div>
  );
};
