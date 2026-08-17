'use client';

import { useState } from 'react';
import type { Win95IconName } from '@/types';
import { Win95Icon } from './Win95Icon';

interface DesktopShortcut {
  id: string;
  label: string;
  icon: Win95IconName;
  path: string;
  sectionId?: string;
}

interface DesktopShortcutsProps {
  onRouteNavigate: (path: string, sectionId?: string) => void;
}

const shortcuts: DesktopShortcut[] = [
  { id: 'computer', label: 'My Computer', icon: 'computer', path: '/' },
  { id: 'projects', label: 'My Projects', icon: 'folder', path: '/', sectionId: 'section-projects' },
  { id: 'explorer', label: 'Internet', icon: 'explorer', path: '/', sectionId: 'section-explorer' },
  { id: 'terminal', label: 'MS-DOS Prompt', icon: 'msDos', path: '/', sectionId: 'section-terminal' },
];

export const DesktopShortcuts: React.FC<DesktopShortcutsProps> = ({ onRouteNavigate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openShortcut = (shortcut: DesktopShortcut) => {
    onRouteNavigate(shortcut.path, shortcut.sectionId);
  };

  return (
    <nav className="win95-desktop-shortcuts" aria-label="Desktop shortcuts">
      {shortcuts.map((shortcut) => (
        <button
          key={shortcut.id}
          type="button"
          className={`win95-desktop-icon win95-desktop-shortcut ${selectedId === shortcut.id ? 'selected' : ''}`}
          aria-label={`Open ${shortcut.label}`}
          aria-pressed={selectedId === shortcut.id}
          onClick={() => setSelectedId(shortcut.id)}
          onDoubleClick={() => openShortcut(shortcut)}
          onPointerUp={(event) => {
            if (event.pointerType !== 'mouse') {
              event.preventDefault();
              openShortcut(shortcut);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openShortcut(shortcut);
            }
          }}
        >
          <Win95Icon name={shortcut.icon} size={32} />
          <span className="win95-icon-label">{shortcut.label}</span>
        </button>
      ))}
    </nav>
  );
};
