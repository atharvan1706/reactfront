import React from 'react';

const ValveIconV2 = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#5C5C5C',
  midColor = '#EBEBEB',
  endColor = '#5C5C5C'
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
        {/* ===== SHARED LINEAR METAL ===== */}
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="57%" stopColor={midColor} />
          <stop offset="77%" stopColor={endColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>

        {/* ===== RADIAL VALVE METAL ===== */}
        <radialGradient id={`valve-left-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="40%" stopColor={midColor} />
          <stop offset="70%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </radialGradient>

        <radialGradient id={`valve-right-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="40%" stopColor={midColor} />
          <stop offset="70%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </radialGradient>

        {/* ===== CLIP PATHS ===== */}
        <clipPath id={`clip-top-${id}`}>
          <rect x="30.826" width="55.35" height="7.875" />
        </clipPath>

        <clipPath id={`clip-leftpipe-${id}`}>
          <rect x="30.826" y="33.145" width="7.875" height="62.286" />
        </clipPath>
      </defs>

      {/* ===== TOP PIPE ===== */}
      <rect
        x="30.826"
        width="55.35"
        height="7.875"
        clipPath={`url(#clip-top-${id})`}
        fill={`url(#metal-${id})`}
      />

      {/* ===== RIGHT PIPE ===== */}
      <rect
        x="78.301"
        width="7.875"
        height="48.812"
        fill={`url(#metal-${id})`}
      />

      {/* ===== LEFT PIPE TOP ===== */}
      <rect
        x="30.826"
        width="7.875"
        height="33.144"
        fill={`url(#metal-${id})`}
      />

      {/* ===== LEFT PIPE BOTTOM ===== */}
      <rect
        x="30.826"
        y="33.145"
        width="7.875"
        height="62.286"
        clipPath={`url(#clip-leftpipe-${id})`}
        fill={`url(#metal-${id})`}
      />

      {/* ===== ANGLED CONNECTOR ===== */}
      <polygon
        points="59.307,24.038 108.393,73.123 59.307,122.21 10.221,73.123"
        fill={`url(#metal-${id})`}
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -34.3 55.9)"
      />

      {/* ===== VALVE LEFT ===== */}
      <path
        d="M6.976,38.823l28.939-0.083L35.83,10.624C19.89,10.624,6.976,23.353,6.976,38.823"
        fill={`url(#valve-left-${id})`}
      />

      {/* ===== VALVE RIGHT ===== */}
      <path
        d="M35.059,38.693l28.258,0.083c0-15.447-12.612-28.157-28.176-28.157L35.059,38.693z"
        fill={`url(#valve-right-${id})`}
      />

      {/* ===== BOTTOM LEFT PORT ===== */}
      <path
        d="M0.001,78.384L34.65,95.277L0.001,112.415V78.384"
        fill={`url(#metal-${id})`}
      />

      {/* ===== BOTTOM RIGHT PORT ===== */}
      <path
        d="M68.807,78.511L34.65,95.203l34.156,16.938V78.511"
        fill={`url(#metal-${id})`}
      />
    </svg>
  );
};

export default ValveIconV2;
