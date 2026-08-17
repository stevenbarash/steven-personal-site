'use client';

import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Windows95Layout } from '@/components/layout/Windows95Layout';
import { Taskbar } from '@/components/ui/win95/Taskbar';
import { DesktopShortcuts } from '@/components/ui/win95/DesktopShortcuts';
import { APP_CONFIG } from '@/constants';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import type { WindowState } from '@/types';

interface DesktopEnvironmentProps {
  children: ReactNode;
  title?: string;
  activeProgram?: string;
  defaultStatusText?: string;
  statusPaneLabel?: string;
  desktopApps?: DesktopAppDefinition[];
}

export interface DesktopAppDefinition {
  id: string;
  sectionId: string;
  title: string;
  activeProgram: string;
  defaultStatusText: string;
  statusPaneLabel: string;
  content: ReactNode;
}

const EMPTY_DESKTOP_APPS: DesktopAppDefinition[] = [];

const SECTION_STATUS_LABELS: Record<string, string> = {
  'section-profile': 'Viewing profile details',
  'section-projects': 'Viewing project portfolio',
  'section-explorer': 'Browsing links explorer',
  'section-terminal': 'Command prompt ready',
};

const SECTION_APP_IDS: Record<string, string> = {
  'section-profile': 'profile',
  'section-projects': 'projects',
  'section-explorer': 'explorer',
  'section-terminal': 'terminal',
  'section-resume': 'resume',
  'section-help': 'help',
  'section-about-site': 'about-site',
};

export const DesktopEnvironment: React.FC<DesktopEnvironmentProps> = ({
  children,
  title = APP_CONFIG.title,
  activeProgram = APP_CONFIG.activeProgram,
  defaultStatusText = 'Ready',
  statusPaneLabel = 'My Computer',
  desktopApps = EMPTY_DESKTOP_APPS,
}) => {
  const [windowState, setWindowState] = useState<WindowState>('normal');
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(defaultStatusText);
  const [isShutdown, setIsShutdown] = useState(false);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const getAppForSection = useCallback((sectionId: string) => (
    desktopApps.find(app => app.sectionId === sectionId)
  ), [desktopApps]);

  const applyLocationApp = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedAppId = params.get('app');
    const requestedApp = desktopApps.find(app => app.id === requestedAppId);

    if (requestedAppId && !requestedApp) {
      params.delete('app');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    }

    setActiveAppId(requestedApp?.id ?? null);
    setWindowState('normal');
    setStatusText(requestedApp?.defaultStatusText ?? defaultStatusText);
  }, [defaultStatusText, desktopApps]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const legacySectionId = window.location.hash.slice(1);
    const legacyApp = !params.has('app') && legacySectionId
      ? getAppForSection(legacySectionId)
      : undefined;

    if (legacyApp) {
      params.set('app', legacyApp.id);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }

    const initialSync = window.requestAnimationFrame(applyLocationApp);
    window.addEventListener('popstate', applyLocationApp);
    return () => {
      window.cancelAnimationFrame(initialSync);
      window.removeEventListener('popstate', applyLocationApp);
    };
  }, [applyLocationApp, getAppForSection]);

  const openApp = useCallback((app: DesktopAppDefinition) => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('app') !== app.id) {
      url.searchParams.set('app', app.id);
      url.hash = '';
      window.history.pushState(null, '', `${url.pathname}${url.search}`);
    }
    setActiveAppId(app.id);
    setWindowState('normal');
    setStatusText(app.defaultStatusText);
  }, []);

  const openMyComputer = useCallback(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('app')) {
      url.searchParams.delete('app');
      window.history.pushState(null, '', `${url.pathname}${url.search}`);
    }
    setActiveAppId(null);
    setWindowState('normal');
    setStatusText(defaultStatusText);
  }, [defaultStatusText]);

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

  const handleShutDown = useCallback(() => {
    setWindowState('closed');
    setIsShutdown(true);
  }, []);

  const handleRestart = useCallback(() => {
    setIsShutdown(false);
    setWindowState('normal');
    window.requestAnimationFrame(() => document.getElementById('start-button')?.focus());
  }, []);

  useEffect(() => {
    if (!isShutdown) return;

    const trapDialogFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleRestart();
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        restartButtonRef.current?.focus();
      }
    };

    restartButtonRef.current?.focus();
    document.addEventListener('keydown', trapDialogFocus, true);
    return () => document.removeEventListener('keydown', trapDialogFocus, true);
  }, [handleRestart, isShutdown]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const targetApp = getAppForSection(sectionId);
    if (targetApp) {
      scrollToSection(sectionId);
      openApp(targetApp);
      return;
    }

    setWindowState(prev => prev === 'minimized' || prev === 'closed' ? 'normal' : prev);
    setStatusText(SECTION_STATUS_LABELS[sectionId] ?? defaultStatusText);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 150);
  }, [defaultStatusText, getAppForSection, openApp, scrollToSection]);

  const handleRouteNavigate = useCallback((path: string, sectionId?: string) => {
    if (pathname !== path) {
      const targetApp = sectionId ? getAppForSection(sectionId) : undefined;
      const targetAppId = targetApp?.id ?? (sectionId ? SECTION_APP_IDS[sectionId] : undefined);
      router.push(`${path}${targetAppId ? `?app=${targetAppId}` : ''}`);
      return;
    }

    if (sectionId) {
      handleNavigate(sectionId);
    } else {
      openMyComputer();
    }
  }, [getAppForSection, handleNavigate, openMyComputer, pathname, router]);

  const isDesktop = useIsDesktop();
  const isWindowVisible = windowState === 'normal' || windowState === 'maximized';
  const activeApp = desktopApps.find(app => app.id === activeAppId);
  const resolvedTitle = activeApp?.title ?? title;
  const resolvedProgram = activeApp?.activeProgram ?? activeProgram;
  const resolvedStatusPaneLabel = activeApp?.statusPaneLabel ?? statusPaneLabel;
  const activeContent = activeApp?.content ?? children;

  return (
    <>
      <main
        inert={isShutdown || undefined}
        className={`min-h-screen pb-[40px] relative ${
          windowState === 'maximized' ? 'p-0' : 'p-[8px]'
        }`}
        style={{ background: '#008080' }}
      >
        <DesktopShortcuts onRouteNavigate={handleRouteNavigate} />

        {isWindowVisible && (
          <Windows95Layout
            key={activeApp?.id ?? 'computer'}
            title={resolvedTitle}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onClose={handleClose}
            isMaximized={windowState === 'maximized'}
            isDesktop={isDesktop}
            onRouteNavigate={handleRouteNavigate}
            onShutDown={handleShutDown}
            statusText={statusText}
            statusPaneLabel={resolvedStatusPaneLabel}
          >
            {activeContent}
          </Windows95Layout>
        )}
      </main>

      <Taskbar
        windowState={windowState}
        onTaskbarClick={handleTaskbarClick}
        onShutDown={handleShutDown}
        onNavigate={handleNavigate}
        onRouteNavigate={handleRouteNavigate}
        activeProgram={resolvedProgram}
        isInert={isShutdown}
      />

      {isShutdown && (
        <div
          className="win95-shutdown-screen"
          role="dialog"
          aria-modal="true"
          aria-label="Shut down computer"
        >
          <div className="win95-shutdown-message">
            <h2 id="shutdown-title">It&apos;s now safe to turn off your computer.</h2>
            <button ref={restartButtonRef} type="button" className="win95-button" onClick={handleRestart} aria-label="Restart computer">
              Restart
            </button>
          </div>
        </div>
      )}
    </>
  );
};
