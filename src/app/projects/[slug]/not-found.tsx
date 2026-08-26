import Link from 'next/link';
import { MinimalSiteLayout } from '@/components/layout/MinimalSiteLayout';

export default function ProjectNotFound() {
  return (
    <MinimalSiteLayout activeHref="/projects">
      <div className="minimal-shell minimal-project-not-found">
        <h1>Project not found</h1>
        <p>This project does not exist or is not available.</p>
        <Link href="/projects">Back to projects</Link>
      </div>
    </MinimalSiteLayout>
  );
}
