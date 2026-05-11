import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { SceneConfig } from '../types';
import { Counter } from '../components/Counter';
import { Flash } from '../components/Flash';
import { DESIGN } from '../config/design-tokens';
import { FONTS } from '../config/fonts';
import { s2f } from '../config/timing';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const STICKER =
  'https://gw.alicdn.com/imgextra/i1/O1CN01NFJCGA1SSGJ4vIPLN_!!6000000002245-2-tps-1024-1024.png';

const COLORS = {
  green: '#17a673',
  amber: '#d4915c',
  blue: DESIGN.accent,
  red: DESIGN.critical,
  violet: '#7c5cff',
  cyan: '#19a7ce',
  dark: '#111318',
  dark2: '#171b22',
};

const ease = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, CLAMP);

const fade = (frame: number, start: number, dur = 12) =>
  ease(frame, [start, start + dur], [0, 1]);

const rise = (frame: number, start: number, y = 24, dur = 16) => {
  const p = fade(frame, start, dur);
  return {
    opacity: p,
    transform: `translateY(${y * (1 - p)}px)`,
    filter: `blur(${8 * (1 - p)}px)`,
  };
};

const pop = (frame: number, start: number, from = 0.72, over = 1.08, dur = 18) => {
  const p = fade(frame, start, dur);
  const scale = interpolate(p, [0, 0.65, 1], [from, over, 1]);
  return {
    opacity: Math.min(p * 2, 1),
    transform: `scale(${scale})`,
    filter: `blur(${10 * (1 - p)}px)`,
  };
};

const SceneShell: React.FC<{
  children?: React.ReactNode;
  mode?: 'light' | 'dark' | 'black';
}> = ({ children, mode = 'light' }) => {
  const dark = mode === 'dark';
  return (
    <AbsoluteFill
      style={{
        background:
          mode === 'black'
            ? '#000'
            : dark
              ? 'radial-gradient(circle at 50% 25%, #293342 0%, #111318 54%, #06070a 100%)'
              : 'linear-gradient(180deg, #f9f8f4 0%, #f1eee7 100%)',
        color: dark || mode === 'black' ? '#fff' : DESIGN.ink,
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = DESIGN.muted, style }) => (
  <div
    style={{
      fontFamily: FONTS.sans,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

const BigSerif: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 92, color = DESIGN.ink, style }) => (
  <div
    style={{
      fontFamily: FONTS.serif,
      fontSize: size,
      lineHeight: 0.95,
      fontWeight: 400,
      color,
      letterSpacing: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

const LogoMark: React.FC<{
  text: string;
  color?: string;
  bg?: string;
  size?: number;
}> = ({ text, color = '#fff', bg = DESIGN.ink, size = 92 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.22),
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      fontFamily: FONTS.sans,
      fontSize: Math.round(size * 0.42),
      fontWeight: 850,
      boxShadow: '0 18px 45px rgba(0,0,0,0.16)',
    }}
  >
    {text}
  </div>
);

const SamSticker: React.FC<{
  frame: number;
  start?: number;
  size?: number;
  centered?: boolean;
}> = ({ frame, start = 0, size = 520, centered = false }) => {
  const { fps } = useVideoConfig();
  const bounce = spring({
    frame: frame - start,
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 120 },
  });
  const opacity = ease(frame, [start, start + 5], [0, 1]);
  const wobble =
    Math.sin(Math.max(0, frame - start) / 2.4) *
    ease(frame, [start + 8, start + 28], [8, 0]);
  const y = centered ? 0 : -18;
  return (
    <div
      style={{
        width: size,
        height: size,
        opacity,
        transform: `translateY(${y}px) scale(${0.55 + bounce * 0.45}) rotate(${wobble}deg)`,
        filter:
          'drop-shadow(0 22px 0 rgba(255,255,255,0.95)) drop-shadow(0 42px 72px rgba(0,0,0,0.16))',
      }}
    >
      <Img src={STICKER} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
};

const ChatUI: React.FC<{ frame: number; start?: number; scale?: number }> = ({
  frame,
  start = 0,
  scale = 1,
}) => {
  const p = fade(frame, start, 18);
  const bubbles = ['Explain AGI simply', 'Generating answer...', 'AI infrastructure'];
  return (
    <div
      style={{
        width: 650 * scale,
        borderRadius: 34,
        padding: 24,
        background: 'rgba(255,255,255,0.78)',
        border: '1px solid rgba(26,26,26,0.08)',
        boxShadow: '0 28px 80px rgba(30,42,58,0.12)',
        opacity: p,
        transform: `translateY(${20 * (1 - p)}px) scale(${0.96 + p * 0.04})`,
        filter: `blur(${6 * (1 - p)}px)`,
      }}
    >
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        {[COLORS.red, COLORS.amber, COLORS.green].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 16, background: c }} />
        ))}
      </div>
      {bubbles.map((b, i) => {
        const bp = fade(frame, start + 8 + i * 8, 12);
        return (
          <div
            key={b}
            style={{
              marginLeft: i === 1 ? 95 : 0,
              marginBottom: 14,
              width: i === 2 ? '78%' : i === 1 ? '64%' : '88%',
              padding: '18px 22px',
              borderRadius: 20,
              background: i === 1 ? '#101318' : '#f0f2f4',
              color: i === 1 ? '#fff' : DESIGN.inkSoft,
              fontFamily: FONTS.sans,
              fontSize: 24 * scale,
              opacity: bp,
              transform: `translateX(${16 * (1 - bp)}px)`,
            }}
          >
            {b}
          </div>
        );
      })}
    </div>
  );
};

