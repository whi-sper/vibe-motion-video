import React from 'react';
import {
  useCurrentFrame,
  AbsoluteFill,
  Img,
  interpolate,
  Easing,
  staticFile,
} from 'remotion';
import type { SceneConfig } from '../types';
import { appPop } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const STICKER_URL =
  'https://gw.alicdn.com/imgextra/i1/O1CN01NFJCGA1SSGJ4vIPLN_!!6000000002245-2-tps-1024-1024.png';

const STICKER_SIZE = 360;
const NODE_SIZE = 134;
const CENTER_X = 540;
const CENTER_Y = 960;
const ORBIT_R = 400;

// Investment network — 6 nodes at 60° offsets (none straight up/down for stage fit)
const NETWORK_NODES: ReadonlyArray<{
  key: string;
  logo?: string;
  text?: string;
  angle: number;
  delay: number;
}> = [
  { key: 'reddit',   logo: 'logos/scene-d/reddit.png',   angle: -60,  delay: s2f(1.4) }, // upper-right
  { key: 'stripe',   logo: 'logos/scene-d/stripe.png',   angle: 0,    delay: s2f(1.6) }, // right
  { key: 'airbnb',   logo: 'logos/scene-d/airbnb.png',   angle: 60,   delay: s2f(1.8) }, // lower-right
  { key: 'helion',   text: 'Helion',                     angle: 120,  delay: s2f(2.0) }, // lower-left
  { key: 'coinbase', logo: 'logos/scene-d/coinbase.png', angle: 180,  delay: s2f(2.2) }, // left
  { key: 'oklo',     text: 'Oklo',                       angle: -120, delay: s2f(2.4) }, // upper-left
];

export const SceneH: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  // Sam sticker enters first
  const stickerAnim = appPop(frame, s2f(0.1), 18);

  return (
    <AbsoluteFill>
      {/* ── Network lines (SVG layer behind sticker) ── */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        {NETWORK_NODES.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const startDist = 178; // just outside sticker silhouette
          const endDist = ORBIT_R - NODE_SIZE / 2 - 8;
          const startX = CENTER_X + startDist * Math.cos(rad);
          const startY = CENTER_Y + startDist * Math.sin(rad);
          const endX = CENTER_X + endDist * Math.cos(rad);
          const endY = CENTER_Y + endDist * Math.sin(rad);

          // Line draws outward from sticker edge
          const lineP = interpolate(
            frame,
            [node.delay, node.delay + 18],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.cubic),
            }
          );
          const curX = startX + (endX - startX) * lineP;
          const curY = startY + (endY - startY) * lineP;

          // Travel dot loops along the line after it's drawn
          const dotShowFrame = node.delay + 24;
          const phase = ((frame - dotShowFrame) % 75) / 75;
          const dotShow = frame >= dotShowFrame ? 1 : 0;
          const dotX = startX + (endX - startX) * phase;
          const dotY = startY + (endY - startY) * phase;
          const dotOpacity = dotShow * Math.sin(phase * Math.PI) * 0.85;

          return (
            <g key={node.key}>
              <line
                x1={startX}
                y1={startY}
                x2={curX}
                y2={curY}
                stroke={DESIGN.muted}
                strokeWidth={2.2}
                strokeOpacity={0.55}
                strokeDasharray="6 7"
                strokeLinecap="round"
              />
              <circle
                cx={dotX}
                cy={dotY}
                r={5.5}
                fill={DESIGN.accent}
                opacity={dotOpacity}
              />
            </g>
          );
        })}
      </svg>

      {/* ── Network nodes (company logos / text bubbles) ── */}
      {NETWORK_NODES.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const nx = CENTER_X + ORBIT_R * Math.cos(rad);
        const ny = CENTER_Y + ORBIT_R * Math.sin(rad);
        const nodeDelay = node.delay + 14;
        const p = interpolate(
          frame,
          [nodeDelay, nodeDelay + 14],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          }
        );
        const scale = interpolate(p, [0, 0.6, 1], [0, 1.12, 1]);

        // Subtle floating idle
        const float = Math.sin((frame - nodeDelay) / 22 + node.angle / 30) * 4;

        return (
          <div
            key={node.key}
            style={{
              position: 'absolute',
              left: nx - NODE_SIZE / 2,
              top: ny - NODE_SIZE / 2,
              width: NODE_SIZE,
              height: NODE_SIZE,
              borderRadius: NODE_SIZE / 2,
              background: '#ffffff',
              border: '1px solid rgba(26,26,26,0.06)',
              boxShadow:
                '0 10px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: p,
              transform: `translateY(${float}px) scale(${scale})`,
              transformOrigin: '50% 50%',
              zIndex: 3,
            }}
          >
            {node.logo ? (
              <Img
                src={staticFile(node.logo)}
                style={{
                  width: '64%',
                  height: '64%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 26,
                  fontWeight: 700,
                  color: DESIGN.ink,
                  letterSpacing: '-0.01em',
                }}
              >
                {node.text}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Sam sticker — front-most layer ── */}
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - STICKER_SIZE / 2,
          top: CENTER_Y - STICKER_SIZE / 2,
          width: STICKER_SIZE,
          height: STICKER_SIZE,
          opacity: stickerAnim.opacity,
          transform: stickerAnim.transform,
          filter:
            'drop-shadow(0 20px 40px rgba(0,0,0,0.12)) drop-shadow(0 40px 80px rgba(0,0,0,0.06))',
          zIndex: 5,
        }}
      >
        <Img
          src={STICKER_URL}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
