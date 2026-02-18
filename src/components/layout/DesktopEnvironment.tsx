'use client';

import { useState, useCallback, ReactNode } from 'react';
import { Windows95Layout } from '@/components/layout/Windows95Layout';
import { Taskbar } from '@/components/ui/win95/Taskbar';
import type { WindowState } from '@/types';

interface DesktopEnvironmentProps {
  children: ReactNode;
}

export const DesktopEnvironment: React.FC<DesktopEnvironmentProps> = ({ children }) => {
  const [windowState, setWindowState] = useState<WindowState>('normal');

  const handleMinimize = useCallback(() => {
    setWindowState('minimized');
  }, []);

  const handleMaximize = useCallback(() => {
    setWindowState(prev => prev === 'maximized' ? 'normal' : 'maximized');
  }, []);

  const handleClose = useCallback(() => {
    setWindowState('closed');
  }, []);

  const handleTaskbarClick = useCallback(() => {
    setWindowState(prev => {
      if (prev === 'minimized' || prev === 'closed') return 'normal';
      if (prev === 'normal' || prev === 'maximized') return 'minimized';
      return 'normal';
    });
  }, []);

  const handleReopen = useCallback(() => {
    setWindowState('normal');
  }, []);

  const handleShutDown = useCallback(() => {
    setWindowState('closed');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: #000080; z-index: 9999;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      font-family: "Tahoma", "Segoe UI", "MS Sans Serif", Arial, sans-serif;
      cursor: default;
    `;
    overlay.innerHTML = `
      <div style="color: #c0c0c0; font-size: 24px; font-weight: bold; margin-bottom: 16px; text-align: center;">
        It's now safe to turn off<br/>your computer.
      </div>
      <div style="color: #808080; font-size: 12px; margin-top: 24px;">
        Click anywhere to restart
      </div>
    `;
    overlay.addEventListener('click', () => {
      overlay.remove();
      setWindowState('normal');
    });
    document.body.appendChild(overlay);
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    setWindowState(prev => {
      if (prev === 'minimized' || prev === 'closed') return 'normal';
      return prev;
    });
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, []);

  const isWindowVisible = windowState === 'normal' || windowState === 'maximized';

  return (
    <>
      <main
        className={`min-h-screen pb-[40px] ${
          windowState === 'maximized' ? 'p-0' : 'p-[8px]'
        }`}
        style={{ background: '#008080' }}
      >
        {windowState === 'closed' && (
          <div className="p-[16px] flex flex-col items-start gap-[4px]">
            <button
              className="win95-desktop-icon"
              onDoubleClick={handleReopen}
              tabIndex={0}
            >
              <img
                src="/images/win95.png"
                alt=""
                className="w-[32px] h-[32px]"
                style={{ imageRendering: 'pixelated' }}
              />
              <span
                className="win95-icon-label"
                style={{ color: 'white', textShadow: '1px 1px 0 #000' }}
              >
                STEVEN.EXE
              </span>
            </button>
          </div>
        )}

        {isWindowVisible && (
          <Windows95Layout
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onClose={handleClose}
            isMaximized={windowState === 'maximized'}
          >
            {children}
          </Windows95Layout>
        )}
      </main>

      <Taskbar
        windowState={windowState}
        onTaskbarClick={handleTaskbarClick}
        onShutDown={handleShutDown}
        onNavigate={handleNavigate}
      />
    </>
  );
};
