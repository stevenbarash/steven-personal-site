import { siteConfig } from '@/constants/site';
import { selectPublished, type PublicationStatus } from '@/content/site';

export type ProjectStatus =
  | 'active'
  | 'maintained'
  | 'experimental'
  | 'archived'
  | 'reference';

export interface ProjectCaseStudy {
  slug: string;
  name: string;
  oneLiner: string;
  problem: string;
  motivationAudience: string;
  role: string;
  constraints: string[];
  approach: string[];
  hardestDecisions: string[];
  outcomes: string[];
  technologies: string[];
  technologyLine: string;
  sectionHeadings: {
    motivation: string;
    mechanism: string;
    decisions: string;
  };
  sourceUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  publicationStatus: PublicationStatus;
  evidenceIds: string[];
  limitations: string;
  featured: boolean;
}

export const projectCatalog: ProjectCaseStudy[] = [
  {
    slug: 'pult',
    name: 'Pult',
    oneLiner: 'A SwiftUI iPhone remote I built and test with my Google TV.',
    problem: 'I wanted an iPhone remote for my Google TV without installing another ad-supported app.',
    motivationAudience: 'I built Pult for that specific job: pairing an iPhone with a Google TV on the same network and using a native remote interface.',
    role: 'Creator and primary developer',
    constraints: [
      'It communicates with Google TV hardware over the local network.',
    ],
    approach: [
      'Pult implements the Android TV Remote Service v2 pairing and command protocols.',
      'Discovery, pairing, transport, remote commands, system intents, and the SwiftUI interface stay in separate layers.',
    ],
    hardestDecisions: [
      'Keeping the networking and protocol code separate from the SwiftUI controls adds structure, but makes each part easier to test and change.',
      'Pult uses hand-rolled protobuf encoding for the small protocol surface instead of adding SwiftProtobuf as a dependency.',
    ],
    outcomes: ['The code is public, and the project is still active.'],
    technologies: ['Swift', 'SwiftUI', 'App Intents'],
    technologyLine: 'Swift + SwiftUI',
    sectionHeadings: {
      motivation: 'Why Pult exists',
      mechanism: 'Pairing and control',
      decisions: 'Protocol choices',
    },
    sourceUrl: `${siteConfig.githubUrl}/pult`,
    status: 'active',
    publicationStatus: 'published',
    evidenceIds: ['pult-project'],
    limitations: 'Not on the App Store. Physical-device compatibility is documented per TV in the repository.',
    featured: true,
  },
  {
    slug: 'uptick',
    name: 'Uptick',
    oneLiner: 'A Zed extension for dependency updates and known vulnerability context.',
    problem: 'I wanted to see outdated and vulnerable dependencies in Zed instead of switching to another tool.',
    motivationAudience: 'Uptick is for people who work in Zed and want version and vulnerability details beside the dependencies they are already editing.',
    role: 'Creator and primary developer',
    constraints: [
      'Uptick supports package.json, Cargo.toml, pubspec.yaml, composer.json, go.mod, and pom.xml.',
      'The editor integration must fit Zed’s extension model while the analysis needs native networking and parsing code.',
    ],
    approach: [
      'The Zed extension is intentionally thin. A Rust language server handles registry lookups and vulnerability analysis.',
      'The language server returns version hints, diagnostics, links, and update actions through the Language Server Protocol.',
    ],
    hardestDecisions: [
      'Splitting the extension from the language server adds installation work, but keeps editor integration separate from dependency analysis.',
      'Uptick presents registry and OSV data in the editor rather than trying to replace a dedicated dependency or security tool.',
    ],
    outcomes: ['The extension and language server are public and actively developed.'],
    technologies: ['Rust', 'Zed Extension API', 'Language Server Protocol', 'OSV'],
    technologyLine: 'Rust + Zed Extension API + LSP',
    sectionHeadings: {
      motivation: 'Why Uptick exists',
      mechanism: 'Inside the extension',
      decisions: 'Editor integration',
    },
    sourceUrl: `${siteConfig.githubUrl}/uptick-zed`,
    status: 'active',
    publicationStatus: 'published',
    evidenceIds: ['uptick-zed-project'],
    limitations: 'OSV results are useful context, not a complete security scan. Uptick does not claim to find every dependency or vulnerability.',
    featured: true,
  },
  {
    slug: 'bike-cli',
    name: 'bike-cli',
    oneLiner: 'One terminal tool for ride weather, Strava activity, training guidance, and bike maintenance.',
    problem: 'I wanted one terminal tool for ride weather, Strava activity, training recommendations, and bike maintenance.',
    motivationAudience: 'I built it around my own preference for keeping these cycling tasks in a terminal instead of moving between several apps.',
    role: 'Creator and developer',
    constraints: [
      'Commands need useful terminal output as well as JSON and CSV for further processing.',
    ],
    approach: [
      'The command hierarchy groups ride weather, Strava activity, statistics, training recommendations, and maintenance in one CLI.',
      'Open-Meteo supplies weather guidance, the Strava API supplies activity data, and local configuration and data keep the tool self-contained.',
    ],
    hardestDecisions: [
      'One command hierarchy is convenient, but the tool still has to keep unrelated data sources and output formats understandable.',
      'Local configuration avoids a hosted account, but puts setup and data management on the person running the CLI.',
    ],
    outcomes: ['The repository contains the working CLI and its command documentation. I am still experimenting with it locally.'],
    technologies: ['Node.js', 'JavaScript', 'Strava API', 'Open-Meteo'],
    technologyLine: 'Node.js + Strava API + Open-Meteo',
    sectionHeadings: {
      motivation: 'Why bike-cli exists',
      mechanism: 'Commands and data',
      decisions: 'Local by design',
    },
    sourceUrl: `${siteConfig.githubUrl}/bike-cli`,
    status: 'experimental',
    publicationStatus: 'published',
    evidenceIds: ['bike-cli-project'],
    limitations: 'bike-cli is an experimental local CLI. It is not a hosted service, a production system, or a validated training tool.',
    featured: true,
  },
  {
    slug: 'personal-site',
    name: 'Personal Site',
    oneLiner: 'A personal site with a working Windows 95 desktop and straightforward public routes.',
    problem: 'A normal grid of portfolio cards did not feel like me, so I built a working Windows 95 desktop.',
    motivationAudience: 'The site gives people evaluating my work a direct way to read about my experience, projects, photography, and contact details.',
    role: 'Designer and developer',
    constraints: [
      'The Windows 95 version needs to behave like a desktop on large and small screens.',
      'Important destinations need stable URLs without breaking old query and hash links.',
    ],
    approach: [
      'The site uses the Next.js App Router, typed content, and Playwright regression tests.',
      'The public pages use stable routes while the desktop keeps old query and hash links working.',
    ],
    hardestDecisions: [
      'The desktop is deliberately unusual, so the main site also needs plain document routes that are easy to navigate and read.',
      'Maintaining old links adds routing work, but avoids turning a redesign into a set of broken bookmarks.',
    ],
    outcomes: ['You are looking at the live site. Its source is public on GitHub.'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Playwright'],
    technologyLine: 'Next.js + React + TypeScript',
    sectionHeadings: {
      motivation: 'Why this site exists',
      mechanism: 'Design and routing',
      decisions: 'Keeping the desktop optional',
    },
    sourceUrl: `${siteConfig.githubUrl}/steven-personal-site`,
    liveUrl: siteConfig.canonicalOrigin,
    status: 'maintained',
    publicationStatus: 'published',
    evidenceIds: ['personal-site-project'],
    limitations: 'The Windows 95 interface is optional; the same core content remains available through conventional public routes.',
    featured: true,
  },
  {
    slug: 'future-case-study',
    name: 'Future Case Study',
    oneLiner: 'A reserved draft used to verify publication boundaries.',
    problem: 'Keep unfinished project material out of public project pages.',
    motivationAudience: 'An internal editorial fixture, not public portfolio content.',
    role: 'Editorial fixture',
    constraints: ['Remain excluded until explicitly published.'],
    approach: ['Exercise the same typed catalog projection as real entries.'],
    hardestDecisions: ['Keep draft filtering at the shared publication boundary.'],
    outcomes: ['Provides a regression fixture for draft filtering.'],
    technologies: ['TypeScript'],
    technologyLine: 'TypeScript',
    sectionHeadings: {
      motivation: 'Editorial purpose',
      mechanism: 'Publication filtering',
      decisions: 'Keeping drafts private',
    },
    status: 'reference',
    publicationStatus: 'draft',
    evidenceIds: [],
    limitations: 'Draft fixture only.',
    featured: false,
  },
];

/** Only explicitly published entries are eligible for generated surfaces. */
export const publishedProjects = selectPublished(projectCatalog);
