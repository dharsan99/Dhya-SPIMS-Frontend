import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'blue',
  height = 40,
  width = 100,
}) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const colorClasses = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    yellow: 'stroke-yellow-500',
    red: 'stroke-red-500',
  };

  return (
    <svg
      width={width}
      height={height}
      className="sparkline"
      style={{ overflow: 'visible' }}
    >
      <polyline
        points={points}
        fill="none"
        strokeWidth="2"
        className={colorClasses[color as keyof typeof colorClasses]}
        style={{
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
      />
    </svg>
  );
}; 