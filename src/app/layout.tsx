import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { siteConfig } from '@/constants/site';
import "./globals.css";
import type { ReactNode } from "react";

const quietStudioFont = Geist({
  subsets: ['latin'],
  variable: '--font-quiet-studio',
});

const publicDescription = 'I turn complex technical systems into working products, demos, and decisions.';
const directionContract = 'THESIS: Quiet Studio presents Steven as a technical builder with breadth and judgment. OWN-WORLD: near-white paper, black type, documentary photography, and exact blue accents. STORY: capability first, fields of depth second, working proof next, contact always close. FIRST VIEWPORT: oversized statement and one Damascus Gate photograph share equal weight; selected work begins at the fold. FORM: d77beeac, editorial portfolio with a flat split hero and unnumbered project rows. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.siteName} | Senior Solutions Engineer`,
    template: `%s | ${siteConfig.siteName}`
  },
  description: publicDescription,
  keywords: [
    siteConfig.personName,
    "Senior Solutions Engineer",
    "Descope",
    "CIAM",
    "OAuth/OIDC",
    "passkeys",
    "FAPI",
    "identity federation",
    "B2B authorization",
    "RBAC",
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
    title: `${siteConfig.siteName} | Senior Solutions Engineer`,
    description: publicDescription,
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.siteName} | Senior Solutions Engineer`,
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
    "CIAM",
    "OAuth/OIDC",
    "Passkeys",
    "FAPI",
    "Identity federation",
    "B2B authorization",
    "RBAC",
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
      <body className={`${quietStudioFont.variable} font-sans`} suppressHydrationWarning>
        <template
          data-impeccable-contract
          dangerouslySetInnerHTML={{ __html: `<!-- ${directionContract} -->` }}
        />
        {children}
        {enableVercelTelemetry && <Analytics />}
        {enableVercelTelemetry && <SpeedInsights />}
      </body>
    </html>
  );
}
