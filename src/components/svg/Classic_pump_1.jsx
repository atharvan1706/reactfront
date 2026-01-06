import React from 'react';

const PumpIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#006500',
  midColor = '#6FB76F',
  endColor = '#003200'
}) => {
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  const filterId = `filter-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 125.921 121.105"
      className={className}
    >
      <defs>
        {/* ===== Impeller Rotation ===== */}
        <animateTransform
          xlinkHref="#Group_Impeller"
          attributeName="transform"
          type="rotate"
          from="0 52 57"
          to="360 52 57"
          dur="2s"
          repeatCount="indefinite"
        />

        {/* ===== Depth Filter ===== */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="SourceGraphic" operator="over" />
        </filter>

        {/* ===== Reusable Gradients ===== */}
        <linearGradient id={`${gradientId}_linear`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="50%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        <radialGradient id={`${gradientId}_radial`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </radialGradient>
      </defs>

      {/* ===== Outlet Port ===== */}
      <g id="Group_OutletPort" filter={`url(#${filterId})`}>
        <rect x="112.821" y="0.719" width="13.101" height="50.408"
          fill={`url(#${gradientId}_linear)`}
          stroke="#B3B3B3"
          strokeWidth="0.5"
        />
        <polyline
          points="53.235,6.184 112.907,6.184 112.907,45.185 102.517,45.185"
          fill={`url(#${gradientId}_linear)`}
        />
      </g>

      {/* ===== Legs ===== */}
      <g id="Group_Legs" filter={`url(#${filterId})`}>
        <path
          d="M11.321,120.384l10.254-35.881h61.908l10.252,35.881H72.966L52.462,89.497l-20.769,30.887H11.321z"
          fill={`url(#${gradientId}_linear)`}
          stroke="#999"
          strokeWidth="0.4"
        />
      </g>

      {/* ===== Leg Base ===== */}
      <g id="Group_LegBase">
        <path d="M0.76,115.851h37.533v5.254H0.76z"
          fill={startColor}
          stroke="#B3B3B3"
          strokeWidth="0.5"
        />
        <path d="M66.603,115.851h37.929v5.254H66.603z"
          fill={startColor}
          stroke="#B3B3B3"
          strokeWidth="0.5"
        />
      </g>

      {/* ===== Pump Body ===== */}
      <g id="Group_PumpBody" filter={`url(#${filterId})`}>
        <path
          d="M53.047,6.158c28.477,0.196,51.402,23.439,51.207,51.917c-0.195,28.475-23.438,51.398-51.914,51.204C23.862,109.086,0.938,85.841,1.133,57.364C1.326,28.889,24.573,5.963,53.047,6.158z"
          fill={`url(#${gradientId}_radial)`}
        />
      </g>

      {/* ===== Center Shade ===== */}
      <g id="Group_CenterShade">
        <path
          d="M38.399,81.168C25.508,73.407,21.35,56.67,29.111,43.78c7.762-12.888,24.502-17.045,37.385-9.285c12.891,7.761,17.047,24.498,9.289,37.393C68.021,84.769,51.286,88.928,38.399,81.168z"
          fill={endColor}
        />
      </g>

      {/* ===== Impeller (Animated) ===== */}
      <g id="Group_Impeller">
        <path d="M51.014,77.055l5.811-38.066"
          fill="none"
          stroke={`url(#${gradientId}_linear)`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M68.625,68.765L36.284,47.493"
          fill="none"
          stroke={`url(#${gradientId}_linear)`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M35.58,67.368L68.82,47.527"
          fill="none"
          stroke={`url(#${gradientId}_linear)`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="53"
          cy="57"
          r="6.5"
          fill={`url(#${gradientId}_radial)`}
        />
      </g>
    </svg>
  );
};

export default PumpIcon;
