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

const COMPANIES = [
  {
    key: 'airbnb',
    name: 'Airbnb',
    logo: 'logos/scene-d/airbnb.png',
    left: 38,
    top: 228,
    rotate: -6,
    fromX: -190,
    fromY: 38,
    delay: 108,
  },
  {
    key: 'stripe',
    name: 'Stripe',
    logo: 'logos/scene-d/stripe.png',
    left: 312,
    top: 148,
    rotate: 4,
    fromX: 0,
    fromY: -180,
    delay: 116,
  },
  {
    key: 'reddit',
    name: 'Reddit',
    logo: 'logos/scene-d/reddit.png',
    left: 582,
    top: 250,
    rotate: -4,
    fromX: 188,
    fromY: 28,
    delay: 124,
  },
  {
    key: 'coinbase',
    name: 'Coinbase',
    logo: 'logos/scene-d/coinbase.png',
    left: 198,
    top: 640,
    rotate: 4,
    fromX: -16,
    fromY: 210,
    delay: 132,
  },
] as const;

const CARD_WIDTH = 306;
const CARD_HEIGHT = 358;

export const SceneD: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();
  const headerAnim = fadeIn(frame, 6, 18);

  const stampIn = interpolate(frame, [18, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const stampExit = interpolate(frame, [84, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const stampScale = interpolate(stampIn, [0, 0.72, 1], [0.92, 1.025, 1]);
  const stampRotate = interpolate(stampIn, [0, 1], [5, 0]);
  const stampOpacity = stampIn * (1 - stampExit);
  const stampEnterX = interpolate(stampIn, [0, 1], [760, 0]);
  const stampExitX = interpolate(stampExit, [0, 1], [0, -870]);
  const stampTranslateX = stampEnterX + stampExitX;

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
        Y Combinator
      </div>

      <div
        style={{
          position: 'relative',
          width: 860,
          height: 1120,
          marginTop: 54,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 184,
            width: 560,
            height: 560,
            marginLeft: -280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stampOpacity,
            transform: `translateX(${stampTranslateX}px) scale(${stampScale}) rotate(${stampRotate}deg)`,
          }}
        >
          <div
            style={{
              width: 348,
              height: 348,
              borderRadius: 52,
              background: '#ff6600',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.sans,
              fontSize: 228,
              fontWeight: 800,
              lineHeight: 1,
              boxShadow:
                '0 24px 70px rgba(255,102,0,0.22), inset 0 0 0 10px rgba(255,255,255,0.18)',
            }}
          >
            Y
          </div>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONTS.sans,
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: DESIGN.ink,
              textTransform: 'uppercase' as const,
            }}
          >
            Combinator
          </div>
        </div>

        {COMPANIES.map((company) => {
          const p = interpolate(frame, [company.delay, company.delay + 22], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const opacity = interpolate(p, [0, 0.18, 1], [0, 1, 1]);
          const x = interpolate(p, [0, 1], [company.fromX, 0]);
          const y = interpolate(p, [0, 1], [company.fromY, 0]);
          const scale = interpolate(p, [0, 0.72, 1], [0.88, 1.035, 1]);

          return (
            <div
              key={company.key}
              style={{
                position: 'absolute',
                left: company.left,
                top: company.top,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                padding: '34px 34px 30px',
                boxSizing: 'border-box',
                borderRadius: 28,
                background: 'rgba(255,255,255,0.92)',
                border: '1px solid rgba(26,26,26,0.06)',
                boxShadow: '0 24px 70px rgba(0,0,0,0.10)',
                opacity,
                transform: `translate(${x}px, ${y}px) rotate(${company.rotate}deg) scale(${scale})`,
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  background: DESIGN.surface,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                }}
              >
                <Img
                  src={staticFile(company.logo)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 84,
                  fontFamily: FONTS.sans,
                  fontSize: 36,
                  fontWeight: 700,
                  color: DESIGN.ink,
                  letterSpacing: '0',
                }}
              >
                {company.name}
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontFamily: FONTS.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: DESIGN.muted,
                  letterSpacing: '0.02em',
                }}
              >
                YC-backed company
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
