'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { MenuBar } from '@/components/ui/win95/MenuBar';
import { WindowTitleBar } from '@/components/ui/win95/WindowTitleBar';
import { APP_CONFIG } from '@/constants';

const TASKBAR_HEIGHT = 40;
const INITIAL_WINDOW_POSITION = { x: 96, y: 8 };

interface Windows95LayoutProps {
  children: ReactNode;
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
  isDesktop?: boolean;
  className?: string;
  onRouteNavigate?: (path: string, sectionId?: string) => void;
  onShutDown?: () => void;
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
  onRouteNavigate,
  onShutDown,
  statusText = 'Ready',
  statusPaneLabel = 'My Computer',
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(INITIAL_WINDOW_POSITION);
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

  const wrapperStyle = !isMaximized
    ? ({
        '--win95-window-left': `${position.x}px`,
        '--win95-window-top': `${position.y}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={windowRef}
      className={`win95-window-frame ${
        isMaximized ? 'win95-window-frame--maximized' : 'win95-window-frame--floating'
      } ${className}`}
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
          onRouteNavigate={onRouteNavigate}
          onCloseWindow={onClose}
          onShutDown={onShutDown}
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
