import React from 'react';
import { useCurrentFrame, AbsoluteFill, staticFile, Img } from 'remotion';
import type { SceneConfig } from '../types';
import { stickerFullAnim, fadeIn, wordRise } from '../animations/presets';
import { strikeOut } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

export const SceneA: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  // Phase 1: Sticker animation (enter big → wobble → shrink → move up)
  const sticker = stickerFullAnim(frame, s2f(0.2), 114);

  // Phase 2: Name/role fade in after sticker settles
  const nameAnim = fadeIn(frame, s2f(3.2));
  const roleAnim = fadeIn(frame, s2f(3.4));

  // Phase 3: Word-by-word text reveal
  const quoteStartFrame = 135;
  const words = [
    { text: '你以为他', frame: quoteStartFrame },
    { text: '只是', frame: quoteStartFrame + s2f(0.4), isStrike: true },
    { text: '“ChatGPT 的老板”？', frame: quoteStartFrame + s2f(0.8), isNewLine: true },
  ];

  // Phase 4: Strikethrough on "只是"
  const strikeWidth = strikeOut(frame, 249);
  const strikeActive = strikeWidth > 0;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 210,
        paddingLeft: 82,
        paddingRight: 82,
        paddingBottom: 260,
      }}
    >
      {/* Sticker block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 124,
          opacity: sticker.opacity,
          transform: sticker.transform,
        }}
      >
        {/* Sticker image */}
        <div
          style={{
            width: 464,
            height: 464,
            marginBottom: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter:
              'drop-shadow(0 20px 40px rgba(0,0,0,0.12)) drop-shadow(0 40px 80px rgba(0,0,0,0.08))',
          }}
        >
          <Img
            src="https://gw.alicdn.com/imgextra/i1/O1CN01NFJCGA1SSGJ4vIPLN_!!6000000002245-2-tps-1024-1024.png"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Name + role */}
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 57,
            color: DESIGN.ink,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            opacity: nameAnim.opacity,
          }}
        >
          Sam Altman
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: DESIGN.muted,
            textTransform: 'uppercase' as const,
            marginTop: 10,
            opacity: roleAnim.opacity,
          }}
        >
          OpenAI · CEO
        </div>
      </div>

      {/* Quote line */}
      <div
        style={{
          fontFamily: FONTS.serif,
          fontStyle: 'italic',
          fontSize: 67,
          lineHeight: 1.5,
          color: DESIGN.inkSoft,
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          const anim = wordRise(frame, w.frame);
          return (
            <span
              key={i}
              style={{
                display: w.isNewLine ? 'block' : 'inline-block',
                opacity: anim.opacity,
                transform: anim.transform,
                filter: anim.filter,
                position: 'relative',
                fontWeight: w.isStrike && strikeActive ? 700 : 400,
                marginTop: w.isNewLine ? 4 : 0,
                whiteSpace: 'nowrap' as const,
              }}
            >
              {w.text}
              {i === 0 && '\u00a0'}
              {w.isStrike && (
                <span
                  style={{
                    position: 'absolute',
                    left: '-2%',
                    top: '52%',
                    width: `${strikeWidth}%`,
                    height: 4,
                    backgroundColor: DESIGN.critical,
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
