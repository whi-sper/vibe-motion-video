import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, cardSlide } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const QUOTE_TEXT = '从打扑克学到的，比教授课堂上还多。';

export const SceneC: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  const quoteMarkAnim = fadeIn(frame, 0, 12);
  const attrAnim = fadeIn(frame, s2f(2.0), 12);
  const cardAnim = cardSlide(frame, s2f(2.5), 15);

  // Per-char animation for quote
  const chars = QUOTE_TEXT.split('');

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
      {/* Quote mark */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 186,
          lineHeight: 0.4,
          color: DESIGN.accent,
          marginBottom: 42,
          height: 82,
          opacity: quoteMarkAnim.opacity,
        }}
      >
        &ldquo;
      </div>

      {/* Quote text - per char */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 54,
          lineHeight: 1.55,
          color: DESIGN.ink,
          textAlign: 'center',
          marginBottom: 62,
          maxWidth: 825,
          fontWeight: 400,
        }}
      >
        {chars.map((ch, i) => {
          const startFrame = s2f(0.5) + Math.round(i * 1.8); // ~60ms per char
          const anim = fadeIn(frame, startFrame, 12);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: anim.opacity,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      {/* Attribution */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.2em',
          marginBottom: 72,
          textTransform: 'uppercase' as const,
          opacity: attrAnim.opacity,
        }}
      >
        — SAM ALTMAN, 后来在《纽约时报》
      </div>

      {/* Followup card */}
      <div
        style={{
          width: '100%',
          padding: '46px 52px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, #fff 0%, #f0f5fc 100%)',
          border: '1px solid rgba(44, 82, 130, 0.12)',
          boxShadow: DESIGN.shadowMd,
          opacity: cardAnim.opacity,
          transform: cardAnim.transform,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 23,
            fontWeight: 500,
            color: DESIGN.accent,
            letterSpacing: '0.2em',
            marginBottom: 16,
            textTransform: 'uppercase' as const,
          }}
        >
          19 岁的第一笔创业
        </div>
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 44,
            color: DESIGN.ink,
            lineHeight: 1.45,
          }}
        >
          创办 <span style={{ color: DESIGN.accent }}>Loopt</span> · 入选 YC
          史上最早 8 家公司
        </div>
      </div>
    </AbsoluteFill>
  );
};
