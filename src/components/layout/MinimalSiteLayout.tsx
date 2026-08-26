import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface MinimalSiteLayoutProps {
  children: ReactNode;
  activeHref?: string;
}

const navigation = [
  { href: '/projects', label: 'Work' },
  { href: '/resume', label: 'Experience' },
  { href: '/photos', label: 'Photography' },
  { href: '/contact', label: 'Contact' },
] as const;

export function MinimalSiteLayout({ children, activeHref }: MinimalSiteLayoutProps) {
  return (
    <div className="minimal-site">
      <a className="minimal-skip-link" href="#main-content">Skip to content</a>
      <header className="minimal-header">
        <div className="minimal-shell minimal-header-inner">
          <Link className="minimal-name-link" href="/" aria-label="Steven Barash, home">Steven Barash</Link>
          <nav className="minimal-nav minimal-nav-wide" aria-label="Primary navigation">
            {navigation.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'minimal-nav-active' : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <details className="minimal-nav-disclosure">
            <summary role="button">Menu</summary>
            <nav className="minimal-nav minimal-nav-narrow" aria-label="Mobile navigation">
              {navigation.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? 'minimal-nav-active' : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </details>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <footer className="minimal-footer">
        <div className="minimal-shell minimal-footer-inner">
          <p>Steven Barash</p>
          <Link
            className="minimal-desktop-start-link"
            href="/desktop"
          >
            <span className="minimal-desktop-start-face" data-desktop-start-face aria-hidden="true">
              <Image
                src="/images/win95.png"
                alt=""
                width={16}
                height={14}
                unoptimized
              />
              <span>Start</span>
            </span>
            <span className="minimal-visually-hidden">Start, open the Windows 95 version</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
