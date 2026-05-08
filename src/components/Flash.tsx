import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const Flash: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 3, triggerFrame + 12],
    [0, 0.5, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        opacity,
        pointerEvents: 'none',
        zIndex: 200,
      }}
    />
  );
};
