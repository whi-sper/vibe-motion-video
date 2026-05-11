import type { SceneConfig } from '../types';

export const FPS = 30;

export const s2f = (seconds: number): number => Math.round(seconds * FPS);

export const SCENE_CONFIGS: SceneConfig[] = [
  {
    id: 's01',
    durationInFrames: s2f(3),
    caption: { text: 'Sam Altman想必大家都不陌生。', charStaggerFrames: 1.6 },
  },
  {
    id: 's02',
    durationInFrames: s2f(3),
    caption: { text: '很多人都是通过 OpenAI 认识他的。', charStaggerFrames: 1.3 },
  },
  {
    id: 's03',
    durationInFrames: s2f(4),
    caption: { text: '但如果你以为他只是“ChatGPT 的老板”。', charStaggerFrames: 1.2 },
  },
  {
    id: 's04',
    durationInFrames: s2f(2),
    caption: { text: '那就太低估这个人了。', charStaggerFrames: 1.2 },
  },
  {
    id: 's05',
    durationInFrames: s2f(4),
    caption: { text: '他 19 岁从斯坦福辍学创业。', charStaggerFrames: 1.2 },
  },
  {
    id: 's06',
    durationInFrames: s2f(4),
    caption: { text: '第一家公司卖了 4000 多万美元。', charStaggerFrames: 1.2 },
    counters: [
      { from: 0, to: 43_400_000, prefix: '$', format: 'big', startFrame: s2f(1.6), durationFrames: s2f(0.8) },
    ],
  },
  {
    id: 's07',
    durationInFrames: s2f(5),
    caption: { text: '28 岁时，他接管了硅谷最神秘的创业组织之一：Y Combinator。', charStaggerFrames: 0.9 },
  },
  {
    id: 's08',
    durationInFrames: s2f(6),
    caption: { text: '在他手里，YC 投出了 Airbnb、Stripe、Reddit、Coinbase。', charStaggerFrames: 0.9 },
  },
  {
    id: 's09',
    durationInFrames: s2f(3),
    caption: { text: '后来，他又创办了 OpenAI。', charStaggerFrames: 1.3 },
  },
  {
    id: 's10',
    durationInFrames: s2f(3),
    caption: { text: '而 ChatGPT，只是这个故事里最出圈的一部分。', charStaggerFrames: 0.9 },
  },
  {
    id: 's11',
    durationInFrames: s2f(5),
    caption: { text: '更离谱的是——', startFrame: s2f(0.5), charStaggerFrames: 2 },
  },
  {
    id: 's12',
    durationInFrames: s2f(5),
    caption: { text: 'OpenAI 估值已经冲到数千亿美元。', charStaggerFrames: 1.1 },
    counters: [
      { from: 1, to: 300, prefix: '$', suffix: 'B', startFrame: s2f(0.45), durationFrames: s2f(2.6) },
    ],
  },
  {
    id: 's13',
    durationInFrames: s2f(4),
    caption: { text: '但 Sam Altman 在 OpenAI 的持股，长期以来一直是 0。', charStaggerFrames: 0.9 },
    flashAtFrame: s2f(0.65),
  },
  {
    id: 's14',
    durationInFrames: s2f(4),
    caption: { text: '他公开披露过，自己在 OpenAI 年薪只有 7.6 万美元。', charStaggerFrames: 0.85 },
    counters: [
      { from: 0, to: 76000, prefix: '$', format: 'big', startFrame: s2f(1), durationFrames: s2f(1.4) },
    ],
  },
  {
    id: 's15',
    durationInFrames: s2f(5),
    caption: { text: '可与此同时，他的个人身价却早已超过 20 亿美元。', charStaggerFrames: 0.95 },
    counters: [
      { from: 0, to: 2_000_000_000, prefix: '$', format: 'cn', startFrame: s2f(0.8), durationFrames: s2f(1.1) },
    ],
  },
  {
    id: 's16',
    durationInFrames: s2f(5),
    caption: { text: '因为他真正厉害的地方，不是“经营 OpenAI”。而是投资。', charStaggerFrames: 0.85 },
  },
  {
    id: 's17',
    durationInFrames: s2f(6),
    caption: { text: '在 Reddit 上市前，他一度是 Reddit 的第三大股东。', charStaggerFrames: 0.9 },
    counters: [
      { from: 0, to: 8.7, suffix: '%', decimals: 1, startFrame: s2f(1.4), durationFrames: s2f(1) },
    ],
  },
  {
    id: 's18',
    durationInFrames: s2f(5),
    caption: { text: '他还很早押注了 Stripe、核聚变公司 Helion Energy、以及核能公司 Oklo。', charStaggerFrames: 0.7 },
  },
  {
    id: 's19',
    durationInFrames: s2f(6),
    caption: { text: '很多人说，他不是 ChatGPT 之父。', charStaggerFrames: 1.1 },
  },
  {
    id: 's20',
    durationInFrames: s2f(3),
    caption: { text: '他更像：硅谷最会下注的人。', charStaggerFrames: 1.25 },
  },
  {
    id: 's21',
    durationInFrames: s2f(6),
    caption: { text: '因为别人还在研究“AI 能做什么”的时候。', charStaggerFrames: 1 },
  },
  {
    id: 's22',
    durationInFrames: s2f(7),
    caption: { text: 'Sam Altman 已经在布局：AI 需要什么能源、什么芯片、什么基础设施。', charStaggerFrames: 0.75 },
  },
  {
    id: 's23',
    durationInFrames: s2f(6),
    caption: { text: '很多年前，他就公开说过一句话：“AI 对世界的改变，会超过互联网。”', charStaggerFrames: 0.75 },
  },
  {
    id: 's24',
    durationInFrames: s2f(6),
    caption: { text: '现在回头看，他说得可能还是保守了。', charStaggerFrames: 1 },
  },
  {
    id: 's25',
    durationInFrames: s2f(5),
    caption: { text: '' },
  },
];

export const TOTAL_FRAMES = SCENE_CONFIGS.reduce(
  (sum, s) => sum + s.durationInFrames,
  0
);
