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
    oneLiner: 'A SwiftUI iPhone remote for my Google TV, built to replace ad-heavy remote apps.',
    problem: 'I lost the physical remote for my Google TV and didn’t want another ad-heavy or paid remote app. Pult (пульт, Russian for “remote”) is the native replacement I built for myself.',
    motivationAudience: 'It pairs an iPhone with a Google TV on the same network. Everything runs locally, with no account or server in between.',
    role: 'Creator and primary developer',
    constraints: [
      'Google TV exposes control only through the Android TV Remote Service v2 protocol, and only on the local network.',
    ],
    approach: [
      'Pult implements the Android TV Remote Service v2 pairing and command protocols directly.',
      'Discovery, pairing, transport, remote commands, system intents, and the SwiftUI interface each live in their own layer.',
    ],
    hardestDecisions: [
      'Protocol and networking code lives apart from the SwiftUI controls, so each layer can be tested and changed on its own.',
      'For such a small protocol surface, hand-rolled protobuf encoding beat taking on SwiftProtobuf as a dependency.',
    ],
    outcomes: ['It is the remote I use and test with my own Google TV. The source is public on GitHub.'],
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
    oneLiner: 'Dependency updates and vulnerability warnings, inline in Zed.',
    problem: 'I wanted to see outdated and vulnerable dependencies in Zed instead of switching to another tool.',
    motivationAudience: 'Uptick is for people editing dependency manifests in Zed who want version and vulnerability answers beside the version number, not in a separate dashboard.',
    role: 'Creator and primary developer',
    constraints: [
      'Editor integration has to fit Zed’s extension model, while dependency analysis needs native networking and parsing.',
      'Six manifest formats are in scope: package.json, Cargo.toml, pubspec.yaml, composer.json, go.mod, and pom.xml.',
    ],
    approach: [
      'The Zed extension stays thin. A Rust language server handles registry lookups and OSV vulnerability analysis.',
      'Results come back through the Language Server Protocol as version hints, diagnostics, links, and update actions.',
    ],
    hardestDecisions: [
      'The split costs installation complexity. What it buys is a hard boundary between editor integration and dependency analysis.',
      'Uptick surfaces registry and OSV data beside the version number and stops there. Dedicated security tooling still owns the full scan.',
    ],
    outcomes: ['The extension and language server are public and under active development, covering six manifest formats.'],
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
    oneLiner: 'Ride weather, Strava, training, and bike maintenance in one terminal tool.',
    problem: 'Ride weather, Strava activity, training guidance, and maintenance tracking lived in separate apps. I spend enough time in the terminal to want them behind one command.',
    motivationAudience: 'Built for my own rides first: one command hierarchy, local data, and output I can read directly or pipe into something else.',
    role: 'Creator and developer',
    constraints: [
      'Output has to work for a person reading it and for scripts consuming JSON or CSV.',
    ],
    approach: [
      'Each job gets its own subcommand group (weather, activity, statistics, training, maintenance) sharing one local configuration.',
      'Open-Meteo supplies weather data and the Strava API supplies activity data; configuration and records stay on my machine.',
    ],
    hardestDecisions: [
      'One CLI for unrelated data sources risks muddle. Grouping commands by job keeps it navigable.',
      'Local configuration means no hosted account to run or trust. Setup and data care fall on whoever runs it, mostly me.',
    ],
    outcomes: ['A working local CLI with documented commands, still evolving as I experiment with it.'],
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
    oneLiner: 'My professional home on the web: plain public pages, plus a working Windows 95 desktop behind the Start button.',
    problem: 'I wanted a site a hiring manager could scan in a minute, without giving up the working Windows 95 desktop I had built for fun.',
    motivationAudience: 'The public pages answer what I do, what I’ve built, and how to reach me. The desktop carries the same content for anyone who would rather open it as programs and files.',
    role: 'Designer and developer',
    constraints: [
      'Two interfaces over the same facts will drift unless both render one shared set of typed content.',
      'Old query and hash links from earlier versions still need to land somewhere sensible.',
    ],
    approach: [
      'Next.js App Router serves stable public routes for experience, projects, photography, and contact.',
      'The Windows 95 desktop renders the same profile, resume, project, photo, and contact catalogs as application windows.',
      'Playwright regression tests cover both interfaces, including the legacy-link redirects.',
    ],
    hardestDecisions: [
      'The desktop is optional on purpose. Nothing important is desktop-only, and every destination keeps a stable URL.',
      'Keeping old links working costs routing code. Broken bookmarks would cost more.',
    ],
    outcomes: ['Live now: these public pages, the desktop at /desktop, and the public source on GitHub.'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Playwright'],
    technologyLine: 'Next.js + React + TypeScript',
    sectionHeadings: {
      motivation: 'Why this site exists',
      mechanism: 'One content model, two interfaces',
      decisions: 'Keeping the desktop optional',
    },
    sourceUrl: `${siteConfig.githubUrl}/steven-personal-site`,
    liveUrl: siteConfig.canonicalOrigin,
    status: 'maintained',
    publicationStatus: 'published',
    evidenceIds: ['personal-site-project'],
    limitations: 'The desktop is a faithful toy, not the fastest way to read a resume. That is what the public pages are for.',
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
