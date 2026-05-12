import React from 'react';
import {
  useCurrentFrame,
  AbsoluteFill,
  interpolate,
  Easing,
} from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, megaIn, zeroIn } from '../animations/presets';
import { Flash } from '../components/Flash';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const SceneF: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  // ── Phase 1: OpenAI valuation reveal ──
  const markAnim = fadeIn(frame, 0, 12);
  const valLabelAnim = fadeIn(frame, s2f(0.3), 12);
  const valNumAnim = megaIn(frame, s2f(0.7), 24);

  // Inline counter: 0 → 3000 亿 (matches Scene7's "$300B+")
  const valStart = s2f(0.7);
  const valDur = s2f(1.7);
  const valProgress = interpolate(
    frame,
    [valStart, valStart + valDur],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.poly(3)),
    }
  );
  const valNum = Math.round(valProgress * 3000);

  // ── Phase 2: Stake reveal ──
  const pivotAnim = fadeIn(frame, s2f(3.5), 18);
  const stakeAnim = fadeIn(frame, s2f(3.9), 12);
  const zeroAnim = zeroIn(frame, s2f(4.3), 27);
  const pctAnim = fadeIn(frame, s2f(5.3), 12);

  // Phase 1 dims as Phase 2 takes over
  const phase1Dim = interpolate(
    frame,
    [s2f(3.5), s2f(4.2)],
    [1, 0.32],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
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
          fontSize: 76,
          fontWeight: 400,
          color: DESIGN.ink,
          marginBottom: 14,
          opacity: markAnim.opacity * phase1Dim,
        }}
      >
        OpenAI
      </div>

      {/* Valuation label */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          marginBottom: 28,
          opacity: valLabelAnim.opacity * phase1Dim,
        }}
      >
        估值
      </div>

      {/* Big growing valuation: $3000亿+ */}
      <div
        style={{
          fontFamily: FONTS.counter,
          fontSize: 168,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          color: DESIGN.accent,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap' as const,
          marginBottom: 60,
          opacity: valNumAnim.opacity * phase1Dim,
          transform: valNumAnim.transform,
          filter: valNumAnim.filter,
        }}
      >
        ${valNum}
        <span
          style={{
            fontFamily: FONTS.notoSansSC,
            fontSize: '0.62em',
            fontWeight: 500,
            marginLeft: '0.08em',
            letterSpacing: '0.02em',
            verticalAlign: '0.08em',
            opacity: 0.85,
          }}
        >
          亿+
        </span>
      </div>

      {/* Pivot — small italic "而他的" */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 44,
          color: DESIGN.muted,
          marginBottom: 16,
          opacity: pivotAnim.opacity,
        }}
      >
        而他的
      </div>

      {/* Stake label */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 28,
          fontWeight: 500,
          color: DESIGN.critical,
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          marginBottom: 8,
          opacity: stakeAnim.opacity,
        }}
      >
        Sam Altman 持股
      </div>

      {/* Giant red 0 */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 380,
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
          fontSize: 30,
          fontWeight: 500,
          color: DESIGN.critical,
          letterSpacing: '0.3em',
          marginTop: 8,
          textTransform: 'uppercase' as const,
          opacity: pctAnim.opacity,
        }}
      >
        PERCENT
      </div>
    </AbsoluteFill>
  );
};
