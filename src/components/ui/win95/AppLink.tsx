'use client';

import { useMemo, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const subscribeToLocation = (onStoreChange: () => void) => {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
};

export function AppLink({ href, onClick, ...props }: AppLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearch = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.search,
    () => '',
  );
  const resolvedHref = useMemo(() => {
    const base = new URL(`${pathname}${currentSearch}`, 'http://app.local');
    const target = new URL(href, base);
    if (target.origin !== base.origin) return href;

    const preservedParams = new URLSearchParams(base.search);
    const targetParams = new URLSearchParams(target.search);
    if (!targetParams.has('app')) preservedParams.delete('app');
    targetParams.forEach((value, key) => preservedParams.set(key, value));
    const query = preservedParams.toString();
    return `${target.pathname}${query ? `?${query}` : ''}${target.hash}`;
  }, [currentSearch, href, pathname]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;

    const current = new URL(window.location.href);
    const target = new URL(resolvedHref, current.origin);
    if (target.origin !== current.origin) return;

    const currentParams = new URLSearchParams(current.search);
    const targetParams = new URLSearchParams(target.search);

    if (!targetParams.has('app')) {
      currentParams.delete('app');
    }
    targetParams.forEach((value, key) => currentParams.set(key, value));
    target.search = currentParams.toString();

    const launcherId = event.currentTarget.dataset.focusLauncher ?? event.currentTarget.dataset.launcherFor;
    if (launcherId) sessionStorage.setItem('win95.pendingLauncherFocus', launcherId);

    event.preventDefault();
    if (target.pathname === current.pathname) {
      window.history.pushState(null, '', `${target.pathname}${target.search}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    router.push(`${target.pathname}${target.search}${target.hash}`);
  };

  return <a href={resolvedHref} onClick={handleClick} {...props} />;
}
