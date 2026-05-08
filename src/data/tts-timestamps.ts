import type { TTSSegment } from '../types';

/**
 * TTS word-level timestamps.
 *
 * Initially empty — populate after generating TTS audio.
 * When populated, the Caption component will auto-switch
 * from stagger mode to TTS-synced mode.
 *
 * Example entry:
 * {
 *   sceneId: 'a',
 *   words: [
 *     { word: 'Sam', startSec: 0.1, endSec: 0.35 },
 *     { word: 'Altman', startSec: 0.38, endSec: 0.72 },
 *     { word: '想必', startSec: 0.75, endSec: 1.1 },
 *     { word: '大家', startSec: 1.12, endSec: 1.4 },
 *     { word: '都不陌生', startSec: 1.43, endSec: 2.0 },
 *   ],
 * }
 */
export const TTS_DATA: TTSSegment[] = [];
