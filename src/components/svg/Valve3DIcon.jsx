import React from 'react';

const Valve3DIcon = ({
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
      viewBox="0 0 101.002 112.5"
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

      {/* ===== Handle - Left Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M50.227,0.069 c-22.843,0 -41.351,18.243 -41.351,40.413 l41.471,-0.118 L50.227,0.069z" fill={startColor} />
        <path d="M50.227,2.569 c-21.743,0 -39.351,17.343 -39.351,38.413 l39.471,-0.118 L50.227,2.569z" fill={`url(#${gradientId}_metal)`} />
        <path d="M50.227,5.069 c-20.643,0 -37.351,16.443 -37.351,36.413 l37.471,-0.118 L50.227,5.069z" fill={`url(#${gradientId}_metal)`} />
        <path d="M50.227,7.569 c-19.543,0 -35.351,15.543 -35.351,34.413 l35.471,-0.118 L50.227,7.569z" fill={`url(#${gradientId}_metal)`} />
        <path d="M50.227,10.069 c-18.443,0 -33.351,14.643 -33.351,32.413 l33.471,-0.118 L50.227,10.069z" fill={endColor} />
        
        <path d="M50.227,0.069 c-22.843,0 -41.351,18.243 -41.351,40.413 l41.471,-0.118" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Handle - Right Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M49.664,0 c22.843,0 41.351,18.243 41.351,40.413 l-41.471,-0.118 L49.664,0z" fill={startColor} />
        <path d="M49.664,2.5 c21.743,0 39.351,17.343 39.351,38.413 l-39.471,-0.118 L49.664,2.5z" fill={`url(#${gradientId}_metal)`} />
        <path d="M49.664,5 c20.643,0 37.351,16.443 37.351,36.413 l-37.471,-0.118 L49.664,5z" fill={`url(#${gradientId}_metal)`} />
        <path d="M49.664,7.5 c19.543,0 35.351,15.543 35.351,34.413 l-35.471,-0.118 L49.664,7.5z" fill={`url(#${gradientId}_metal)`} />
        <path d="M49.664,10 c18.443,0 33.351,14.643 33.351,32.413 l-33.471,-0.118 L49.664,10z" fill={endColor} />
        
        <path d="M49.664,0 c22.843,0 41.351,18.243 41.351,40.413 l-41.471,-0.118" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Vertical Pipe ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M46.323,37.368 l7.56,0 0,50.333 -7.56,0 0,-50.333z" fill={`url(#${gradientId}_metal)`} />
        <path d="M47.323,38.368 l5.56,0 0,48.333 -5.56,0 0,-48.333z" fill={`url(#${gradientId}_metal)`} />
        <path d="M48.323,39.368 l3.56,0 0,46.333 -3.56,0 0,-46.333z" fill={`url(#${gradientId}_metal)`} />
        <path d="M49.023,40.068 l2.16,0 0,44.933 -2.16,0 0,-44.933z" fill={endColor} />

        <path d="M46.323,37.368 l0,50.333" stroke="#000" strokeWidth="2" />
        <path d="M53.883,87.701 l0,-50.333" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,62.301 L50.594,87.665 0,112.5 0,62.301z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,64.301 L48.594,87.665 2,110.5 2,64.301z" fill={`url(#${gradientId}_port)`} />
        <path d="M4,66.301 L46.594,87.665 4,108.5 4,66.301z" fill={`url(#${gradientId}_port)`} />
        <path d="M6,68.301 L44.594,87.665 6,106.5 6,68.301z" fill={`url(#${gradientId}_port)`} />
        <path d="M8,70.301 L42.594,87.665 8,104.5 8,70.301z" fill={`url(#${gradientId}_port)`} />
        <path d="M10,72.301 L40.594,87.665 10,102.5 10,72.301z" fill={endColor} />

        <path d="M0,62.301 L50.594,87.665 0,112.5" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M50.407,87.665 L101.002,62.301 101.002,112.5 50.407,87.665z" fill={`url(#${gradientId}_port)`} />
        <path d="M52.407,87.665 L99.002,64.301 99.002,110.5 52.407,87.665z" fill={`url(#${gradientId}_port)`} />
        <path d="M54.407,87.665 L97.002,66.301 97.002,108.5 54.407,87.665z" fill={`url(#${gradientId}_port)`} />
        <path d="M56.407,87.665 L95.002,68.301 95.002,106.5 56.407,87.665z" fill={`url(#${gradientId}_port)`} />
        <path d="M58.407,87.665 L93.002,70.301 93.002,104.5 58.407,87.665z" fill={`url(#${gradientId}_port)`} />
        <path d="M60.407,87.665 L91.002,72.301 91.002,102.5 60.407,87.665z" fill={endColor} />

        <path d="M50.407,87.665 L101.002,62.301 101.002,112.5" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default Valve3DIcon;
