import { siteConfig } from '@/constants/site';

export interface ProfileContent {
  name: string;
  headline: string;
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
  headline: 'I turn complex technical systems into working products, demos, and decisions.',
  role: 'Senior Solutions Engineer',
  company: 'Descope',
  location: 'Brooklyn, New York',
  summary: `I’m ${siteConfig.personName}, a Senior Solutions Engineer at Descope. Before that, I worked at Okta/Auth0 and ID.me. My deepest areas are identity and agentic AI, and I also build independent software to make technical ideas concrete.`,
  capabilityLine: 'Identity Systems · Agentic AI · Technical Prototyping · Independent Software',
  portraitUrl: '/images/profile-portrait.png',
  websiteUrl: siteConfig.canonicalOrigin,
};
