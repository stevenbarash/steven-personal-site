import { Inter, Merriweather } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const merriweather = Merriweather({ 
  subsets: ["latin"], 
  variable: '--font-merriweather', 
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: {
    default: "Steven Barash - Sr. Solutions Engineer & Photographer",
    template: "%s | Steven Barash"
  },
  description: "Personal website of Steven Barash, Sr. Solutions Engineer at ID.me and photographer based in Brooklyn, NYC. Explore my work, photography, and professional experience.",
  keywords: [
    "Steven Barash",
    "Solutions Engineer",
    "ID.me",
    "Photographer",
    "Brooklyn",
    "NYC",
    "Software Engineer",
    "Web Development",
    "Photography"
  ],
  authors: [{ name: "Steven Barash" }],
  creator: "Steven Barash",
  publisher: "Steven Barash",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stevenbarash.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stevenbarash.com',
    title: 'Steven Barash - Sr. Solutions Engineer & Photographer',
    description: 'Personal website of Steven Barash, Sr. Solutions Engineer at ID.me and photographer based in Brooklyn, NYC.',
    siteName: 'Steven Barash',
    images: [
      {
        url: '/images/me.jpg',
        width: 1200,
        height: 630,
        alt: 'Steven Barash - Sr. Solutions Engineer & Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steven Barash - Sr. Solutions Engineer & Photographer',
    description: 'Personal website of Steven Barash, Sr. Solutions Engineer at ID.me and photographer based in Brooklyn, NYC.',
    images: ['/images/me.jpg'],
    creator: '@stevenbarash',
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
  verification: {
    google: 'your-google-verification-code',
  },
};

// Structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Steven Barash",
  "jobTitle": "Sr. Solutions Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "ID.me"
  },
  "url": "https://stevenbarash.com",
  "image": "/images/me.jpg",
  "sameAs": [
    "https://linkedin.com/in/stevenbarash",
    "https://github.com/stevenbarash"
  ],
  "knowsAbout": [
    "Software Engineering",
    "Solutions Architecture",
    "Photography",
    "Web Development"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brooklyn",
    "addressRegion": "NY",
    "addressCountry": "US"
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vercel.live" />
        
        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="//va.vercel-scripts.com" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <ThemeProvider attribute="class">
        <body className="font-sans dark:bg-background-dark dark:text-text-dark">
          {children}
          <Analytics />
          <SpeedInsights />
          <PerformanceMonitor />
        </body>
      </ThemeProvider>
    </html>
  );
} 