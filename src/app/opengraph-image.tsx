import { ImageResponse } from 'next/og';

export const alt = 'Steven Barash. Complex technical systems turned into working products, demos, and decisions.';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f8f8f6',
          color: '#040404',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial, Helvetica, sans-serif',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px 84px',
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#034cfc',
            display: 'flex',
            height: 12,
            width: 88,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            Steven Barash
          </div>
          <div style={{ display: 'flex', fontSize: 54, fontWeight: 650, letterSpacing: -1.6, lineHeight: 1.08, marginTop: 34, maxWidth: 960 }}>
            I turn complex technical systems into working products, demos, and decisions.
          </div>
          <div style={{ color: '#034cfc', display: 'flex', fontSize: 26, fontWeight: 600, marginTop: 34 }}>
            Identity systems, agentic AI, and independent software.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
