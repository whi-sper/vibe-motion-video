import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import type { SceneConfig } from '../types';
import { fadeIn } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';

// ── Soft pastel palette — fill / top-highlight / ink ───────
const PALETTE = {
  peach:    { fill: '#fde0c8', hi: '#fff1e2', ink: '#b35930' },
  lavender: { fill: '#ecddf5', hi: '#f8eefe', ink: '#6a3da1' },
  sky:      { fill: '#dee5f5', hi: '#ecf1fa', ink: '#3a4d8a' },
  mint:     { fill: '#d8ede1', hi: '#ecf6ef', ink: '#107a5a' },
  smoke:    { fill: '#e6e3ea', hi: '#f2f0f5', ink: '#2a2a2a' },
} as const;

type PaletteKey = keyof typeof PALETTE;

// ── Soft pastel bubble — paper-like with subtle top light ──
interface BubbleProps {
  name: string;
  size: number;
  x: number;
  y: number;
  palette: PaletteKey;
  fontSize: number;
  opacity: number;
  scale: number;
  floatY: number;
  zIndex?: number;
  emphasis?: boolean;
}

const Bubble: React.FC<BubbleProps> = ({
  name,
  size,
  x,
  y,
  palette,
  fontSize,
  opacity,
  scale,
  floatY,
  zIndex = 2,
  emphasis = false,
}) => {
  const p = PALETTE[palette];
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity,
        transform: `translateY(${floatY}px) scale(${scale})`,
        transformOrigin: '50% 50%',
        zIndex,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% -10%, ${p.hi} 0%, ${p.fill} 62%)`,
          boxShadow: [
            'inset 0 0 0 1px rgba(255,255,255,0.55)',
            `inset 0 ${size * 0.02}px ${size * 0.04}px rgba(255,255,255,0.45)`,
            `0 ${size * 0.025}px ${size * 0.06}px rgba(0,0,0,0.05)`,
            `0 ${size * 0.1}px ${size * 0.28}px rgba(60,55,80,0.07)`,
          ].join(', '),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize,
            fontWeight: emphasis ? 700 : 600,
            color: p.ink,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

// Apple-style overshoot easing
const APPLE_EASE = Easing.bezier(0.34, 1.4, 0.5, 1);

// Surrounding product bubbles — 7-bubble cloud, top + bottom extended to fill stage
const SIDE_BUBBLES: ReadonlyArray<{
  key: string;
  name: string;
  x: number;
  y: number;
  size: number;
  palette: PaletteKey;
  fontSize: number;
  delay: number;
  bob: number;
}> = [
  // All 7 bubbles on a circle of radius 310 around ChatGPT, evenly spaced at 51.4°
  { key: 'atlas',   name: 'Atlas',   x:  242, y: -193, size: 235, palette: 'sky',      fontSize: 40, delay: 144, bob: 0.9 },
  { key: 'whisper', name: 'Whisper', x:  302, y:   69, size: 230, palette: 'peach',    fontSize: 38, delay: 150, bob: 1.8 },
  { key: 'codex',   name: 'Codex',   x:  135, y:  279, size: 230, palette: 'lavender', fontSize: 38, delay: 156, bob: 2.7 },
  { key: 'sora',    name: 'Sora',    x: -135, y:  279, size: 235, palette: 'smoke',    fontSize: 40, delay: 162, bob: 3.6 },
  { key: 'prism',   name: 'Prism',   x: -302, y:   69, size: 230, palette: 'sky',      fontSize: 40, delay: 168, bob: 4.5 },
  { key: 'dalle',   name: 'DALL·E',  x: 0, y: -310, size: 235, palette: 'peach',    fontSize: 40, delay: 174, bob: 5.4 },
  { key: 'gpt4',    name: '...',     x:    -242, y: -193, size: 240, palette: 'lavender', fontSize: 42, delay: 138, bob: 0   },
];

export const SceneE: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: OpenAI logo flies in from right, holds, exits left ──
  const logoIn = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const logoExit = interpolate(frame, [50, 74], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const logoTranslateX =
    interpolate(logoIn, [0, 1], [760, 0]) +
    interpolate(logoExit, [0, 1], [0, -870]);
  const logoOpacity = logoIn * (1 - logoExit);
  const logoScale = interpolate(logoIn, [0, 0.7, 1], [0.9, 1.03, 1]);
  const logoRotate = interpolate(logoIn, [0, 1], [4, 0]);

  // ── Phase 2: ChatGPT bubble — pop in big, hold, shrink to make room ──
  const chatIn = interpolate(frame, [62, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: APPLE_EASE,
  });
  const chatShrink = interpolate(frame, [128, 158], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const chatEntryScale = interpolate(chatIn, [0, 1], [0.6, 1]);
  // Shrink ChatGPT (440px base) to match surrounding bubbles (~235px) → scale 0.534
  const chatPostScale = interpolate(chatShrink, [0, 1], [1, 0.534]);
  const chatScale = chatEntryScale * chatPostScale;
  const chatFloat = Math.sin((frame - 90) / 24) * 5;
  const chatOpacity = chatIn;

  const headerAnim = fadeIn(frame, 80, 18);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '148px 82px 260px',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: '0.24em',
          color: DESIGN.muted,
          textTransform: 'uppercase' as const,
          opacity: headerAnim.opacity,
        }}
      >
        OpenAI
      </div>

      <div
        style={{
          position: 'relative',
          width: 860,
          height: 1120,
          marginTop: 54,
        }}
      >
        {/* OpenAI lockup — horizontal mark + wordmark, fly in/out */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 184,
            width: 820,
            height: 560,
            marginLeft: -410,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            opacity: logoOpacity,
            transform: `translateX(${logoTranslateX}px) scale(${logoScale}) rotate(${logoRotate}deg)`,
            zIndex: 10,
          }}
        >
          <Img
            src={staticFile('logos/openAI-logo.svg')}
            style={{
              width: 200,
              height: 200,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 168,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: DESIGN.ink,
            }}
          >
            OpenAI
          </div>
        </div>

        {/* Bubble cloud — anchored at stage center */}
        <div
          style={{
            position: 'absolute',
            left: 430,
            top: 540,
            width: 0,
            height: 0,
          }}
        >
          {/* ChatGPT main bubble */}
          <Bubble
            name="ChatGPT"
            size={440}
            x={0}
            y={0}
            palette="mint"
            fontSize={76}
            opacity={chatOpacity}
            scale={chatScale}
            floatY={chatFloat}
            zIndex={5}
            emphasis
          />

          {/* Surrounding product bubbles */}
          {SIDE_BUBBLES.map((b) => {
            const p = interpolate(frame, [b.delay, b.delay + 28], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: APPLE_EASE,
            });
            const opacity = interpolate(p, [0, 0.2, 1], [0, 1, 1]);
            const scale = interpolate(p, [0, 1], [0, 1]);
            const float = Math.sin((frame - b.delay) / 22 + b.bob) * 6;
            return (
              <Bubble
                key={b.key}
                name={b.name}
                size={b.size}
                x={b.x}
                y={b.y}
                palette={b.palette}
                fontSize={b.fontSize}
                opacity={opacity}
                scale={scale}
                floatY={float}
                zIndex={2}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
