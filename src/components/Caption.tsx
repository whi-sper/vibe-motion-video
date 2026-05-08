import React from 'react';
import { interpolate } from 'remotion';
import type { SceneConfig } from '../types';
import { FONTS } from '../config/fonts';
import { DESIGN } from '../config/design-tokens';

interface CaptionProps {
  frame: number;
  scenes: SceneConfig[];
}

export const Caption: React.FC<CaptionProps> = ({ frame, scenes }) => {
  // Find active scene and compute scene-local frame
  let accumulated = 0;
  let activeScene: SceneConfig | null = null;
  let localFrame = 0;
  for (const scene of scenes) {
    if (frame < accumulated + scene.durationInFrames) {
      activeScene = scene;
      localFrame = frame - accumulated;
      break;
    }
    accumulated += scene.durationInFrames;
  }

  if (!activeScene) return null;

  const { caption, tts } = activeScene;
  const startFrame = caption.startFrame ?? 0;
  const stagger = caption.charStaggerFrames ?? 1;

  // TTS-synced mode
  if (tts && tts.words.length > 0) {
    const fps = 30;
    const currentSec = localFrame / fps;
    return (
      <div style={containerStyle}>
        {tts.words.map((w, i) => {
          const visible = currentSec >= w.startSec;
          const p = visible
            ? interpolate(
                currentSec,
                [w.startSec, w.startSec + 0.15],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
            : 0;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: p,
                transform: `translateY(${4 * (1 - p)}px)`,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    );
  }

  // Simple stagger mode (default)
  const chars = caption.text.split('');
  return (
    <div style={containerStyle}>
      {chars.map((ch, i) => {
        const charStart = startFrame + i * stagger;
        const p = interpolate(localFrame, [charStart, charStart + 9], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${4 * (1 - p)}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 300,
  left: 52,
  right: 52,
  zIndex: 40,
  fontFamily: FONTS.chinese,
  fontSize: 34,
  lineHeight: 1.65,
  color: DESIGN.inkSoft,
  textAlign: 'center',
  padding: '36px 42px',
  fontWeight: 400,
  minHeight: 130,
  letterSpacing: '0.01em',
};
