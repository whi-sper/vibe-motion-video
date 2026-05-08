import React from 'react';
import { useCurrentFrame } from 'remotion';
import { strikeOut } from '../animations/presets';
import { DESIGN } from '../config/design-tokens';

interface StrikeThroughProps {
  children: React.ReactNode;
  startFrame: number;
  style?: React.CSSProperties;
}

export const StrikeThrough: React.FC<StrikeThroughProps> = ({
  children,
  startFrame,
  style,
}) => {
  const frame = useCurrentFrame();
  const width = strikeOut(frame, startFrame);

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '0 10px',
        ...style,
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          left: '-2%',
          top: '52%',
          width: `${width}%`,
          height: 4,
          backgroundColor: DESIGN.critical,
        }}
      />
    </span>
  );
};
