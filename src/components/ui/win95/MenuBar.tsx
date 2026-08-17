'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

interface MenuBarProps {
  onRouteNavigate?: (path: string, sectionId?: string) => void;
  onCloseWindow?: () => void;
  onShutDown?: () => void;
}

interface MenuCommand {
  type: 'command';
  label: string;
  onSelect: () => void;
}

interface MenuSeparator {
  type: 'separator';
}

type DropdownItem = MenuCommand | MenuSeparator;

interface TopLevelMenu {
  label: string;
  mnemonic: string;
  items: DropdownItem[];
}

type MenuEdge = 'first' | 'last';

export const MenuBar: React.FC<MenuBarProps> = ({
  onRouteNavigate,
  onCloseWindow,
  onShutDown,
}) => {
  const [focusedMenuIndex, setFocusedMenuIndex] = useState(0);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [focusedCommandIndex, setFocusedCommandIndex] = useState(0);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const commandRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const navigateToSection = useCallback((sectionId: string) => {
    onRouteNavigate?.('/', sectionId);
  }, [onRouteNavigate]);

  const menus: TopLevelMenu[] = useMemo(() => [
    {
      label: 'File',
      mnemonic: 'f',
      items: [
        { type: 'command', label: 'Home', onSelect: () => onRouteNavigate?.('/') },
        { type: 'command', label: 'Close Window', onSelect: () => onCloseWindow?.() },
        { type: 'separator' },
        { type: 'command', label: 'Shut Down...', onSelect: () => onShutDown?.() },
      ],
    },
    {
      label: 'View',
      mnemonic: 'v',
      items: [
        { type: 'command', label: 'My Computer', onSelect: () => onRouteNavigate?.('/') },
        { type: 'command', label: 'Projects', onSelect: () => navigateToSection('section-projects') },
        { type: 'command', label: 'Resume', onSelect: () => navigateToSection('section-resume') },
        { type: 'command', label: 'Photography', onSelect: () => onRouteNavigate?.('/photos') },
        { type: 'command', label: 'Internet', onSelect: () => navigateToSection('section-explorer') },
        { type: 'command', label: 'MS-DOS Prompt', onSelect: () => navigateToSection('section-terminal') },
      ],
    },
    {
      label: 'Help',
      mnemonic: 'h',
      items: [
        { type: 'command', label: 'Help Topics', onSelect: () => navigateToSection('section-help') },
        { type: 'command', label: 'About This Site', onSelect: () => navigateToSection('section-about-site') },
      ],
    },
  ], [navigateToSection, onCloseWindow, onRouteNavigate, onShutDown]);

  const getCommandIndexes = useCallback((menuIndex: number) => (
    menus[menuIndex].items
      .map((item, itemIndex) => (item.type === 'command' ? itemIndex : -1))
      .filter(itemIndex => itemIndex >= 0)
  ), [menus]);

  const openMenu = useCallback((menuIndex: number, edge: MenuEdge = 'first') => {
    const commandIndexes = getCommandIndexes(menuIndex);
    const nextCommandIndex = edge === 'last'
      ? commandIndexes[commandIndexes.length - 1]
      : commandIndexes[0];

    setFocusedMenuIndex(menuIndex);
    setOpenMenuIndex(menuIndex);
    setFocusedCommandIndex(nextCommandIndex ?? 0);
  }, [getCommandIndexes]);

  const closeMenu = useCallback((restoreTriggerFocus = false) => {
    const menuIndex = openMenuIndex;
    setOpenMenuIndex(null);
    commandRefs.current = [];
    if (restoreTriggerFocus && menuIndex !== null) {
      window.requestAnimationFrame(() => triggerRefs.current[menuIndex]?.focus());
    }
  }, [openMenuIndex]);

  useEffect(() => {
    if (openMenuIndex === null) return;
    window.requestAnimationFrame(() => commandRefs.current[focusedCommandIndex]?.focus());
  }, [focusedCommandIndex, openMenuIndex]);

  useEffect(() => {
    if (openMenuIndex === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuBarRef.current?.contains(event.target as Node)) closeMenu();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [closeMenu, openMenuIndex]);

  useEffect(() => {
    const handleGlobalMnemonics = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const menuIndex = menus.findIndex(menu => menu.mnemonic === event.key.toLowerCase());
      if (menuIndex < 0) return;

      event.preventDefault();
      openMenu(menuIndex);
    };

    document.addEventListener('keydown', handleGlobalMnemonics);
    return () => document.removeEventListener('keydown', handleGlobalMnemonics);
  }, [menus, openMenu]);

  const focusTrigger = (menuIndex: number) => {
    setFocusedMenuIndex(menuIndex);
    triggerRefs.current[menuIndex]?.focus();
  };

  const switchOpenMenu = (menuIndex: number) => {
    commandRefs.current = [];
    openMenu(menuIndex);
  };

  const handleTriggerKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    menuIndex: number,
  ) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu(menuIndex);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(menuIndex, 'last');
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    let nextMenuIndex: number | undefined;
    if (event.key === 'ArrowLeft') nextMenuIndex = (menuIndex - 1 + menus.length) % menus.length;
    if (event.key === 'ArrowRight') nextMenuIndex = (menuIndex + 1) % menus.length;
    if (event.key === 'Home') nextMenuIndex = 0;
    if (event.key === 'End') nextMenuIndex = menus.length - 1;
    if (nextMenuIndex === undefined) return;

    event.preventDefault();
    if (openMenuIndex === null) {
      focusTrigger(nextMenuIndex);
    } else {
      switchOpenMenu(nextMenuIndex);
    }
  };

  const handleCommandKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    menuIndex: number,
    itemIndex: number,
  ) => {
    const commandIndexes = getCommandIndexes(menuIndex);
    const commandPosition = commandIndexes.indexOf(itemIndex);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === 'Tab') {
      closeMenu();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const offset = event.key === 'ArrowLeft' ? -1 : 1;
      switchOpenMenu((menuIndex + offset + menus.length) % menus.length);
      return;
    }

    let nextCommandIndex: number | undefined;
    if (event.key === 'ArrowDown') {
      nextCommandIndex = commandIndexes[(commandPosition + 1) % commandIndexes.length];
    }
    if (event.key === 'ArrowUp') {
      nextCommandIndex = commandIndexes[(commandPosition - 1 + commandIndexes.length) % commandIndexes.length];
    }
    if (event.key === 'Home') nextCommandIndex = commandIndexes[0];
    if (event.key === 'End') nextCommandIndex = commandIndexes[commandIndexes.length - 1];
    if (nextCommandIndex === undefined) return;

    event.preventDefault();
    setFocusedCommandIndex(nextCommandIndex);
    commandRefs.current[nextCommandIndex]?.focus();
  };

  const selectCommand = (command: MenuCommand) => {
    closeMenu();
    command.onSelect();
  };

  return (
    <div ref={menuBarRef} className="win95-menu-bar" role="menubar">
      {menus.map((menu, menuIndex) => {
        const isOpen = openMenuIndex === menuIndex;
        const menuId = `win95-${menu.label.toLowerCase()}-menu`;

        return (
          <div
            key={menu.label}
            className="win95-menu-root"
            role="none"
          >
            <button
              ref={(element) => {
                triggerRefs.current[menuIndex] = element;
              }}
              className={`win95-menu-item${isOpen ? ' is-open' : ''}`}
              role="menuitem"
              tabIndex={focusedMenuIndex === menuIndex ? 0 : -1}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls={menuId}
              aria-label={menu.label}
              onClick={() => {
                if (isOpen) {
                  closeMenu(true);
                } else {
                  switchOpenMenu(menuIndex);
                }
              }}
              onFocus={() => setFocusedMenuIndex(menuIndex)}
              onKeyDown={(event) => handleTriggerKeyDown(event, menuIndex)}
            >
              <span className="win95-menu-item-face">
                <span className="win95-menu-mnemonic">{menu.label.charAt(0)}</span>
                {menu.label.slice(1)}
              </span>
            </button>

            {isOpen && (
              <div
                id={menuId}
                className="win95-dropdown-menu"
                role="menu"
                aria-label={menu.label}
              >
                {menu.items.map((item, itemIndex) => {
                  if (item.type === 'separator') {
                    return <div key={`separator-${itemIndex}`} className="win95-dropdown-separator" role="separator" />;
                  }

                  return (
                    <button
                      key={item.label}
                      ref={(element) => {
                        commandRefs.current[itemIndex] = element;
                      }}
                      className="win95-dropdown-item"
                      role="menuitem"
                      tabIndex={focusedCommandIndex === itemIndex ? 0 : -1}
                      type="button"
                      onClick={() => selectCommand(item)}
                      onFocus={() => setFocusedCommandIndex(itemIndex)}
                      onKeyDown={(event) => handleCommandKeyDown(event, menuIndex, itemIndex)}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
