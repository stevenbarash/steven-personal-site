import { siteConfig } from '@/constants/site';

export interface ProfileContent {
  name: string;
  headline: string;
  publicDescription: string;
  professionalLabel: string;
  role: string;
  company: string;
  scope: string;
  location: string;
  background: string;
  protocols: string;
  interests: string;
  personal: string;
  languages: string;
  portraitUrl: string;
  websiteUrl: string;
}

export const profileContent: ProfileContent = {
  name: siteConfig.personName,
  headline: 'I help customers see what’s possible and build it with them.',
  publicDescription: `${siteConfig.personName} is a Senior Solutions Engineer at Descope, working with customers on authentication and authorization for users and AI agents. Based in Brooklyn.`,
  professionalLabel: 'Senior Solutions Engineer',
  role: 'Senior Solutions Engineer',
  company: 'Descope',
  scope: 'Enterprise CIAM presales across the U.S. East Coast and Europe',
  location: 'Brooklyn, New York',
  background: 'For 6+ years, I’ve worked with startups, global enterprises, and government agencies to figure out how identity should work in their products. I help teams work through authentication and authorization decisions, then build prototypes so we can test the approach together.',
  protocols: 'My background is in customer identity (CIAM), and I also work on identity for AI agents. I know my way around web and mobile apps, backend systems, and SDK development. I enjoy working through product questions too, especially how the technical decisions affect the people using what we build.',
  interests: 'I’m drawn to developer tools that make hard problems easier to work through. Lately, that means identity for AI agents, agents that automate go-to-market work, and demos that help customers understand how something would work in their own environment.',
  personal: 'Outside of work, I’m usually cycling somewhere unnecessarily far away, learning a language (the human spoken kind), or exploring a new place.',
  languages: 'I speak Russian professionally (I’ve delivered demos entirely in Russian), plus some Ukrainian and Spanish, and a little Korean.',
  portraitUrl: '/images/profile-photo.png',
  websiteUrl: siteConfig.canonicalOrigin,
};
