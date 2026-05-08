import React from 'react';
import { AbsoluteFill } from 'remotion';
import { DESIGN } from '../config/design-tokens';

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: DESIGN.bg,
        backgroundImage: [
          'radial-gradient(circle at 50% 0%, #ffffff 0%, transparent 60%)',
          `radial-gradient(circle at 50% 100%, rgba(44, 82, 130, 0.04) 0%, transparent 50%)`,
        ].join(', '),
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
