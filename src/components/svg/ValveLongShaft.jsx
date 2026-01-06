import React from 'react';

const BallValveIcon = ({
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
      viewBox="0 0 75.76 112.5"
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
          <stop offset="0%" stopColor="#4C4C4C" />
          <stop offset="37%" stopColor="#EFEFEF" />
          <stop offset="50%" stopColor="#F1F1F1" />
          <stop offset="74%" stopColor="#BDBDBD" />
          <stop offset="100%" stopColor="#4C4C4C" />
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
        <path d="M37.853,0.027 c-17.189,0 -31.117,13.913 -31.117,30.82 l31.208,-0.09 L37.853,0.027z" fill={startColor} />
        <path d="M37.853,2.027 c-16.089,0 -29.117,13.013 -29.117,28.82 l29.208,-0.09 L37.853,2.027z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.853,4.027 c-15.089,0 -27.117,12.113 -27.117,26.82 l27.208,-0.09 L37.853,4.027z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.853,6.027 c-14.089,0 -25.117,11.213 -25.117,24.82 l25.208,-0.09 L37.853,6.027z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.853,8.027 c-13.089,0 -23.117,10.313 -23.117,22.82 l23.208,-0.09 L37.853,8.027z" fill={endColor} />
        
        <path d="M37.853,0.027 c-17.189,0 -31.117,13.913 -31.117,30.82 l31.208,-0.09" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Handle - Right Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.429,-0.026 c17.189,0 31.117,13.913 31.117,30.821 l-31.208,-0.09 L37.429,-0.026z" fill={startColor} />
        <path d="M37.429,1.974 c16.089,0 29.117,13.013 29.117,28.821 l-29.208,-0.09 L37.429,1.974z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.429,3.974 c15.089,0 27.117,12.113 27.117,26.821 l-27.208,-0.09 L37.429,3.974z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.429,5.974 c14.089,0 25.117,11.213 25.117,24.821 l-25.208,-0.09 L37.429,5.974z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.429,7.974 c13.089,0 23.117,10.313 23.117,22.821 l-23.208,-0.09 L37.429,7.974z" fill={endColor} />
        
        <path d="M37.429,-0.026 c17.189,0 31.117,13.913 31.117,30.821 l-31.208,-0.09" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Vertical Pipe ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M34.685,29.895 l7.53,0 0,63.664 -7.53,0 0,-63.664z" fill={`url(#${gradientId}_metal)`} />
        <path d="M35.685,30.895 l5.53,0 0,61.664 -5.53,0 0,-61.664z" fill={`url(#${gradientId}_metal)`} />
        <path d="M36.685,31.895 l3.53,0 0,59.664 -3.53,0 0,-59.664z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.385,32.595 l2.13,0 0,58.264 -2.13,0 0,-58.264z" fill={endColor} />

        <path d="M34.685,29.895 l0,63.664" stroke="#000" strokeWidth="2" />
        <path d="M42.215,93.559 l0,-63.664" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,112.498 L0,74.619 37.879,93.559 0,112.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,110.498 L2,76.619 35.879,93.559 2,110.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M4,108.498 L4,78.619 33.879,93.559 4,108.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M6,106.498 L6,80.619 31.879,93.559 6,106.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M8,104.498 L8,82.619 29.879,93.559 8,104.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M10,102.498 L10,84.619 27.879,93.559 10,102.498z" fill={endColor} />

        <path d="M0,112.498 L0,74.619 37.879,93.559" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.879,93.559 L75.758,112.498 75.758,74.619 37.879,93.559z" fill={`url(#${gradientId}_port)`} />
        <path d="M39.879,93.559 L73.758,110.498 73.758,76.619 39.879,93.559z" fill={`url(#${gradientId}_port)`} />
        <path d="M41.879,93.559 L71.758,108.498 71.758,78.619 41.879,93.559z" fill={`url(#${gradientId}_port)`} />
        <path d="M43.879,93.559 L69.758,106.498 69.758,80.619 43.879,93.559z" fill={`url(#${gradientId}_port)`} />
        <path d="M45.879,93.559 L67.758,104.498 67.758,82.619 45.879,93.559z" fill={`url(#${gradientId}_port)`} />
        <path d="M47.879,93.559 L65.758,102.498 65.758,84.619 47.879,93.559z" fill={endColor} />

        <path d="M37.879,93.559 L75.758,112.498 75.758,74.619" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default BallValveIcon;