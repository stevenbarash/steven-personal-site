'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG } from '@/constants';
import { StartMenu } from './StartMenu';
import { Win95Icon } from './Win95Icon';
import type { WindowState } from '@/types';

interface TaskbarProps {
  activeProgram?: string;
  windowState?: WindowState;
  onTaskbarClick?: () => void;
  onShutDown?: () => void;
  onNavigate?: (sectionId: string) => void;
  onRouteNavigate?: (path: string, sectionId?: string) => void;
  isInert?: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  activeProgram = APP_CONFIG.activeProgram,
  windowState = 'normal',
  onTaskbarClick,
  onShutDown,
  onNavigate,
  onRouteNavigate,
  isInert = false,
}) => {
  const [time, setTime] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setTime(`${displayHours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setStartMenuOpen(prev => !prev);
  };

  const handleStartMenuClose = useCallback((restoreStartFocus = false) => {
    setStartMenuOpen(false);
    if (restoreStartFocus) window.requestAnimationFrame(() => startButtonRef.current?.focus());
  }, []);

  const isWindowActive = windowState === 'normal' || windowState === 'maximized';
  const showTaskButton = windowState !== 'closed';

  return (
    <div className="win95-taskbar fixed bottom-0 left-0 w-full" inert={isInert || undefined}>
      <StartMenu
        isOpen={startMenuOpen}
        onClose={handleStartMenuClose}
        onShutDown={onShutDown}
        onNavigate={onNavigate}
        onRouteNavigate={onRouteNavigate}
      />

      <div className="flex items-center gap-[4px] h-[28px]">
        <button
          ref={startButtonRef}
          id="start-button"
          className={`win95-button flex items-center gap-[4px] px-[6px] font-bold h-[22px] ${
            startMenuOpen ? 'win95-button-pressed' : ''
          }`}
          onClick={handleStartClick}
          aria-expanded={startMenuOpen}
          aria-haspopup="true"
          aria-label="Start menu"
        >
          <img 
            src="/images/win95.png" 
            alt="" 
            className="w-[16px] h-[16px]"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-[11px] text-black">Start</span>
        </button>

        <div className="h-[20px] w-[2px] mx-[2px]" style={{
          boxShadow: 'inset 1px 0 0 #808080, inset -1px 0 0 #ffffff'
        }} />

        {showTaskButton && (
          <button
            className={`win95-task-btn shrink-0 ${isWindowActive ? 'active' : ''}`}
            onClick={onTaskbarClick}
          >
            <Win95Icon name="computer" size={16} className="shrink-0" />
            <span className="text-[11px] text-black truncate">{activeProgram}</span>
          </button>
        )}

        <div className="flex-1" />

        <div className="win95-tray h-[20px] hidden sm:flex">
          <span className="text-[11px] text-black">{time}</span>
        </div>
      </div>
    </div>
  );
};
