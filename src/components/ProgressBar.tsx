import React from 'react';
import { interpolate } from 'remotion';
import type { SceneConfig } from '../types';

interface ProgressBarProps {
  frame: number;
  scenes: SceneConfig[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ frame, scenes }) => {
  const boundaries: number[] = [0];
  scenes.forEach((s) =>
    boundaries.push(boundaries[boundaries.length - 1] + s.durationInFrames)
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        left: 36,
        right: 36,
        display: 'flex',
        gap: 10,
        zIndex: 50,
      }}
    >
      {scenes.map((scene, i) => {
        const segStart = boundaries[i];
        const segEnd = boundaries[i + 1];

        let fillPercent: number;
        if (frame >= segEnd) {
          fillPercent = 100;
        } else if (frame < segStart) {
          fillPercent = 0;
        } else {
          fillPercent = interpolate(
            frame,
            [segStart, segEnd],
            [0, 100],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
        }

        return (
          <div
            key={scene.id}
            style={{
              flex: 1,
              height: 5,
              backgroundColor: 'rgba(26,26,26,0.1)',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${fillPercent}%`,
                height: '100%',
                backgroundColor: '#1a1a1a',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
