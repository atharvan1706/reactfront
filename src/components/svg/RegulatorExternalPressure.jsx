import React from 'react';

const ValveIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#3a3a3a',
  midColor = '#e6e6e6',
  endColor = '#2b2b2b'
}) => {
  const gid = `valve-${Math.random().toString(36).substr(2, 9)}`;
  const fid = `filter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 112.5 112.5"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* ===== Soft depth ===== */}
        <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.4" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>

        {/* ===== Main metal ===== */}
        <linearGradient id={`${gid}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* ===== Valve core ===== */}
        <radialGradient id={`${gid}-core`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="60%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </radialGradient>

        {/* ===== Rim highlight ===== */}
        <radialGradient id={`${gid}-rim`} cx="50%" cy="50%" r="55%">
          <stop offset="80%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
        </radialGradient>
      </defs>

      {/* ===== Top pipe ===== */}
      <rect
        x="30"
        y="0"
        width="52"
        height="10"
        fill={`url(#${gid}-metal)`}
        filter={`url(#${fid})`}
      />

      {/* ===== Right pipe ===== */}
      <rect
        x="82"
        y="0"
        width="10"
        height="90"
        fill={`url(#${gid}-metal)`}
        filter={`url(#${fid})`}
      />

      {/* ===== Left pipe ===== */}
      <rect
        x="20"
        y="0"
        width="10"
        height="90"
        fill={`url(#${gid}-metal)`}
        filter={`url(#${fid})`}
      />

      {/* ===== Valve body ===== */}
      <g filter={`url(#${fid})`}>
        <ellipse
          cx="56"
          cy="48"
          rx="32"
          ry="30"
          fill={`url(#${gid}-core)`}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.8"
        />
        <ellipse
          cx="56"
          cy="48"
          rx="32"
          ry="30"
          fill={`url(#${gid}-rim)`}
        />
      </g>

      {/* ===== Bottom ports ===== */}
      <path
        d="M56 92 L96 112 V78"
        fill={`url(#${gid}-metal)`}
        filter={`url(#${fid})`}
      />
      <path
        d="M56 92 L16 112 V78"
        fill={`url(#${gid}-metal)`}
        filter={`url(#${fid})`}
      />
    </svg>
  );
};

export default ValveIcon;
