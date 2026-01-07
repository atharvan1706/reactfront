import React from 'react';

const Pump3DIcon = ({
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
      viewBox="0 0 112.5 94.76"
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

        {/* Impeller radial gradient */}
        <radialGradient id={`${gradientId}_impeller`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.01%" stopColor={startColor} />
          <stop offset="83%" stopColor={startColor} />
          <stop offset="92%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </radialGradient>

        {/* Rotor radial gradient */}
        <radialGradient id={`${gradientId}_rotor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={endColor} />
          <stop offset="67%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </radialGradient>

        {/* Blade gradient */}
        <linearGradient id={`${gradientId}_blade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.01%" stopColor={startColor} />
          <stop offset="50%" stopColor={midColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>
      </defs>

      {/* ===== Pump Support ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M21.108,71.181 l-6.063,9.432 -15.044,0 0,14.147 112.498,0 0,-14.147 -42.214,0 -6.961,-9.432 -42.215,0z" fill={startColor} opacity="0.8" />
        <path d="M21.108,71.181 l-6.063,9.432 -15.044,0 0,14.147 112.498,0 0,-14.147 -42.214,0 -6.961,-9.432 -42.215,0z" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Pump Support Platform ===== */}
      <g filter={`url(#${filterId})`}>
        <rect x="2.261" y="82.042" width="108.146" height="11.288" fill={midColor} stroke={startColor} strokeWidth="0.262" />
      </g>

      {/* ===== Large Impeller ===== */}
      <g filter={`url(#${filterId})`}>
        <ellipse cx="42.216" cy="41.99" rx="39.784" ry="39.89" fill={`url(#${gradientId}_impeller)`} />
        <ellipse cx="42.216" cy="42.323" rx="33.418" ry="33.508" fill={startColor} opacity="0.9" />
        <ellipse cx="42.216" cy="41.99" rx="39.784" ry="39.89" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Large Blades ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M40.372,73.748 c6.926,0.362 13.917,-1.166 20.23,-4.811 L40.663,34.401" fill={`url(#${gradientId}_blade)`} />
        <path d="M44.921,10.359 c-6.912,-0.577 -13.948,0.733 -20.371,4.18 L43.405,49.68" fill={`url(#${gradientId}_blade)`} />
        <path d="M74.038,43.855 c0.36,-6.926 -1.166,-13.917 -4.81,-20.233 l-34.538,19.94" fill={`url(#${gradientId}_blade)`} />
        <path d="M10.651,39.306 c-0.578,6.909 0.732,13.947 4.179,20.37 l35.142,-18.855" fill={`url(#${gradientId}_blade)`} />
      </g>

      {/* ===== Large Rotor ===== */}
      <g filter={`url(#${filterId})`}>
        <circle cx="42.216" cy="41.99" r="8.757" fill={`url(#${gradientId}_rotor)`} />
        <circle cx="42.216" cy="41.99" r="8.757" fill="none" stroke="#000" strokeWidth="1" />
      </g>

      {/* ===== Large Rotor Blade ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M42.496,48.517 c3.552,0 6.431,-2.879 6.431,-6.431 l-6.684,0 c0,0.262 0,0.313 0,0.658" fill={startColor} />
        <path d="M42.123,35.585 c-3.552,0 -6.431,2.88 -6.431,6.432 l6.684,0 c0,-0.262 0,-0.313 0,-0.658 L42.123,35.585z" fill={midColor} stroke={startColor} strokeWidth="0.25" />
      </g>

      {/* ===== Small Impeller ===== */}
      <g filter={`url(#${filterId})`}>
        <ellipse cx="80.699" cy="52.657" rx="32.165" ry="32.252" fill={`url(#${gradientId}_impeller)`} />
        <ellipse cx="80.734" cy="52.657" rx="26.697" ry="26.769" fill={startColor} opacity="0.9" />
        <ellipse cx="80.699" cy="52.657" rx="32.165" ry="32.252" fill="none" stroke="#000" strokeWidth="1.5" />
      </g>

      {/* ===== Small Blades ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M68.547,75.012 c5.693,2.136 12.116,3.065 18.724,2.442 l-4.44,-27.806" fill={`url(#${gradientId}_blade)`} />
        <path d="M93.707,30.636 c-5.603,-2.269 -11.984,-3.354 -18.613,-2.889 l3.312,27.896" fill={`url(#${gradientId}_blade)`} />
        <path d="M102.995,65.454 c2.286,-5.597 3.39,-11.972 2.943,-18.603 l-27.907,3.174" fill={`url(#${gradientId}_blade)`} />
        <path d="M59.447,38.989 c-2.418,5.495 -3.675,11.825 -3.387,18.47 l27.968,-2.042" fill={`url(#${gradientId}_blade)`} />
      </g>

      {/* ===== Small Rotor ===== */}
      <g filter={`url(#${filterId})`}>
        <circle cx="80.838" cy="52.544" r="8.533" fill={`url(#${gradientId}_rotor)`} />
        <circle cx="80.838" cy="52.544" r="8.533" fill="none" stroke="#000" strokeWidth="1" />
      </g>

      {/* ===== Small Rotor Blade ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M79.884,58.864 c3.497,0.616 6.833,-1.72 7.449,-5.218 l-6.581,-1.161 c-0.046,0.258 -0.055,0.31 -0.115,0.648" fill={startColor} />
        <path d="M81.762,46.064 c-3.498,-0.617 -6.832,1.72 -7.45,5.217 l6.582,1.16 c0.046,-0.257 0.056,-0.308 0.115,-0.648 L81.762,46.064z" fill={midColor} stroke={startColor} strokeWidth="0.25" />
      </g>
    </svg>
  );
};

export default Pump3DIcon;