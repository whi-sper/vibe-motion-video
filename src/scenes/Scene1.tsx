import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, numIn, megaIn } from '../animations/presets';
import { Counter } from '../components/Counter';
import { Flash } from '../components/Flash';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const Scene1: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  const eyebrowAnim = fadeIn(frame, s2f(0.1), 15);
  const salaryAnim = numIn(frame, s2f(0.3), 18);
  const roleAnim = fadeIn(frame, s2f(0.6), 12);
  const vsAnim = fadeIn(frame, s2f(1.4), 12);
  const eyebrowBrightAnim = fadeIn(frame, s2f(1.7), 12);
  const netWorthAnim = megaIn(frame, s2f(1.9), 24);

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
      {config.flashAtFrame != null && (
        <Flash triggerFrame={config.flashAtFrame} />
      )}

      {/* Eyebrow */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: DESIGN.muted,
          textTransform: 'uppercase' as const,
          marginBottom: 36,
          opacity: eyebrowAnim.opacity,
        }}
      >
        OpenAI · 年薪
      </div>

      {/* Salary number */}
      <div
        style={{
          fontSize: 145,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: DESIGN.ink,
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 20,
          opacity: salaryAnim.opacity,
          transform: salaryAnim.transform,
          filter: salaryAnim.filter,
        }}
      >
        <Counter config={config.counters![0]} />
      </div>

      {/* Role */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 42,
          color: DESIGN.inkSoft,
          marginBottom: 103,
          fontWeight: 400,
          opacity: roleAnim.opacity,
        }}
      >
        — Sam Altman
      </div>

      {/* VS divider */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 46,
          color: DESIGN.muted,
          margin: '20px 0 72px',
          letterSpacing: '0.05em',
          opacity: vsAnim.opacity,
        }}
      >
        而他的
      </div>

      {/* Bright eyebrow */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: DESIGN.accent,
          textTransform: 'uppercase' as const,
          marginBottom: 31,
          opacity: eyebrowBrightAnim.opacity,
        }}
      >
        个人身价
      </div>

      {/* Mega number */}
      <div
        style={{
          fontSize: 248,
          fontWeight: 800,
          letterSpacing: '-0.05em',
          lineHeight: 0.95,
          color: DESIGN.accent,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap' as const,
          opacity: netWorthAnim.opacity,
          transform: netWorthAnim.transform,
          filter: netWorthAnim.filter,
        }}
      >
        <Counter config={config.counters![1]} />
      </div>
    </AbsoluteFill>
  );
};
