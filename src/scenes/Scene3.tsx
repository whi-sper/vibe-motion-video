import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, numIn, pieGrow } from '../animations/presets';
import { Counter } from '../components/Counter';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const Scene3: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  const nameAnim = fadeIn(frame, 0, 12);
  const ipoAnim = fadeIn(frame, s2f(0.2), 12);
  const svgAnim = fadeIn(frame, s2f(0.4), 12);
  const pieDashOffset = pieGrow(frame, s2f(0.8), 458, 33);
  const pctAnim = numIn(frame, s2f(1.5), 15);
  const labelAnim = fadeIn(frame, s2f(1.7), 12);
  const compareAnim = fadeIn(frame, s2f(2.0), 12);

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
      {/* Reddit name */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 114,
          fontWeight: 400,
          marginBottom: 10,
          color: DESIGN.ink,
          opacity: nameAnim.opacity,
        }}
      >
        Reddit
      </div>

      {/* IPO tag */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.2em',
          marginBottom: 82,
          textTransform: 'uppercase' as const,
          opacity: ipoAnim.opacity,
        }}
      >
        2024 · IPO
      </div>

      {/* Pie chart */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 20px 62px rgba(44, 82, 130, 0.15))',
        }}
      >
        <svg
          width={568}
          height={568}
          viewBox="0 0 200 200"
          style={{
            transform: 'rotate(-90deg)',
            opacity: svgAnim.opacity,
          }}
        >
          <circle
            cx={100}
            cy={100}
            r={80}
            fill="none"
            strokeWidth={26}
            stroke="rgba(26, 26, 26, 0.06)"
          />
          <circle
            cx={100}
            cy={100}
            r={80}
            fill="none"
            strokeWidth={26}
            stroke={DESIGN.accent}
            strokeDasharray={502}
            strokeDashoffset={pieDashOffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            textAlign: 'center' as const,
          }}
        >
          <div
            style={{
              fontSize: 114,
              fontWeight: 700,
              color: DESIGN.accent,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontVariantNumeric: 'tabular-nums',
              opacity: pctAnim.opacity,
              transform: pctAnim.transform,
              filter: pctAnim.filter,
            }}
          >
            <Counter config={config.counters![0]} />
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 23,
              fontWeight: 500,
              color: DESIGN.muted,
              letterSpacing: '0.2em',
              marginTop: 10,
              textTransform: 'uppercase' as const,
              opacity: labelAnim.opacity,
            }}
          >
            Sam Altman
          </div>
        </div>
      </div>

      {/* Compare text */}
      <div
        style={{
          marginTop: 82,
          textAlign: 'center' as const,
          fontFamily: FONTS.chinese,
          fontSize: 34,
          color: DESIGN.inkSoft,
          fontWeight: 400,
          opacity: compareAnim.opacity,
        }}
      >
        是 CEO 持股的{' '}
        <strong style={{ color: DESIGN.accent, fontWeight: 700 }}>
          2.3 倍
        </strong>
      </div>
    </AbsoluteFill>
  );
};
