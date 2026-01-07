import React from 'react';

const BallValve1Icon = ({
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
      viewBox="0 0 112.5 43.8"
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

        {/* Body gradient */}
        <linearGradient id={`${gradientId}_body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="22%" stopColor="#7E7E7E" />
          <stop offset="32%" stopColor={midColor} />
          <stop offset="69%" stopColor={midColor} />
          <stop offset="77%" stopColor="#A5A5A5" />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>

        {/* Dark gradient */}
        <linearGradient id={`${gradientId}_dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="62%" stopColor="#858585" />
          <stop offset="77%" stopColor="#727272" />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>

        {/* Handle gradient */}
        <linearGradient id={`${gradientId}_handle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="62%" stopColor="#7C7C7C" />
          <stop offset="77%" stopColor="#767676" />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Port and Body ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0.002,15.653 l56.192,0 0,28.152 -56.192,0 0,-28.152z" fill={`url(#${gradientId}_body)`} />
        <path d="M0.002,15.653 l56.192,0 0,28.152 -56.192,0 0,-28.152z" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Dark Section ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M18.583,15.653 l-9.234,0 0,28.152 9.234,0 0,-28.152z" fill={`url(#${gradientId}_dark)`} />
        <path d="M18.583,15.653 l-9.234,0 0,28.152 9.234,0 0,-28.152z" fill="none" stroke="#000" strokeWidth="1" />
      </g>

      {/* ===== Box Structure ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M18.583,36.823 l0,6.981 1.351,0 0,-5.855 25.675,0 0,-1.126 -27.026,0z" fill={startColor} opacity="0.8" />
        <path d="M45.608,23.125 l-1.126,-0.49 0,14.188 1.126,1.126 0,-14.824z" fill={midColor} opacity="0.8" />
        <path d="M18.583,22.635 l25.9,0 0,14.188 -25.9,0 0,-14.188z" fill={endColor} opacity="0.9" />
        <path d="M18.583,22.635 l25.9,0 0,14.188 -25.9,0 0,-14.188z" fill="none" stroke="#000" strokeWidth="1" />
      </g>

      {/* ===== Vertical Connector ===== */}
      <g filter={`url(#${filterId})`}>
        <polygon points="35.023,3.378 35.023,2.815 28.042,2.815 28.042,3.378 26.916,3.378 26.916,11.211 36.375,11.211 36.375,3.378" fill={`url(#${gradientId}_metal)`} />
        <path d="M26.916,3.378 l9.459,0 0,3.604 -9.459,0 0,-3.604z" fill={`url(#${gradientId}_metal)`} />
        <polygon points="35.023,3.378 35.023,2.815 28.042,2.815 28.042,3.378 26.916,3.378 26.916,11.211 36.375,11.211 36.375,3.378" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Connector to Body ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M18.583,16.328 l0,-5.405 12.187,0 2.856,-0.337 0,6.081 -2.856,-0.338 -12.187,0z" fill={`url(#${gradientId}_dark)`} />
        <path d="M33.85,10.135 c-0.967,-0.11 -2.925,-0.091 -3.894,0 c-1.019,0.095 -4.022,0.759 -4.022,0.759 l0,5.463 c0,0 3.005,0.649 4.022,0.76 c0.812,0.088 2.452,0.074 3.265,0 c1.083,-0.099 4.279,-0.789 4.279,-0.789 l0,-5.471 C37.5,10.857 34.774,10.24 33.85,10.135z" fill={`url(#${gradientId}_metal)`} />
        <path d="M18.583,16.328 l0,-5.405 12.187,0 2.856,-0.337 0,6.081 -2.856,-0.338 -12.187,0z" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Handle Guide ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M23.312,10.923 c0,0 0.079,-1.317 0.719,-1.724 c0.6,-0.381 13.171,0.012 16.397,-0.078 c0.32,-0.009 0.789,-0.559 1.013,-0.788 c0.76,-0.777 1.625,-2.124 2.148,-2.846 c0.91,-1.257 1.207,-1.434 1.343,-1.434 c0.619,0 4.401,0 4.401,0 L49.333,1.577 c0,0 -4.646,-0.034 -5.527,0 c-0.361,0.014 -0.752,0.524 -1.104,0.933 c-0.762,0.885 -2.172,3.292 -3.175,4.36 c-0.106,0.113 -17.342,0.113 -17.342,0.113 s-0.659,0.358 -0.789,0.563 c-0.168,0.266 -0.338,2.252 -0.338,2.252 l0,1.126 L23.312,10.923" fill={midColor} opacity="0.7" />
      </g>

      {/* ===== Handle ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M47.41,0 l65.088,0 0,5.743 -65.088,0 0,-5.743z" fill={`url(#${gradientId}_handle)`} />
        <path d="M48.41,0.8 l63.088,0 0,4.143 -63.088,0 0,-4.143z" fill={`url(#${gradientId}_handle)`} />
        <path d="M49.41,1.6 l61.088,0 0,2.543 -61.088,0 0,-2.543z" fill={`url(#${gradientId}_handle)`} />
        <path d="M50.41,2.2 l59.088,0 0,1.343 -59.088,0 0,-1.343z" fill={endColor} />

        <path d="M47.41,0 l65.088,0 0,5.743 -65.088,0 0,-5.743z" fill="none" stroke="#000" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default BallValve1Icon;