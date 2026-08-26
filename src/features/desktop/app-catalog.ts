import type {
  DesktopAppDefinition,
  DesktopPlacement,
  PlacedDesktopApp,
} from './types';

export const desktopAppCatalog: readonly DesktopAppDefinition[] = [
  {
    id: 'home', label: 'My Computer', icon: 'computer', href: '/desktop',
    chrome: { title: 'STEVEN.EXE - Personal Site', programLabel: 'STEVEN.EXE', statusText: '7 objects', pathLabel: 'My Computer' },
    placements: {
      desktop: { order: 0, label: 'My Computer' },
      start: { order: 0, label: 'My Computer', group: 0 },
      'view-menu': { order: 0, label: 'My Computer' },
    },
  },
  {
    id: 'profile', label: 'About Me', icon: 'user', href: '/desktop?app=profile', legacyAppId: 'profile', legacySectionId: 'section-profile',
    chrome: { title: 'ABOUT.EXE - About Me', programLabel: 'ABOUT.EXE', statusText: 'Profile ready', pathLabel: 'C:\\STEVEN\\ABOUT\\' },
    placements: {
      start: { order: 1, label: 'About Me', group: 0 },
      home: { order: 5, label: 'About Me', group: 1 },
      'view-menu': { order: 6, label: 'About Me' },
    },
  },
  {
    id: 'projects', label: 'Projects', icon: 'folder', href: '/desktop?app=projects', legacyAppId: 'projects', legacySectionId: 'section-projects',
    chrome: { title: 'PROJECTS - Project Explorer', programLabel: 'PROJECTS', statusText: '4 projects', pathLabel: 'C:\\STEVEN\\PROJECTS\\' },
    placements: {
      desktop: { order: 2, label: 'Projects' },
      start: { order: 3, label: 'Projects', group: 0 },
      home: { order: 1, label: 'Projects', group: 0 },
      'view-menu': { order: 2, label: 'Projects' },
    },
  },
  {
    id: 'resume', label: 'Resume', icon: 'notepad', href: '/desktop?app=resume', legacyAppId: 'resume', legacySectionId: 'section-resume',
    chrome: { title: 'RESUME.DOC - WordPad', programLabel: 'RESUME.DOC', statusText: 'Resume ready', pathLabel: 'C:\\STEVEN\\RESUME.DOC' },
    placements: {
      desktop: { order: 3, label: 'Resume' },
      start: { order: 4, label: 'Resume', group: 0 },
      home: { order: 2, label: 'Resume', group: 0 },
      'view-menu': { order: 3, label: 'Resume' },
    },
  },
  {
    id: 'photos', label: 'Photography', icon: 'camera', href: '/desktop?app=photos', legacyAppId: 'photos', legacySectionId: 'section-photos',
    chrome: { title: 'PHOTOS.EXE - Photography Explorer', programLabel: 'PHOTOS.EXE', statusText: 'Ready to browse photos', pathLabel: 'C:\\PHOTOS\\' },
    placements: {
      desktop: { order: 4, label: 'Photography' },
      start: { order: 5, label: 'Photography', group: 0 },
      home: { order: 3, label: 'Photography', group: 0 },
      'view-menu': { order: 4, label: 'Photography' },
    },
  },
  {
    id: 'contact', label: 'Contact', icon: 'explorer', href: '/desktop?app=explorer', legacyAppId: 'explorer', legacySectionId: 'section-explorer',
    chrome: { title: 'CONTACTS - Internet Explorer', programLabel: 'CONTACT', statusText: 'Contact options ready', pathLabel: 'C:\\STEVEN\\CONTACTS\\' },
    placements: {
      desktop: { order: 5, label: 'Contact' },
      start: { order: 6, label: 'Contact', group: 0 },
      home: { order: 4, label: 'Contact', group: 0 },
      'view-menu': { order: 5, label: 'Contact' },
    },
  },
  {
    id: 'terminal', label: 'Command Prompt', icon: 'msDos', href: '/desktop?app=terminal', legacyAppId: 'terminal', legacySectionId: 'section-terminal',
    chrome: { title: 'MS-DOS Prompt', programLabel: 'MS-DOS Prompt', statusText: 'Command prompt ready', pathLabel: 'C:\\STEVEN\\' },
    placements: {
      start: { order: 7, label: 'Command Prompt', group: 1 },
      home: { order: 6, label: 'Command Prompt', group: 1 },
      'view-menu': { order: 7, label: 'Command Prompt' },
    },
  },
  {
    id: 'help', label: 'Help', icon: 'help', href: '/desktop?app=help', legacyAppId: 'help', legacySectionId: 'section-help',
    chrome: { title: 'HELP - Using This Site', programLabel: 'HELP', statusText: 'Help topics ready', pathLabel: 'C:\\WINDOWS\\HELP\\' },
    placements: {
      start: { order: 8, label: 'Help', group: 1 },
      home: { order: 7, label: 'Help / About This Site', group: 1 },
      'help-menu': { order: 0, label: 'Help Topics' },
    },
  },
  {
    id: 'about-site', label: 'About This Site', icon: 'help', href: '/desktop?app=about-site', legacyAppId: 'about-site', legacySectionId: 'section-about-site',
    chrome: { title: 'ABOUT - This Site', programLabel: 'ABOUT SITE', statusText: 'Site information ready', pathLabel: 'C:\\STEVEN\\SITE\\' },
    placements: { 'help-menu': { order: 1, label: 'About This Site' } },
  },
];

export const getAppsForPlacement = (placement: DesktopPlacement): PlacedDesktopApp[] => (
  desktopAppCatalog
    .flatMap((app) => {
      const definition = app.placements[placement];
      return definition ? [{ ...app, placement: definition }] : [];
    })
    .sort((first, second) => first.placement.order - second.placement.order)
);
