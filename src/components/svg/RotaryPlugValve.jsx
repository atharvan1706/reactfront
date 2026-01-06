import React from 'react';

const ValveIcon = ({
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
      viewBox="0 0 69.44 112.5"
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

        {/* Valve body radial gradient */}
        <radialGradient id={`${gradientId}_valve_body`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4C4C4C" />
          <stop offset="37%" stopColor="#EFEFEF" />
          <stop offset="50%" stopColor="#F1F1F1" />
          <stop offset="74%" stopColor="#BDBDBD" />
          <stop offset="100%" stopColor="#4C4C4C" />
        </radialGradient>

        {/* Main valve radial gradient */}
        <radialGradient id={`${gradientId}_valve`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="40%" stopColor="#B7B7B7" />
          <stop offset="75%" stopColor="#7B7B7B" />
          <stop offset="100%" stopColor={startColor} />
        </radialGradient>

        {/* Port gradient */}
        <linearGradient id={`${gradientId}_port`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Valve Body - Left Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M35.048,0.053 c-17.513,0 -31.703,13.987 -31.703,30.984 l31.795,-0.091 L35.048,0.053z" fill={`url(#${gradientId}_valve_body)`} />
        <path d="M35.048,0.053 c-17.513,0 -31.703,13.987 -31.703,30.984 l31.795,-0.091" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Valve Body - Right Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M34.616,0 c17.513,0 31.702,13.987 31.702,30.984 l-31.794,-0.09 L34.616,0z" fill={`url(#${gradientId}_valve_body)`} />
        <path d="M34.616,0 c17.513,0 31.702,13.987 31.702,30.984 l-31.794,-0.09" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Top Port (Center) ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M30.886,29.986 l7.44,0 0,21.868 -7.44,0 0,-21.868z" fill={`url(#${gradientId}_port)`} />
        <path d="M31.886,30.986 l5.44,0 0,19.868 -5.44,0 0,-19.868z" fill={`url(#${gradientId}_port)`} />
        <path d="M32.886,31.986 l3.44,0 0,17.868 -3.44,0 0,-17.868z" fill={`url(#${gradientId}_port)`} />
        <path d="M33.486,32.586 l2.24,0 0,16.668 -2.24,0 0,-16.668z" fill={endColor} />

        <path d="M30.886,29.986 l0,21.868" stroke="#000" strokeWidth="2" />
        <path d="M38.326,51.854 l0,-21.868" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Main Valve (Circle) ===== */}
      <g filter={`url(#${filterId})`}>
        <ellipse cx="34.719" cy="81.387" rx="31.111" ry="31.111" fill={`url(#${gradientId}_valve)`} />
        <ellipse cx="34.719" cy="81.387" rx="28.111" ry="28.111" fill={`url(#${gradientId}_valve)`} />
        <ellipse cx="34.719" cy="81.387" rx="25.111" ry="25.111" fill={`url(#${gradientId}_valve)`} />
        <ellipse cx="34.719" cy="81.387" rx="22.111" ry="22.111" fill={`url(#${gradientId}_valve)`} />
        <ellipse cx="34.719" cy="81.387" rx="19.111" ry="19.111" fill={`url(#${gradientId}_valve)`} />
        <ellipse cx="34.719" cy="81.387" rx="16.111" ry="16.111" fill={endColor} />

        <ellipse cx="34.719" cy="81.387" rx="31.111" ry="31.111" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port (Bottom) ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,55.461 l7.439,0 0,50.95 -7.439,0 0,-50.95z" fill={`url(#${gradientId}_port)`} />
        <path d="M1,56.461 l5.439,0 0,48.95 -5.439,0 0,-48.95z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,57.461 l3.439,0 0,46.95 -3.439,0 0,-46.95z" fill={`url(#${gradientId}_port)`} />
        <path d="M2.7,58.161 l1.939,0 0,45.55 -1.939,0 0,-45.55z" fill={endColor} />

        <path d="M0,55.461 l0,50.95" stroke="#000" strokeWidth="2" />
        <path d="M7.439,106.411 l0,-50.95" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Right Port (Bottom) ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M61.997,55.461 l7.44,0 0,50.95 -7.44,0 0,-50.95z" fill={`url(#${gradientId}_port)`} />
        <path d="M62.997,56.461 l5.44,0 0,48.95 -5.44,0 0,-48.95z" fill={`url(#${gradientId}_port)`} />
        <path d="M63.997,57.461 l3.44,0 0,46.95 -3.44,0 0,-46.95z" fill={`url(#${gradientId}_port)`} />
        <path d="M64.697,58.161 l1.94,0 0,45.55 -1.94,0 0,-45.55z" fill={endColor} />

        <path d="M61.997,55.461 l0,50.95" stroke="#000" strokeWidth="2" />
        <path d="M69.438,106.411 l0,-50.95" stroke="#000" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default ValveIcon;