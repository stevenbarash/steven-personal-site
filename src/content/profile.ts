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
  prototyping: string;
  personal: string;
  languages: string;
  portraitUrl: string;
  websiteUrl: string;
}

export const profileContent: ProfileContent = {
  name: siteConfig.personName,
  headline: 'I’m a solutions engineer who writes code.',
  publicDescription: `${siteConfig.personName} is a Senior Solutions Engineer at Descope in Brooklyn, specializing in CIAM, authentication, and authorization. Previously ID.me and Okta.`,
  professionalLabel: 'Senior Solutions Engineer',
  role: 'Senior Solutions Engineer',
  company: 'Descope',
  scope: 'Enterprise CIAM presales across the U.S. East Coast and Europe',
  location: 'Brooklyn, New York',
  background: 'For 6+ years, I’ve helped startups, global enterprises, and government agencies make authentication and authorization decisions, and built the prototypes to test them.',
  protocols: 'Most of my work is CIAM: OAuth 2.0 and OpenID Connect, SAML, WebAuthn/passkeys, SCIM, federation, RBAC, and fine-grained authorization.',
  interests: 'I’m drawn to developer-first identity platforms, agents that automate real go-to-market work, and the craft of demo engineering.',
  prototyping: 'I like turning abstract identity designs into working prototypes: something a team can run, break, and evaluate before committing.',
  personal: 'Outside of work, I’m usually cycling somewhere unnecessarily far away, learning a language (the human spoken kind), or exploring a new place.',
  languages: 'I speak Russian professionally (I’ve delivered demos entirely in Russian), plus some Ukrainian and Spanish, and a little Korean.',
  portraitUrl: '/images/profile-portrait.png',
  websiteUrl: siteConfig.canonicalOrigin,
};
