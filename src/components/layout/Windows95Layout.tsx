import { ReactNode } from 'react';
import { WindowTitleBar, MenuBar } from '@/components/ui/win95';
import { APP_CONFIG } from '@/constants';

interface Windows95LayoutProps {
  children: ReactNode;
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

export const Windows95Layout: React.FC<Windows95LayoutProps> = ({
  children,
  title = APP_CONFIG.title,
  onMinimize,
  onMaximize,
  onClose,
  className = ""
}) => {
  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <WindowTitleBar
        title={title}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />
      
      <div className="win95-window">
        <MenuBar />
        
        <div className="p-4 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 