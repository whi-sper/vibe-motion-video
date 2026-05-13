import React from 'react';
import {
  useCurrentFrame,
  AbsoluteFill,
  interpolate,
  Easing,
} from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, wordRise } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const QUOTE_LINE_1 = ['AI', '对世界的改变，'];
const QUOTE_LINE_2 = ['会', '超过', '互联网。'];

export const SceneK: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  const eyebrow = fadeIn(frame, 0, 12);
  const openQuote = fadeIn(frame, s2f(0.3), 18);
  const closeQuote = fadeIn(frame, s2f(2.6), 18);
  const attribution = fadeIn(frame, s2f(3.0), 15);
  const rule = interpolate(frame, [s2f(3.2), s2f(3.7)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

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
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          marginBottom: 70,
          opacity: eyebrow.opacity,
        }}
      >
        Many Years Ago · 多年前他就说过
      </div>

      {/* Quote block */}
      <div
        style={{
          position: 'relative',
          width: 880,
          padding: '0 80px',
        }}
      >
        {/* Opening quote glyph */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -120,
            fontFamily: FONTS.serif,
            fontSize: 280,
            color: DESIGN.accent,
            lineHeight: 1,
            opacity: openQuote.opacity * 0.85,
            userSelect: 'none' as const,
          }}
        >
          “
        </div>

        {/* Closing quote glyph */}
        <div
          style={{
            position: 'absolute',
            right: -10,
            bottom: -200,
            fontFamily: FONTS.serif,
            fontSize: 280,
            color: DESIGN.accent,
            lineHeight: 1,
            opacity: closeQuote.opacity * 0.85,
            userSelect: 'none' as const,
          }}
        >
          ”
        </div>

        {/* Quote text — serif italic, word-by-word rise */}
        <div
          style={{
            fontFamily: FONTS.serif,
            fontStyle: 'italic',
            fontSize: 90,
            color: DESIGN.ink,
            lineHeight: 1.28,
            textAlign: 'center' as const,
            fontWeight: 400,
          }}
        >
          <div>
            {QUOTE_LINE_1.map((w, i) => {
              const anim = wordRise(frame, s2f(0.7 + i * 0.18));
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: anim.opacity,
                    transform: anim.transform,
                    filter: anim.filter,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <div style={{ marginTop: 10 }}>
            {QUOTE_LINE_2.map((w, i) => {
              const anim = wordRise(frame, s2f(1.6 + i * 0.18));
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: anim.opacity,
                    transform: anim.transform,
                    filter: anim.filter,
                    color: i === 2 ? DESIGN.accent : DESIGN.ink,
                    fontWeight: i === 2 ? 600 : 400,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hairline rule + attribution */}
      <div
        style={{
          marginTop: 220,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          opacity: attribution.opacity,
        }}
      >
        <div
          style={{
            width: 80 * rule,
            height: 2,
            background: DESIGN.muted,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 28,
            fontWeight: 500,
            color: DESIGN.muted,
            letterSpacing: '0.14em',
          }}
        >
          Sam Altman
        </div>
      </div>
    </AbsoluteFill>
  );
};
