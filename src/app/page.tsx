import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';
import { PultProtocolArtifact } from '@/components/projects/PultProtocolArtifact';
import { publishedProjects } from '@/content/projects';
import { createTwitterMetadata } from '@/constants/site';
import { photoLibrary } from '@/data/photos';

const headline = 'I turn complex technical systems into working products, demos, and decisions.';
const supportLine = 'Identity systems, agentic AI, and independent software.';
const selectedProjectSlugs = ['uptick', 'bike-cli'];
const getPublishedProject = (slug: string) => {
  const project = publishedProjects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Published project ${slug} is required for the homepage.`);
  return project;
};
const pultProject = getPublishedProject('pult');
const selectedProjects = selectedProjectSlugs.map(getPublishedProject);
const getPhoto = (id: string) => {
  const photo = photoLibrary.find((item) => item.id === id);
  if (!photo) throw new Error(`Quiet Studio photograph ${id} is missing from the verified photo library.`);
  return photo;
};
const heroPhoto = getPhoto('ig-DC4r__8xPDU');

export const metadata: Metadata = {
  title: 'Steven Barash | Products, Demos, and Technical Systems',
  description: headline,
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Steven Barash | Products, Demos, and Technical Systems',
    description: headline,
  },
  twitter: createTwitterMetadata('Steven Barash | Products, Demos, and Technical Systems', headline),
};

export default function Home() {
  return (
    <MinimalSiteLayout>
      <div className="quiet-studio-home">
        <section className="quiet-studio-hero" aria-labelledby="home-headline" data-quiet-studio-hero>
          <div className="quiet-studio-statement">
            <h1 id="home-headline">{headline}</h1>
            <p>{supportLine}</p>
            <div className="quiet-studio-actions" aria-label="Primary actions">
              <a className="quiet-studio-action-primary" href="#work">See the work</a>
              <Link className="quiet-studio-action-secondary" href="/contact">Contact</Link>
            </div>
          </div>
          <figure className="quiet-studio-hero-photo">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              width={heroPhoto.width}
              height={heroPhoto.height}
              sizes="(max-width: 767px) 100vw, 50vw"
              priority
              data-quiet-studio-image
            />
          </figure>
        </section>

        <section
          id="work"
          className="quiet-studio-bench"
          aria-labelledby="pult-workbench-heading"
          data-pult-workbench
        >
          <header className="quiet-studio-bench-header">
            <h2 id="pult-workbench-heading">On the bench</h2>
            <p>An active project shown through the decision underneath it.</p>
          </header>

          <div className="quiet-studio-bench-layout">
            <article className="quiet-studio-bench-notes" aria-labelledby="pult-workbench-project">
              <h3 id="pult-workbench-project">{pultProject.name}</h3>
              <p className="quiet-studio-bench-summary">{pultProject.problem}</p>
              <dl>
                <div>
                  <dt>Testing</dt>
                  <dd>{pultProject.approach[0]}</dd>
                </div>
                <div>
                  <dt>Hard choice</dt>
                  <dd>{pultProject.hardestDecisions[1]}</dd>
                </div>
                <div>
                  <dt>Constraint</dt>
                  <dd>{pultProject.limitations}</dd>
                </div>
              </dl>
              <div className="quiet-studio-bench-links">
                <Link href="/projects/pult">Read the Pult case study</Link>
                {pultProject.sourceUrl && (
                  <a href={pultProject.sourceUrl} target="_blank" rel="noopener noreferrer">
                    View Pult source
                  </a>
                )}
              </div>
            </article>

            <PultProtocolArtifact className="quiet-studio-protocol" />
          </div>
        </section>

        <section
          id="selected-work"
          className="quiet-studio-work"
          aria-labelledby="selected-work-heading"
          data-quiet-studio-work
        >
          <h2 id="selected-work-heading">Selected work</h2>
          <div className="quiet-studio-work-layout">
            <ul className="quiet-studio-projects">
              {selectedProjects.map((project) => (
                <li key={project.slug}>
                  <h3>
                    <Link href={`/projects/${project.slug}`}>{project.name}</Link>
                  </h3>
                  <p>{project.oneLiner}</p>
                  <Link className="quiet-studio-project-link" href={`/projects/${project.slug}`}>
                    View project
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="quiet-studio-about"
          aria-labelledby="about-heading"
          data-quiet-studio-about
        >
          <div className="quiet-studio-about-intro">
            <h2 id="about-heading">About</h2>
            <Image
              src="/images/profile-portrait.png"
              alt="Illustrated portrait of Steven Barash"
              width={576}
              height={576}
              sizes="(max-width: 767px) 148px, (max-width: 1100px) 20vw, 260px"
              className="quiet-studio-about-portrait"
            />
          </div>
          <div className="quiet-studio-about-copy">
            <p>
              I’m a solutions engineer and builder based in Brooklyn. I work where complex technical
              systems meet real decisions, helping engineering and security teams understand an
              architecture, test it through a working proof of concept, and carry it into production.
              At Descope, that often means customer identity, but the broader thread is turning
              ambiguity into something people can run, evaluate, and trust.
            </p>
            <p>
              Before Descope, I worked at ID.me and spent three and a half years on Okta’s CIAM team.
              I still write code most days, from sample applications and demo environments to internal
              AI tools and independent software. Lately I have been prototyping agentic identity
              concepts for customers and building my own agents.
            </p>
            <p>
              I live in Brooklyn. Away from work, I’m usually riding a bike out of the city, taking
              photographs, or working on another language. Russian is solid; Ukrainian and Spanish
              are works in progress; Korean remains aspirational.
            </p>
            <div className="quiet-studio-about-links">
              <Link href="/resume">View experience</Link>
              <Link href="/photos">View photography</Link>
            </div>
          </div>
        </section>

        <section
          className="quiet-studio-contact"
          aria-labelledby="home-contact-heading"
          data-quiet-studio-contact
        >
          <h2 id="home-contact-heading">Working through a difficult technical decision?</h2>
          <div className="quiet-studio-contact-copy">
            <p>
              Email me about identity architecture, agentic systems, technical evaluations,
              or workshops.
            </p>
            <Link className="quiet-studio-action-primary quiet-studio-contact-link" href="/contact">
              Get in touch
            </Link>
          </div>
        </section>
      </div>
    </MinimalSiteLayout>
  );
}
