import { interpolate, Easing } from 'remotion';

export interface AnimStyle {
  opacity: number;
  transform: string;
  filter?: string;
}

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ─── Basic ───────────────────────────────────────────────

/** opacity 0→1 */
export function fadeIn(frame: number, start: number, dur = 12): AnimStyle {
  const opacity = interpolate(frame, [start, start + dur], [0, 1], CLAMP);
  return { opacity, transform: 'none' };
}

// ─── Number / Title Entrances ────────────────────────────

/** opacity + translateY(20→0) + blur(8→0) */
export function numIn(frame: number, start: number, dur = 18): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: Math.min(p * 2.5, 1),
    transform: `translateY(${20 * (1 - p)}px)`,
    filter: `blur(${8 * (1 - p)}px)`,
  };
}

/** scale(0.85→1.03→1) + blur(12→0) + translateY(15→0) */
export function megaIn(frame: number, start: number, dur = 24): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 0.6, 1], [0.85, 1.03, 1]);
  const ty = interpolate(p, [0, 0.6, 1], [15, 0, 0]);
  const blur = interpolate(p, [0, 0.3, 1], [12, 0, 0]);
  const opacity = interpolate(p, [0, 0.15, 1], [0, 1, 1]);
  return {
    opacity,
    transform: `scale(${scale}) translateY(${ty}px)`,
    filter: `blur(${blur}px)`,
  };
}

// ─── Slide Entrances ─────────────────────────────────────

/** opacity + translateY(8→0) */
export function nameSlide(frame: number, start: number, dur = 15): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: p,
    transform: `translateY(${8 * (1 - p)}px)`,
  };
}

/** opacity + translateY(10→0) */
export function cardSlide(frame: number, start: number, dur = 12): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: p,
    transform: `translateY(${10 * (1 - p)}px)`,
  };
}

/** opacity + translateX(-16→0) */
export function bioSlideIn(
  frame: number,
  start: number,
  dur = 15
): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: p,
    transform: `translateX(${-16 * (1 - p)}px)`,
  };
}

// ─── Scale / Bounce Entrances ────────────────────────────

/** scale(0.6→1.06→1) */
export function appPop(frame: number, start: number, dur = 12): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 0.6, 1], [0.6, 1.06, 1]);
  return {
    opacity: Math.min(p * 2, 1),
    transform: `scale(${scale})`,
  };
}

/** scale(0.4→1.05→1) + blur(20→0) */
export function zeroIn(frame: number, start: number, dur = 27): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 0.6, 1], [0.4, 1.05, 1]);
  const blur = interpolate(p, [0, 0.4, 1], [20, 0, 0]);
  const opacity = interpolate(p, [0, 0.15, 1], [0, 1, 1]);
  return {
    opacity,
    transform: `scale(${scale})`,
    filter: `blur(${blur}px)`,
  };
}

/** scale(0.8→1.08→1) + rotate(-2→0) */
export function italicReveal(
  frame: number,
  start: number,
  dur = 18
): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 0.6, 1], [0.8, 1.08, 1]);
  const rotate = interpolate(p, [0, 0.6, 1], [-2, 0, 0]);
  return {
    opacity: Math.min(p * 2, 1),
    transform: `scale(${scale}) rotate(${rotate}deg)`,
  };
}

// ─── Text Effects ────────────────────────────────────────

/** opacity + translateY(12→0) + blur(4→0) */
export function wordRise(frame: number, start: number, dur = 15): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: p,
    transform: `translateY(${12 * (1 - p)}px)`,
    filter: `blur(${4 * (1 - p)}px)`,
  };
}

/** Per-char caption: opacity + translateY(4→0) */
export function wordIn(frame: number, start: number, dur = 9): AnimStyle {
  const p = interpolate(frame, [start, start + dur], [0, 1], CLAMP);
  return {
    opacity: p,
    transform: `translateY(${4 * (1 - p)}px)`,
  };
}

// ─── Progress / Fill ─────────────────────────────────────

/** Returns width percentage 0→target */
export function barGrow(
  frame: number,
  start: number,
  target: number,
  dur = 27
): number {
  return interpolate(frame, [start, start + dur], [0, target], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
}

/** Returns stroke-dashoffset 502→target */
export function pieGrow(
  frame: number,
  start: number,
  target: number,
  dur = 33
): number {
  return interpolate(frame, [start, start + dur], [502, target], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
}

/** Returns width percentage 0→104 for strikethrough line */
export function strikeOut(frame: number, start: number, dur = 15): number {
  return interpolate(frame, [start, start + dur], [0, 104], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
}

// ─── Complex Multi-phase ─────────────────────────────────

/**
 * Sticker: enter big + centered → wobble → shrink + move up
 * Total 114 frames (3.8s at 30fps)
 */
export function stickerFullAnim(
  frame: number,
  start: number,
  dur = 114
): AnimStyle {
  const t = interpolate(frame, [start, start + dur], [0, 1], CLAMP);
  const opacity = interpolate(t, [0, 0.08, 1], [0, 1, 1]);
  const scale = interpolate(
    t,
    [0, 0.08, 0.55, 0.8, 1],
    [0.5, 1.35, 1.35, 1, 1]
  );
  const ty = interpolate(t, [0, 0.08, 0.55, 0.8, 1], [140, 140, 140, 0, 0]);
  const rotate = interpolate(
    t,
    [0, 0.08, 0.18, 0.26, 0.34, 0.42, 1],
    [0, 0, -6, 5, -3, 0, 0]
  );
  return {
    opacity,
    transform: `scale(${scale}) translateY(${ty}px) rotate(${rotate}deg)`,
  };
}
