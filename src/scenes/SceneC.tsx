import React from 'react';
import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const QUOTE_TEXT = '从打扑克学到的，比教授课堂上还多。';

export const SceneC: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();
  const shineStartFrame = 20;
  const shineEndFrame = 62;

  const sceneAnim = fadeIn(frame, s2f(0.4), 18);
  const shineActive = frame >= shineStartFrame && frame <= shineEndFrame;
  const shinePosition = interpolate(frame, [shineStartFrame, shineEndFrame], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 82px 470px',
        opacity: sceneAnim.opacity,
      }}
    >
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 26,
            fontWeight: 500,
            color: DESIGN.accent,
            letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
          }}
        >
          19 岁 · 第一家公司
        </div>

        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 82,
            lineHeight: 1.05,
            color: DESIGN.ink,
            marginTop: 30,
            fontWeight: 400,
          }}
        >
          Loopt
        </div>

        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            fontFamily: FONTS.sans,
            fontSize: 158,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 78,
            whiteSpace: 'nowrap' as const,
          }}
        >
          <span style={{ color: DESIGN.ink }}>4000万+</span>
          {shineActive && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                backgroundImage: `linear-gradient(110deg, transparent 0%, transparent 26%, rgba(255,255,255,0.98) 48%, ${DESIGN.accent} 56%, transparent 78%, transparent 100%)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '42% 100%',
                backgroundPosition: `${shinePosition}% 50%`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
              }}
            >
              4000万+
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 29,
            fontWeight: 500,
            color: DESIGN.muted,
            letterSpacing: '0.16em',
            marginTop: 28,
            textTransform: 'uppercase' as const,
          }}
        >
          美元收购价
        </div>
      </div>
    </AbsoluteFill>
  );
};
