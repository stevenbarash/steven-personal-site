'use client';

import { useCallback, useEffect, useMemo } from 'react';

interface MenuBarProps {
  onNavigate?: (sectionId: string) => void;
  onRouteNavigate?: (path: string, sectionId?: string) => void;
  currentPath?: string;
}

interface MenuItemConfig {
  label: string;
  mnemonic: string;
  onSelect: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNavigate,
  onRouteNavigate,
  currentPath = '/',
}) => {
  const navigateToSection = useCallback((sectionId: string) => {
    if (currentPath === '/') {
      if (onNavigate) onNavigate(sectionId);
      return;
    }
    onRouteNavigate?.('/', sectionId);
  }, [currentPath, onNavigate, onRouteNavigate]);

  const menuItems: MenuItemConfig[] = useMemo(() => [
    {
      label: 'File',
      mnemonic: 'f',
      onSelect: () => onRouteNavigate?.('/'),
    },
    {
      label: 'Edit',
      mnemonic: 'e',
      onSelect: () => navigateToSection('section-profile'),
    },
    {
      label: 'View',
      mnemonic: 'v',
      onSelect: () => navigateToSection('section-explorer'),
    },
    {
      label: 'Help',
      mnemonic: 'h',
      onSelect: () => navigateToSection('section-profile'),
    },
  ], [navigateToSection, onRouteNavigate]);

  useEffect(() => {
    const handleGlobalMnemonics = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const key = event.key.toLowerCase();
      const item = menuItems.find(menuItem => menuItem.mnemonic === key);
      if (!item) return;
      event.preventDefault();
      item.onSelect();
    };

    document.addEventListener('keydown', handleGlobalMnemonics);
    return () => {
      document.removeEventListener('keydown', handleGlobalMnemonics);
    };
  }, [menuItems]);

  return (
    <div className="win95-menu-bar" role="menubar">
      {menuItems.map((item) => (
        <button
          key={item.label}
          className="win95-menu-item"
          role="menuitem"
          tabIndex={0}
          type="button"
          onClick={item.onSelect}
          aria-label={item.label}
        >
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '1px' }}>
            {item.label.charAt(0)}
          </span>
          {item.label.slice(1)}
        </button>
      ))}
    </div>
  );
};
