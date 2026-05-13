import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, megaIn, cardSlide } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const SceneL: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  const eyebrow = fadeIn(frame, 0, 12);
  const notOnlyLine = fadeIn(frame, s2f(0.4), 12);
  const firstIdentityAnim = cardSlide(frame, s2f(0.8), 15);
  const butLine = fadeIn(frame, s2f(2.0), 14);
  const identityAnim = megaIn(frame, s2f(2.5), 24);
  const tagAnim = fadeIn(frame, s2f(3.8), 14);

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
          marginBottom: 78,
          opacity: eyebrow.opacity,
        }}
      >
        About Sam · 关于他
      </div>

      {/* "他不仅是 ——" italic prefix */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 44,
          color: DESIGN.muted,
          marginBottom: 22,
          opacity: notOnlyLine.opacity,
        }}
      >
        他不仅是 ——
      </div>

      {/* First identity: "ChatGPT 之父" in a soft pill (true, but stepping stone) */}
      <div
        style={{
          marginBottom: 86,
          opacity: firstIdentityAnim.opacity,
          transform: firstIdentityAnim.transform,
        }}
      >
        <div
          style={{
            padding: '18px 44px',
            borderRadius: 999,
            background: 'rgba(26,26,26,0.05)',
            border: '1.5px solid rgba(26,26,26,0.08)',
            fontFamily: FONTS.sans,
            fontSize: 64,
            fontWeight: 700,
            color: DESIGN.inkSoft,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          ChatGPT 之父
        </div>
      </div>

      {/* "他更像 ——" italic prefix */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 48,
          color: DESIGN.muted,
          marginBottom: 22,
          opacity: butLine.opacity,
        }}
      >
        他更像 ——
      </div>

      {/* Mega identity reveal: 硅谷最会下注的人 */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 96,
          fontWeight: 800,
          color: DESIGN.accent,
          letterSpacing: '-0.03em',
          textAlign: 'center' as const,
          lineHeight: 1.05,
          opacity: identityAnim.opacity,
          transform: identityAnim.transform,
          filter: identityAnim.filter,
        }}
      >
        硅谷最会
        <br />
        下注的人
      </div>

      {/* Tag pill */}
      <div
        style={{
          marginTop: 56,
          padding: '12px 28px',
          borderRadius: 999,
          border: `1.5px solid ${DESIGN.accent}`,
          fontFamily: FONTS.sans,
          fontSize: 22,
          fontWeight: 600,
          color: DESIGN.accent,
          letterSpacing: '0.24em',
          textTransform: 'uppercase' as const,
          opacity: tagAnim.opacity,
        }}
      >
        Silicon Valley's Best Bettor
      </div>
    </AbsoluteFill>
  );
};
