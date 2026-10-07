import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { siteConfig } from '@/constants/site';
import { profileContent } from '@/content/profile';
import "./globals.css";
import "@once-ui-system/core/css/tokens.css";
import "./portfolio.scss";
import type { ReactNode } from "react";

const portfolioFont = Geist({
  subsets: ['latin'],
  variable: '--font-portfolio',
});

const publicDescription = profileContent.headline;

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} | ${profileContent.professionalLabel}`,
    template: `%s | ${siteConfig.siteName}`
  },
  description: publicDescription,
  keywords: [
    siteConfig.personName,
    "Senior Solutions Engineer",
    "Software builder",
    "Technical debugging",
    "Automation and repeatability",
    "Descope",
    "CIAM",
    "OAuth/OIDC",
    "SAML",
    "MFA",
    "identity architecture",
    "authentication strategy",
    "passkeys",
    "FAPI",
    "identity federation",
    "B2B authorization",
    "RBAC",
    "FGA",
    "identity migrations",
    "technical deal strategy",
    "enterprise requirements",
    "demo engineering",
    "demo storytelling",
    "demo automation",
    "POC scoping and validation",
    "SE and AE technical enablement",
    "authentication and integration debugging",
    "API and SDK integrations",
    "MCP",
    "agentic AI",
    "technical prototypes",
    "independent software",
    "Brooklyn",
  ],
  authors: [{ name: siteConfig.personName, url: siteConfig.canonicalOrigin }],
  creator: siteConfig.personName,
  publisher: siteConfig.personName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.canonicalOrigin),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.canonicalOrigin,
    title: `${siteConfig.siteName} | ${profileContent.professionalLabel}`,
    description: publicDescription,
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.siteName} | ${profileContent.professionalLabel}`,
    description: publicDescription,
    creator: siteConfig.xHandle,
    site: siteConfig.xHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
  category: 'technology',
  classification: 'personal website',
  other: {
    'geo.region': 'US-NY',
    'geo.placename': 'Brooklyn, New York',
    'copyright': siteConfig.personName,
    'language': 'English',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Essential structured data for Person
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.canonicalOrigin}/#person`,
  "name": siteConfig.personName,
  "jobTitle": "Senior Solutions Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Descope",
    "url": "https://www.descope.com",
    "description": "Identity and authentication platform"
  },
  "url": siteConfig.canonicalOrigin,
  "image": {
    "@type": "ImageObject",
    "url": `${siteConfig.canonicalOrigin}/images/me.jpg`,
    "width": 250,
    "height": 250
  },
  "sameAs": [
    siteConfig.linkedinUrl,
    siteConfig.githubUrl,
    siteConfig.instagramUrl,
    siteConfig.xUrl
  ],
  "knowsAbout": [
    "Software prototyping and integrations",
    "Technical debugging",
    "Automation and repeatability",
    "CIAM",
    "OAuth/OIDC",
    "SAML",
    "MFA",
    "Identity architecture",
    "Authentication strategy",
    "Passkeys",
    "FAPI",
    "Identity federation",
    "B2B authorization",
    "RBAC",
    "FGA",
    "Identity migrations",
    "Technical deal strategy",
    "Unusual enterprise requirements",
    "Demo engineering and business-value storytelling",
    "Demo automation and repeatability",
    "POC scoping, success criteria, validation, and technical wins",
    "API and SDK prototypes and integrations",
    "MCP and agent prototypes and integrations",
    "SE and AE technical enablement",
    "Complex authentication and integration debugging",
    "Agentic AI",
    "Technical prototyping"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brooklyn",
    "addressRegion": "NY",
    "addressCountry": "US"
  },
  "description": publicDescription,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const enableVercelTelemetry = process.env.VERCEL_ENV === 'production';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Essential structured data */}
        <script
          id="person-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll('<', '\\u003c') }}
        />
      </head>
      <body className={`${portfolioFont.variable} font-sans`} suppressHydrationWarning>
        {children}
        {enableVercelTelemetry && <Analytics />}
        {enableVercelTelemetry && <SpeedInsights />}
      </body>
    </html>
  );
}
