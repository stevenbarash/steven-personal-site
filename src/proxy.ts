import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  const legacyApp = request.nextUrl.searchParams.get('app');
  const pathnameByLegacyApp: Record<string, string> = {
    explorer: '/contact',
    projects: '/projects',
  };
  const pathname = legacyApp ? pathnameByLegacyApp[legacyApp] : undefined;
  if (!legacyApp) return NextResponse.next();

  const embeddedDesktopApps = new Set(['profile', 'resume', 'terminal', 'help', 'about-site']);
  if (!pathname && !embeddedDesktopApps.has(legacyApp)) return NextResponse.next();

  const destination = request.nextUrl.clone();
  if (pathname) {
    destination.pathname = pathname;
    destination.searchParams.delete('app');
  } else {
    destination.pathname = '/desktop';
  }
  return NextResponse.redirect(destination, 307);
}

export const config = {
  matcher: '/',
};
