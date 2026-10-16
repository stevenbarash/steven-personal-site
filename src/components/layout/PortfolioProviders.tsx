'use client';

import { Icon, IconButton, LayoutProvider } from '@once-ui-system/core';
import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
const ThemeContext = createContext<{ toggle: () => void } | null>(null);
const storageKey = 'portfolio-theme';
let inMemoryTheme: Theme = 'dark';

// Run while HTML is parsed, before portfolio content can paint or React hydrates.
// Keep the mutation on this script's parent; opt out of Rocket Loader deferral.
const initialThemeScript = `
  try {
    var theme = localStorage.getItem(${JSON.stringify(storageKey)});
    if (theme === 'light' || theme === 'dark') {
      document.currentScript.parentElement.setAttribute('data-theme', theme);
    }
  } catch {}
`;

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
      <ThemeContext.Provider value={{ toggle }}>
        <div
          className="portfolio-site"
          data-theme={theme}
          suppressHydrationWarning
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
          <script data-cfasync="false" dangerouslySetInnerHTML={{ __html: initialThemeScript }} />
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
      // Let the visible child label name the button, not IconButton's fallback.
      aria-label={undefined}
      variant="ghost"
      className="portfolio-theme-toggle"
      onClick={context.toggle}
    >
      <span className="portfolio-theme-sun">
        <Icon name="light" size="s" />
        <span className="portfolio-theme-label">Switch to light theme</span>
      </span>
      <span className="portfolio-theme-moon">
        <Icon name="dark" size="s" />
        <span className="portfolio-theme-label">Switch to dark theme</span>
      </span>
    </IconButton>
  );
}
