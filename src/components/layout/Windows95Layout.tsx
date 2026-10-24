'use client';

import type { CSSProperties, PointerEvent, ReactNode } from 'react';
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
  focusOnMount?: boolean;
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
  focusOnMount = false,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(INITIAL_WINDOW_POSITION);
  const [isFloatingViewport, setIsFloatingViewport] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    handle: HTMLDivElement;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    width: number;
    height: number;
  } | null>(null);

  const canDrag = isDesktop && !isMaximized && isFloatingViewport;

  const stopDrag = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.handle.hasPointerCapture(drag.pointerId)) {
      drag.handle.releasePointerCapture(drag.pointerId);
    }
  }, []);

  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 768px)');
    const updateViewport = () => setIsFloatingViewport(viewport.matches);
    updateViewport();
    viewport.addEventListener('change', updateViewport);
    window.addEventListener('blur', stopDrag);
    window.addEventListener('resize', stopDrag);
    return () => {
      viewport.removeEventListener('change', updateViewport);
      window.removeEventListener('blur', stopDrag);
      window.removeEventListener('resize', stopDrag);
      stopDrag();
    };
  }, [stopDrag]);

  useEffect(() => {
    if (!canDrag) stopDrag();
  }, [canDrag, stopDrag]);

  useEffect(() => {
    if (focusOnMount) windowRef.current?.focus();
  }, [focusOnMount]);

  const handleTitleBarPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!canDrag || !e.isPrimary || e.button !== 0 || dragRef.current || !windowRef.current) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        pointerId: e.pointerId,
        handle: e.currentTarget,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: position.x,
        startTop: position.y,
        width: windowRef.current.offsetWidth,
        height: windowRef.current.offsetHeight,
      };
    },
    [canDrag, position.x, position.y]
  );

  const handleTitleBarPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const maxX = Math.max(0, window.innerWidth - drag.width);
    const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - drag.height);
    const x = Math.min(maxX, Math.max(0, drag.startLeft + e.clientX - drag.startX));
    const y = Math.min(maxY, Math.max(0, drag.startTop + e.clientY - drag.startY));
    setPosition((current) => current.x === x && current.y === y ? current : { x, y });
  }, []);

  const handleTitleBarPointerEnd = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) stopDrag();
  }, [stopDrag]);

  const wrapperStyle = !isMaximized
    ? ({
        '--win95-window-left': `${position.x}px`,
        '--win95-window-top': `${position.y}px`,
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={windowRef}
      data-testid="application-window"
      aria-label={`${title} application window`}
      tabIndex={-1}
      className={`win95-window-frame ${
        isMaximized ? 'win95-window-frame--maximized' : 'win95-window-frame--floating'
      } ${className}`}
      style={wrapperStyle}
    >
      <div
        className={`win95-window win95-app-shell flex flex-col ${
          isMaximized ? 'min-h-[calc(100vh-40px)]' : 'max-h-[calc(100vh-48px)]'
        }`}
      >
        <WindowTitleBar
          title={title}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
          showMaximize={isDesktop}
          onTitleBarPointerDown={canDrag ? handleTitleBarPointerDown : undefined}
          onTitleBarPointerMove={handleTitleBarPointerMove}
          onTitleBarPointerEnd={handleTitleBarPointerEnd}
        />

        <MenuBar
          onRouteNavigate={onRouteNavigate}
          onCloseWindow={onClose}
          onShutDown={onShutDown}
        />

        <div className="win95-app-body win95-reading p-[6px] flex flex-col gap-[6px] flex-1 min-h-0 overflow-auto">
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
