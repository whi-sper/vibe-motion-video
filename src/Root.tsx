import React from 'react';
import { Composition } from 'remotion';
import { Sam } from './Sam';
import { FPS, TOTAL_FRAMES } from './config/timing';

export const Root: React.FC = () => {
  return (
    <Composition
      id="SamAltman"
      component={Sam}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
