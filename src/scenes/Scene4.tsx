import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, appPop } from '../animations/presets';
import { Counter } from '../components/Counter';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const COMPANIES = [
  { ico: 'A', name: 'Airbnb' },
  { ico: 'P', name: 'Pinterest' },
  { ico: 'I', name: 'Instacart' },
  { ico: 'A', name: 'Asana' },
  { ico: 'D', name: 'DoorDash' },
  { ico: 'U', name: 'Uber' },
  { ico: 'D', name: 'Dropbox' },
  { ico: 'R', name: 'Reddit' },
];

const TILE_DELAYS = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.05];

export const Scene4: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const headerAnim = fadeIn(frame, 0, 12);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '155px 82px 260px',
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 36,
          color: DESIGN.muted,
          marginBottom: 57,
          fontWeight: 400,
          opacity: headerAnim.opacity,
        }}
      >
        YC 时代 · 个人投资组合
      </div>

      {/* 3×3 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 31,
          width: '100%',
          maxWidth: 722,
        }}
      >
        {COMPANIES.map((c, i) => {
          const anim = appPop(frame, s2f(TILE_DELAYS[i]));
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                background: DESIGN.surface,
                borderRadius: 42,
                boxShadow: DESIGN.shadowSm,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                opacity: anim.opacity,
                transform: anim.transform,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.serif,
                  fontWeight: 400,
                  fontSize: 67,
                  color: DESIGN.ink,
                }}
              >
                {c.ico}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: DESIGN.muted,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                {c.name}
              </div>
            </div>
          );
        })}

        {/* Summary tile */}
        {(() => {
          const anim = appPop(frame, s2f(TILE_DELAYS[8]));
          return (
            <div
              style={{
                aspectRatio: '1',
                background: `linear-gradient(135deg, ${DESIGN.accent} 0%, ${DESIGN.accentSoft} 100%)`,
                borderRadius: 42,
                boxShadow: `0 1px 0 rgba(255,255,255,0.2) inset, 0 20px 52px rgba(44, 82, 130, 0.25)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                opacity: anim.opacity,
                transform: anim.transform,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 57,
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                <Counter config={config.counters![0]} style={{ color: 'white' }} />
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                公司
              </div>
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};
