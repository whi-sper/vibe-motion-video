import type { SceneConfig } from '../types';
import { SCENE_AUDIO } from '../data/scene-audio';

export const FPS = 30;

/** Convert seconds to frames */
export const s2f = (seconds: number): number => Math.round(seconds * FPS);

const POST_AUDIO_PADDING_SEC = 0.5;

const sceneDuration = (
  sceneId: SceneConfig['id'],
  fallbackSec: number
): number => {
  const audioDurationSec = SCENE_AUDIO[sceneId]?.durationSec;
  return s2f(
    typeof audioDurationSec === 'number'
      ? audioDurationSec + POST_AUDIO_PADDING_SEC
      : fallbackSec
  );
};

/**
 * MASTER TIMING SHEET
 *
 * This is THE file you edit when TTS audio comes back.
 * durationInFrames automatically uses TTS duration + 0.5s when audio metadata exists.
 * Change counter startFrame/durationFrames to sync with speech.
 */
export const SCENE_CONFIGS: SceneConfig[] = [
  // Scene A: Sticker reveal + provocation (9s)
  {
    id: 'a',
    durationInFrames: sceneDuration('a', 9),
    caption: { text: 'Sam Altman 想必大家都不陌生' },
  },
  // Scene B: Bio sketch (6.5s)
  {
    id: 'b',
    durationInFrames: sceneDuration('b', 6.5),
    caption: { text: '8 岁拆电脑，17 岁进斯坦福，19 岁退学。' },
  },
  // Scene C: Quote + Loopt (6.5s)
  {
    id: 'c',
    durationInFrames: sceneDuration('c', 6.5),
    caption: { text: '19 岁，他创办第一家公司 Loopt，后来卖了 4000 多万美元。' },
  },
  // Scene D: YC takeover + portfolio reveal (7.5s)
  {
    id: 'd',
    durationInFrames: sceneDuration('d', 7.5),
    caption: {
      text: '28 岁时，他接管了硅谷最神秘的创业组织之一：Y Combinator。在他手里，YC 投出了：Airbnb、Stripe、Reddit、Coinbase。',
    },
  },
  // Scene E: OpenAI ecosystem reveal (7s)
  {
    id: 'e',
    durationInFrames: sceneDuration('e', 7),
    caption: {
      text: '后来，他创办了 OpenAI。而 ChatGPT，只是这个故事里最出圈的一部分。',
    },
  },
  // Scene F: Valuation rocket → 0 stake reveal (8s)
  {
    id: 'f',
    durationInFrames: sceneDuration('f', 8),
    caption: {
      text: '更离谱的是—— OpenAI 估值已经冲到数千亿美元。但 Sam Altman 在 OpenAI 的持股，长期以来一直是 0。',
    },
  },
  // Scene G: Hook — salary vs net worth (6.5s, reuses Scene1)
  {
    id: 'g',
    durationInFrames: sceneDuration('g', 6.5),
    caption: { text: '20 年后的今天，他在 OpenAI 年薪 7 万 6。但身价 20 亿。' },
    counters: [
      {
        from: 0,
        to: 76000,
        prefix: '$',
        format: 'big',
        startFrame: s2f(0.3),
        durationFrames: s2f(0.8),
      },
      {
        from: 0,
        to: 2_000_000_000,
        prefix: '$',
        format: 'cn',
        startFrame: s2f(1.9),
        durationFrames: s2f(1.2),
      },
    ],
    flashAtFrame: s2f(1.9),
  },
  // Scene H: Sam as investor — sticker + investment network (7s)
  {
    id: 'h',
    durationInFrames: sceneDuration('h', 7),
    caption: {
      text: '因为他真正厉害的地方，不是"经营 OpenAI"。而是投资。',
    },
  },
  // Scene 2: Stripe (5.5s)
  {
    id: '2',
    durationInFrames: sceneDuration('2', 5.5),
    caption: { text: '$15,000 买 Stripe 2% 股份。如今 700 亿。' },
    counters: [
      {
        from: 0,
        to: 70_000_000_000,
        prefix: '$',
        format: 'cn',
        startFrame: s2f(1.3),
        durationFrames: s2f(1.3),
      },
    ],
  },
  // Scene 3: Reddit (5s)
  {
    id: '3',
    durationInFrames: sceneDuration('3', 5),
    caption: { text: 'Reddit 上市，他持股 8.7% — CEO 的 2 倍多。' },
    counters: [
      {
        from: 0,
        to: 8.7,
        suffix: '%',
        decimals: 1,
        startFrame: s2f(0.8),
        durationFrames: s2f(1),
      },
    ],
  },
  // Scene 4: Portfolio (5.5s)
  {
    id: '4',
    durationInFrames: sceneDuration('4', 5.5),
    caption: { text: 'Airbnb、Reddit、Uber、Dropbox… 他押中了一整代。' },
    counters: [
      {
        from: 0,
        to: 400,
        suffix: '+',
        startFrame: s2f(1.3),
        durationFrames: s2f(0.8),
      },
    ],
  },
  // Scene 5: Hard tech (6s)
  {
    id: '5',
    durationInFrames: sceneDuration('5', 6),
    caption: { text: '3.75 亿押核聚变，1.8 亿砸抗衰老。' },
    counters: [
      {
        from: 0,
        to: 375_000_000,
        prefix: '$',
        format: 'cn',
        startFrame: s2f(1.3),
        durationFrames: s2f(0.7),
      },
      {
        from: 0,
        to: 180_000_000,
        prefix: '$',
        format: 'cn',
        startFrame: s2f(2.2),
        durationFrames: s2f(0.7),
      },
    ],
  },
  // Scene 6: Oklo (5.5s)
  {
    id: '6',
    durationInFrames: sceneDuration('6', 5.5),
    caption: { text: 'Oklo 创始股 0.002 美金。三年回报 7 万倍。' },
    counters: [
      {
        from: 0,
        to: 880_000_000,
        prefix: '$',
        format: 'cn',
        startFrame: s2f(1.7),
        durationFrames: s2f(1),
      },
    ],
  },
  // Scene 7: Zero (5.5s)
  {
    id: '7',
    durationInFrames: sceneDuration('7', 5.5),
    caption: { text: '而他在 OpenAI 的持股 — 是 0。' },
    flashAtFrame: s2f(0.9),
  },
  // Scene 8: Closing (5.5s)
  {
    id: '8',
    durationInFrames: sceneDuration('8', 5.5),
    caption: { text: '他不是 ChatGPT 之父。他是硅谷最会下注的人。' },
  },
];

export const TOTAL_FRAMES = SCENE_CONFIGS.reduce(
  (sum, s) => sum + s.durationInFrames,
  0
);
