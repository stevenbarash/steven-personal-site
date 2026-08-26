'use client';

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Windows95Layout } from '@/components/layout/Windows95Layout';
import { Taskbar } from '@/components/ui/win95/Taskbar';
import { DesktopShortcuts } from '@/components/ui/win95/DesktopShortcuts';
import { getAppById, getAppByLegacyAppId, getAppByLegacySectionId, getAppByPathname } from '@/features/desktop/navigation';
import type { DesktopAppDefinition, DesktopAppId } from '@/features/desktop/types';
import { APP_CONFIG } from '@/constants';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import type { WindowState } from '@/types';

interface DesktopEnvironmentProps {
  children: ReactNode;
  title?: string;
  activeProgram?: string;
  defaultStatusText?: string;
  statusPaneLabel?: string;
  desktopApps?: DesktopAppContentDefinition[];
}

export interface DesktopAppContentDefinition {
  id: DesktopAppId;
  content: ReactNode;
}

const EMPTY_DESKTOP_APPS: DesktopAppContentDefinition[] = [];

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
  const [shouldFocusWindow, setShouldFocusWindow] = useState(false);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const focusTimer = sessionStorage.getItem('win95.pendingRouteWindowFocus') === '1'
      ? window.setTimeout(() => setShouldFocusWindow(true), 0)
      : undefined;
    if (focusTimer !== undefined) sessionStorage.removeItem('win95.pendingRouteWindowFocus');

    const rememberInternalNavigation = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.classList.contains('win95-skip-link')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
        sessionStorage.setItem('win95.pendingRouteWindowFocus', '1');
      }
    };
    document.addEventListener('click', rememberInternalNavigation, true);
    return () => {
      if (focusTimer !== undefined) window.clearTimeout(focusTimer);
      document.removeEventListener('click', rememberInternalNavigation, true);
    };
  }, []);

  const getAppForSection = useCallback((sectionId: string) => {
    const catalogApp = getAppByLegacySectionId(sectionId);
    return catalogApp && desktopApps.some((app) => app.id === catalogApp.id)
      ? catalogApp
      : undefined;
  }, [desktopApps]);

  const applyLocationApp = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedAppId = params.get('app');
    const catalogApp = getAppByLegacyAppId(requestedAppId);
    const requestedApp = catalogApp && desktopApps.some((app) => app.id === catalogApp.id)
      ? catalogApp
      : undefined;

    if (requestedAppId && !requestedApp) {
      params.delete('app');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    }

    setActiveAppId(requestedApp?.id ?? null);
    setWindowState('normal');
    setStatusText(requestedApp?.chrome.statusText ?? defaultStatusText);
  }, [defaultStatusText, desktopApps]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const legacySectionId = window.location.hash.slice(1);
    const catalogLegacyApp = !params.has('app') && legacySectionId
      ? getAppByLegacySectionId(legacySectionId)
      : undefined;
    const legacyApp = catalogLegacyApp && new URL(catalogLegacyApp.href, window.location.origin).pathname !== '/'
      ? catalogLegacyApp
      : !params.has('app') && legacySectionId ? getAppForSection(legacySectionId) : undefined;

    if (legacyApp && new URL(legacyApp.href, window.location.origin).pathname !== '/') {
      params.delete('app');
      const destination = new URL(legacyApp.href, window.location.origin);
      if (destination.pathname === '/desktop' && legacyApp.legacyAppId) {
        params.set('app', legacyApp.legacyAppId);
      }
      destination.search = params.toString();
      window.location.replace(`${destination.pathname}${destination.search}`);
      return;
    }

    if (legacyApp?.legacyAppId) {
      params.set('app', legacyApp.legacyAppId);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }

    const initialSync = window.requestAnimationFrame(applyLocationApp);
    window.addEventListener('popstate', applyLocationApp);
    return () => {
      window.cancelAnimationFrame(initialSync);
      window.removeEventListener('popstate', applyLocationApp);
    };
  }, [applyLocationApp, getAppForSection]);

  useEffect(() => {
    if (pathname !== '/desktop' || new URLSearchParams(window.location.search).has('app')) return;
    const launcherId = sessionStorage.getItem('win95.pendingLauncherFocus');
    if (!launcherId) return;

    const focusLauncher = window.setTimeout(() => {
      const launcher = document.querySelector<HTMLElement>(`[data-launcher-for="${CSS.escape(launcherId)}"]`);
      if (!launcher) return;
      launcher.focus();
      sessionStorage.removeItem('win95.pendingLauncherFocus');
    }, 0);
    return () => window.clearTimeout(focusLauncher);
  }, [activeAppId, pathname]);

  const openApp = useCallback((app: DesktopAppDefinition) => {
    const url = new URL(window.location.href);
    if (app.legacyAppId && url.searchParams.get('app') !== app.legacyAppId) {
      url.searchParams.set('app', app.legacyAppId);
      url.hash = '';
      window.history.pushState(null, '', `${url.pathname}${url.search}`);
    }
    setActiveAppId(app.id);
    setWindowState('normal');
    setStatusText(app.chrome.statusText);
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
    const params = new URLSearchParams(window.location.search);
    const closingApp = getAppByLegacyAppId(params.get('app'))
      ?? (activeAppId ? getAppById(activeAppId) : getAppByPathname(pathname));
    if (!closingApp || closingApp.id === 'home') {
      setWindowState('closed');
      return;
    }

    sessionStorage.setItem('win95.pendingLauncherFocus', closingApp.id);
    params.delete('app');
    const query = params.toString();
    const homeTarget = `/desktop${query ? `?${query}` : ''}`;
    if (pathname !== '/desktop') {
      router.push(homeTarget);
      return;
    }

    window.history.pushState(null, '', homeTarget);
    setActiveAppId(null);
    setWindowState('normal');
    setStatusText(defaultStatusText);
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[data-launcher-for="${CSS.escape(closingApp.id)}"]`)?.focus();
      sessionStorage.removeItem('win95.pendingLauncherFocus');
    }, 0);
  }, [activeAppId, defaultStatusText, pathname, router]);

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
    setStatusText(defaultStatusText);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 150);
  }, [defaultStatusText, getAppForSection, openApp, scrollToSection]);

  const handleRouteNavigate = useCallback((path: string, sectionId?: string) => {
    if (pathname !== path) {
      sessionStorage.setItem('win95.pendingRouteWindowFocus', '1');
      const params = new URLSearchParams(window.location.search);
      params.delete('app');
      const targetAppId = sectionId
        ? getAppByLegacySectionId(sectionId)?.legacyAppId
        : undefined;
      if (targetAppId) params.set('app', targetAppId);
      const query = params.toString();
      router.push(`${path}${query ? `?${query}` : ''}`);
      return;
    }

    if (sectionId) {
      handleNavigate(sectionId);
    } else {
      openMyComputer();
    }
  }, [handleNavigate, openMyComputer, pathname, router]);

  const isDesktop = useIsDesktop();
  const isWindowVisible = windowState === 'normal' || windowState === 'maximized';
  const activeApp = getAppById(activeAppId);
  const activeAppContent = desktopApps.find((app) => app.id === activeAppId);
  const resolvedTitle = activeApp?.chrome.title ?? title;
  const resolvedProgram = activeApp?.chrome.programLabel ?? activeProgram;
  const resolvedStatusPaneLabel = activeApp?.chrome.pathLabel ?? statusPaneLabel;
  const activeContent = activeAppContent?.content ?? children;

  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        inert={isShutdown || undefined}
        className={`win95-desktop-main min-h-screen relative ${
          windowState === 'maximized' ? 'p-0' : 'p-[8px]'
        }`}
        style={{ background: '#008080' }}
      >
        <a className="win95-skip-link" href="#main-content">Skip to main content</a>
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
            focusOnMount={Boolean(activeApp) || shouldFocusWindow}
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
