import { Background, Column, Row, Text, ToggleButton } from '@once-ui-system/core';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PortfolioProviders, PortfolioThemeToggle } from './PortfolioProviders';

interface PortfolioLayoutProps {
  children: ReactNode;
  activeHref?: string;
}

// Navigation and shell adapted from Once UI's Magic Portfolio (CC BY-NC 4.0).
const navigation = [
  { href: '/resume', label: 'Experience', icon: 'person' },
  { href: '/photos', label: 'Photography', icon: 'image' },
  { href: '/contact', label: 'Contact', icon: 'mail' },
] as const;

export function PortfolioLayout({ children, activeHref }: PortfolioLayoutProps) {
  return (
    <PortfolioProviders>
      <a className="portfolio-skip-link" href="#main-content">Skip to content</a>
      <div className="portfolio-ambient" aria-hidden="true">
        <Background
          fill
          pointerEvents="none"
          mask={{ x: 50, y: 0, radius: 100 }}
          gradient={{ display: true, opacity: 40, x: 50, y: 0, width: 300, height: 160, colorStart: 'brand-alpha-weak', colorEnd: 'static-transparent' }}
        />
      </div>
      <header className="portfolio-header">
        <Link className="portfolio-name" href="/" aria-label="Steven Barash, home">Steven Barash</Link>
        <Row as="nav" className="portfolio-navigation" aria-label="Primary navigation" gap="4" padding="4" radius="l" background="page" border data-border="rounded">
          <ToggleButton href="/" prefixIcon="home" selected={!activeHref} aria-current={!activeHref ? 'page' : undefined} aria-label="Home" className="portfolio-nav-link" />
          <span className="portfolio-nav-divider" aria-hidden="true" />
          {navigation.map((item) => (
            <ToggleButton
              key={item.href}
              href={item.href}
              prefixIcon={item.icon}
              selected={activeHref === item.href}
              aria-current={activeHref === item.href ? 'page' : undefined}
              aria-label={item.label}
              className="portfolio-nav-link"
            >
              <span className="portfolio-nav-label">{item.label}</span>
            </ToggleButton>
          ))}
          <span className="portfolio-nav-divider" aria-hidden="true" />
          <PortfolioThemeToggle />
        </Row>
      </header>
      <main id="main-content" tabIndex={-1} className="portfolio-main">{children}</main>
      <Column as="footer" className="portfolio-footer" gap="16">
        <Row horizontal="between" vertical="center" gap="16" wrap>
          <Row vertical="center" gap="8">
            <Text variant="body-default-s" onBackground="neutral-weak">Steven Barash</Text>
            <Link className="portfolio-credit" href="/credits">Credits</Link>
          </Row>
        </Row>
      </Column>
      <Link className="portfolio-start-link" href="/desktop" prefetch={false} aria-label="Start the Windows 95 experience">
        <span className="win95-button portfolio-start-face">
          <Image className="portfolio-start-icon" src="/images/win95.png" alt="" width={16} height={14} unoptimized />
          <span>Start</span>
        </span>
      </Link>
    </PortfolioProviders>
  );
}
