'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PersonFill, FolderFill, Folder2Open, WindowDesktop, QuestionCircleFill, Power, FileEarmarkTextFill, HouseFill, CameraFill } from 'react-bootstrap-icons';

interface StartMenuItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  sectionId?: string;
  path?: string;
  separator?: boolean;
  action?: () => void;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShutDown?: () => void;
  onNavigate?: (sectionId: string) => void;
  onRouteNavigate?: (path: string, sectionId?: string) => void;
}

/** Set to true to show Photography in the start menu and allow navigation to /photos */
const PHOTOS_PAGE_ENABLED = false;

const menuItems: StartMenuItem[] = [
  { label: 'Home', icon: HouseFill, path: '/' },
  { label: 'About Me', icon: PersonFill, sectionId: 'section-profile' },
  { label: 'My Projects', icon: FolderFill, sectionId: 'section-projects' },
  { label: 'Explorer', icon: Folder2Open, sectionId: 'section-explorer' },
  ...(PHOTOS_PAGE_ENABLED ? [{ label: 'Photography', icon: CameraFill, path: '/photos' as const }] : []),
  { label: 'Command Prompt', icon: WindowDesktop, sectionId: 'section-terminal' },
  { label: 'My Resume', icon: FileEarmarkTextFill, sectionId: 'section-projects' },
  { label: '', icon: PersonFill, separator: true },
  { label: 'Help', icon: QuestionCircleFill, sectionId: 'section-profile' },
  { label: '', icon: PersonFill, separator: true },
  { label: 'Shut Down...', icon: Power },
];

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onShutDown, onNavigate, onRouteNavigate }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const actionableIndexes = useMemo(
    () => menuItems.map((item, index) => (item.separator ? -1 : index)).filter(index => index >= 0),
    []
  );

  const focusItemAt = (index: number) => {
    setHighlightedIndex(index);
    itemRefs.current[index]?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const startBtn = document.getElementById('start-button');
        if (startBtn && startBtn.contains(e.target as Node)) return;
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      const firstIndex = actionableIndexes[0] ?? -1;
      setTimeout(() => {
        if (firstIndex >= 0) itemRefs.current[firstIndex]?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [actionableIndexes, isOpen, onClose]);

  const handleItemClick = (item: StartMenuItem) => {
    if (item.separator) return;

    if (item.label === 'Shut Down...') {
      onShutDown?.();
      onClose();
      return;
    }

    if (item.path) {
      onRouteNavigate?.(item.path);
      onClose();
      return;
    }

    if (item.sectionId) {
      if (onRouteNavigate) {
        onRouteNavigate('/', item.sectionId);
      } else if (onNavigate) {
        onNavigate(item.sectionId);
      } else {
        const el = document.getElementById(item.sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (item.action) item.action();
    onClose();
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!actionableIndexes.length) return;

    const currentPosition = Math.max(0, actionableIndexes.indexOf(highlightedIndex));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = actionableIndexes[(currentPosition + 1) % actionableIndexes.length];
      focusItemAt(nextIndex);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = actionableIndexes[(currentPosition - 1 + actionableIndexes.length) % actionableIndexes.length];
      focusItemAt(nextIndex);
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      focusItemAt(actionableIndexes[0]);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      focusItemAt(actionableIndexes[actionableIndexes.length - 1]);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) handleItemClick(menuItems[highlightedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="win95-start-menu" role="menu" onKeyDown={handleMenuKeyDown}>
      <div className="win95-start-menu-sidebar">
        <span className="win95-start-menu-sidebar-text">
          <strong>Steven</strong>98
        </span>
      </div>

      <div className="win95-start-menu-items">
        {menuItems.map((item, index) => {
          if (item.separator) {
            return <div key={`sep-${index}`} className="win95-start-menu-separator" />;
          }
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`win95-start-menu-item ${highlightedIndex === index ? 'is-focused' : ''}`}
              role="menuitem"
              type="button"
              id={`start-menu-item-${index}`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
              onFocus={() => setHighlightedIndex(index)}
            >
              <IconComponent size={20} className="win95-start-menu-icon" />
              <span className="win95-start-menu-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
