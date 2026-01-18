import { Inter, Merriweather, Space_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ReactNode } from "react";

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

const spaceMono = Space_Mono({ 
  subsets: ["latin"], 
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: {
    default: "Steven Barash - Sr. Solutions Engineer & Professional Photographer | Brooklyn, NYC",
    template: "%s | Steven Barash - Solutions Engineer & Photographer"
  },
  description: "Steven Barash is a Senior Solutions Engineer at Descope specializing in identity and authentication solutions. Professional photographer based in Brooklyn, NYC with expertise in software engineering, web development, and creative photography. View portfolio, professional experience, and technical projects.",
  keywords: [
    "Steven Barash",
    "Senior Solutions Engineer",
    "Descope",
    "Identity Authentication",
    "Professional Photographer",
    "Brooklyn Photographer",
    "NYC Photographer",
    "Software Engineer",
    "Web Development",
    "Photography Portfolio",
    "Solutions Architecture",
    "Authentication Solutions",
    "Identity Management",
    "Brooklyn",
    "NYC",
    "Technical Consultant",
    "API Integration",
    "Developer Relations"
  ],
  authors: [{ name: "Steven Barash", url: "https://stevenbarash.com" }],
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
    title: 'Steven Barash - Sr. Solutions Engineer & Professional Photographer',
    description: 'Senior Solutions Engineer at Descope specializing in identity authentication. Professional photographer in Brooklyn, NYC. View portfolio and technical expertise.',
    siteName: 'Steven Barash - Solutions Engineer & Photographer',
    images: [
      {
        url: '/images/me.jpg',
        width: 1200,
        height: 630,
        alt: 'Steven Barash - Senior Solutions Engineer and Professional Photographer',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steven Barash - Sr. Solutions Engineer & Professional Photographer',
    description: 'Senior Solutions Engineer at Descope specializing in identity authentication. Professional photographer in Brooklyn, NYC.',
    images: ['/images/me.jpg'],
    creator: '@steven_barash',
    site: '@steven_barash',
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
  category: 'technology',
  classification: 'personal website',
  other: {
    'geo.region': 'US-NY',
    'geo.placename': 'Brooklyn, New York',
    'geo.position': '40.7128;-74.0060',
    'ICBM': '40.7128, -74.0060',
  },
};

// Essential structured data for Person
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Steven Barash",
  "jobTitle": "Senior Solutions Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Descope",
    "url": "https://www.descope.com",
    "description": "Identity and authentication platform"
  },
  "url": "https://stevenbarash.com",
  "image": {
    "@type": "ImageObject",
    "url": "https://stevenbarash.com/images/me.jpg",
    "width": 400,
    "height": 400
  },
  "sameAs": [
    "https://linkedin.com/in/stevenbarash",
    "https://github.com/stevenbarash",
    "https://www.instagram.com/steven.photography",
    "https://www.x.com/steven_barash"
  ],
  "knowsAbout": [
    "Identity Authentication",
    "Solutions Engineering",
    "API Integration",
    "Web Development",
    "Photography",
    "Software Architecture",
    "Developer Relations",
    "Technical Consulting"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brooklyn",
    "addressRegion": "NY",
    "addressCountry": "US"
  },
  "description": "Senior Solutions Engineer at Descope specializing in identity and authentication solutions. Professional photographer based in Brooklyn, NYC."
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vercel.live" />
        
        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="//va.vercel-scripts.com" />
        
        {/* Essential structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          async
        />
        
        {/* Additional meta tags for better SEO */}
        <meta name="author" content="Steven Barash" />
        <meta name="copyright" content="Steven Barash" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#008080" />
        
        {/* Geo tags */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="Brooklyn, New York" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 