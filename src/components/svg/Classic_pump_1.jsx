import React from 'react';

const PumpIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#0a5f0a',
  midColor = '#6fdc6f',
  endColor = '#013201'
}) => {
  const id = Math.random().toString(36).substr(2, 9);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 125.921 121.105"
      className={className}
    >
      <defs>
        {/* ================== SHADOW & DEPTH ================== */}
        <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.35"/>
        </filter>

        <filter id={`inner-${id}`}>
          <feGaussianBlur stdDeviation="3"/>
          <feComposite operator="out" in2="SourceGraphic"/>
        </filter>

        {/* ================== PUMP BODY ================== */}
        <radialGradient id={`body-${id}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#9af39a"/>
          <stop offset="30%" stopColor={midColor}/>
          <stop offset="65%" stopColor={startColor}/>
          <stop offset="100%" stopColor={endColor}/>
        </radialGradient>

        {/* Rim highlight */}
        <radialGradient id={`rim-${id}`} cx="50%" cy="50%" r="52%">
          <stop offset="85%" stopColor="rgba(255,255,255,0)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.55)"/>
        </radialGradient>

        {/* ================== IMPELLER ================== */}
        <linearGradient id={`impeller-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eaffea"/>
          <stop offset="50%" stopColor="#5fd45f"/>
          <stop offset="100%" stopColor="#0c5f0c"/>
        </linearGradient>

        <radialGradient id={`impeller-core-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="60%" stopColor="#6fdc6f"/>
          <stop offset="100%" stopColor="#0c5f0c"/>
        </radialGradient>

        {/* ================== GLOW ================== */}
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* ================== ROTATION ================== */}
        <animateTransform
          xlinkHref="#Group_Impeller"
          attributeName="transform"
          type="rotate"
          from="0 52 57"
          to="360 52 57"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </defs>

      {/* ================== OUTLET ================== */}
      <g filter={`url(#shadow-${id})`}>
        <rect x="112.8" y="0.7" width="13.1" height="50.4" fill={`url(#body-${id})`} />
        <polyline points="53.2,6.2 112.9,6.2 112.9,45.2 102.5,45.2" fill={`url(#body-${id})`} />
      </g>

      {/* ================== LEGS ================== */}
      <path
        d="M11.3,120.4l10.3-35.9h61.9l10.3,35.9H73L52.5,89.5l-20.8,30.9z"
        fill={`url(#body-${id})`}
        filter={`url(#shadow-${id})`}
      />

      {/* ================== BASE ================== */}
      <rect x="0.8" y="115.9" width="37.5" height="5.2" fill={startColor}/>
      <rect x="66.6" y="115.9" width="37.9" height="5.2" fill={startColor}/>

      {/* ================== PUMP BODY ================== */}
      <g filter={`url(#shadow-${id})`}>
        <path
          d="M53.047,6.158c28.477,0.196,51.402,23.439,51.207,51.917c-0.195,28.475-23.438,51.398-51.914,51.204C23.862,109.086,0.938,85.841,1.133,57.364C1.326,28.889,24.573,5.963,53.047,6.158z"
          fill={`url(#body-${id})`}
        />
        <path
          d="M53.047,6.158c28.477,0.196,51.402,23.439,51.207,51.917c-0.195,28.475-23.438,51.398-51.914,51.204"
          fill={`url(#rim-${id})`}
        />
      </g>

      {/* ================== CENTER DEPTH ================== */}
      <circle cx="53" cy="57" r="26" fill="#012501" opacity="0.85"/>

      {/* ================== IMPELLER ================== */}
      <g id="Group_Impeller" filter={`url(#glow-${id})`}>
        <path d="M51,77 l6,-38" stroke={`url(#impeller-${id})`} strokeWidth="4" strokeLinecap="round"/>
        <path d="M69,69 L36,47" stroke={`url(#impeller-${id})`} strokeWidth="4" strokeLinecap="round"/>
        <path d="M36,67 L69,47" stroke={`url(#impeller-${id})`} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="53" cy="57" r="7" fill={`url(#impeller-core-${id})`} />
      </g>
    </svg>
  );
};

export default PumpIcon;
