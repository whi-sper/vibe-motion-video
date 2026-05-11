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

  const labelAnim = fadeIn(frame, s2f(0.2), 12);
  const companyAnim = fadeIn(frame, s2f(0.7), 12);
  const moneyAnim = cardSlide(frame, s2f(1.2), 16);
  const ycAnim = fadeIn(frame, s2f(2.2), 12);
  const quoteAnim = fadeIn(frame, s2f(3.0), 12);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 82px 520px',
      }}
    >
      {/* Primary setup */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          color: DESIGN.accent,
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          opacity: labelAnim.opacity,
        }}
      >
        19 岁 · 第一家公司
      </div>

      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 74,
          lineHeight: 1.2,
          color: DESIGN.ink,
          textAlign: 'center',
          marginTop: 30,
          fontWeight: 400,
          opacity: companyAnim.opacity,
        }}
      >
        创办 <span style={{ color: DESIGN.accent }}>Loopt</span>
      </div>

      {/* Main number */}
      <div
        style={{
          marginTop: 82,
          opacity: moneyAnim.opacity,
          transform: moneyAnim.transform,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 150,
            fontWeight: 800,
            color: DESIGN.ink,
            lineHeight: 1,
            whiteSpace: 'nowrap' as const,
          }}
        >
          💵4000万+
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 31,
            fontWeight: 500,
            color: DESIGN.critical,
            letterSpacing: '0.16em',
            marginTop: 30,
            textTransform: 'uppercase' as const,
          }}
        >
          美元收购价
        </div>
      </div>

      {/* Supporting context */}
      <div
        style={{
          marginTop: 56,
          opacity: ycAnim.opacity,
          textAlign: 'center',
          fontFamily: FONTS.sans,
          fontSize: 23,
          fontWeight: 400,
          color: DESIGN.muted,
          lineHeight: 1.5,
          letterSpacing: '0.08em',
        }}
      >
        入选 YC 史上最早 8 家公司
      </div>

      {/* Secondary quote */}
      <div
        style={{
          position: 'absolute',
          left: 82,
          right: 82,
          bottom: 118,
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 31,
          lineHeight: 1.6,
          color: DESIGN.muted,
          textAlign: 'center',
          opacity: quoteAnim.opacity,
        }}
      >
        “{QUOTE_TEXT}”
      </div>
    </AbsoluteFill>
  );
};
