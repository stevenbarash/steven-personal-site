'use client';

import { useState } from 'react';
import { getAppsForPlacement } from '@/features/desktop/app-catalog';
import { getNavigationTarget } from '@/features/desktop/navigation';
import { Win95Icon } from './Win95Icon';

interface DesktopShortcutsProps {
  onRouteNavigate: (path: string, sectionId?: string) => void;
}

const desktopApps = getAppsForPlacement('desktop');

export const DesktopShortcuts: React.FC<DesktopShortcutsProps> = ({ onRouteNavigate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openShortcut = (app: (typeof desktopApps)[number]) => {
    const target = getNavigationTarget(app);
    onRouteNavigate(target.path, target.sectionId);
  };

  return (
    <nav className="win95-desktop-shortcuts" aria-label="Desktop shortcuts">
      {desktopApps.map((app) => (
        <button
          key={app.id}
          type="button"
          className={`win95-desktop-icon win95-desktop-shortcut ${selectedId === app.id ? 'selected' : ''}`}
          aria-label={`Open ${app.placement.label}`}
          aria-pressed={selectedId === app.id}
          onClick={() => setSelectedId(app.id)}
          onDoubleClick={() => openShortcut(app)}
          onPointerUp={(event) => {
            if (event.pointerType !== 'mouse') {
              event.preventDefault();
              openShortcut(app);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openShortcut(app);
            }
          }}
        >
          <Win95Icon name={app.icon} size={32} />
          <span className="win95-icon-label">{app.placement.label}</span>
        </button>
      ))}
    </nav>
  );
};
