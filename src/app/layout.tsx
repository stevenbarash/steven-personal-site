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

// Enhanced structured data for better SEO and GEO
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
    "Technical Consulting",
    "Authentication Solutions",
    "Identity Management"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Senior Solutions Engineer",
    "description": "Specializing in identity and authentication solutions"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brooklyn",
    "addressRegion": "NY",
    "addressCountry": "US"
  },
  "alumniOf": {
    "@type": "Organization",
    "name": "ID.me"
  },
  "description": "Senior Solutions Engineer at Descope specializing in identity and authentication solutions. Professional photographer based in Brooklyn, NYC.",
  "knowsLanguage": ["English"],
  "nationality": "American"
};

// Additional structured data for CreativeWork (Photography)
const creativeWorkData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Steven Barash Photography Portfolio",
  "author": {
    "@type": "Person",
    "name": "Steven Barash"
  },
  "description": "Professional photography portfolio showcasing creative work in Brooklyn, NYC",
  "url": "https://stevenbarash.com",
  "genre": "Photography",
  "keywords": "photography, portfolio, Brooklyn, NYC, professional photographer",
  "inLanguage": "en-US",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split('T')[0]
};

// FAQ structured data for better AI understanding
const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does Steven Barash do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Steven Barash is a Senior Solutions Engineer at Descope, specializing in identity and authentication solutions. He also works as a professional photographer in Brooklyn, NYC."
      }
    },
    {
      "@type": "Question",
      "name": "What is Steven Barash's expertise?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Steven specializes in identity authentication, solutions engineering, API integration, web development, and professional photography."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Steven Barash located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Steven Barash is based in Brooklyn, New York City, where he works as both a solutions engineer and photographer."
      }
    },
    {
      "@type": "Question",
      "name": "What company does Steven Barash work for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Steven Barash works as a Senior Solutions Engineer at Descope, a company specializing in identity and authentication solutions."
      }
    }
  ]
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
        
        {/* Structured data for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Structured data for CreativeWork */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkData) }}
        />
        
        {/* FAQ structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
        />
        
        {/* Additional meta tags for better SEO */}
        <meta name="author" content="Steven Barash" />
        <meta name="copyright" content="Steven Barash" />
        <meta name="language" content="English" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#008080" />
        
        {/* Geo tags */}
        <meta name="geo.region" content="US-NY" />
        <meta name="geo.placename" content="Brooklyn, New York" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
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