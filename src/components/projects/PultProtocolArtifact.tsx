interface PultProtocolArtifactProps {
  className: string;
}

export function PultProtocolArtifact({ className }: PultProtocolArtifactProps) {
  return (
    <figure className={className}>
      <figcaption>Pairing and control path</figcaption>
      <ol>
        <li>iPhone Pult app</li>
        <li>
          <strong>mTLS pairing and command channels</strong>
          <span>Pairing: port 6467</span>
          <span>Commands: port 6466</span>
        </li>
        <li>Google TV</li>
      </ol>
    </figure>
  );
}
