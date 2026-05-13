import React from 'react';
import { Audio, Series, staticFile, useCurrentFrame } from 'remotion';
import { PhoneFrame } from './components/PhoneFrame';
import { ProgressBar } from './components/ProgressBar';
import { Caption } from './components/Caption';
import { SCENE_CONFIGS, AUDIO_PLAYBACK_RATE } from './config/timing';
import { SCENE_AUDIO } from './data/scene-audio';
import type { SceneConfig } from './types';

// Scene component imports
import { SceneA } from './scenes/SceneA';
import { SceneB } from './scenes/SceneB';
import { SceneC } from './scenes/SceneC';
import { SceneD } from './scenes/SceneD';
import { SceneE } from './scenes/SceneE';
import { SceneF } from './scenes/SceneF';
import { SceneH } from './scenes/SceneH';
import { SceneJ } from './scenes/SceneJ';
import { SceneK } from './scenes/SceneK';
import { SceneL } from './scenes/SceneL';
import { Scene1 } from './scenes/Scene1';
import { Scene3 } from './scenes/Scene3';

const SCENE_MAP: Record<string, React.FC<{ config: SceneConfig }>> = {
  a: SceneA,
  b: SceneB,
  c: SceneC,
  d: SceneD,
  e: SceneE,
  f: SceneF,
  'g': Scene1,
  h: SceneH,
  i: Scene3,
  j: SceneJ,
  k: SceneK,
  l: SceneL,
};

export const Sam: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <PhoneFrame>
      {/* <ProgressBar frame={frame} scenes={SCENE_CONFIGS} /> */}

      <Series>
        {SCENE_CONFIGS.map((config) => {
          const SceneComp = SCENE_MAP[config.id];
          const audio = SCENE_AUDIO[config.id];

          return (
            <Series.Sequence
              key={config.id}
              durationInFrames={config.durationInFrames}
            >
              <>
                <SceneComp config={config} />
                {audio ? (
                  <Audio
                    src={staticFile(audio.src)}
                    playbackRate={AUDIO_PLAYBACK_RATE}
                  />
                ) : null}
              </>
            </Series.Sequence>
          );
        })}
      </Series>

      <Caption frame={frame} scenes={SCENE_CONFIGS} />
    </PhoneFrame>
  );
};
