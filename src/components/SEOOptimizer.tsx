'use client';

import { useEffect } from 'react';

export function SEOOptimizer() {
  useEffect(() => {
    // Add semantic attributes to existing elements
    const addSemanticAttributes = () => {
      // Add main landmark
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.setAttribute('role', 'main');
        mainElement.setAttribute('aria-label', 'Steven Barash Portfolio');
      }

      // Add navigation landmarks
      const navElements = document.querySelectorAll('nav, [role="navigation"]');
      navElements.forEach((nav, index) => {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      });

      // Add article landmarks for content sections
      const contentSections = document.querySelectorAll('.win95-content');
      contentSections.forEach((section, index) => {
        if (!section.closest('article')) {
          const article = document.createElement('article');
          article.setAttribute('role', 'article');
          article.setAttribute('aria-label', `Content Section ${index + 1}`);
          section.parentNode?.insertBefore(article, section);
          article.appendChild(section);
        }
      });

      // Add heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        if (!heading.getAttribute('id')) {
          heading.setAttribute('id', `heading-${index + 1}`);
        }
      });

      // Add alt text to images
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.getAttribute('alt')) {
          img.setAttribute('alt', `Image ${index + 1}`);
        }
        img.setAttribute('loading', 'lazy');
      });

      // Add semantic roles to interactive elements
      const buttons = document.querySelectorAll('button, [role="button"]');
      buttons.forEach((button) => {
        if (!button.getAttribute('aria-label')) {
          const text = button.textContent?.trim();
          if (text) {
            button.setAttribute('aria-label', text);
          }
        }
      });

      // Add skip links for accessibility
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'skip-link';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        transition: top 0.3s;
      `;
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });

      // Add main content id
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.id = 'main-content';
      }

      document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // Add microdata attributes
    const addMicrodata = () => {
      // Add person microdata
      const profileSection = document.querySelector('.profile-section, [data-profile]');
      if (profileSection) {
        profileSection.setAttribute('itemscope', '');
        profileSection.setAttribute('itemtype', 'https://schema.org/Person');
        
        const nameElement = profileSection.querySelector('[data-name]') || profileSection.querySelector('h1, h2');
        if (nameElement) {
          nameElement.setAttribute('itemprop', 'name');
        }
        
        const jobTitleElement = profileSection.querySelector('[data-job-title]') || profileSection.querySelector('p');
        if (jobTitleElement) {
          jobTitleElement.setAttribute('itemprop', 'jobTitle');
        }
        
        const imageElement = profileSection.querySelector('img');
        if (imageElement) {
          imageElement.setAttribute('itemprop', 'image');
        }
      }

      // Add organization microdata
      const companyElement = document.querySelector('[data-company]');
      if (companyElement) {
        companyElement.setAttribute('itemscope', '');
        companyElement.setAttribute('itemtype', 'https://schema.org/Organization');
        companyElement.setAttribute('itemprop', 'worksFor');
        
        const companyName = companyElement.querySelector('[data-company-name]');
        if (companyName) {
          companyName.setAttribute('itemprop', 'name');
        }
      }
    };

    // Add semantic content structure
    const addSemanticStructure = () => {
      // Create a hidden semantic content container
      const semanticContainer = document.createElement('div');
      semanticContainer.setAttribute('aria-hidden', 'true');
      semanticContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
        pointer-events: none;
      `;
      semanticContainer.className = 'semantic-content';

      semanticContainer.innerHTML = `
        <nav aria-label="Breadcrumb navigation">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Portfolio</li>
          </ol>
        </nav>
        
        <section aria-labelledby="expertise-heading">
          <h2 id="expertise-heading">Areas of Expertise</h2>
          <ul>
            <li>Identity Authentication Solutions</li>
            <li>API Integration and Development</li>
            <li>Solutions Architecture</li>
            <li>Professional Photography</li>
            <li>Web Development</li>
            <li>Technical Consulting</li>
          </ul>
        </section>
        
        <section aria-labelledby="services-heading">
          <h2 id="services-heading">Professional Services</h2>
          <ul>
            <li>Solutions Engineering for Identity Platforms</li>
            <li>Technical Consulting for Authentication Systems</li>
            <li>Professional Photography Services</li>
            <li>Web Development and API Integration</li>
          </ul>
        </section>
      `;

      document.body.appendChild(semanticContainer);
    };

    // Execute all optimizations
    addSemanticAttributes();
    addMicrodata();
    addSemanticStructure();

    return () => {
      // Cleanup
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.remove();
      }
      
      const semanticContent = document.querySelector('.semantic-content');
      if (semanticContent) {
        semanticContent.remove();
      }
    };
  }, []);

  return null;
} 