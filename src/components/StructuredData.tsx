'use client';

import { useEffect } from 'react';

export function StructuredData() {
  useEffect(() => {
    // Organization structured data
    const organizationData = {
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
    };

    // Service structured data
    const serviceData = {
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
    };

    // WebSite structured data
    const websiteData = {
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
    };

    // BreadcrumbList structured data
    const breadcrumbData = {
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
    };

    // Add all structured data scripts
    const addStructuredData = (data: any, id: string) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    addStructuredData(organizationData, 'organization-structured-data');
    addStructuredData(serviceData, 'service-structured-data');
    addStructuredData(websiteData, 'website-structured-data');
    addStructuredData(breadcrumbData, 'breadcrumb-structured-data');

    return () => {
      // Cleanup on unmount
      const scripts = [
        'organization-structured-data',
        'service-structured-data',
        'website-structured-data',
        'breadcrumb-structured-data'
      ];
      
      scripts.forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null;
} 