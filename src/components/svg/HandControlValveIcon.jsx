import React from 'react';

const HandControlValveIcon = ({
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
      viewBox="0 0 112.5 106.39"
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

        {/* Port gradient */}
        <linearGradient id={`${gradientId}_port`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Top Handle Bar ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M6.338,0 l99.824,0 0,13.128 -99.824,0 0,-13.128z" fill={`url(#${gradientId}_metal)`} />
        <path d="M7.338,1 l97.824,0 0,11.128 -97.824,0 0,-11.128z" fill={`url(#${gradientId}_metal)`} />
        <path d="M8.338,2 l95.824,0 0,9.128 -95.824,0 0,-9.128z" fill={`url(#${gradientId}_metal)`} />
        <path d="M9.338,3 l93.824,0 0,7.128 -93.824,0 0,-7.128z" fill={`url(#${gradientId}_metal)`} />
        <path d="M10.338,4 l91.824,0 0,5.128 -91.824,0 0,-5.128z" fill={endColor} />

        <path d="M6.338,0 l99.824,0 0,13.128 -99.824,0 0,-13.128z" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Vertical Handle ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="49.998,12.773 49.998,78.179 63.353,78.179 63.353,12.972 56.676,6.255" fill={`url(#${gradientId}_metal)`} />
        <polygon points="51.498,14.273 51.498,76.679 61.853,76.679 61.853,14.472 56.676,9.255" fill={`url(#${gradientId}_metal)`} />
        <polygon points="52.998,15.773 52.998,75.179 60.353,75.179 60.353,15.972 56.676,12.255" fill={`url(#${gradientId}_metal)`} />
        <polygon points="54.198,16.973 54.198,73.979 58.853,73.979 58.853,17.172 56.676,14.255" fill={endColor} />

        <polygon points="49.998,12.773 49.998,78.179 63.353,78.179 63.353,12.972 56.676,6.255" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,50.808 L57.007,78.395 0,106.39 0,50.808z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,52.808 L55.007,78.395 2,104.39 2,52.808z" fill={`url(#${gradientId}_port)`} />
        <path d="M4,54.808 L53.007,78.395 4,102.39 4,54.808z" fill={`url(#${gradientId}_port)`} />
        <path d="M6,56.808 L51.007,78.395 6,100.39 6,56.808z" fill={`url(#${gradientId}_port)`} />
        <path d="M8,58.808 L49.007,78.395 8,98.39 8,58.808z" fill={`url(#${gradientId}_port)`} />
        <path d="M10,60.808 L47.007,78.395 10,96.39 10,60.808z" fill={endColor} />

        <path d="M0,50.808 L57.007,78.395 0,106.39" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M56.25,78.393 L112.5,50.367 112.5,106.831 56.25,78.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M58.25,78.393 L110.5,52.367 110.5,104.831 58.25,78.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M60.25,78.393 L108.5,54.367 108.5,102.831 60.25,78.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M62.25,78.393 L106.5,56.367 106.5,100.831 62.25,78.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M64.25,78.393 L104.5,58.367 104.5,98.831 64.25,78.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M66.25,78.393 L102.5,60.367 102.5,96.831 66.25,78.393z" fill={endColor} />

        <path d="M56.25,78.393 L112.5,50.367 112.5,106.831" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default HandControlValveIcon;