const NodeNetwork: React.FC<{
  frame: number;
  nodes: { label: string; x: number; y: number; color?: string }[];
  start?: number;
  dark?: boolean;
}> = ({ frame, nodes, start = 0, dark = false }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      {nodes.map((a, i) =>
        nodes.slice(i + 1).map((b, j) => {
          const lp = fade(frame, start + i * 5 + j * 2, 20);
          return (
            <line
              key={`${a.label}-${b.label}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={dark ? 'rgba(255,255,255,0.18)' : 'rgba(44,82,130,0.18)'}
              strokeWidth={2}
              opacity={lp}
            />
          );
        })
      )}
    </svg>
    {nodes.map((n, i) => {
      const a = pop(frame, start + i * 6, 0.4, 1.1, 16);
      return (
        <div
          key={n.label}
          style={{
            position: 'absolute',
            left: n.x,
            top: n.y,
            transform: `translate(-50%, -50%) ${a.transform}`,
            opacity: a.opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 18,
              background: n.color ?? COLORS.blue,
              boxShadow: `0 0 34px ${n.color ?? COLORS.blue}`,
            }}
          />
          <div
            style={{
              padding: '9px 15px',
              borderRadius: 14,
              background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.82)',
              color: dark ? '#fff' : DESIGN.ink,
              fontFamily: FONTS.sans,
              fontSize: 20,
              fontWeight: 750,
              whiteSpace: 'nowrap',
            }}
          >
            {n.label}
          </div>
        </div>
      );
    })}
  </div>
);

const INTRO_OFFSETS: Record<string, number> = {
  s01: 0,
  s02: s2f(3),
  s03: s2f(6),
  s04: s2f(10),
};

const IntroScene: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame + (INTRO_OFFSETS[sceneId] ?? 0);
  const stickerEnter = spring({
    frame: t - s2f(0.22),
    fps,
    config: { damping: 8, mass: 0.58, stiffness: 128 },
  });
  const stickerShrink = ease(t, [s2f(2.45), s2f(3.35)], [1, 0.47]);
  const stickerX = 540;
  const stickerY = ease(t, [s2f(2.45), s2f(3.35)], [770, 285]);
  const stickerOpacity = fade(t, s2f(0.15), 8);
  const stickerWobble =
    Math.sin(Math.max(0, t - s2f(0.25)) / 2.3) *
    ease(t, [s2f(0.4), s2f(1.25)], [8, 0]);
  const stickerScale = (0.52 + stickerEnter * 0.48) * stickerShrink;
  const nameOpacity =
    fade(t, s2f(1.15), 18) * (1 - fade(t, s2f(2.55), 14));
  const identityOpacity =
    fade(t, s2f(3.05), 15) * (1 - fade(t, s2f(5.75), 12));
  const chatBgOpacity =
    fade(t, s2f(3.25), 18) * (1 - fade(t, s2f(7.2), 18));
  const claimOpacity = fade(t, s2f(6.05), 12);
  const claimScale = ease(t, [s2f(6.05), s2f(6.85), s2f(9.55)], [0.72, 1, 1.1]);
  const claimY = ease(t, [s2f(6.05), s2f(6.85)], [42, 0]);
  const markerWidth = ease(t, [s2f(10.12), s2f(10.55)], [0, 690]);
  const shake =
    t >= s2f(10.08) && t <= s2f(10.75)
      ? Math.sin((t - s2f(10.08)) * 2.8) * 8
      : 0;
  const reversalOpacity = fade(t, s2f(10.55), 14);

  return (
    <SceneShell>
      <div
        style={{
          position: 'absolute',
          left: 116,
          top: 288,
          transform: `translateY(${Math.sin(t / 18) * 12}px) rotate(-4deg)`,
          opacity: chatBgOpacity * 0.5,
          filter: 'blur(1px)',
        }}
      >
        <ChatUI frame={t} start={s2f(3.1)} scale={0.78} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: stickerX,
          top: stickerY,
          width: 520,
          height: 520,
          opacity: stickerOpacity,
          transform: `translate(-50%, -50%) scale(${stickerScale}) rotate(${stickerWobble}deg)`,
          transformOrigin: 'center',
          filter:
            'drop-shadow(0 22px 0 rgba(255,255,255,0.95)) drop-shadow(0 42px 72px rgba(0,0,0,0.16))',
          zIndex: 8,
        }}
      >
        <Img src={STICKER} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1060,
          textAlign: 'center',
          opacity: nameOpacity,
          transform: `translateY(${20 * (1 - nameOpacity)}px)`,
        }}
      >
        <BigSerif size={88}>Sam Altman</BigSerif>
        <Label style={{ marginTop: 22 }}>Silicon Valley</Label>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 210,
          right: 210,
          top: 575,
          padding: '30px 38px',
          borderRadius: 26,
          background: 'rgba(255,255,255,0.92)',
          boxShadow: DESIGN.shadowMd,
          border: '1px solid rgba(26,26,26,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          opacity: identityOpacity,
          transform: `translateY(${32 * (1 - identityOpacity)}px)`,
        }}
      >
        <LogoMark text="AI" bg="#101318" size={82} />
        <div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 58, lineHeight: 1 }}>OpenAI</div>
          <Label style={{ marginTop: 8 }}>CEO</Label>
        </div>
      </div>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${shake}px)`,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 900,
            maxWidth: 900,
            textAlign: 'center',
            opacity: claimOpacity,
            transform: `translateY(${claimY}px) scale(${claimScale})`,
            transformOrigin: 'center',
          }}
        >
          <Label color={DESIGN.muted}>Public Assumption</Label>
          <div
            style={{
              marginTop: 28,
              fontFamily: FONTS.sans,
              fontSize: 54,
              fontWeight: 850,
              color: DESIGN.inkSoft,
            }}
          >
            只是
          </div>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginTop: 10,
              fontFamily: FONTS.sans,
              fontSize: 96,
              fontWeight: 950,
              lineHeight: 1.08,
              letterSpacing: 0,
              color: DESIGN.ink,
              whiteSpace: 'nowrap',
            }}
          >
            ChatGPT 的老板
            <div
              style={{
                position: 'absolute',
                left: -24,
                top: '53%',
                width: markerWidth,
                height: 18,
                borderRadius: 18,
                background: DESIGN.critical,
                transform: 'rotate(-4deg)',
                transformOrigin: 'left center',
              }}
            />
          </div>
          <div
            style={{
              marginTop: 64,
              opacity: reversalOpacity,
              transform: `scale(${0.82 + reversalOpacity * 0.18})`,
            }}
          >
            <BigSerif size={64} color={DESIGN.critical}>
              低估了
            </BigSerif>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = ease(frame, [s2f(0.25), s2f(3.2)], [0, 1]);
  const items = [
    { t: '19 YEARS OLD', y: 650 },
    { t: 'Stanford', y: 820 },
    { t: 'Drop Out', y: 990 },
    { t: 'Loopt', y: 1160 },
  ];
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: '270px 105px' }}>
        <Label>Before OpenAI</Label>
        <BigSerif size={82} style={{ marginTop: 28 }}>
          19 岁，退学创业
        </BigSerif>
        <svg width="870" height="760" style={{ position: 'absolute', top: 570, left: 105 }}>
          <line x1="86" y1="0" x2="86" y2="620" stroke="rgba(26,26,26,0.12)" strokeWidth="8" />
          <line
            x1="86"
            y1="0"
            x2="86"
            y2={620 * progress}
            stroke={DESIGN.accent}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
        {items.map((it, idx) => {
          const a = pop(frame, s2f(0.45 + idx * 0.62), 0.8, 1.04, 14);
          return (
            <div
              key={it.t}
              style={{
                position: 'absolute',
                left: 145,
                top: it.y,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                opacity: a.opacity,
                transform: a.transform,
              }}
            >
              <div style={{ width: 58, height: 58, borderRadius: 58, background: DESIGN.accent }} />
              <div style={{ fontFamily: FONTS.sans, fontSize: 48, fontWeight: 850 }}>{it.t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene06: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: '250px 94px' }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', ...rise(frame, 0) }}>
          <div style={{ width: 300, height: 240, background: '#ded7ca', borderRadius: 12 }} />
          <div style={{ width: 170, height: 320, background: '#cec6b8', borderRadius: 12 }} />
          <div style={{ width: 250, height: 190, background: '#e8e1d4', borderRadius: 12 }} />
        </div>
        <div
          style={{
            marginTop: -80,
            marginLeft: 80,
            width: 720,
            padding: '54px 58px',
            borderRadius: 26,
            background: '#fff',
            boxShadow: DESIGN.shadowLg,
            transform: `translateY(${ease(frame, [s2f(0.7), s2f(1.2)], [70, 0])}px)`,
            opacity: fade(frame, s2f(0.7), 16),
          }}
        >
          <Label color={COLORS.amber}>Acquisition</Label>
          <div style={{ fontFamily: FONTS.sans, fontSize: 64, fontWeight: 900, marginTop: 22 }}>
            Loopt sold for
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: FONTS.counter,
              fontSize: 118,
              fontWeight: 900,
              color: DESIGN.accent,
              letterSpacing: 0,
            }}
          >
            <Counter config={config.counters![0]} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene07: React.FC = () => {
  const frame = useCurrentFrame();
  const nodes = [
    { label: 'Founder', x: 235, y: 1030, color: COLORS.green },
    { label: 'Seed', x: 505, y: 820, color: COLORS.amber },
    { label: 'Demo Day', x: 770, y: 1040, color: COLORS.blue },
    { label: 'Growth', x: 535, y: 1245, color: COLORS.violet },
  ];
  const stamp = pop(frame, s2f(0.3), 1.8, 0.92, 15);
  return (
    <SceneShell>
      <NodeNetwork frame={frame} nodes={nodes} start={s2f(1.1)} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 520,
            height: 520,
            border: '18px solid #ff6d1a',
            borderRadius: 62,
            color: '#ff6d1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.sans,
            fontSize: 150,
            fontWeight: 950,
            letterSpacing: 0,
            opacity: stamp.opacity,
            transform: `${stamp.transform} rotate(-9deg)`,
            boxShadow: '0 28px 75px rgba(255,109,26,0.18)',
          }}
        >
          YC
        </div>
        <div style={{ marginTop: 640, textAlign: 'center', ...rise(frame, s2f(1.55)) }}>
          <Label>Y Combinator</Label>
          <BigSerif size={60} style={{ marginTop: 16 }}>
            接管硅谷创业机器
          </BigSerif>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const companies = [
    { name: 'Airbnb', mark: 'A', color: '#ff5a5f', x: 96, y: 470, r: -7 },
    { name: 'Stripe', mark: 'S', color: '#635bff', x: 385, y: 390, r: 5 },
    { name: 'Reddit', mark: 'R', color: '#ff4500', x: 665, y: 520, r: -4 },
    { name: 'Coinbase', mark: 'C', color: '#0052ff', x: 250, y: 910, r: 4 },
  ];
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: '260px 70px' }}>
        <Label>YC Portfolio</Label>
        <BigSerif size={78} style={{ marginTop: 24 }}>
          卡牌飞入
        </BigSerif>
        {companies.map((c, i) => {
          const a = pop(frame, s2f(0.45 + i * 0.7), 0.55, 1.08, 18);
          const orbit = Math.sin((frame + i * 18) / 22) * 12;
          return (
            <div
              key={c.name}
              style={{
                position: 'absolute',
                left: c.x,
                top: c.y + orbit,
                width: 320,
                height: 410,
                borderRadius: 28,
                padding: 34,
                background: '#fff',
                boxShadow: '0 30px 80px rgba(0,0,0,0.14)',
                opacity: a.opacity,
                transform: `${a.transform} rotate(${c.r}deg)`,
              }}
            >
              <LogoMark text={c.mark} bg={c.color} size={104} />
              <div style={{ marginTop: 80, fontFamily: FONTS.sans, fontSize: 42, fontWeight: 850 }}>
                {c.name}
              </div>
              <div style={{ marginTop: 12, fontFamily: FONTS.sans, fontSize: 20, color: DESIGN.muted }}>
                YC-backed company
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene09: React.FC = () => {
  const frame = useCurrentFrame();
  const p = fade(frame, s2f(0.2), 40);
  return (
    <SceneShell mode="dark">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 440,
            height: 440,
            borderRadius: 440,
            border: '2px solid rgba(255,255,255,0.28)',
            boxShadow: `0 0 ${90 + Math.sin(frame / 10) * 25}px rgba(255,255,255,0.28)`,
            opacity: p,
            transform: `scale(${0.86 + p * 0.14})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontFamily: FONTS.serif, fontSize: 90 }}>OpenAI</div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const chatScale = ease(frame, [0, s2f(2)], [1, 0.58]);
  const pull = ease(frame, [0, s2f(2.8)], [0, -180]);
  return (
    <SceneShell mode="dark">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `translateX(${pull}px) scale(${chatScale})` }}>
          <ChatUI frame={frame} start={0} scale={1} />
        </div>
        <div
          style={{
            marginLeft: 430,
            opacity: fade(frame, s2f(1), 18),
            transform: `translateX(${ease(frame, [s2f(1), s2f(1.8)], [90, 0])}px)`,
          }}
        >
          <Label color="rgba(255,255,255,0.52)">Bigger Layer</Label>
          <div style={{ fontFamily: FONTS.sans, fontSize: 72, fontWeight: 900, lineHeight: 1.06 }}>
            AI
            <br />
            Infrastructure
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene11: React.FC = () => {
  const frame = useCurrentFrame();
  const show = frame > s2f(0.5);
  return (
    <SceneShell mode="black">
      {show && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...pop(frame, s2f(0.55), 0.4, 1.04, 18), textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 48, fontWeight: 800, color: '#fff' }}>
              更离谱的是
            </div>
            <div style={{ marginTop: 28, fontFamily: FONTS.serif, fontSize: 150, color: COLORS.amber }}>
              ...
            </div>
          </div>
        </AbsoluteFill>
      )}
    </SceneShell>
  );
};

const Scene12: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const push = ease(frame, [0, s2f(5)], [1, 1.22]);
  return (
    <SceneShell mode="dark">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${push})` }}>
        <Label color="rgba(255,255,255,0.55)">OpenAI Valuation</Label>
        <div
          style={{
            marginTop: 30,
            fontFamily: FONTS.counter,
            fontSize: 220,
            fontWeight: 950,
            color: '#fff',
            letterSpacing: 0,
            textShadow: '0 0 70px rgba(255,255,255,0.25)',
          }}
        >
          <Counter config={config.counters![0]} />
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          {['1B', '10B', '100B', '300B'].map((v, i) => (
            <div
              key={v}
              style={{
                padding: '14px 18px',
                borderRadius: 14,
                background: i === 3 ? COLORS.green : 'rgba(255,255,255,0.12)',
                fontFamily: FONTS.sans,
                fontSize: 24,
                fontWeight: 800,
                opacity: fade(frame, s2f(0.3 + i * 0.55), 10),
              }}
            >
              {v}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene13: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const zero = pop(frame, s2f(0.25), 0.2, 1.08, 18);
  return (
    <SceneShell>
      {config.flashAtFrame != null && <Flash triggerFrame={config.flashAtFrame} />}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Label color={DESIGN.critical}>OpenAI Stake</Label>
        <div
          style={{
            marginTop: 30,
            fontFamily: FONTS.counter,
            fontSize: 410,
            fontWeight: 950,
            color: DESIGN.critical,
            lineHeight: 0.88,
            opacity: zero.opacity,
            transform: zero.transform,
          }}
        >
          0%
        </div>
        <div style={{ marginTop: 45, fontFamily: FONTS.sans, fontSize: 32, color: DESIGN.muted }}>
          long reported equity stake
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene14: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const typeWidth = ease(frame, [s2f(1), s2f(2.3)], [0, 1]);
  return (
    <SceneShell>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 760,
            padding: '56px 60px',
            borderRadius: 20,
            background: '#fff',
            boxShadow: DESIGN.shadowLg,
            border: '1px solid rgba(26,26,26,0.08)',
            ...rise(frame, s2f(0.15), 30, 16),
          }}
        >
          <Label>Payroll Statement</Label>
          <div style={{ marginTop: 46, display: 'grid', gap: 26 }}>
            {['Name    Sam Altman', 'Company OpenAI', 'Annual Salary'].map((line, i) => (
              <div
                key={line}
                style={{
                  fontFamily: FONTS.counter,
                  fontSize: 32,
                  color: i === 2 ? DESIGN.ink : DESIGN.muted,
                  opacity: fade(frame, s2f(0.4 + i * 0.2), 8),
                }}
              >
                {line}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 36,
              fontFamily: FONTS.counter,
              fontSize: 108,
              fontWeight: 900,
              color: DESIGN.ink,
              width: `${typeWidth * 100}%`,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <Counter config={config.counters![0]} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const assetNodes = [
  { label: 'Stripe', x: 240, y: 690, color: '#635bff' },
  { label: 'Reddit', x: 780, y: 760, color: '#ff4500' },
  { label: 'Helion', x: 220, y: 1170, color: COLORS.cyan },
  { label: 'Oklo', x: 780, y: 1225, color: COLORS.amber },
  { label: '$2B+', x: 540, y: 960, color: COLORS.green },
];

const Scene15: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <NodeNetwork frame={frame} nodes={assetNodes} start={s2f(0.45)} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ marginTop: -30, ...pop(frame, s2f(0.8), 0.5, 1.08, 18) }}>
          <div
            style={{
              fontFamily: FONTS.counter,
              fontSize: 150,
              fontWeight: 950,
              color: DESIGN.accent,
              textShadow: '0 18px 55px rgba(44,82,130,0.18)',
            }}
          >
            <Counter config={config.counters![0]} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene16: React.FC = () => {
  const frame = useCurrentFrame();
  const takeover = fade(frame, s2f(1.3), 45);
  return (
    <SceneShell mode="dark">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            opacity: 1 - takeover * 0.65,
            transform: `scale(${1 - takeover * 0.45})`,
            fontFamily: FONTS.serif,
            fontSize: 82,
          }}
        >
          OpenAI
        </div>
        <NodeNetwork frame={frame} nodes={assetNodes} start={s2f(0.65)} dark />
        <div
          style={{
            position: 'absolute',
            bottom: 560,
            textAlign: 'center',
            opacity: fade(frame, s2f(2.2), 16),
          }}
        >
          <Label color={COLORS.green}>Real Engine</Label>
          <div style={{ marginTop: 14, fontFamily: FONTS.sans, fontSize: 72, fontWeight: 950 }}>
            INVESTING
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene17: React.FC<{ config: SceneConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: '230px 82px' }}>
        <div
          style={{
            borderRadius: 18,
            background: '#101318',
            color: '#dce7f3',
            padding: '34px 38px',
            boxShadow: DESIGN.shadowLg,
            ...rise(frame, 0, 28, 14),
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 36 }}>
            <Label color="rgba(255,255,255,0.48)">Market Terminal</Label>
            <div style={{ fontFamily: FONTS.counter, color: COLORS.green, fontSize: 26 }}>IPO LIVE</div>
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 78, fontWeight: 950, color: '#fff' }}>
            Reddit, Inc.
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.12)', margin: '36px 0' }} />
          {['Ticker: RDDT', 'Shareholder rank: #3', 'Sam Altman stake'].map((l, i) => (
            <div
              key={l}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: FONTS.counter,
                fontSize: 34,
                padding: '20px 0',
                opacity: fade(frame, s2f(0.5 + i * 0.35), 10),
              }}
            >
              <span>{l}</span>
              <span style={{ color: i === 2 ? COLORS.green : '#fff' }}>
                {i === 2 ? <Counter config={config.counters![0]} /> : 'CONFIRMED'}
              </span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene18: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { label: 'Payment', x: 230, y: 560, color: '#635bff' },
    { label: 'AI', x: 540, y: 760, color: COLORS.blue },
    { label: 'Energy', x: 330, y: 1040, color: COLORS.green },
    { label: 'Fusion', x: 690, y: 1250, color: COLORS.cyan },
    { label: 'Nuclear', x: 830, y: 900, color: COLORS.amber },
  ];
  return (
    <SceneShell mode="dark">
      <NodeNetwork frame={frame} nodes={steps} start={s2f(0.35)} dark />
      <AbsoluteFill style={{ padding: '245px 84px' }}>
        <Label color="rgba(255,255,255,0.52)">Future Stack</Label>
        <div style={{ marginTop: 24, fontFamily: FONTS.sans, fontSize: 70, fontWeight: 950, lineHeight: 1.05 }}>
          支付
          <br />
          AI
          <br />
          能源
          <br />
          核聚变
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene19: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', ...rise(frame, s2f(0.2), 24, 18) }}>
          <Label>Common Label</Label>
          <div
            style={{
              marginTop: 34,
              fontFamily: FONTS.sans,
              fontSize: 112,
              fontWeight: 950,
              lineHeight: 1.02,
            }}
          >
            ChatGPT
            <br />
            Father
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene20: React.FC = () => {
  const frame = useCurrentFrame();
  const nodes = [
    { label: 'Stripe', x: 260, y: 720, color: '#635bff' },
    { label: 'Reddit', x: 780, y: 760, color: '#ff4500' },
    { label: 'Helion', x: 240, y: 1180, color: COLORS.cyan },
    { label: 'Oklo', x: 780, y: 1180, color: COLORS.amber },
  ];
  const converge = ease(frame, [s2f(0.5), s2f(2.2)], [0, 1]);
  return (
    <SceneShell>
      <NodeNetwork
        frame={frame}
        nodes={nodes.map((n) => ({
          ...n,
          x: n.x + (540 - n.x) * converge * 0.72,
          y: n.y + (960 - n.y) * converge * 0.72,
        }))}
        start={0}
      />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <SamSticker frame={frame} start={s2f(1.1)} size={360} centered />
        <div style={{ marginTop: 520, textAlign: 'center', opacity: fade(frame, s2f(1.7), 16) }}>
          <BigSerif size={62}>硅谷最会下注的人</BigSerif>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene21: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = [
    { t: 'Chatbot', x: 90, y: 520, r: -5 },
    { t: 'AI Image', x: 560, y: 660, r: 5 },
    { t: 'Writing', x: 150, y: 1040, r: 4 },
    { t: 'Agent', x: 590, y: 1180, r: -4 },
  ];
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: '250px 70px' }}>
        <Label>Most People See</Label>
        {cards.map((c, i) => {
          const a = rise(frame, s2f(0.3 + i * 0.45), 28, 16);
          return (
            <div
              key={c.t}
              style={{
                position: 'absolute',
                left: c.x,
                top: c.y + Math.sin((frame + i * 22) / 20) * 18,
                width: 380,
                padding: 30,
                borderRadius: 24,
                background: '#fff',
                boxShadow: DESIGN.shadowMd,
                transform: `${a.transform} rotate(${c.r}deg)`,
                opacity: a.opacity,
              }}
            >
              <ChatUI frame={frame} start={s2f(0.2 + i * 0.2)} scale={0.5} />
              <div style={{ marginTop: 22, fontFamily: FONTS.sans, fontSize: 36, fontWeight: 850 }}>
                {c.t}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene22: React.FC = () => {
  const frame = useCurrentFrame();
  const push = ease(frame, [0, s2f(7)], [0, -260]);
  const blocks = [
    { label: 'DATA CENTER', x: 110, h: 360, color: '#263345' },
    { label: 'CHIPS', x: 360, h: 500, color: '#304d70' },
    { label: 'GRID', x: 610, h: 430, color: '#2f5f54' },
    { label: 'FUSION', x: 800, h: 610, color: '#5a4830' },
  ];
  return (
    <SceneShell mode="dark">
      <AbsoluteFill style={{ transform: `translateY(${push}px)` }}>
        <div style={{ position: 'absolute', top: 360, left: 90 }}>
          <Label color="rgba(255,255,255,0.56)">Sam Is Planning</Label>
          <div style={{ marginTop: 22, fontFamily: FONTS.sans, fontSize: 66, fontWeight: 950, lineHeight: 1.05 }}>
            Energy
            <br />
            Chips
            <br />
            Infrastructure
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1050, height: 760 }}>
          {blocks.map((b, i) => {
            const a = rise(frame, s2f(0.8 + i * 0.55), 100, 22);
            return (
              <div
                key={b.label}
                style={{
                  position: 'absolute',
                  left: b.x,
                  bottom: 0,
                  width: 170,
                  height: b.h,
                  borderRadius: '22px 22px 0 0',
                  background: b.color,
                  boxShadow: `0 0 70px ${b.color}`,
                  opacity: a.opacity,
                  transform: a.transform,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 26,
                    left: 18,
                    right: 18,
                    fontFamily: FONTS.sans,
                    fontSize: 20,
                    fontWeight: 850,
                    color: 'rgba(255,255,255,0.78)',
                  }}
                >
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene23: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: '250px 82px', background: '#ece8df' }}>
        <div
          style={{
            width: '100%',
            height: 720,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #161616 0%, #505050 100%)',
            filter: 'grayscale(1)',
            boxShadow: DESIGN.shadowLg,
            opacity: fade(frame, 0, 18),
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: 72, bottom: 72 }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 76, color: '#fff' }}>“AI will</div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 76, color: '#fff' }}>exceed the internet.”</div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: 44,
              top: 44,
              padding: '10px 16px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.16)',
              color: '#fff',
              fontFamily: FONTS.counter,
              fontSize: 22,
            }}
          >
            ARCHIVE
          </div>
        </div>
        <div style={{ marginTop: 54, ...rise(frame, s2f(1.5), 24, 16) }}>
          <Label>Old Public Statement</Label>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene24: React.FC = () => {
  const frame = useCurrentFrame();
  const pull = ease(frame, [0, s2f(6)], [1.25, 0.86]);
  const nodes = [
    { label: 'Models', x: 240, y: 700, color: COLORS.blue },
    { label: 'Energy', x: 820, y: 820, color: COLORS.green },
    { label: 'Compute', x: 250, y: 1240, color: COLORS.violet },
    { label: 'Capital', x: 780, y: 1290, color: COLORS.amber },
    { label: 'AI Era', x: 540, y: 980, color: '#fff' },
  ];
  return (
    <SceneShell mode="dark">
      <div style={{ transform: `scale(${pull})` }}>
        <NodeNetwork frame={frame} nodes={nodes} start={0} dark />
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 650,
            height: 650,
            borderRadius: 650,
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 0 100px rgba(25,167,206,0.22) inset',
            transform: `scale(${pull})`,
          }}
        />
        <div style={{ position: 'absolute', bottom: 520, textAlign: 'center', opacity: fade(frame, s2f(2), 18) }}>
          <SamSticker frame={frame} start={s2f(1.2)} size={250} centered />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Scene25: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell mode="dark">
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 92px' }}>
        <div style={{ textAlign: 'center', opacity: fade(frame, s2f(0.4), 36) }}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 68,
              lineHeight: 1.28,
              color: '#fff',
              textShadow: '0 0 70px rgba(255,255,255,0.16)',
            }}
          >
            Sam Altman 不是 AI 的发明者，
            <br />
            而是 AI 时代的下注者。
          </div>
          <div style={{ marginTop: 66, fontFamily: FONTS.sans, fontSize: 24, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.45)' }}>
            SAM ALTMAN
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

export const StoryboardScene: React.FC<{ config: SceneConfig }> = ({ config }) => {
  switch (config.id) {
    case 's01':
    case 's02':
    case 's03':
    case 's04':
      return <IntroScene sceneId={config.id} />;
    case 's05':
      return <Scene05 />;
    case 's06':
      return <Scene06 config={config} />;
    case 's07':
      return <Scene07 />;
    case 's08':
      return <Scene08 />;
    case 's09':
      return <Scene09 />;
    case 's10':
      return <Scene10 />;
    case 's11':
      return <Scene11 />;
    case 's12':
      return <Scene12 config={config} />;
    case 's13':
      return <Scene13 config={config} />;
    case 's14':
      return <Scene14 config={config} />;
    case 's15':
      return <Scene15 config={config} />;
    case 's16':
      return <Scene16 />;
    case 's17':
      return <Scene17 config={config} />;
    case 's18':
      return <Scene18 />;
    case 's19':
      return <Scene19 />;
    case 's20':
      return <Scene20 />;
    case 's21':
      return <Scene21 />;
    case 's22':
      return <Scene22 />;
    case 's23':
      return <Scene23 />;
    case 's24':
      return <Scene24 />;
    case 's25':
      return <Scene25 />;
    default:
      return <SceneShell />;
  }
};
