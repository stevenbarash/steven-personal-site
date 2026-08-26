interface ArtifactProps {
  variant: 'preview' | 'detail';
}

export function BikeCliArtifact({ variant }: ArtifactProps) {
  return (
    <figure className="bike-cli-specimen" data-variant={variant}>
      <figcaption>One command, three output formats</figcaption>
      <dl>
        <div><dt>Readable</dt><dd><code>bike now</code></dd></div>
        <div><dt>JSON</dt><dd><code>bike now --format json</code></dd></div>
        <div><dt>CSV</dt><dd><code>bike wear --format csv</code></dd></div>
      </dl>
    </figure>
  );
}
