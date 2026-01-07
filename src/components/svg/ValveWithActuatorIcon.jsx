import React from 'react';

const ValveWithActuatorIcon = ({
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
      viewBox="0 0 102.744 112.5"
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

        {/* Box gradient */}
        <linearGradient id={`${gradientId}_box`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="36%" stopColor="#BEC0C2" />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>

        {/* Box front gradient */}
        <linearGradient id={`${gradientId}_box_front`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={endColor} />
          <stop offset="50%" stopColor={midColor} />
          <stop offset="100%" stopColor="#BCBEC0" />
        </linearGradient>

        {/* Port gradient */}
        <linearGradient id={`${gradientId}_port`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Box Front ===== */}
      <g filter={`url(#${filterId})`}>
        <rect x="8.846" y="0.032" width="84.826" height="32.63" fill={`url(#${gradientId}_box_front)`} />
        <rect x="8.846" y="0.032" width="84.826" height="32.63" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Box Bottom Edge ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M8.846,32.662 l3.75,3.192 c3.174,-0.033 83.323,0.118 84.81,0.195 l-3.734,-3.965 -42.3,-1.56 L8.846,32.662z" fill={`url(#${gradientId}_box)`} />
        <path d="M8.846,32.662 l3.75,3.192 c3.174,-0.033 83.323,0.118 84.81,0.195 l-3.734,-3.965 -42.3,-1.56 L8.846,32.662z" fill="none" stroke="#000" strokeWidth="1" />
      </g>

      {/* ===== Box Side ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M91.622,16.348 l1.239,16.314 4.545,3.386 c-0.073,-1.252 -0.01,-30.573 -0.01,-32.629 l-3.725,-3.417 L91.622,16.348z" fill={`url(#${gradientId}_box)`} />
        <path d="M91.622,16.348 l1.239,16.314 4.545,3.386 c-0.073,-1.252 -0.01,-30.573 -0.01,-32.629 l-3.725,-3.417 L91.622,16.348z" fill="none" stroke="#000" strokeWidth="1" />
      </g>

      {/* ===== Vertical Pipe ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M47.403,32.435 l7.485,0 0,53.979 -7.485,0 0,-53.979z" fill={`url(#${gradientId}_metal)`} />
        <path d="M48.403,33.435 l5.485,0 0,51.979 -5.485,0 0,-51.979z" fill={`url(#${gradientId}_metal)`} />
        <path d="M49.403,34.435 l3.485,0 0,49.979 -3.485,0 0,-49.979z" fill={`url(#${gradientId}_metal)`} />
        <path d="M50.103,35.135 l2.085,0 0,48.579 -2.085,0 0,-48.579z" fill={endColor} />

        <path d="M47.403,32.435 l0,53.979" stroke="#000" strokeWidth="2" />
        <path d="M54.888,86.414 l0,-53.979" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Left Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M0,60.393 L51.834,86.49 0,112.97 0,60.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M2,62.393 L49.834,86.49 2,110.97 2,62.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M4,64.393 L47.834,86.49 4,108.97 4,64.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M6,66.393 L45.834,86.49 6,106.97 6,66.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M8,68.393 L43.834,86.49 8,104.97 8,68.393z" fill={`url(#${gradientId}_port)`} />
        <path d="M10,70.393 L41.834,86.49 10,102.97 10,70.393z" fill={endColor} />

        <path d="M0,60.393 L51.834,86.49 0,112.97" stroke="#000" strokeWidth="2" fill="none" />
      </g>

      {/* ===== Right Port ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M50.909,86.489 L102.744,60.393 102.744,112.97 50.909,86.489z" fill={`url(#${gradientId}_port)`} />
        <path d="M52.909,86.489 L100.744,62.393 100.744,110.97 52.909,86.489z" fill={`url(#${gradientId}_port)`} />
        <path d="M54.909,86.489 L98.744,64.393 98.744,108.97 54.909,86.489z" fill={`url(#${gradientId}_port)`} />
        <path d="M56.909,86.489 L96.744,66.393 96.744,106.97 56.909,86.489z" fill={`url(#${gradientId}_port)`} />
        <path d="M58.909,86.489 L94.744,68.393 94.744,104.97 58.909,86.489z" fill={`url(#${gradientId}_port)`} />
        <path d="M60.909,86.489 L92.744,70.393 92.744,102.97 60.909,86.489z" fill={endColor} />

        <path d="M50.909,86.489 L102.744,60.393 102.744,112.97" stroke="#000" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

export default ValveWithActuatorIcon;