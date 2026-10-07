import { ResumeData } from '@/types';
import { siteConfig } from '@/constants/site';

export const resumeSkillGroups = [
  {
    name: 'Identity',
    skills: [
      'Identity & Access Management (IAM)',
      'Customer Identity & Access Management (CIAM)',
      'Authentication Strategy & Identity Architecture',
      'OAuth 2.0',
      'OIDC',
      'SAML',
      'Multi-Factor Authentication (MFA)',
      'WebAuthn / Passkeys',
      'SCIM',
      'Identity Federation',
      'B2B Authorization',
      'Role-Based Access Control (RBAC)',
      'Fine-Grained Authorization (FGA)',
      'Identity Migrations',
    ],
  },
  {
    name: 'Technical strategy',
    skills: [
      'Technical Deal Strategy & Unusual Enterprise Requirements',
      'Solutions Architecture',
      'Demo Storytelling Linked to Business Value',
      'POC Scoping, Success Criteria & Validation',
      'Technical Wins',
      'SE / AE Technical Enablement',
      'Developer-First Platforms & AI-Enabled GTM',
    ],
  },
  {
    name: 'Building',
    skills: [
      'Demo Engineering, Automation & Repeatability',
      'Rapid API / SDK Prototypes & Integrations',
      'MCP / Agent Prototypes & Integrations',
      'Complex Authentication & Integration Debugging',
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'Java',
      'C#',
      'SQL',
      'HTML / CSS',
    ],
  },
] as const;

