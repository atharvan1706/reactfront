import React from 'react';

const PipeValveIcon = ({
  width = 64,
  height = 64,
  className = '',
  primaryColor = '#5C5C5C',
  secondaryColor = '#EBEBEB',
  accentColor = '#D8D8D8',
  darkColor = '#373737',
  lightColor = '#F0F0F0'
}) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 86.18 112.5"
      className={className}
    >
      <defs>
        {/* Pipe gradient */}
        <linearGradient id={`${gradientId}_pipe`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="45%" stopColor={secondaryColor} />
          <stop offset="57%" stopColor={accentColor} />
          <stop offset="77%" stopColor="#B2B2B2" />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>

        {/* Valve gradient */}
        <radialGradient id={`${gradientId}_valve`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6D6D6D" />
          <stop offset="15%" stopColor="#C4C4C4" />
          <stop offset="36%" stopColor="#EEEEEE" />
          <stop offset="50%" stopColor={lightColor} />
          <stop offset="67%" stopColor="#D9D9D9" />
          <stop offset="90%" stopColor="#959595" />
          <stop offset="100%" stopColor="#6D6D6D" />
        </radialGradient>

        {/* Port gradient */}
        <linearGradient id={`${gradientId}_port`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={darkColor} />
          <stop offset="45%" stopColor={secondaryColor} />
          <stop offset="55%" stopColor={accentColor} />
          <stop offset="77%" stopColor="#A5A5A5" />
          <stop offset="100%" stopColor={darkColor} />
        </linearGradient>

        {/* Nozzle gradient */}
        <radialGradient id={`${gradientId}_nozzle`} cx="20%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#4C4C4C" />
          <stop offset="28%" stopColor="#A4A4A4" />
          <stop offset="49%" stopColor="#DCDCDC" />
          <stop offset="61%" stopColor="#E0E0E0" />
          <stop offset="86%" stopColor="#949494" />
          <stop offset="100%" stopColor="#4C4C4C" />
        </radialGradient>

        {/* Shadow filter */}
        <filter id={`${gradientId}_shadow`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Horizontal Pipe (Top) */}
      <rect 
        x="30.826" 
        y="0" 
        width="55.35" 
        height="7.875" 
        fill={`url(#${gradientId}_pipe)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Vertical Pipe (Left) - Top Section */}
      <rect 
        x="30.826" 
        y="0" 
        width="7.875" 
        height="33.144" 
        fill={`url(#${gradientId}_pipe)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Vertical Pipe (Right) */}
      <rect 
        x="78.301" 
        y="0" 
        width="7.875" 
        height="48.812" 
        fill={`url(#${gradientId}_pipe)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Valve - Left Half */}
      <path 
        d="M6.976,38.823l28.939-0.083L35.83,10.624C19.89,10.624,6.976,23.353,6.976,38.823"
        fill={`url(#${gradientId}_valve)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Valve - Right Half */}
      <path 
        d="M35.059,38.693l28.258,0.083c0-15.447-12.612-28.157-28.176-28.157L35.059,38.693z"
        fill={`url(#${gradientId}_valve)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Valve Circle Outline */}
      <circle
        cx="35"
        cy="24.7"
        r="14"
        fill="none"
        stroke={primaryColor}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Vertical Pipe (Left) - Bottom Section */}
      <rect 
        x="30.826" 
        y="33.145" 
        width="7.875" 
        height="62.286" 
        fill={`url(#${gradientId}_pipe)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Diagonal Pipe */}
      <rect 
        x="55.369" 
        y="42.352" 
        width="7.875" 
        height="61.543" 
        transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 49.5405 166.7657)"
        fill={`url(#${gradientId}_pipe)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Right Nozzle */}
      <path 
        d="M78.301,48.6l-0.866,0.826l4.326,6.824c0,0,1.647-1.431,2.317-2.203c0.516-0.594,0.879-1.365,1.149-1.833
        c0.702-1.21,0.931-3.149,0.952-3.348V47.85l-7.879-0.138V48.6z"
        fill={`url(#${gradientId}_nozzle)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Left Port */}
      <path 
        d="M0.001,78.384L34.65,95.277L0.001,112.415V78.384"
        fill={`url(#${gradientId}_port)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Right Port */}
      <path 
        d="M68.807,78.511L34.65,95.203l34.156,16.938V78.511"
        fill={`url(#${gradientId}_port)`}
        filter={`url(#${gradientId}_shadow)`}
      />

      {/* Decorative highlights on ports */}
      <path 
        d="M5,85 L30,95 L5,105"
        fill="none"
        stroke={lightColor}
        strokeWidth="0.5"
        opacity="0.5"
      />
      <path 
        d="M63,85 L38,95 L63,105"
        fill="none"
        stroke={lightColor}
        strokeWidth="0.5"
        opacity="0.5"
      />
    </svg>
  );
};

export default PipeValveIcon;
