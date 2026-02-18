'use client';

import { useEffect, useRef } from 'react';
import { PersonFill, FolderFill, Folder2Open, WindowDesktop, QuestionCircleFill, Power, FileEarmarkTextFill } from 'react-bootstrap-icons';

interface StartMenuItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  sectionId?: string;
  separator?: boolean;
  action?: () => void;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShutDown?: () => void;
  onNavigate?: (sectionId: string) => void;
}

const menuItems: StartMenuItem[] = [
  {
    label: 'About Me',
    icon: PersonFill,
    sectionId: 'section-profile',
  },
  {
    label: 'My Projects',
    icon: FolderFill,
    sectionId: 'section-projects',
  },
  {
    label: 'My Links',
    icon: Folder2Open,
    sectionId: 'section-explorer',
  },
  {
    label: 'Command Prompt',
    icon: WindowDesktop,
    sectionId: 'section-terminal',
  },
  {
    label: 'My Resume',
    icon: FileEarmarkTextFill,
    sectionId: 'section-projects',
  },
  {
    label: '',
    icon: PersonFill,
    separator: true,
  },
  {
    label: 'Help',
    icon: QuestionCircleFill,
    sectionId: 'section-profile',
  },
  {
    label: '',
    icon: PersonFill,
    separator: true,
  },
  {
    label: 'Shut Down...',
    icon: Power,
  },
];

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onShutDown, onNavigate }) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (item: StartMenuItem) => {
    if (item.separator) return;

    if (item.label === 'Shut Down...') {
      onShutDown?.();
      onClose();
      return;
    }

    if (item.sectionId) {
      if (onNavigate) {
        onNavigate(item.sectionId);
      } else {
        const el = document.getElementById(item.sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (item.action) item.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div ref={menuRef} className="win95-start-menu" role="menu">
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
              className="win95-start-menu-item"
              role="menuitem"
              onClick={() => handleItemClick(item)}
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
