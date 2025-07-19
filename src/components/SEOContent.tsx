'use client';

import { useEffect } from 'react';

interface SEOContentProps {
  className?: string;
}

export function SEOContent({ className = '' }: SEOContentProps) {
  useEffect(() => {
    // Add semantic content to the page for better AI understanding
    const seoContent = document.createElement('div');
    seoContent.style.position = 'absolute';
    seoContent.style.left = '-9999px';
    seoContent.style.top = '-9999px';
    seoContent.style.width = '1px';
    seoContent.style.height = '1px';
    seoContent.style.overflow = 'hidden';
    seoContent.style.pointerEvents = 'none';
    seoContent.setAttribute('aria-hidden', 'true');
    seoContent.className = 'seo-content';

    seoContent.innerHTML = `
      <article>
        <header>
          <h1>Steven Barash - Senior Solutions Engineer & Professional Photographer</h1>
          <h2>About Steven Barash</h2>
        </header>
        
        <section>
          <h3>Professional Background</h3>
          <p>Steven Barash is a Senior Solutions Engineer at Descope, a leading identity and authentication platform. He specializes in helping organizations implement secure, scalable authentication solutions. With expertise in API integration, web development, and solutions architecture, Steven works closely with clients to design and implement identity management systems that meet their specific needs.</p>
          
          <h3>Technical Expertise</h3>
          <ul>
            <li>Identity Authentication and Authorization</li>
            <li>API Integration and Development</li>
            <li>Solutions Architecture</li>
            <li>Web Development</li>
            <li>Developer Relations</li>
            <li>Technical Consulting</li>
            <li>Authentication Solutions</li>
            <li>Identity Management</li>
          </ul>
          
          <h3>Photography Portfolio</h3>
          <p>Based in Brooklyn, NYC, Steven is also a professional photographer specializing in creative and commercial photography. His work showcases the vibrant culture and unique character of New York City, with a focus on urban landscapes, street photography, and portrait work.</p>
          
          <h3>Location and Services</h3>
          <p>Steven Barash is located in Brooklyn, New York City, and provides services in:</p>
          <ul>
            <li>Solutions Engineering for Identity Platforms</li>
            <li>Technical Consulting for Authentication Systems</li>
            <li>Professional Photography Services</li>
            <li>Web Development and API Integration</li>
          </ul>
        </section>
        
        <section>
          <h3>Frequently Asked Questions</h3>
          
          <h4>What does Steven Barash do?</h4>
          <p>Steven Barash is a Senior Solutions Engineer at Descope, specializing in identity and authentication solutions. He also works as a professional photographer in Brooklyn, NYC.</p>
          
          <h4>What is Steven Barash's expertise?</h4>
          <p>Steven specializes in identity authentication, solutions engineering, API integration, web development, and professional photography.</p>
          
          <h4>Where is Steven Barash located?</h4>
          <p>Steven Barash is based in Brooklyn, New York City, where he works as both a solutions engineer and photographer.</p>
          
          <h4>What company does Steven Barash work for?</h4>
          <p>Steven Barash works as a Senior Solutions Engineer at Descope, a company specializing in identity and authentication solutions.</p>
          
          <h4>What services does Steven Barash offer?</h4>
          <p>Steven offers solutions engineering services for identity platforms, technical consulting for authentication systems, professional photography services, and web development expertise.</p>
          
          <h4>How can I contact Steven Barash?</h4>
          <p>Steven can be contacted through LinkedIn, GitHub, Instagram, or Twitter for professional inquiries and photography projects.</p>
        </section>
        
        <section>
          <h3>Professional Experience</h3>
          <p>Steven has extensive experience in the technology industry, particularly in identity and authentication solutions. He has worked with various organizations to implement secure, scalable authentication systems and has a deep understanding of modern web development practices.</p>
          
          <h3>Photography Work</h3>
          <p>As a professional photographer in Brooklyn, Steven captures the essence of New York City through his lens. His photography portfolio includes urban landscapes, street photography, portraits, and commercial work that reflects the diverse and dynamic nature of the city.</p>
        </section>
        
        <footer>
          <p>Steven Barash - Senior Solutions Engineer at Descope and Professional Photographer in Brooklyn, NYC. Specializing in identity authentication solutions and creative photography.</p>
        </footer>
      </article>
    `;

    document.body.appendChild(seoContent);

    return () => {
      // Cleanup on unmount
      const existingContent = document.querySelector('.seo-content');
      if (existingContent) {
        existingContent.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
} 