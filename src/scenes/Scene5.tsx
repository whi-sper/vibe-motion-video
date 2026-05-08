import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, nameSlide, barGrow } from '../animations/presets';
import { Counter } from '../components/Counter';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const BETS = [
  {
    name: 'Helion · 核聚变',
    desc: '2028 年向微软供电',
    barTarget: 100,
    rowDelay: 0.5,
    barDelay: 0.7,
    amountDelay: 1.4,
    counterIdx: 0,
    amountInside: true,
  },
  {
    name: 'Retro · 抗衰生物',
    desc: '让人类多活十年',
    barTarget: 48,
    rowDelay: 1.4,
    barDelay: 1.6,
    amountDelay: 2.3,
    counterIdx: 1,
    amountInside: false,
  },
];

export const Scene5: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();

  const headerAnim = fadeIn(frame, 0, 12);
  const titleAnim = nameSlide(frame, s2f(0.1));

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
      {/* Header */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: DESIGN.muted,
          textTransform: 'uppercase' as const,
          marginBottom: 20,
          opacity: headerAnim.opacity,
        }}
      >
        不止于软件
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 67,
          fontWeight: 400,
          color: DESIGN.ink,
          marginBottom: 93,
          opacity: titleAnim.opacity,
          transform: titleAnim.transform,
        }}
      >
        他押注的硬科技
      </div>

      {/* Bet rows */}
      {BETS.map((bet, i) => {
        const rowAnim = fadeIn(frame, s2f(bet.rowDelay), 12);
        const barWidth = barGrow(frame, s2f(bet.barDelay), bet.barTarget, 27);
        const amountAnim = fadeIn(frame, s2f(bet.amountDelay), 9);

        return (
          <div
            key={i}
            style={{
              width: '100%',
              marginBottom: 67,
              opacity: rowAnim.opacity,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 39,
                fontWeight: 600,
                color: DESIGN.ink,
                marginBottom: 5,
              }}
            >
              {bet.name}
            </div>
            <div
              style={{
                fontFamily: FONTS.chinese,
                fontSize: 28,
                color: DESIGN.muted,
                marginBottom: 26,
                fontWeight: 400,
              }}
            >
              {bet.desc}
            </div>
            <div
              style={{
                width: '100%',
                height: 93,
                background: DESIGN.surface,
                borderRadius: 20,
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${DESIGN.accent} 0%, ${DESIGN.accentSoft} 100%)`,
                  width: `${barWidth}%`,
                  borderRadius: 20,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: bet.amountInside ? 36 : -175,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 42,
                  fontWeight: 700,
                  color: bet.amountInside ? 'white' : DESIGN.accent,
                  zIndex: 5,
                  opacity: amountAnim.opacity,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.01em',
                }}
              >
                <Counter config={config.counters![bet.counterIdx]} />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
