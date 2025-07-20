import { Inter, Merriweather } from "next/font/google";
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
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
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
          async
        />
        
        {/* Structured data for CreativeWork */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkData) }}
          async
        />
        
        {/* FAQ structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
          async
        />

        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Steven Barash",
            "url": "https://stevenbarash.com",
            "logo": "https://stevenbarash.com/images/sb-logo.svg",
            "description": "Senior Solutions Engineer and Professional Photographer based in Brooklyn, NYC",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Brooklyn",
              "addressRegion": "NY",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "professional",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://linkedin.com/in/stevenbarash",
              "https://github.com/stevenbarash",
              "https://www.instagram.com/steven.photography",
              "https://www.x.com/steven_barash"
            ]
          }) }}
          async
        />

        {/* Service structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Solutions Engineering Services",
            "provider": {
              "@type": "Person",
              "name": "Steven Barash"
            },
            "description": "Identity authentication solutions engineering and technical consulting services",
            "serviceType": "Solutions Engineering",
            "areaServed": {
              "@type": "Place",
              "name": "Brooklyn, New York"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Professional Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Identity Authentication Solutions",
                    "description": "Implementation of secure authentication systems"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "API Integration",
                    "description": "Custom API development and integration services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Professional Photography",
                    "description": "Creative and commercial photography services"
                  }
                }
              ]
            }
          }) }}
          async
        />

        {/* WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Steven Barash - Solutions Engineer & Photographer",
            "url": "https://stevenbarash.com",
            "description": "Personal website of Steven Barash, Senior Solutions Engineer at Descope and professional photographer in Brooklyn, NYC",
            "author": {
              "@type": "Person",
              "name": "Steven Barash"
            },
            "publisher": {
              "@type": "Person",
              "name": "Steven Barash"
            },
            "inLanguage": "en-US",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://stevenbarash.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }) }}
          async
        />

        {/* BreadcrumbList structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://stevenbarash.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": "https://stevenbarash.com/about"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Portfolio",
                "item": "https://stevenbarash.com/portfolio"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Contact",
                "item": "https://stevenbarash.com/contact"
              }
            ]
          }) }}
          async
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
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
        <PerformanceMonitor />
        
        {/* GEO Content for SEO - Hidden from view but accessible to search engines */}
        <div 
          aria-hidden="true" 
          className="geo-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          <article>
            <header>
              <h1>Steven Barash - Senior Solutions Engineer & Professional Photographer</h1>
              <p>Comprehensive guide about Steven Barash's professional services and expertise</p>
            </header>

            <section>
              <h2>Who is Steven Barash?</h2>
              <p>Steven Barash is a Senior Solutions Engineer at Descope, a leading identity and authentication platform. He is also a professional photographer based in Brooklyn, New York City. With expertise in identity authentication, API integration, and solutions architecture, Steven helps organizations implement secure, scalable authentication solutions.</p>
            </section>

            <section>
              <h2>What does Steven Barash do?</h2>
              <p>Steven Barash works as a Senior Solutions Engineer at Descope, specializing in identity and authentication solutions. His role involves helping clients implement secure authentication systems, providing technical consulting, and developing API integrations. Additionally, he works as a professional photographer in Brooklyn, NYC, offering creative and commercial photography services.</p>
            </section>

            <section>
              <h2>Steven Barash's Professional Background</h2>
              <p>Steven has extensive experience in the technology industry, particularly in identity and authentication solutions. He has worked with various organizations to implement secure, scalable authentication systems and has a deep understanding of modern web development practices. His expertise includes API integration, solutions architecture, and developer relations.</p>
            </section>

            <section>
              <h2>Steven Barash's Technical Expertise</h2>
              <ul>
                <li>Identity Authentication and Authorization Systems</li>
                <li>API Integration and Development</li>
                <li>Solutions Architecture and Design</li>
                <li>Web Development and Frontend Technologies</li>
                <li>Developer Relations and Technical Consulting</li>
                <li>Authentication Solutions Implementation</li>
                <li>Identity Management Systems</li>
                <li>Security Best Practices</li>
              </ul>
            </section>

            <section>
              <h2>Steven Barash's Photography Services</h2>
              <p>As a professional photographer in Brooklyn, Steven specializes in creative and commercial photography. His work includes urban landscapes, street photography, portraits, and commercial projects. He captures the vibrant culture and unique character of New York City through his lens.</p>
            </section>

            <section>
              <h2>Where is Steven Barash located?</h2>
              <p>Steven Barash is based in Brooklyn, New York City. He provides both solutions engineering services and photography services in the New York metropolitan area and remotely for clients worldwide.</p>
            </section>

            <section>
              <h2>Steven Barash's Company and Role</h2>
              <p>Steven works as a Senior Solutions Engineer at Descope, a company specializing in identity and authentication solutions. Descope provides a comprehensive platform for implementing secure authentication systems, and Steven helps clients integrate and optimize these solutions for their specific needs.</p>
            </section>

            <section>
              <h2>Steven Barash's Services</h2>
              <ul>
                <li>Solutions Engineering for Identity Platforms</li>
                <li>Technical Consulting for Authentication Systems</li>
                <li>API Integration and Development</li>
                <li>Professional Photography Services</li>
                <li>Web Development and Frontend Solutions</li>
                <li>Developer Relations and Support</li>
              </ul>
            </section>

            <section>
              <h2>How to contact Steven Barash</h2>
              <p>Steven can be contacted through various professional channels:</p>
              <ul>
                <li>LinkedIn: https://www.linkedin.com/in/stevenbarash</li>
                <li>GitHub: https://github.com/stevenbarash</li>
                <li>Instagram: https://www.instagram.com/steven.photography</li>
                <li>Twitter: https://www.x.com/steven_barash</li>
              </ul>
            </section>

            <section>
              <h2>Steven Barash's Professional Experience</h2>
              <p>Steven has worked in the technology industry for several years, focusing on identity and authentication solutions. He has experience with various authentication platforms and has helped numerous organizations implement secure, user-friendly authentication systems. His background includes both technical implementation and client-facing consulting roles.</p>
            </section>

            <section>
              <h2>Steven Barash's Photography Portfolio</h2>
              <p>Steven's photography work showcases the diverse and dynamic nature of New York City. His portfolio includes urban landscapes, street photography, portraits, and commercial work. He has a unique perspective on capturing the essence of Brooklyn and the broader NYC area.</p>
            </section>

            <section>
              <h2>Frequently Asked Questions About Steven Barash</h2>
              
              <h3>What is Steven Barash's job title?</h3>
              <p>Steven Barash is a Senior Solutions Engineer at Descope.</p>
              
              <h3>What company does Steven Barash work for?</h3>
              <p>Steven Barash works for Descope, a company specializing in identity and authentication solutions.</p>
              
              <h3>What are Steven Barash's skills?</h3>
              <p>Steven's skills include identity authentication, API integration, solutions architecture, web development, and professional photography.</p>
              
              <h3>Where does Steven Barash live?</h3>
              <p>Steven Barash lives in Brooklyn, New York City.</p>
              
              <h3>What services does Steven Barash offer?</h3>
              <p>Steven offers solutions engineering services, technical consulting, API integration, and professional photography services.</p>
              
              <h3>How can I hire Steven Barash?</h3>
              <p>You can contact Steven through LinkedIn, GitHub, Instagram, or Twitter for professional inquiries and photography projects.</p>
              
              <h3>What is Steven Barash's expertise?</h3>
              <p>Steven specializes in identity authentication solutions, API integration, solutions architecture, and professional photography.</p>
              
              <h3>Does Steven Barash do photography?</h3>
              <p>Yes, Steven is a professional photographer based in Brooklyn, NYC, offering creative and commercial photography services.</p>
            </section>

            <footer>
              <p>Steven Barash - Senior Solutions Engineer at Descope and Professional Photographer in Brooklyn, NYC. Specializing in identity authentication solutions and creative photography services.</p>
            </footer>
          </article>
        </div>
      </body>
    </html>
  );
} 