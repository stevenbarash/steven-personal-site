interface ArtifactProps {
  variant: 'preview' | 'detail';
}

export function PersonalSiteArchitectureArtifact({ variant }: ArtifactProps) {
  return (
    <figure className="site-route-map" data-variant={variant}>
      <figcaption>One content system, two public surfaces</figcaption>
      <div className="site-route-map-source">Typed content</div>
      <ul>
        <li><strong>Public routes</strong><span>Work, experience, photography, contact</span></li>
        <li><strong>Optional /desktop</strong><span>Legacy query + hash links</span></li>
      </ul>
    </figure>
  );
}
