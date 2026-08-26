interface ArtifactProps {
  variant: 'preview' | 'detail';
}

export function UptickFlowArtifact({ variant }: ArtifactProps) {
  return (
    <figure className="uptick-flow" data-variant={variant}>
      <figcaption>Extension and analysis path</figcaption>
      <ol>
        <li>Dependency file in Zed</li>
        <li>Thin Zed extension</li>
        <li>Rust language server</li>
        <li>Registry data + OSV</li>
      </ol>
      <p>Hints, diagnostics, links, and update actions through LSP</p>
    </figure>
  );
}
