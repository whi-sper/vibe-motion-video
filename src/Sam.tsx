import React from 'react';
import { Audio, Series, staticFile, useCurrentFrame } from 'remotion';
import { PhoneFrame } from './components/PhoneFrame';
import { Caption } from './components/Caption';
import { SCENE_CONFIGS } from './config/timing';
import { SCENE_AUDIO } from './data/scene-audio';
import { StoryboardScene } from './scenes/StoryboardScene';

export const Sam: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <PhoneFrame>
      <Series>
        {SCENE_CONFIGS.map((config) => {
          const audio = SCENE_AUDIO[config.id];

          return (
            <Series.Sequence
              key={config.id}
              durationInFrames={config.durationInFrames}
            >
              <>
                <StoryboardScene config={config} />
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
