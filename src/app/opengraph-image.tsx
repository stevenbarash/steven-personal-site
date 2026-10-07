import { ImageResponse } from 'next/og';
import { profileContent } from '@/content/profile';

export const alt = `${profileContent.name} | ${profileContent.professionalLabel}. ${profileContent.headline}`;

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
          background: '#0b0b0b',
          color: '#f5f5f5',
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
            background: '#8ce7f6',
            display: 'flex',
            height: 12,
            width: 88,
            borderRadius: 6,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            {profileContent.name}
          </div>
          <div style={{ display: 'flex', fontSize: 54, fontWeight: 650, letterSpacing: -1.6, lineHeight: 1.08, marginTop: 34, maxWidth: 960 }}>
            {profileContent.headline}
          </div>
          <div style={{ color: '#8ce7f6', display: 'flex', fontSize: 26, fontWeight: 600, marginTop: 34 }}>
            {profileContent.professionalLabel}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
