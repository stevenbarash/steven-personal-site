import { siteConfig } from '@/constants/site';

export interface ProfileContent {
  name: string;
  headline: string;
  professionalLabel: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  capabilityLine: string;
  portraitUrl: string;
  websiteUrl: string;
}

export const profileContent: ProfileContent = {
  name: siteConfig.personName,
  headline: 'I’m a solutions engineer who writes code.',
  professionalLabel: 'Solutions Engineer',
  role: 'Senior Solutions Engineer',
  company: 'Descope',
  location: 'Brooklyn, New York',
  summary: 'I’m a Senior Solutions Engineer with 6+ years of experience in identity, developer platforms, and technical GTM. I turn authentication and authorization requirements into architectures, prototypes, and production-ready solutions for startups, global enterprises, and government agencies. At Descope, I lead enterprise CIAM presales across the U.S. East Coast and Europe. Previously, I worked at ID.me and Okta.',
  capabilityLine: 'Prototypes & Integrations · Architecture & Debugging · Demos & Enablement · POCs & Automation',
  portraitUrl: '/images/profile-portrait.png',
  websiteUrl: siteConfig.canonicalOrigin,
};
