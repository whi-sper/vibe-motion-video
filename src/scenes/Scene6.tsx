import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, cardSlide, numIn, italicReveal } from '../animations/presets';
import { Counter } from '../components/Counter';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const Scene6: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  const tagAnim = fadeIn(frame, 0, 12);
  const nameAnim = fadeIn(frame, s2f(0.1), 12);
  const buyCardAnim = cardSlide(frame, s2f(0.4));
  const priceAnim = fadeIn(frame, s2f(0.6), 9);
  const arrowAnim = fadeIn(frame, s2f(1.0), 12);
  const nowCardAnim = cardSlide(frame, s2f(1.4), 15);
  const explodeAnim = numIn(frame, s2f(1.7), 15);
  const multiAnim = italicReveal(frame, s2f(2.4));

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
      {/* Tag */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.25em',
          marginBottom: 20,
          textTransform: 'uppercase' as const,
          opacity: tagAnim.opacity,
        }}
      >
        2021 · Oklo
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 77,
          fontWeight: 400,
          marginBottom: 103,
          color: DESIGN.ink,
          opacity: nameAnim.opacity,
        }}
      >
        核裂变 · 创始股
      </div>

      {/* Buy card */}
      <div
        style={{
          width: '100%',
          padding: '42px 52px',
          borderRadius: 36,
          background: DESIGN.surface,
          boxShadow: DESIGN.shadowSm,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          opacity: buyCardAnim.opacity,
          transform: buyCardAnim.transform,
        }}
      >
        <span style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 500, color: DESIGN.muted }}>
          买入价
        </span>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 67,
            fontWeight: 700,
            color: DESIGN.ink,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            opacity: priceAnim.opacity,
          }}
        >
          $0.002
        </span>
      </div>

      {/* Arrow */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 36,
          color: DESIGN.muted,
          margin: '31px 0',
          opacity: arrowAnim.opacity,
        }}
      >
        三年后…
      </div>

      {/* Now card */}
      <div
        style={{
          width: '100%',
          padding: '62px 52px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, #fff 0%, #f0f5fc 100%)',
          boxShadow: DESIGN.shadowMd,
          border: '1px solid rgba(44, 82, 130, 0.12)',
          textAlign: 'center' as const,
          opacity: nowCardAnim.opacity,
          transform: nowCardAnim.transform,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: DESIGN.accent,
            textTransform: 'uppercase' as const,
            display: 'block',
            marginBottom: 20,
          }}
        >
          如今估值
        </span>
        <div
          style={{
            fontSize: 145,
            fontWeight: 700,
            color: DESIGN.accent,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap' as const,
            opacity: explodeAnim.opacity,
            transform: explodeAnim.transform,
            filter: explodeAnim.filter,
          }}
        >
          <Counter config={config.counters![0]} />
        </div>
      </div>

      {/* Multiplier */}
      <div
        style={{
          marginTop: 62,
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 93,
          fontWeight: 400,
          color: DESIGN.highlight,
          letterSpacing: '-0.02em',
          opacity: multiAnim.opacity,
          transform: multiAnim.transform,
        }}
      >
        70,000 ×
      </div>
    </AbsoluteFill>
  );
};
