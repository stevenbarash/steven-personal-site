'use client';

import { IconButton, LayoutProvider } from '@once-ui-system/core';
import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);
const storageKey = 'portfolio-theme';
let inMemoryTheme: Theme = 'dark';

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Storage can be unavailable; keep the interactive preference in memory.
  }
  return inMemoryTheme;
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(storageKey, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(storageKey, onChange);
  };
}

const serverTheme = (): Theme => 'dark';

export function PortfolioProviders({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, serverTheme);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    inMemoryTheme = next;
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Persistence is optional; the current page keeps the selected theme.
    }
    window.dispatchEvent(new Event(storageKey));
  }

  return (
    <LayoutProvider>
      <ThemeContext.Provider value={{ theme, toggle }}>
        <div
          className="portfolio-site"
          data-theme={theme}
          data-brand="cyan"
          data-accent="cyan"
          data-neutral="gray"
          data-solid="contrast"
          data-solid-style="flat"
          data-border="playful"
          data-surface="translucent"
          data-transition="micro"
          data-scaling="100"
        >
          {children}
        </div>
      </ThemeContext.Provider>
    </LayoutProvider>
  );
}

export function PortfolioThemeToggle() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('PortfolioThemeToggle requires PortfolioProviders');
  return (
    <IconButton
      icon={context.theme === 'dark' ? 'light' : 'dark'}
      variant="ghost"
      className="portfolio-theme-toggle"
      aria-label={`Switch to ${context.theme === 'dark' ? 'light' : 'dark'} theme`}
      onClick={context.toggle}
    />
  );
}
