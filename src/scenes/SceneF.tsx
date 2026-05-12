import React from 'react';
import {
  useCurrentFrame,
  AbsoluteFill,
  interpolate,
  Easing,
  Img,
  staticFile,
} from 'remotion';
import type { SceneConfig } from '../types';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

// 3 cash emojis stacked into a pile on the right pan
const CASH_ITEMS: ReadonlyArray<{
  x: number;
  y: number;
  rotate: number;
  delay: number;
  landFrame: number; // frame when this cash visually impacts the beam
}> = [
  { x: -8, y: -50, rotate: -10, delay: s2f(0.7), landFrame: s2f(0.86) },
  { x: 14, y: -82, rotate: 7, delay: s2f(1.0), landFrame: s2f(1.16) },
  { x: -4, y: -114, rotate: -4, delay: s2f(1.3), landFrame: s2f(1.46) },
];

// Damped sine — overshoot then settle (physics impact response)
function dampedKick(
  frame: number,
  triggerFrame: number,
  amplitude: number
): number {
  const t = (frame - triggerFrame) / 8;
  if (t < 0 || t > 5) return 0;
  return amplitude * Math.exp(-t * 0.55) * Math.sin(t * Math.PI);
}

export const SceneF: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  // ── Phase 1: simple balance scale ──
  const scaleIn = interpolate(frame, [0, s2f(0.4)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scaleOut = interpolate(frame, [s2f(4.5), s2f(5.0)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const scaleOpacity = scaleIn * (1 - scaleOut);

  // ── Physics tilt: starts left-down (-8°), balances as cash lands ──
  const baseTilt = interpolate(
    frame,
    [
      0,
      CASH_ITEMS[0].landFrame,
      CASH_ITEMS[0].landFrame + 6,
      CASH_ITEMS[1].landFrame,
      CASH_ITEMS[1].landFrame + 6,
      CASH_ITEMS[2].landFrame,
      CASH_ITEMS[2].landFrame + 6,
    ],
    [-8, -8, -5, -5, -2.5, -2.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // Each cash drop kicks beam toward right (positive = right-down)
  const wobble =
    dampedKick(frame, CASH_ITEMS[0].landFrame, 2.2) +
    dampedKick(frame, CASH_ITEMS[1].landFrame, 1.5) +
    dampedKick(frame, CASH_ITEMS[2].landFrame, 0.9);
  const tilt = baseTilt + wobble;

  // ── Phase 2: giant 0 drops in (gentle) ──
  const dropStart = s2f(5.4);
  const dropEnd = s2f(6.0);
  const dropT = interpolate(frame, [dropStart, dropEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
  const zeroY = interpolate(dropT, [0, 1], [-460, 0]);
  const zeroOpacity = interpolate(
    frame,
    [dropStart - 2, dropStart + 4],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Very subtle squash on landing
  const impactFrame = dropEnd;
  const squashT = interpolate(
    frame,
    [impactFrame, impactFrame + 4, impactFrame + 12],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const zeroScaleX = 1 + squashT * 0.05;
  const zeroScaleY = 1 - squashT * 0.05;

  // Scale unit dimensions
  const beamW = 540;
  const beamThick = 5;
  const triHalfW = 44;
  const triH = 64;
  const sideOffset = 200; // distance from center to logo/cash center

  return (
    <AbsoluteFill style={{ padding: '155px 82px 260px' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* ── Phase 1: Simple balance — centered ── */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: scaleOpacity,
            width: 720,
            height: 300,
          }}
        >
          {/* Triangle base (FIXED — does not rotate). Apex at unit center. */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: -triHalfW,
              marginTop: beamThick / 2,
              width: 0,
              height: 0,
              borderLeft: `${triHalfW}px solid transparent`,
              borderRight: `${triHalfW}px solid transparent`,
              borderBottom: `${triH}px solid ${DESIGN.ink}`,
            }}
          />

          {/* Rotating group: beam + logo + cash tilts as a unit */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: '50% 50%',
              transform: `rotate(${tilt}deg)`,
            }}
          >
            {/* Beam (horizontal line) */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: -beamW / 2,
                marginTop: -beamThick / 2,
                width: beamW,
                height: beamThick,
                background: DESIGN.ink,
                borderRadius: beamThick / 2,
              }}
            />

            {/* Left: OpenAI logo */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: -sideOffset - 65,
                marginTop: -130 - beamThick / 2,
                width: 130,
                height: 130,
              }}
            >
              <Img
                src={staticFile('logos/openAI-logo.svg')}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Right: cash pile (3 💵 emojis appearing + falling) */}
            {CASH_ITEMS.map((cash, i) => {
              const p = interpolate(
                frame,
                [cash.delay, cash.delay + 10],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.cubic),
                }
              );
              const itemScale = interpolate(p, [0, 0.6, 1], [0, 1.15, 1]);
              // Drop from above for "falling onto pan" feel
              const fallY = interpolate(p, [0, 0.7, 1], [-50, 6, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: sideOffset + cash.x - 44,
                    marginTop: cash.y - 44,
                    width: 88,
                    height: 88,
                    fontSize: 84,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: p,
                    transform: `translateY(${fallY}px) scale(${itemScale}) rotate(${cash.rotate}deg)`,
                    transformOrigin: '50% 80%',
                  }}
                >
                  💵
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Phase 2: Giant red 0 only — centered ── */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            fontFamily: FONTS.serif,
            fontSize: 540,
            fontWeight: 400,
            color: DESIGN.critical,
            lineHeight: 0.85,
            fontVariantNumeric: 'tabular-nums',
            opacity: zeroOpacity,
            transform: `translate(-50%, calc(-50% + ${zeroY}px)) scale(${zeroScaleX}, ${zeroScaleY})`,
            transformOrigin: '50% 50%',
          }}
        >
          0
        </div>
      </div>
    </AbsoluteFill>
  );
};
