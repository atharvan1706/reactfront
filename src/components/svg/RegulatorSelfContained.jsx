import React from 'react';

const PipeValveIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#5C5C5C',
  midColor = '#EBEBEB',
  endColor = '#FFFFFF'
}) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const filterId = `filter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 86.18 112.5"
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
          <stop offset="0%" stopColor={startColor} />
          <stop offset="36%" stopColor={midColor} />
          <stop offset="50%" stopColor={endColor} />
          <stop offset="100%" stopColor={startColor} />
        </radialGradient>

        {/* Port gradient */}
        <linearGradient id={`${gradientId}_port`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Horizontal Pipe (Top) ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M30.826,0 l55.35,0 0,7.875 -55.35,0 0,-7.875z" fill={`url(#${gradientId}_metal)`} />
        <path d="M30.826,1 l55.35,0 0,5.875 -55.35,0 0,-5.875z" fill={`url(#${gradientId}_metal)`} />
        <path d="M30.826,2 l55.35,0 0,3.875 -55.35,0 0,-3.875z" fill={`url(#${gradientId}_metal)`} />
        <path d="M30.826,3.2 l55.35,0 0,1.475 -55.35,0 0,-1.475z" fill={endColor} />
        
        <path d="M30.826,0 l55.35,0" stroke="#000" strokeWidth="2" />
        <path d="M86.176,7.875 l-55.35,0" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Vertical Pipe (Left) - Top Section ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M30.826,0 l7.875,0 0,33.144 -7.875,0 0,-33.144z" fill={`url(#${gradientId}_metal)`} />
        <path d="M31.826,0 l5.875,0 0,33.144 -5.875,0 0,-33.144z" fill={`url(#${gradientId}_metal)`} />
        <path d="M32.826,0 l3.875,0 0,33.144 -3.875,0 0,-33.144z" fill={`url(#${gradientId}_metal)`} />
        <path d="M33.626,0 l2.275,0 0,33.144 -2.275,0 0,-33.144z" fill={endColor} />
        
        <path d="M30.826,0 l0,33.144" stroke="#000" strokeWidth="2" />
        <path d="M38.701,33.144 l0,-33.144" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Vertical Pipe (Right) ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M78.301,0 l7.875,0 0,48.812 -7.875,0 0,-48.812z" fill={`url(#${gradientId}_metal)`} />
        <path d="M79.301,0 l5.875,0 0,48.812 -5.875,0 0,-48.812z" fill={`url(#${gradientId}_metal)`} />
        <path d="M80.301,0 l3.875,0 0,48.812 -3.875,0 0,-48.812z" fill={`url(#${gradientId}_metal)`} />
        <path d="M81.101,0 l2.275,0 0,48.812 -2.275,0 0,-48.812z" fill={endColor} />
        
        <path d="M78.301,0 l0,48.812" stroke="#000" strokeWidth="2" />
        <path d="M86.176,48.812 l0,-48.812" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Valve - Left Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M6.976,38.823 l28.939,-0.083 -0.085,-28.116 C19.89,10.624 6.976,23.353 6.976,38.823z" fill={`url(#${gradientId}_valve)`} />
        <path d="M6.976,38.823 l28.939,-0.083 -0.085,-28.116" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Valve - Right Half ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M35.059,38.693 l28.258,0.083 c0,-15.447 -12.612,-28.157 -28.176,-28.157 L35.059,38.693z" fill={`url(#${gradientId}_valve)`} />
        <path d="M35.059,38.693 l28.258,0.083 c0,-15.447 -12.612,-28.157 -28.176,-28.157" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Vertical Pipe (Left) - Bottom Section ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M30.826,33.145 l7.875,0 0,62.286 -7.875,0 0,-62.286z" fill={`url(#${gradientId}_metal)`} />
        <path d="M31.826,33.145 l5.875,0 0,62.286 -5.875,0 0,-62.286z" fill={`url(#${gradientId}_metal)`} />
        <path d="M32.826,33.145 l3.875,0 0,62.286 -3.875,0 0,-62.286z" fill={`url(#${gradientId}_metal)`} />
        <path d="M33.626,33.145 l2.275,0 0,62.286 -2.275,0 0,-62.286z" fill={endColor} />
        
        <path d="M30.826,33.145 l0,62.286" stroke="#000" strokeWidth="2" />
        <path d="M38.701,95.431 l0,-62.286" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Diagonal Pipe ===== */}
      <g filter={`url(#${filterId})`}>
        <rect x="55.369" y="42.352" width="7.875" height="61.543" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 49.5405 166.7657)" fill={`url(#${gradientId}_metal)`} />
        <rect x="55.869" y="42.852" width="6.875" height="61.543" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 49.5405 166.7657)" fill={`url(#${gradientId}_metal)`} />
        <rect x="56.369" y="43.352" width="5.875" height="61.543" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 49.5405 166.7657)" fill={`url(#${gradientId}_metal)`} />
        <rect x="56.869" y="43.852" width="4.875" height="61.543" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 49.5405 166.7657)" fill={endColor} />
        
        <rect x="55.369" y="42.352" width="7.875" height="61.543" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 49.5405 166.7657)" fill="none" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Right Nozzle ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M78.301,48.6 l-0.866,0.826 4.326,6.824 c0,0 1.647,-1.431 2.317,-2.203 0.516,-0.594 0.879,-1.365 1.149,-1.833 0.702,-1.21 0.931,-3.149 0.952,-3.348 L85.179,47.85 77.3,47.712 77.3,48.6z" fill={`url(#${gradientId}_metal)`} />
        <path d="M78.301,48.6 l-0.866,0.826 4.326,6.824 c0,0 1.647,-1.431 2.317,-2.203 0.516,-0.594 0.879,-1.365 1.149,-1.833 0.702,-1.21 0.931,-3.149 0.952,-3.348" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0.001,78.384 L34.65,95.277 0.001,112.415 0.001,78.384z" fill={`url(#${gradientId}_port)`} />
        <path d="M2.001,80.384 L32.65,95.277 2.001,110.415 2.001,80.384z" fill={`url(#${gradientId}_port)`} />
        <path d="M4.001,82.384 L30.65,95.277 4.001,108.415 4.001,82.384z" fill={`url(#${gradientId}_port)`} />
        <path d="M6.001,84.384 L28.65,95.277 6.001,106.415 6.001,84.384z" fill={endColor} />
        
        <path d="M0.001,78.384 L34.65,95.277 0.001,112.415" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M68.807,78.511 L34.65,95.203 68.806,112.141 68.807,78.511z" fill={`url(#${gradientId}_port)`} />
        <path d="M66.807,80.511 L36.65,95.203 66.806,110.141 66.807,80.511z" fill={`url(#${gradientId}_port)`} />
        <path d="M64.807,82.511 L38.65,95.203 64.806,108.141 64.807,82.511z" fill={`url(#${gradientId}_port)`} />
        <path d="M62.807,84.511 L40.65,95.203 62.806,106.141 62.807,84.511z" fill={endColor} />
        
        <path d="M68.807,78.511 L34.65,95.203 68.806,112.141" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default PipeValveIcon;
