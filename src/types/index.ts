export type SceneId =
  | 'a'
  | 'b'
  | 'c'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8';

export interface CounterConfig {
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  format?: 'cn' | 'big' | 'default';
  decimals?: number;
  /** Frame (relative to scene start) when counter begins */
  startFrame: number;
  /** Duration in frames */
  durationFrames: number;
}

export interface CaptionTiming {
  text: string;
  /** Per-character stagger delay in frames (default: 1) */
  charStaggerFrames?: number;
  /** Frame offset from scene start when caption begins */
  startFrame?: number;
}

export interface TTSWordTimestamp {
  word: string;
  startSec: number;
  endSec: number;
}

export interface TTSSegment {
  sceneId: SceneId;
  words: TTSWordTimestamp[];
}

export interface SceneConfig {
  id: SceneId;
  durationInFrames: number;
  caption: CaptionTiming;
  counters?: CounterConfig[];
  flashAtFrame?: number;
  tts?: TTSSegment;
}
