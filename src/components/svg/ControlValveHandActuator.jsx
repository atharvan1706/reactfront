import React from 'react';

const GateValveIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#7f7f7f',
  midColor = '#e5e5e5',
  endColor = '#ffffff'
}) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const filterId = `filter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 76.5 112.5"
      className={className}
    >
      <defs>
        {/* Depth / soft shadow */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>

        {/* Generic metallic gradient */}
        <linearGradient id={`${gradientId}_metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* Handle radial gradient */}
        <radialGradient id={`${gradientId}_handle`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#737373" />
          <stop offset="37%" stopColor="#F7F7F7" />
          <stop offset="50%" stopColor="#F8F8F8" />
          <stop offset="74%" stopColor="#DEDEDE" />
          <stop offset="100%" stopColor="#737373" />
        </radialGradient>

        {/* Port gradient */}
        <linearGradient id={`${gradientId}_port`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Handle - Right Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.143,0 C54.64,0 68.813,13.972 68.813,30.952 L37.05,30.86 L37.143,0z" fill={startColor} />
        <path d="M37.143,2 C53.54,0 66.813,13.972 66.813,28.952 L37.05,28.86 L37.143,2z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.143,4 C52.44,0 64.813,13.972 64.813,26.952 L37.05,26.86 L37.143,4z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.143,6 C51.34,0 62.813,13.972 62.813,24.952 L37.05,24.86 L37.143,6z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.143,8 C50.24,0 60.813,13.972 60.813,22.952 L37.05,22.86 L37.143,8z" fill={endColor} />
        
        <path d="M37.143,0 C54.64,0 68.813,13.972 68.813,30.952 L37.05,30.86" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Handle - Left Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.938,0 C20.854,0 7.013,13.95 7.013,30.903 l31.015,-0.09 L37.938,0z" fill={startColor} />
        <path d="M37.938,2 C21.954,0 9.013,13.95 9.013,28.903 l29.015,-0.09 L37.938,2z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.938,4 C23.054,0 11.013,13.95 11.013,26.903 l27.015,-0.09 L37.938,4z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.938,6 C24.154,0 13.013,13.95 13.013,24.903 l25.015,-0.09 L37.938,6z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.938,8 C25.254,0 15.013,13.95 15.013,22.903 l23.015,-0.09 L37.938,8z" fill={endColor} />
        
        <path d="M37.938,0 C20.854,0 7.013,13.95 7.013,30.903 l31.015,-0.09" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Vertical Pipe ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M34.2,30.43 l7.425,0 0,63.225 -7.425,0 0,-63.225z" fill={`url(#${gradientId}_metal)`} />
        <path d="M35.2,31.43 l5.425,0 0,61.225 -5.425,0 0,-61.225z" fill={`url(#${gradientId}_metal)`} />
        <path d="M36.2,32.43 l3.425,0 0,59.225 -3.425,0 0,-59.225z" fill={`url(#${gradientId}_metal)`} />
        <path d="M36.9,33.13 l2.025,0 0,57.825 -2.025,0 0,-57.825z" fill={endColor} />

        <path d="M34.2,30.43 l0,63.225" stroke="#000" strokeWidth="2" />
        <path d="M41.625,93.655 l0,-63.225" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Horizontal Rod ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M68.85,41.175 l7.65,0 0,22.95 -7.65,0 0,-22.95z" fill={`url(#${gradientId}_metal)`} />
        <path d="M69.85,42.175 l5.65,0 0,20.95 -5.65,0 0,-20.95z" fill={`url(#${gradientId}_metal)`} />
        <path d="M70.85,43.175 l3.65,0 0,18.95 -3.65,0 0,-18.95z" fill={`url(#${gradientId}_metal)`} />
        <path d="M71.55,43.875 l2.25,0 0,17.55 -2.25,0 0,-17.55z" fill={endColor} />

        <path d="M68.85,41.175 l0,22.95" stroke="#000" strokeWidth="2" />
        <path d="M76.5,64.125 l0,-22.95" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Rod Connector ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="37.912,52.3 41.639,48.605 68.948,48.605 72.675,52.331 68.948,56.025 41.639,56.025" fill={`url(#${gradientId}_metal)`} />
        <polygon points="39.212,52.3 42.639,49.605 67.648,49.605 70.675,52.331 67.648,55.025 42.639,55.025" fill={`url(#${gradientId}_metal)`} />
        <polygon points="40.512,52.3 43.639,50.605 66.348,50.605 68.675,52.331 66.348,54.025 43.639,54.025" fill={`url(#${gradientId}_metal)`} />
        <polygon points="41.412,52.3 44.639,51.305 65.048,51.305 67.175,52.331 65.048,53.325 44.639,53.325" fill={endColor} />

        <polygon points="37.912,52.3 41.639,48.605 68.948,48.605 72.675,52.331 68.948,56.025 41.639,56.025" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,112.5 L0,74.7 37.737,93.568 0,112.5z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,110.5 L2,76.7 35.737,93.568 2,110.5z" fill={`url(#${gradientId}_port)`} />
        <path d="M4,108.5 L4,78.7 33.737,93.568 4,108.5z" fill={`url(#${gradientId}_port)`} />
        <path d="M6,106.5 L6,80.7 31.737,93.568 6,106.5z" fill={`url(#${gradientId}_port)`} />
        <path d="M8,104.5 L8,82.7 29.737,93.568 8,104.5z" fill={`url(#${gradientId}_port)`} />
        <path d="M10,102.5 L10,84.7 27.737,93.568 10,102.5z" fill={endColor} />

        <path d="M0,112.5 L0,74.7 37.737,93.568" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.737,93.568 L75.6,112.5 75.6,74.7 37.737,93.568z" fill={`url(#${gradientId}_port)`} />
        <path d="M39.737,93.568 L73.6,110.5 73.6,76.7 39.737,93.568z" fill={`url(#${gradientId}_port)`} />
        <path d="M41.737,93.568 L71.6,108.5 71.6,78.7 41.737,93.568z" fill={`url(#${gradientId}_port)`} />
        <path d="M43.737,93.568 L69.6,106.5 69.6,80.7 43.737,93.568z" fill={`url(#${gradientId}_port)`} />
        <path d="M45.737,93.568 L67.6,104.5 67.6,82.7 45.737,93.568z" fill={`url(#${gradientId}_port)`} />
        <path d="M47.737,93.568 L65.6,102.5 65.6,84.7 47.737,93.568z" fill={endColor} />

        <path d="M37.737,93.568 L75.6,112.5 75.6,74.7" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default GateValveIcon;