import React from 'react';
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const neonPink = '#ff22b8';
const neonCyan = '#22dce8';
const ink = '#050814';
const panel = '#0d1424';

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: ink,
          color: '#ffffff',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'radial-gradient(circle at 26% 25%, rgba(255, 34, 184, 0.22), transparent 28%), radial-gradient(circle at 78% 30%, rgba(34, 220, 232, 0.18), transparent 30%), #050814',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 34,
            top: 34,
            width: 1132,
            height: 562,
            border: `5px solid ${neonPink}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 92,
            width: 1010,
            height: 10,
            display: 'flex',
            background: `linear-gradient(90deg, ${neonPink} 0%, ${neonPink} 52%, ${neonCyan} 52%, ${neonCyan} 100%)`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 92,
            top: 178,
            width: 142,
            height: 142,
            border: `5px solid ${neonCyan}`,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a1020',
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 900, color: neonPink }}>KS</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 282,
            top: 183,
            width: 600,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: 82, fontWeight: 900, letterSpacing: 0, lineHeight: 1 }}>
            KrayoSkriptz
          </div>
          <div style={{ marginTop: 16, fontSize: 44, fontWeight: 700, color: neonCyan }}>
            Roblox Scripts & Executors
          </div>
          <div style={{ marginTop: 48, fontSize: 34, fontWeight: 700, lineHeight: 1.35 }}>
            Fresh scripts, previews,<br />lootlabs unlocks.
          </div>
          <div style={{ marginTop: 42, display: 'flex' }}>
            <div
              style={{
                width: 200,
                height: 74,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#c30072',
                borderRadius: 8,
                fontSize: 33,
                fontWeight: 900,
              }}
            >
              SCRIPTS
            </div>
            <div
              style={{
                marginLeft: 36,
                width: 200,
                height: 74,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#078ca0',
                borderRadius: 8,
                fontSize: 33,
                fontWeight: 900,
              }}
            >
              EXEC
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 92,
            top: 166,
            width: 292,
            height: 190,
            border: '4px solid #526176',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            padding: 28,
            background: panel,
          }}
        >
          <div
            style={{
              height: 72,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(90deg, ${neonPink} 0%, ${neonPink} 50%, ${neonCyan} 50%, ${neonCyan} 100%)`,
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            SCRIPTS
          </div>
          <div style={{ marginTop: 28, width: 190, height: 15, borderRadius: 99, background: '#243047' }} />
          <div style={{ marginTop: 18, width: 230, height: 15, borderRadius: 99, background: '#243047' }} />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 92,
            bottom: 96,
            width: 292,
            height: 160,
            border: `5px solid ${neonPink}`,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: panel,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 900, color: neonCyan, marginRight: 28 }}>&lt;/&gt;</div>
          <div style={{ fontSize: 42, fontWeight: 900 }}>EXEC</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
