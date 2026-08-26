import { desktopAppCatalog, getAppsForPlacement } from './app-catalog';
import type {
  DesktopAppDefinition,
  DesktopAppId,
  DesktopNavigationTarget,
} from './types';

export type StartMenuItem =
  | { type: 'app'; appId: DesktopAppId }
  | { type: 'separator' }
  | { type: 'shutdown' };

const startApps = getAppsForPlacement('start');

export const START_MENU_ITEMS: readonly StartMenuItem[] = [
  ...startApps.flatMap<StartMenuItem>((app, index) => {
    const previous = startApps[index - 1];
    const startsGroup = previous && previous.placement.group !== app.placement.group;
    return [
      ...(startsGroup ? [{ type: 'separator' as const }] : []),
      { type: 'app', appId: app.id },
    ];
  }),
  { type: 'separator' },
  { type: 'shutdown' },
];

export const HELP_MENU_APP_IDS: readonly DesktopAppId[] = getAppsForPlacement('help-menu').map(({ id }) => id);

export const getAppById = (id: string | null | undefined): DesktopAppDefinition | undefined => (
  desktopAppCatalog.find((app) => app.id === id)
);

export const getAppByLegacyAppId = (legacyAppId: string | null | undefined): DesktopAppDefinition | undefined => (
  desktopAppCatalog.find((app) => app.legacyAppId === legacyAppId)
);

export const getAppByLegacySectionId = (legacySectionId: string | null | undefined): DesktopAppDefinition | undefined => (
  desktopAppCatalog.find((app) => app.legacySectionId === legacySectionId)
);

export const getAppByPathname = (pathname: string): DesktopAppDefinition | undefined => (
  desktopAppCatalog.find((app) => new URL(app.href, 'https://desktop.invalid').pathname === pathname && pathname !== '/')
);

export const getNavigationTarget = (app: DesktopAppDefinition): DesktopNavigationTarget => {
  const target = new URL(app.href, 'https://desktop.invalid');
  if (target.pathname === '/desktop' && app.legacySectionId) {
    return { path: target.pathname, sectionId: app.legacySectionId };
  }
  if (target.pathname !== '/') return { path: target.pathname };
  if (app.legacySectionId) return { path: '/', sectionId: app.legacySectionId };
  return { path: target.pathname };
};