export const resumeData: ResumeData = {
  summary:
    'For 6+ years, I’ve worked across identity, developer platforms, and technical GTM. I turn authentication and authorization requirements into architectures, prototypes, and production-ready solutions for startups, global enterprises, and government agencies. I’m particularly interested in developer-first platforms, AI-enabled GTM, and demo engineering and automation.',

  contact: {
    email: siteConfig.emailDisplay,
    linkedin: siteConfig.linkedinUrl,
    website: siteConfig.canonicalOrigin,
  },

  experience: [
    {
      company: 'Descope',
      logoSrc: '/images/logos/descope.png',
      companyUrl: 'https://www.descope.com',
      roles: [
        {
          title: 'Sr. Solutions Engineer',
          startDate: 'January 2025',
          endDate: 'Present',
          location: 'New York, NY',
        },
      ],
      bullets: [
        'Lead enterprise CIAM presales across the U.S. East Coast and Europe, partnering with engineering, security, and product teams',
        'Build reference implementations, sample applications, and automated demos to validate architectures and accelerate technical evaluations',
        'Advise teams on authentication, authorization, federation, and progressive onboarding for B2C and B2B products',
        'Bring customer feedback to the product team and help set roadmap priorities',
        'Translate ambiguous requirements and unusual integration constraints into identity architectures, POCs, and practical implementation plans',
      ],
    },
    {
      company: 'ID.me',
      logoSrc: '/images/logos/idme.png',
      companyUrl: 'https://www.id.me',
      roles: [
        {
          title: 'Sr. Solutions Engineer',
          startDate: 'January 2024',
          endDate: 'January 2025',
          location: 'New York, NY',
        },
      ],
      bullets: [
        'Worked across presales and post-sales on identity integrations and customer implementations',
        'Worked on a multi-phase identity deployment for a large state agency that became the company’s largest deal closed that fiscal year',
        'Built prototypes and custom demos for customer evaluations and brought product feedback to internal teams',
      ],
    },
    {
      company: 'Okta',
      logoSrc: '/images/logos/okta.png',
      companyUrl: 'https://www.okta.com',
      roles: [
        {
          title: 'Solutions Engineer',
          startDate: 'March 2023',
          endDate: 'January 2024',
          location: 'New York, NY',
        },
        {
          title: 'Associate Solutions Engineer',
          startDate: 'November 2021',
          endDate: 'March 2023',
          location: 'New York, NY',
        },
        {
          title: 'Analyst Solutions Engineer, CIAM Specialist',
          startDate: 'June 2020',
          endDate: 'November 2021',
          location: 'New York, NY',
        },
      ],
      bullets: [
        'Consistently ranked at the top of my segment',
        '2x President\'s Club (2022 + 2023)',
        'Awarded Solutions Engineer of the Year FY23',
        'Gave demos entirely in Russian to Russian-speaking developer teams based in Armenia',
      ],
    },
    {
      company: 'University of Pittsburgh, Swanson School of Engineering',
      logoSrc: '/images/logos/pitt.png',
      companyUrl: 'https://www.engineering.pitt.edu',
      roles: [
        {
          title: 'Web Developer Intern',
          startDate: 'September 2018',
          endDate: 'May 2020',
          location: 'Pittsburgh, PA',
        },
      ],
      bullets: [
        'Built laboratory and faculty webpages with HTML, CSS, and JavaScript',
        'Trained faculty and staff on how to edit their webpages',
        'Met with faculty and staff to create specifications for new webpages',
      ],
    },
    {
      company: 'Innovative Systems, Inc.',
      logoSrc: '/images/logos/innovative.png',
      roles: [
        {
          title: 'Software Engineering Intern',
          startDate: 'May 2019',
          endDate: 'August 2019',
          location: 'Pittsburgh, PA',
        },
      ],
      bullets: [
        'Built a dataset profiling tool with a team for an international customer',
        'Built simulations of competitors\' algorithms from publicly available documentation',
        'Ported JavaScript code to TypeScript',
        'Built UI components in React',
      ],
    },
    {
      company: 'Federated Hermes',
      logoSrc: '/images/logos/federated.png',
      roles: [
        {
          title: 'Software Developer Intern',
          startDate: 'May 2018',
          endDate: 'August 2018',
          location: 'Pittsburgh, PA',
        },
      ],
      bullets: [
        'Built web services with Java, Spring Framework, and Oracle SQL',
        'Automated content entry into the CMS using the Selenium framework',
        'Documented web service APIs',
        'Redesigned and redeveloped the company\'s internal website at an intern hackathon',
      ],
    },
    {
      company: 'University of Pittsburgh',
      logoSrc: '/images/logos/pitt.png',
      roles: [
        {
          title: 'IT Support Assistant',
          startDate: 'July 2016',
          endDate: 'August 2018',
          location: 'Pittsburgh, PA',
        },
      ],
      bullets: [
        'Installed and configured computer software and hardware',
        'Troubleshot hardware and software as needed',
        'Entered inventory of computers into a database',
      ],
    },
    {
      company: 'Carnegie Mellon University',
      logoSrc: '/images/logos/cmu.png',
      companyUrl: 'https://www.cmu.edu',
      roles: [
        {
          title: 'Computer Hardware Research Intern',
          startDate: 'November 2014',
          endDate: 'May 2016',
          location: 'Electrical and Computer Engineering Dept.',
        },
      ],
      bullets: [
        'Researched Dynamic Random-Access Memory errors within Carnegie Mellon\'s Electrical and Computer Engineering Dept.',
        'Built Java tools to parse and analyze experimental data',
      ],
    },
  ],

  education: [
    {
      institution: 'University of Pittsburgh, School of Computing and Information',
      degree: "Bachelor's Degree",
      field: 'Information Science',
      dates: '2016 to 2020',
    }
  ],

  skills: resumeSkillGroups.flatMap(({ skills }) => [...skills]),

  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Russian', proficiency: 'Full Professional' },
    { name: 'Surzhyk', proficiency: 'Professional Working' },
    { name: 'Ukrainian', proficiency: 'Limited Working' },
    { name: 'Spanish', proficiency: 'Limited Working' },
    { name: 'Korean', proficiency: 'Basic' },
  ],

  honors: [
    'Solutions Engineer of the Year FY23, Okta',
    "President's Club 2023, Okta",
    "President's Club 2022, Okta",
    'First Place Winner, Pitt Challenge Hackathon',
    'Second Place Winner, Pitt Blast Furnace Demo Day',
  ],
};
