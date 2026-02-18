'use client';

import { ReactNode, useRef, useState, useCallback, useEffect } from 'react';
import { WindowTitleBar, MenuBar } from '@/components/ui/win95';
import { APP_CONFIG } from '@/constants';

const TASKBAR_HEIGHT = 40;
const INITIAL_WINDOW_OFFSET = 8;

interface Windows95LayoutProps {
  children: ReactNode;
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  isDesktop?: boolean;
  className?: string;
  onNavigate?: (sectionId: string) => void;
  onRouteNavigate?: (path: string, sectionId?: string) => void;
  currentPath?: string;
  statusText?: string;
  statusPaneLabel?: string;
}

export const Windows95Layout: React.FC<Windows95LayoutProps> = ({
  children,
  title = APP_CONFIG.title,
  onMinimize,
  onMaximize,
  onClose,
  isMaximized = false,
  isDesktop = false,
  className = "",
  onNavigate,
  onRouteNavigate,
  currentPath = '/',
  statusText = 'Ready',
  statusPaneLabel = 'My Computer',
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: INITIAL_WINDOW_OFFSET, y: INITIAL_WINDOW_OFFSET });
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);

  const canDrag = isDesktop && !isMaximized;

  const handleTitleBarDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (!canDrag || e.button !== 0) return;
      e.preventDefault();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: position.x,
        startTop: position.y,
      };
    },
    [canDrag, position.x, position.y]
  );

  useEffect(() => {
    if (!canDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !windowRef.current) return;
      const { startX, startY, startLeft, startTop } = dragRef.current;
      const width = windowRef.current.offsetWidth;
      const height = windowRef.current.offsetHeight;
      const maxX = Math.max(0, window.innerWidth - width);
      const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - height);
      const newX = Math.min(maxX, Math.max(0, startLeft + (e.clientX - startX)));
      const newY = Math.min(maxY, Math.max(0, startTop + (e.clientY - startY)));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canDrag]);

  const wrapperStyle =
    canDrag
      ? {
          position: 'absolute' as const,
          left: position.x,
          top: position.y,
          width: '100%',
          maxWidth: '56rem',
        }
      : undefined;

  return (
    <div
      ref={windowRef}
      className={`${isMaximized ? 'w-full' : 'max-w-4xl'} ${canDrag ? '' : 'mx-auto'} ${className}`}
      style={wrapperStyle}
    >
      <div
        className={`win95-window flex flex-col ${
          isMaximized ? 'min-h-[calc(100vh-40px)]' : 'max-h-[calc(100vh-48px)]'
        }`}
      >
        <WindowTitleBar
          title={title}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
          onTitleBarDragStart={canDrag ? handleTitleBarDragStart : undefined}
        />

        <MenuBar
          onNavigate={onNavigate}
          onRouteNavigate={onRouteNavigate}
          currentPath={currentPath}
        />

        <div className="p-[6px] flex flex-col gap-[6px] flex-1 min-h-0 overflow-auto">
          {children}
        </div>

        <div className="win95-status-bar shrink-0">
          <div className="win95-status-section flex-1">
            {statusText}
          </div>
          <div className="win95-status-section w-[120px]">
            {statusPaneLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
