import React from 'react';

const ConnectorIcon = ({ 
  width = 64, 
  height = 64, 
  className = '',
  startColor = '#373737',
  midColor = '#EBEBEB',
  endColor = '#373737'
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
      viewBox="0 0 112.5 100.33"
      enableBackground="new 0 0 112.5 100.33"
      xmlSpace="preserve"
      className={className}
    >
      <defs>
        {/* ===== Soft inner shadow for depth ===== */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* ===== Handle gradient ===== */}
        <linearGradient
          id={`${gradientId}_1`}
          gradientUnits="userSpaceOnUse"
          x1="85.9785"
          y1="19.2896"
          x2="89.429"
          y2="13.3132"
        >
          <stop offset="0%" stopColor={startColor} />
          <stop offset="30%" stopColor={startColor} />
          <stop offset="50%" stopColor={midColor} />
          <stop offset="70%" stopColor={endColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* ===== Connector shaft ===== */}
        <linearGradient
          id={`${gradientId}_2`}
          gradientUnits="userSpaceOnUse"
          x1="68.2236"
          y1="42.749"
          x2="74.6495"
          y2="46.459"
        >
          <stop offset="0%" stopColor={startColor} />
          <stop offset="40%" stopColor={startColor} />
          <stop offset="55%" stopColor={midColor} />
          <stop offset="75%" stopColor={endColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* ===== Left port ===== */}
        <linearGradient
          id={`${gradientId}_3`}
          gradientUnits="userSpaceOnUse"
          x1="27.7407"
          y1="100.5215"
          x2="27.7407"
          y2="45.04"
        >
          <stop offset="0%" stopColor={endColor} />
          <stop offset="35%" stopColor={startColor} />
          <stop offset="55%" stopColor={midColor} />
          <stop offset="75%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* ===== Right port ===== */}
        <linearGradient
          id={`${gradientId}_4`}
          gradientUnits="userSpaceOnUse"
          x1="82.2334"
          y1="100.5215"
          x2="82.2334"
          y2="45.04"
        >
          <stop offset="0%" stopColor={endColor} />
          <stop offset="35%" stopColor={startColor} />
          <stop offset="55%" stopColor={midColor} />
          <stop offset="75%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>

      {/* ===== Handle ===== */}
      <g id="Group_Handle" filter={`url(#${filterId})`}>
        <path
          fill={`url(#${gradientId}_1)`}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.6"
          d="M62.908,5.97L66.352,0L112.5,26.633l-3.443,5.969L62.908,5.97z"
        />
        <polygon
          fill={`url(#${gradientId}_2)`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.5"
          points="89.064,21.051 87.771,16.135 82.84,17.457 51.813,71.174 58.45,74.517"
        />
      </g>

      {/* ===== Left Port ===== */}
      <g id="Group_Port1" filter={`url(#${filterId})`}>
        <path
          fill={`url(#${gradientId}_3)`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.6"
          d="M0,45.04l55.481,27.538L0,100.521V45.04"
        />
      </g>

      {/* ===== Right Port ===== */}
      <g id="Group_Port2" filter={`url(#${filterId})`}>
        <path
          fill={`url(#${gradientId}_4)`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.6"
          d="M109.975,45.04L54.492,72.577l55.482,27.944V45.04"
        />
      </g>
    </svg>
  );
};

export default ConnectorIcon;
