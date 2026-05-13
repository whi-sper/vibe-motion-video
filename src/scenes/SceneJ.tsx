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
import { fadeIn } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

// ── Inline icons for companies without provided logos ──
const FusionIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="-50 -50 100 100" width="100%" height="100%">
    <defs>
      <radialGradient id="fusion-core">
        <stop offset="0%" stopColor="#fff5e0" />
        <stop offset="60%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.85" />
      </radialGradient>
    </defs>
    <circle r="16" fill="url(#fusion-core)" />
    <g
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      opacity="0.85"
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r1 = 22;
        const r2 = 40;
        return (
          <line
            key={i}
            x1={r1 * Math.cos(rad)}
            y1={r1 * Math.sin(rad)}
            x2={r2 * Math.cos(rad)}
            y2={r2 * Math.sin(rad)}
          />
        );
      })}
    </g>
  </svg>
);

const AtomIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="-50 -50 100 100" width="100%" height="100%">
    <ellipse
      rx="40"
      ry="14"
      stroke={color}
      strokeWidth="2.8"
      fill="none"
      transform="rotate(0)"
    />
    <ellipse
      rx="40"
      ry="14"
      stroke={color}
      strokeWidth="2.8"
      fill="none"
      transform="rotate(60)"
    />
    <ellipse
      rx="40"
      ry="14"
      stroke={color}
      strokeWidth="2.8"
      fill="none"
      transform="rotate(120)"
    />
    <circle r="7" fill={color} />
  </svg>
);

const BETS: ReadonlyArray<{
  key: string;
  name: string;
  english: string;
  chinese: string;
  logo?: string;
  iconType?: 'fusion' | 'atom';
  brandColor: string;
  bgTint: string;
  delay: number;
}> = [
  {
    key: 'stripe',
    name: 'Stripe',
    english: 'Payments',
    chinese: '支付',
    logo: 'logos/scene-d/stripe.png',
    brandColor: '#635bff',
    bgTint: '#eeecff',
    delay: s2f(0.5),
  },
  {
    key: 'helion',
    name: 'Helion',
    english: 'Fusion',
    chinese: '核聚变',
    iconType: 'fusion',
    brandColor: '#e67528',
    bgTint: '#ffedd9',
    delay: s2f(0.95),
  },
  {
    key: 'oklo',
    name: 'Oklo',
    english: 'Nuclear',
    chinese: '核能',
    iconType: 'atom',
    brandColor: '#2f7d99',
    bgTint: '#deeef4',
    delay: s2f(1.4),
  },
];

export const SceneJ: React.FC<{ config: SceneConfig }> = () => {
  const frame = useCurrentFrame();

  const headerAnim = fadeIn(frame, 0, 12);
  const footerAnim = fadeIn(frame, s2f(2.2), 15);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '155px 60px 260px',
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 28,
          fontWeight: 500,
          color: DESIGN.muted,
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          marginBottom: 90,
          opacity: headerAnim.opacity,
        }}
      >
        Early Bets · 很早就押注
      </div>

      {/* Three bet cards */}
      <div
        style={{
          display: 'flex',
          gap: 30,
          marginBottom: 70,
        }}
      >
        {BETS.map((bet) => {
          const p = interpolate(frame, [bet.delay, bet.delay + 22], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          const ty = interpolate(p, [0, 1], [60, 0]);
          const scale = interpolate(p, [0, 0.6, 1], [0.92, 1.04, 1]);

          return (
            <div
              key={bet.key}
              style={{
                width: 290,
                height: 410,
                padding: '40px 28px 32px',
                borderRadius: 36,
                background: bet.bgTint,
                border: '1px solid rgba(26,26,26,0.05)',
                boxShadow:
                  '0 16px 44px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: p,
                transform: `translateY(${ty}px) scale(${scale})`,
                transformOrigin: '50% 80%',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 122,
                  height: 122,
                  borderRadius: 26,
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 18,
                  boxShadow:
                    '0 4px 12px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.03)',
                }}
              >
                {bet.logo ? (
                  <Img
                    src={staticFile(bet.logo)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : bet.iconType === 'fusion' ? (
                  <FusionIcon color={bet.brandColor} />
                ) : (
                  <AtomIcon color={bet.brandColor} />
                )}
              </div>

              {/* Name + descriptors */}
              <div style={{ textAlign: 'center' as const }}>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 50,
                    fontWeight: 700,
                    color: DESIGN.ink,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {bet.name}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 17,
                    fontWeight: 600,
                    color: bet.brandColor,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase' as const,
                    marginBottom: 10,
                  }}
                >
                  {bet.english}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.chinese,
                    fontSize: 26,
                    fontWeight: 500,
                    color: DESIGN.inkSoft,
                    letterSpacing: '0.06em',
                  }}
                >
                  {bet.chinese}
                </div>
              </div>

              {/* "Sam's Bet" badge */}
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 13,
                  fontWeight: 600,
                  color: DESIGN.muted,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase' as const,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(26,26,26,0.08)',
                  width: '100%',
                  textAlign: 'center' as const,
                }}
              >
                Sam's Bet
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          fontFamily: FONTS.chinese,
          fontSize: 32,
          color: DESIGN.inkSoft,
          textAlign: 'center' as const,
          opacity: footerAnim.opacity,
        }}
      >
        早就押在了{' '}
        <strong style={{ color: DESIGN.ink, fontWeight: 700 }}>未来</strong>
      </div>
    </AbsoluteFill>
  );
};
