import React from 'react';

const ValveIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#373737',
  midColor = '#EBEBEB',
  endColor = '#373737'
}) => {
  const id = Math.random().toString(36).substr(2, 9);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 86.18 112.5"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* ===== PIPE / PORT METAL ===== */}
        {[1,2,3,4,7,8].map(n => (
          <linearGradient
            key={n}
            id={`pipe-${n}-${id}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={startColor} />
            <stop offset="45%" stopColor={midColor} />
            <stop offset="55%" stopColor={midColor} />
            <stop offset="75%" stopColor={endColor} />
            <stop offset="100%" stopColor={startColor} />
          </linearGradient>
        ))}

        {/* ===== HANDLE LEFT ===== */}
        <radialGradient
          id={`handle-left-${id}`}
          cx="49%"
          cy="45%"
          r="55%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={midColor} />
          <stop offset="35%" stopColor={midColor} />
          <stop offset="65%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </radialGradient>

        {/* ===== HANDLE RIGHT (mirrored) ===== */}
        <radialGradient
          id={`handle-right-${id}`}
          cx="51%"
          cy="45%"
          r="55%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={midColor} />
          <stop offset="35%" stopColor={midColor} />
          <stop offset="65%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </radialGradient>
      </defs>

      {/* ===== TOP PIPE ===== */}
      <rect
        x="30.826"
        width="55.35"
        height="7.875"
        fill={`url(#pipe-1-${id})`}
      />

      {/* ===== RIGHT PIPE ===== */}
      <polygon
        fill={`url(#pipe-2-${id})`}
        points="78.301,7.875 78.301,95.85 86.176,95.85 86.176,0"
      />

      {/* ===== LEFT PIPE TOP ===== */}
      <polygon
        fill={`url(#pipe-3-${id})`}
        points="30.826,0 30.826,33 38.701,32.834 38.701,7.875"
      />

      {/* ===== LEFT PIPE BOTTOM ===== */}
      <polygon
        fill={`url(#pipe-4-${id})`}
        points="30.826,31.417 30.826,95.452 38.701,95.452 38.701,31.243"
      />

      {/* ===== HANDLE LEFT ===== */}
      <path
        fill={`url(#handle-left-${id})`}
        d="M35.83,10.624c-15.94,0-28.854,12.73-28.854,28.2l28.938-0.083L35.83,10.624"
      />

      {/* ===== HANDLE RIGHT ===== */}
      <path
        fill={`url(#handle-right-${id})`}
        d="M35.107,10.624c15.563,0,28.174,12.709,28.174,28.156l-28.256-0.083L35.107,10.624"
      />

      {/* ===== BOTTOM RIGHT PORT ===== */}
      <path
        fill={`url(#pipe-7-${id})`}
        d="M34.581,95.365l34.72,17.135V78.3"
      />

      {/* ===== BOTTOM LEFT PORT ===== */}
      <path
        fill={`url(#pipe-8-${id})`}
        d="M0.001,112.5V78.3l34.58,17.065"
      />
    </svg>
  );
};

export default ValveIcon;
