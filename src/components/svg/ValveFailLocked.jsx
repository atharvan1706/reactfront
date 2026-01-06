import React from 'react';

const ButterflyValveIcon = ({
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
      viewBox="0 0 75.68 112.5"
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

        {/* Valve radial gradient */}
        <radialGradient id={`${gradientId}_valve`} cx="0.5" cy="0.5" r="0.5">
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

      {/* ===== Valve - Left Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M38.363,-0.089 c-17.254,0 -31.234,13.867 -31.234,30.72 l31.325,-0.09 L38.363,-0.089z" fill={startColor} />
        <path d="M38.363,1.911 c-16.154,0 -29.234,12.967 -29.234,28.72 l29.325,-0.09 L38.363,1.911z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38.363,3.911 c-15.154,0 -27.234,12.067 -27.234,26.72 l27.325,-0.09 L38.363,3.911z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38.363,5.911 c-14.154,0 -25.234,11.167 -25.234,24.72 l25.325,-0.09 L38.363,5.911z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38.363,7.911 c-13.154,0 -23.234,10.267 -23.234,22.72 l23.325,-0.09 L38.363,7.911z" fill={endColor} />
        
        <path d="M38.363,-0.089 c-17.254,0 -31.234,13.867 -31.234,30.72 l31.325,-0.09" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Valve - Right Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.319,-0.089 c17.271,0 31.263,13.868 31.263,30.72 l-31.354,-0.09 L37.319,-0.089z" fill={startColor} />
        <path d="M37.319,1.911 c16.171,0 29.263,12.968 29.263,28.72 l-29.354,-0.09 L37.319,1.911z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.319,3.911 c15.171,0 27.263,12.068 27.263,26.72 l-27.354,-0.09 L37.319,3.911z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.319,5.911 c14.171,0 25.263,11.168 25.263,24.72 l-25.354,-0.09 L37.319,5.911z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.319,7.911 c13.171,0 23.263,10.268 23.263,22.72 l-23.354,-0.09 L37.319,7.911z" fill={endColor} />
        
        <path d="M37.319,-0.089 c17.271,0 31.263,13.868 31.263,30.72 l-31.354,-0.09" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Vertical Handle ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M34.771,29.773 l7.5,0 0,63.772 -7.5,0 0,-63.772z" fill={`url(#${gradientId}_metal)`} />
        <path d="M35.771,30.773 l5.5,0 0,61.772 -5.5,0 0,-61.772z" fill={`url(#${gradientId}_metal)`} />
        <path d="M36.771,31.773 l3.5,0 0,59.772 -3.5,0 0,-59.772z" fill={`url(#${gradientId}_metal)`} />
        <path d="M37.471,32.473 l2.1,0 0,58.372 -2.1,0 0,-58.372z" fill={endColor} />

        <path d="M34.771,29.773 l0,63.772" stroke="#000" strokeWidth="2" />
        <path d="M42.271,93.545 l0,-63.772" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Top Right Handle Bar ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="42.162,40.517 64.189,40.517 64.189,47.894 42.162,47.894 38.458,44.189" fill={`url(#${gradientId}_metal)`} />
        <polygon points="42.162,41.517 62.189,41.517 62.189,46.894 42.162,46.894 39.458,44.189" fill={`url(#${gradientId}_metal)`} />
        <polygon points="42.162,42.517 60.189,42.517 60.189,45.894 42.162,45.894 40.458,44.189" fill={`url(#${gradientId}_metal)`} />
        <polygon points="42.162,43.317 58.189,43.317 58.189,45.094 42.162,45.094 41.058,44.189" fill={endColor} />

        <polygon points="42.162,40.517 64.189,40.517 64.189,47.894 42.162,47.894 38.458,44.189" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Top Left Handle Bar ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="34.641,40.517 12.613,40.517 12.613,47.894 34.641,47.894 38.345,44.221" fill={`url(#${gradientId}_metal)`} />
        <polygon points="34.641,41.517 14.613,41.517 14.613,46.894 34.641,46.894 37.345,44.221" fill={`url(#${gradientId}_metal)`} />
        <polygon points="34.641,42.517 16.613,42.517 16.613,45.894 34.641,45.894 36.345,44.221" fill={`url(#${gradientId}_metal)`} />
        <polygon points="34.641,43.317 18.613,43.317 18.613,45.094 34.641,45.094 35.645,44.221" fill={endColor} />

        <polygon points="34.641,40.517 12.613,40.517 12.613,47.894 34.641,47.894 38.345,44.221" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Bottom Right Handle Bar ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="42.162,52.73 64.189,52.73 64.189,60.107 42.162,60.107 38.458,56.403" fill={`url(#${gradientId}_metal)`} />
        <polygon points="42.162,53.73 62.189,53.73 62.189,59.107 42.162,59.107 39.458,56.403" fill={`url(#${gradientId}_metal)`} />
        <polygon points="42.162,54.73 60.189,54.73 60.189,58.107 42.162,58.107 40.458,56.403" fill={`url(#${gradientId}_metal)`} />
        <polygon points="42.162,55.53 58.189,55.53 58.189,57.307 42.162,57.307 41.058,56.403" fill={endColor} />

        <polygon points="42.162,52.73 64.189,52.73 64.189,60.107 42.162,60.107 38.458,56.403" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Bottom Left Handle Bar ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="34.641,52.73 12.613,52.73 12.613,60.107 34.641,60.107 38.345,56.435" fill={`url(#${gradientId}_metal)`} />
        <polygon points="34.641,53.73 14.613,53.73 14.613,59.107 34.641,59.107 37.345,56.435" fill={`url(#${gradientId}_metal)`} />
        <polygon points="34.641,54.73 16.613,54.73 16.613,58.107 34.641,58.107 36.345,56.435" fill={`url(#${gradientId}_metal)`} />
        <polygon points="34.641,55.53 18.613,55.53 18.613,57.307 34.641,57.307 35.645,56.435" fill={endColor} />

        <polygon points="34.641,52.73 12.613,52.73 12.613,60.107 34.641,60.107 38.345,56.435" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,112.498 L0,74.771 37.951,93.69 0,112.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,110.498 L2,76.771 35.951,93.69 2,110.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M4,108.498 L4,78.771 33.951,93.69 4,108.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M6,106.498 L6,80.771 31.951,93.69 6,106.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M8,104.498 L8,82.771 29.951,93.69 8,104.498z" fill={`url(#${gradientId}_port)`} />
        <path d="M10,102.498 L10,84.771 27.951,93.69 10,102.498z" fill={endColor} />

        <path d="M0,112.498 L0,74.771 37.951,93.69" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M37.951,93.69 L75.68,112.498 75.68,74.771 37.951,93.69z" fill={`url(#${gradientId}_port)`} />
        <path d="M39.951,93.69 L73.68,110.498 73.68,76.771 39.951,93.69z" fill={`url(#${gradientId}_port)`} />
        <path d="M41.951,93.69 L71.68,108.498 71.68,78.771 41.951,93.69z" fill={`url(#${gradientId}_port)`} />
        <path d="M43.951,93.69 L69.68,106.498 69.68,80.771 43.951,93.69z" fill={`url(#${gradientId}_port)`} />
        <path d="M45.951,93.69 L67.68,104.498 67.68,82.771 45.951,93.69z" fill={`url(#${gradientId}_port)`} />
        <path d="M47.951,93.69 L65.68,102.498 65.68,84.771 47.951,93.69z" fill={endColor} />

        <path d="M37.951,93.69 L75.68,112.498 75.68,74.771" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default ButterflyValveIcon;