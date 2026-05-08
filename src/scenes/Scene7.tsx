import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, zeroIn } from '../animations/presets';
import { Flash } from '../components/Flash';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const Scene7: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  const markAnim = fadeIn(frame, 0, 12);
  const valAnim = fadeIn(frame, s2f(0.2), 12);
  const stakeAnim = fadeIn(frame, s2f(0.5), 12);
  const zeroAnim = zeroIn(frame, s2f(0.9), 27);
  const pctAnim = fadeIn(frame, s2f(1.7), 12);
  const footAnim = fadeIn(frame, s2f(2.0), 12);

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

      {/* OpenAI mark */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 93,
          fontWeight: 400,
          marginBottom: 20,
          color: DESIGN.ink,
          opacity: markAnim.opacity,
        }}
      >
        OpenAI
      </div>

      {/* Valuation tag */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 28,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.2em',
          marginBottom: 93,
          textTransform: 'uppercase' as const,
          opacity: valAnim.opacity,
        }}
      >
        估值 $300B+
      </div>

      {/* Stake label */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: '0.2em',
          color: DESIGN.critical,
          marginBottom: 20,
          textTransform: 'uppercase' as const,
          opacity: stakeAnim.opacity,
        }}
      >
        Sam Altman 持股
      </div>

      {/* Giant zero */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 620,
          fontWeight: 400,
          color: DESIGN.critical,
          lineHeight: 0.85,
          fontVariantNumeric: 'tabular-nums',
          opacity: zeroAnim.opacity,
          transform: zeroAnim.transform,
          filter: zeroAnim.filter,
        }}
      >
        0
      </div>

      {/* PERCENT */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 34,
          fontWeight: 500,
          color: DESIGN.critical,
          letterSpacing: '0.3em',
          marginTop: 10,
          textTransform: 'uppercase' as const,
          opacity: pctAnim.opacity,
        }}
      >
        PERCENT
      </div>

      {/* Footnote */}
      <div
        style={{
          marginTop: 82,
          fontFamily: FONTS.chinese,
          fontSize: 31,
          color: DESIGN.inkSoft,
          textAlign: 'center' as const,
          lineHeight: 1.7,
          fontWeight: 400,
          opacity: footAnim.opacity,
        }}
      >
        ChatGPT 估值飙到几千亿
        <br />
        他个人账面{' '}
        <strong style={{ color: DESIGN.ink, fontWeight: 700 }}>
          一分没多
        </strong>
      </div>
    </AbsoluteFill>
  );
};
