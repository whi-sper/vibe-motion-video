import React from 'react';
import { Audio, Series, staticFile, useCurrentFrame } from 'remotion';
import { PhoneFrame } from './components/PhoneFrame';
import { ProgressBar } from './components/ProgressBar';
import { Caption } from './components/Caption';
import { SCENE_CONFIGS } from './config/timing';
import { SCENE_AUDIO } from './data/scene-audio';
import type { SceneConfig } from './types';

// Scene component imports
import { SceneA } from './scenes/SceneA';
import { SceneB } from './scenes/SceneB';
import { SceneC } from './scenes/SceneC';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';
import { Scene6 } from './scenes/Scene6';
import { Scene7 } from './scenes/Scene7';
import { Scene8 } from './scenes/Scene8';

const SCENE_MAP: Record<string, React.FC<{ config: SceneConfig }>> = {
  a: SceneA,
  b: SceneB,
  c: SceneC,
  '1': Scene1,
  '2': Scene2,
  '3': Scene3,
  '4': Scene4,
  '5': Scene5,
  '6': Scene6,
  '7': Scene7,
  '8': Scene8,
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
                {audio ? <Audio src={staticFile(audio.src)} /> : null}
              </>
            </Series.Sequence>
          );
        })}
      </Series>

      <Caption frame={frame} scenes={SCENE_CONFIGS} />
    </PhoneFrame>
  );
};
