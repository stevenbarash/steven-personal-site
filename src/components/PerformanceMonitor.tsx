'use client';

import { useEffect, useState } from 'react';

export const PerformanceMonitor = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only run on client side after hydration
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Track Core Web Vitals
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'LCP', {
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals',
          });
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          console.log('FID:', fid);
          
          if (window.gtag) {
            window.gtag('event', 'FID', {
              value: Math.round(fid),
              event_category: 'Web Vitals',
            });
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
            
            if (window.gtag) {
              window.gtag('event', 'CLS', {
                value: Math.round(clsValue * 1000) / 1000,
                event_category: 'Web Vitals',
              });
            }
          }
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Track Time to First Byte (TTFB)
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart;
            console.log('TTFB:', ttfb);
            
            if (window.gtag) {
              window.gtag('event', 'TTFB', {
                value: Math.round(ttfb),
                event_category: 'Web Vitals',
              });
            }
          }
        });
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });

      // Cleanup observers on unmount
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        navigationObserver.disconnect();
      };
    }
  }, []);

  // Don't render anything during SSR or before hydration
  if (!mounted) {
    return null;
  }

  return null; // This component doesn't render anything
}; 