import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, cardSlide } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const Scene8: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  const lineAnim = fadeIn(frame, 0, 15);
  const publicAnim = cardSlide(frame, s2f(0.5), 15);
  const realAnim = cardSlide(frame, s2f(1.2), 18);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '155px 82px 360px',
      }}
    >
      {/* Closing line */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 52,
          color: DESIGN.inkSoft,
          marginBottom: 93,
          textAlign: 'center' as const,
          fontWeight: 400,
          opacity: lineAnim.opacity,
        }}
      >
        他真正的身份是…
      </div>

      {/* ID card stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 42,
          width: '100%',
        }}
      >
        {/* Public card */}
        <div
          style={{
            borderRadius: 42,
            padding: '57px 62px',
            background: DESIGN.surface,
            boxShadow: DESIGN.shadowSm,
            opacity: publicAnim.opacity,
            transform: publicAnim.transform,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 24,
              fontWeight: 500,
              color: DESIGN.muted,
              letterSpacing: '0.2em',
              marginBottom: 24,
              textTransform: 'uppercase' as const,
            }}
          >
            公开身份
          </div>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 62,
              fontWeight: 400,
              marginBottom: 20,
              color: DESIGN.ink,
            }}
          >
            OpenAI CEO
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 32,
              color: DESIGN.muted,
              fontWeight: 500,
              letterSpacing: '0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            年薪 $76,000 · 持股 0%
          </div>
        </div>

        {/* Real card */}
        <div
          style={{
            borderRadius: 42,
            padding: '57px 62px',
            background: 'linear-gradient(135deg, #fff 0%, #f0f5fc 100%)',
            boxShadow: DESIGN.shadowMd,
            border: '1px solid rgba(44, 82, 130, 0.15)',
            opacity: realAnim.opacity,
            transform: realAnim.transform,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 24,
              fontWeight: 500,
              color: DESIGN.accent,
              letterSpacing: '0.2em',
              marginBottom: 24,
              textTransform: 'uppercase' as const,
            }}
          >
            真实身份
          </div>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 62,
              fontWeight: 400,
              marginBottom: 20,
              color: DESIGN.accent,
            }}
          >
            硅谷最会下注的人
          </div>
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 32,
              color: DESIGN.accentSoft,
              fontWeight: 500,
              letterSpacing: '0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            身价 $2B · 投出 400+ 公司
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
