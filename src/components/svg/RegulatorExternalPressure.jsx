import React from 'react';

const ValveIcon = ({
  width = 64,
  height = 64,
  bodyColor = '#1f7a1f',
  midColor = '#4fae4f',
  darkColor = '#0f3d0f',
  className = ''
}) => {
  const id = Math.random().toString(36).slice(2, 9);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 86.18 112.5"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* ===== MAIN METAL ===== */}
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="50%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={darkColor} />
        </linearGradient>

        {/* ===== RADIAL HANDLE ===== */}
        <radialGradient id={`handle-${id}`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="55%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={darkColor} />
        </radialGradient>

        {/* ===== HARD RIM HIGHLIGHT ===== */}
        <radialGradient id={`rim-${id}`} cx="50%" cy="50%" r="55%">
          <stop offset="85%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
        </radialGradient>

        {/* ===== DEPTH SHADOW ===== */}
        <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ================= PIPE TOP ================= */}
      <rect
        x="30.8"
        y="0"
        width="55.4"
        height="7.9"
        fill={`url(#metal-${id})`}
        filter={`url(#shadow-${id})`}
      />

      {/* ================= RIGHT PIPE ================= */}
      <rect
        x="78.3"
        y="0"
        width="7.9"
        height="95.9"
        fill={`url(#metal-${id})`}
        filter={`url(#shadow-${id})`}
      />

      {/* ================= LEFT PIPE TOP ================= */}
      <rect
        x="30.8"
        y="0"
        width="7.9"
        height="33"
        fill={`url(#metal-${id})`}
      />

      {/* ================= LEFT PIPE BOTTOM ================= */}
      <rect
        x="30.8"
        y="31.2"
        width="7.9"
        height="64.2"
        fill={`url(#metal-${id})`}
      />

      {/* ================= HANDLE BODY ================= */}
      <g filter={`url(#shadow-${id})`}>
        <path
          d="M35.83,10.624c-15.94,0-28.854,12.73-28.854,28.2l28.938-0.083L35.83,10.624"
          fill={`url(#handle-${id})`}
        />
        <path
          d="M35.107,10.624c15.563,0,28.174,12.709,28.174,28.156l-28.256-0.083L35.107,10.624"
          fill={`url(#handle-${id})`}
        />
        <ellipse
          cx="35.5"
          cy="38"
          rx="28"
          ry="26"
          fill={`url(#rim-${id})`}
        />
      </g>

      {/* ================= BOTTOM PORT RIGHT ================= */}
      <path
        d="M34.581,95.365l34.72,17.135V78.3"
        fill={`url(#metal-${id})`}
        filter={`url(#shadow-${id})`}
      />

      {/* ================= BOTTOM PORT LEFT ================= */}
      <path
        d="M0.001,112.5V78.3l34.58,17.065"
        fill={`url(#metal-${id})`}
        filter={`url(#shadow-${id})`}
      />
    </svg>
  );
};

export default ValveIcon;
