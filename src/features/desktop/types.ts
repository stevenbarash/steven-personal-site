import type { Win95IconName } from '@/types';

export type DesktopAppId =
  | 'home'
  | 'profile'
  | 'projects'
  | 'contact'
  | 'terminal'
  | 'resume'
  | 'photos'
  | 'help'
  | 'about-site';

export type DesktopPlacement = 'desktop' | 'start' | 'home' | 'view-menu' | 'help-menu';

export interface DesktopAppChrome {
  title: string;
  programLabel: string;
  statusText: string;
  pathLabel: string;
}

export interface DesktopPlacementDefinition {
  order: number;
  label: string;
  group?: number;
}

export interface DesktopAppDefinition {
  id: DesktopAppId;
  label: string;
  icon: Win95IconName;
  href: string;
  legacyAppId?: string;
  legacySectionId?: string;
  chrome: DesktopAppChrome;
  placements: Partial<Record<DesktopPlacement, DesktopPlacementDefinition>>;
}

export interface PlacedDesktopApp extends DesktopAppDefinition {
  placement: DesktopPlacementDefinition;
}

export interface DesktopNavigationTarget {
  path: string;
  sectionId?: string;
}
