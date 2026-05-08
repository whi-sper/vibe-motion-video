import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import type { CounterConfig } from '../types';
import { FONTS } from '../config/fonts';

function formatChinese(n: number): { num: string; unit: string } {
  const abs = Math.abs(n);
  if (abs >= 1e8) {
    const v = n / 1e8;
    return { num: v % 1 === 0 ? v.toFixed(1) : v.toFixed(1), unit: '亿' };
  }
  if (abs >= 1e4) {
    const v = n / 1e4;
    return { num: v % 1 === 0 ? v.toFixed(1) : v.toFixed(1), unit: '万' };
  }
  return { num: Math.round(n).toString(), unit: '' };
}

const cnUnitStyle: React.CSSProperties = {
  fontFamily: FONTS.notoSansSC,
  fontSize: '0.62em',
  fontWeight: 500,
  marginLeft: '0.08em',
  letterSpacing: '0.02em',
  verticalAlign: '0.08em',
  opacity: 0.85,
};

interface CounterProps {
  config: CounterConfig;
  style?: React.CSSProperties;
}

export const Counter: React.FC<CounterProps> = ({ config, style }) => {
  const frame = useCurrentFrame();
  const {
    from,
    to,
    prefix = '',
    suffix = '',
    format = 'default',
    decimals = 0,
    startFrame,
    durationFrames,
  } = config;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.poly(3)),
    }
  );

  const currentValue = from + (to - from) * progress;
  const visible = frame >= startFrame - 3;

  let display: React.ReactNode;
  if (format === 'cn') {
    const { num, unit } = formatChinese(currentValue);
    display = (
      <>
        {prefix}
        {num}
        {unit && <span style={cnUnitStyle}>{unit}</span>}
        {suffix}
      </>
    );
  } else if (format === 'big') {
    display = `${prefix}${Math.round(currentValue).toLocaleString('en-US')}${suffix}`;
  } else if (decimals > 0) {
    display = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;
  } else {
    display = `${prefix}${Math.round(currentValue).toLocaleString('en-US')}${suffix}`;
  }

  return (
    <span
      style={{
        fontFamily: FONTS.counter,
        fontVariantNumeric: 'tabular-nums',
        opacity: visible ? 1 : 0,
        ...style,
      }}
    >
      {display}
    </span>
  );
};
