import { siteConfig } from '@/constants/site';

export interface ProfileContent {
  name: string;
  headline: string;
  professionalLabel: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  background: string;
  protocols: string;
  interests: string;
  prototyping: string;
  personal: string;
  languages: string;
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
  background: 'I’ve spent 6+ years in identity, developer platforms, and technical GTM. I work with early-stage startups, global enterprises, and government agencies.',
  protocols: 'My technical background includes OAuth 2.0, OpenID Connect, SAML, WebAuthn/passkeys, SCIM, identity federation, CIAM, RBAC, and fine-grained authorization.',
  interests: 'Developer-first platforms, AI-enabled GTM, building agents, demo engineering, and automation.',
  prototyping: 'I like using rapid prototyping to make complex technical ideas tangible: something a team can build, try, and evaluate.',
  personal: 'Outside of work, I’m usually cycling somewhere unnecessarily far away, learning a language (the human spoken kind), or exploring a new place.',
  languages: 'I speak Russian, some Ukrainian and Spanish, and a little Korean.',
  capabilityLine: 'Prototypes & Integrations · Architecture & Debugging · Demos & Enablement · POCs & Automation',
  portraitUrl: '/images/profile-portrait.png',
  websiteUrl: siteConfig.canonicalOrigin,
};
