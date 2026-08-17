import { ImageResponse } from 'next/og';

export const alt = 'Steven Barash personal site presented as a Windows 95 desktop';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const commandPrompt = String.raw`C:\STEVEN> explore portfolio`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#008080',
          color: '#000000',
          display: 'flex',
          fontFamily: 'Arial, sans-serif',
          height: '100%',
          padding: 42,
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#c0c0c0',
            border: '4px solid #ffffff',
            boxShadow: 'inset -4px -4px #808080, inset 4px 4px #dfdfdf',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              background: '#000080',
              color: '#ffffff',
              display: 'flex',
              fontSize: 28,
              fontWeight: 700,
              height: 66,
              justifyContent: 'space-between',
              margin: 5,
              padding: '0 16px',
            }}
          >
            <span>STEVEN.EXE — Personal Site</span>
            <span style={{ background: '#c0c0c0', color: '#000000', padding: '1px 12px' }}>×</span>
          </div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '28px 52px 42px',
            }}
          >
            <div style={{ color: '#000080', display: 'flex', fontSize: 24, fontWeight: 700, marginBottom: 18 }}>
              MY COMPUTER &gt; PORTFOLIO
            </div>
            <div style={{ display: 'flex', fontSize: 66, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
              Steven Barash
            </div>
            <div style={{ display: 'flex', fontSize: 31, marginTop: 20 }}>
              Solutions Engineer · Photographer · Brooklyn, NYC
            </div>
            <div
              style={{
                background: '#dfdfdf',
                border: '3px solid #808080',
                boxShadow: 'inset 2px 2px #000000, inset -2px -2px #ffffff',
                color: '#000000',
                display: 'flex',
                fontFamily: 'Courier New, monospace',
                fontSize: 23,
                marginTop: 36,
                padding: '15px 18px',
              }}
            >
              {commandPrompt}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
