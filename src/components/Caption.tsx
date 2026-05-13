import React from 'react';
import { interpolate } from 'remotion';
import type { SceneConfig } from '../types';
import { FONTS } from '../config/fonts';
import { DESIGN } from '../config/design-tokens';
import { SCENE_AUDIO } from '../data/scene-audio';
import { AUDIO_PLAYBACK_RATE, FPS } from '../config/timing';

interface CaptionProps {
  frame: number;
  scenes: SceneConfig[];
}

interface SentenceTiming {
  text: string;
  startFrame: number;
  durationFrames: number;
  endFrame: number;
}

const SENTENCE_REGEX = /[^。！？；：:!?]+[。！？；：:!?]?/g;
const TRAILING_PUNCTUATION_REGEX = /[。！？；：:!?，、,]+$/;

const splitIntoSentences = (text: string): string[] => {
  const sentences = text.match(SENTENCE_REGEX)?.map((part) => part.trim()).filter(Boolean);
  return sentences && sentences.length > 0 ? sentences : [text.trim()].filter(Boolean);
};

const stripTrailingPunctuation = (text: string): string =>
  text.replace(TRAILING_PUNCTUATION_REGEX, '');

const getSentenceWeight = (sentence: string): number => {
  let weight = 0;

  for (const char of sentence) {
    if (/\s/.test(char)) {
      weight += 0.15;
    } else if (/[，、,:]/.test(char)) {
      weight += 0.7;
    } else if (/[。！？；!?]/.test(char)) {
      weight += 1.4;
    } else if (/[A-Za-z0-9]/.test(char)) {
      weight += 0.65;
    } else {
      weight += 1;
    }
  }

  return Math.max(weight, 1);
};

const buildSentenceTimings = ({
  text,
  startFrame,
  durationFrames,
}: {
  text: string;
  startFrame: number;
  durationFrames: number;
}): SentenceTiming[] => {
  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    return [];
  }

  const totalFrames = Math.max(durationFrames, sentences.length);
  const weights = sentences.map(getSentenceWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let cursor = startFrame;
  let usedFrames = 0;

  return sentences.map((sentence, index) => {
    const remainingSentences = sentences.length - index;
    const remainingFrames = totalFrames - usedFrames;
    const rawFrames = Math.round((totalFrames * weights[index]) / totalWeight);
    const allocatedFrames =
      index === sentences.length - 1
        ? remainingFrames
        : Math.max(1, Math.min(rawFrames, remainingFrames - (remainingSentences - 1)));

    const timing = {
      text: sentence,
      startFrame: cursor,
      durationFrames: allocatedFrames,
      endFrame: cursor + allocatedFrames,
    };

    cursor += allocatedFrames;
    usedFrames += allocatedFrames;
    return timing;
  });
};

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
  const audioMeta = SCENE_AUDIO[activeScene.id];
  const captionText = audioMeta?.text ?? caption.text;
  const startFrame = caption.startFrame ?? 0;
  const stagger = caption.charStaggerFrames ?? 1;

  const spokenDurationFrames = audioMeta?.durationSec
    ? Math.max(
        1,
        Math.min(
          activeScene.durationInFrames - startFrame,
          Math.round((audioMeta.durationSec / AUDIO_PLAYBACK_RATE) * FPS)
        )
      )
    : null;

  if (spokenDurationFrames) {
    const sentenceTimings = buildSentenceTimings({
      text: captionText,
      startFrame,
      durationFrames: spokenDurationFrames,
    });

    if (sentenceTimings.length > 0) {
      if (localFrame < sentenceTimings[0].startFrame) {
        return <div style={containerStyle} />;
      }

      let activeSentence = sentenceTimings[sentenceTimings.length - 1];
      for (const sentence of sentenceTimings) {
        if (localFrame >= sentence.startFrame) {
          activeSentence = sentence;
        }
        if (localFrame < sentence.endFrame) {
          break;
        }
      }

      const chars = stripTrailingPunctuation(activeSentence.text).split('');
      const revealWindow = Math.max(
        10,
        Math.min(activeSentence.durationFrames * 0.72, Math.max(chars.length * 4, 18))
      );
      const charStep = chars.length > 0 ? revealWindow / chars.length : revealWindow;

      return (
        <div style={containerStyle}>
          {chars.map((ch, i) => {
            const charStart = activeSentence.startFrame + i * charStep;
            const p = interpolate(localFrame, [charStart, charStart + 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={`${activeSentence.startFrame}-${i}`}
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
    }
  }

  // TTS-synced mode
  if (tts && tts.words.length > 0) {
    const currentSec = localFrame / FPS;
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
  const chars = stripTrailingPunctuation(captionText).split('');
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
