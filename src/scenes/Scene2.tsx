import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, nameSlide, cardSlide, italicReveal } from '../animations/presets';
import { Counter } from '../components/Counter';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const Scene2: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  const eyebrowAnim = fadeIn(frame, 0, 12);
  const nameAnim = nameSlide(frame, s2f(0.1));
  const buyCardAnim = cardSlide(frame, s2f(0.4));
  const arrowAnim = fadeIn(frame, s2f(0.9), 12);
  const nowCardAnim = cardSlide(frame, s2f(1.1), 15);
  const multiAnim = italicReveal(frame, s2f(2.6));

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
          letterSpacing: '0.18em',
          color: DESIGN.muted,
          textTransform: 'uppercase' as const,
          marginBottom: 31,
          opacity: eyebrowAnim.opacity,
        }}
      >
        2009 · 第一笔
      </div>

      {/* Stripe name */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 134,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          marginBottom: 93,
          color: DESIGN.ink,
          opacity: nameAnim.opacity,
          transform: nameAnim.transform,
        }}
      >
        Stripe
      </div>

      {/* Investment card */}
      <div
        style={{
          width: '100%',
          padding: '46px 52px',
          borderRadius: 36,
          background: DESIGN.surface,
          boxShadow: DESIGN.shadowSm,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 31,
          opacity: buyCardAnim.opacity,
          transform: buyCardAnim.transform,
        }}
      >
        <span style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 500, color: DESIGN.muted }}>
          买入
        </span>
        <span style={{ fontFamily: FONTS.sans, fontSize: 57, color: DESIGN.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          $15,000
        </span>
      </div>

      {/* Arrow bridge */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 36,
          color: DESIGN.muted,
          margin: '46px 0 42px',
          opacity: arrowAnim.opacity,
        }}
      >
        17 年后…
      </div>

      {/* Now card */}
      <div
        style={{
          width: '100%',
          padding: '57px 52px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, #fff 0%, #f0f5fc 100%)',
          boxShadow: DESIGN.shadowMd,
          border: '1px solid rgba(44, 82, 130, 0.12)',
          textAlign: 'center' as const,
          opacity: nowCardAnim.opacity,
          transform: nowCardAnim.transform,
        }}
      >
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 500, letterSpacing: '0.18em', color: DESIGN.accent, textTransform: 'uppercase' as const, marginBottom: 20 }}>
          如今估值
        </div>
        <div style={{ fontSize: 165, fontWeight: 700, color: DESIGN.accent, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' as const }}>
          <Counter config={config.counters![0]} />
        </div>
      </div>

      {/* Multiplier */}
      <div
        style={{
          marginTop: 52,
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 82,
          fontWeight: 400,
          color: DESIGN.highlight,
          letterSpacing: '-0.02em',
          opacity: multiAnim.opacity,
          transform: multiAnim.transform,
        }}
      >
        ≈ 90,000 ×
      </div>
    </AbsoluteFill>
  );
};
