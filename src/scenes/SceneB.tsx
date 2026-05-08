import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn, bioSlideIn } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const BIO_DATA = [
  { age: '8', event: '拥有人生第一台 ', bold: 'Macintosh', rest: '，自己拆开研究', delay: 0.3 },
  { age: '17', event: '考入 ', bold: '斯坦福', rest: ' 计算机系，进 AI 实验室', delay: 1.2 },
  { age: '19', event: '', bold: '退学', rest: '，开始第一次创业', delay: 2.1 },
];

export const SceneB: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();
  const headerAnim = fadeIn(frame, 0, 12);

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
          letterSpacing: '0.2em',
          color: DESIGN.muted,
          textTransform: 'uppercase' as const,
          marginBottom: 93,
          opacity: headerAnim.opacity,
        }}
      >
        在 OpenAI 之前
      </div>

      {/* Bio rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
          width: '100%',
        }}
      >
        {BIO_DATA.map((row, i) => {
          const anim = bioSlideIn(frame, s2f(row.delay));
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 42,
                padding: '36px 46px',
                background: DESIGN.surface,
                borderRadius: 36,
                boxShadow: DESIGN.shadowSm,
                opacity: anim.opacity,
                transform: anim.transform,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 77,
                  fontWeight: 700,
                  color: DESIGN.accent,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  fontVariantNumeric: 'tabular-nums',
                  flexShrink: 0,
                  width: 145,
                }}
              >
                {row.age}
                <span
                  style={{
                    fontFamily: FONTS.notoSansSC,
                    fontSize: 34,
                    fontWeight: 500,
                    color: DESIGN.muted,
                    marginLeft: 5,
                  }}
                >
                  岁
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: FONTS.chinese,
                  fontSize: 34,
                  color: DESIGN.ink,
                  lineHeight: 1.45,
                  fontWeight: 400,
                }}
              >
                {row.event}
                <strong style={{ fontWeight: 600 }}>{row.bold}</strong>
                {row.rest}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
