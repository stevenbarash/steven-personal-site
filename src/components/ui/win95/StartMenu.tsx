'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getAppById, getNavigationTarget, START_MENU_ITEMS, type StartMenuItem } from '@/features/desktop/navigation';
import { Win95Icon } from './Win95Icon';

interface StartMenuProps {
  isOpen: boolean;
  onClose: (restoreStartFocus?: boolean) => void;
  onShutDown?: () => void;
  onNavigate?: (sectionId: string) => void;
  onRouteNavigate?: (path: string, sectionId?: string) => void;
}

const getItemLabel = (item: StartMenuItem) => {
  if (item.type === 'shutdown') return 'Shut Down...';
  if (item.type === 'app') return getAppById(item.appId)?.placements.start?.label ?? '';
  return '';
};

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onShutDown, onNavigate, onRouteNavigate }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const actionableIndexes = useMemo(
    () => START_MENU_ITEMS.map((item, index) => (item.type === 'separator' ? -1 : index)).filter(index => index >= 0),
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
      if (e.key === 'Escape') onClose(true);
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
    if (item.type === 'separator') return;

    if (item.type === 'shutdown') {
      onShutDown?.();
      onClose();
      return;
    }

    const app = getAppById(item.appId);
    if (!app) return;
    const target = getNavigationTarget(app);

    if (onRouteNavigate) {
      onRouteNavigate(target.path, target.sectionId);
    } else if (target.sectionId && onNavigate) {
      onNavigate(target.sectionId);
    } else if (target.sectionId) {
      const el = document.getElementById(target.sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      if (highlightedIndex >= 0) handleItemClick(START_MENU_ITEMS[highlightedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="win95-start-menu" role="menu" aria-label="Start" onKeyDown={handleMenuKeyDown}>
      <div className="win95-start-menu-sidebar">
        <span className="win95-start-menu-sidebar-text">
          <strong>Steven</strong>98
        </span>
      </div>

      <div className="win95-start-menu-items">
        {START_MENU_ITEMS.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={`sep-${index}`} className="win95-start-menu-separator" />;
          }
          const app = item.type === 'app' ? getAppById(item.appId) : undefined;
          const label = getItemLabel(item);
          return (
            <button
              key={item.type === 'app' ? item.appId : item.type}
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
              {app && <Win95Icon name={app.icon} size={32} className="win95-start-menu-icon" />}
              {item.type === 'shutdown' && <Win95Icon name="powerOff" size={32} className="win95-start-menu-icon" />}
              <span className="win95-start-menu-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
