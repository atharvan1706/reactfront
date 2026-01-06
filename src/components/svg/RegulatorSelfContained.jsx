import React from 'react';

const ValveIconExact = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#5C5C5C',
  midColor = '#EBEBEB',
  endColor = '#5C5C5C'
}) => {
  const id = Math.random().toString(36).slice(2, 9);

  const sc = startColor;
  const mc = midColor;
  const ec = endColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 86.18 112.5"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`SVGID_3_${id}`} gradientUnits="userSpaceOnUse"
          x1="-4.882813e-004" y1="112.5" x2="0.9995" y2="112.5"
          gradientTransform="matrix(0 7.875 7.875 0 -827.4336 0.0034)">
          <stop offset="0" stopColor={sc} />
          <stop offset="0.45" stopColor={mc} />
          <stop offset="0.57" stopColor={mc} />
          <stop offset="0.77" stopColor={ec} />
          <stop offset="1" stopColor={sc} />
        </linearGradient>

        <radialGradient id={`SVGID_23_${id}`} cx="-0.0068" cy="112.4941" r="1.0008"
          gradientTransform="matrix(47.5839 0 0 -46.1845 49.8252 5246.2827)">
          <stop offset="0" stopColor={ec} />
          <stop offset="0.5" stopColor={mc} />
          <stop offset="1" stopColor={ec} />
        </radialGradient>

        <radialGradient id={`SVGID_26_${id}`} cx="0" cy="112.498" r="1.001"
          gradientTransform="matrix(-46.4661 0 0 -46.1105 21.7625 5238.1147)">
          <stop offset="0" stopColor={ec} />
          <stop offset="0.5" stopColor={mc} />
          <stop offset="1" stopColor={ec} />
        </radialGradient>
      </defs>

      {/* ===== ORIGINAL SHAPES — UNTOUCHED ===== */}

      <rect x="30.826" width="55.35" height="7.875" fill={`url(#SVGID_3_${id})`} />

      <path
        d="M6.976,38.823l28.939-0.083L35.83,10.624C19.89,10.624,6.976,23.353,6.976,38.823"
        fill={`url(#SVGID_23_${id})`}
      />

      <path
        d="M35.059,38.693l28.258,0.083c0-15.447-12.612-28.157-28.176-28.157L35.059,38.693z"
        fill={`url(#SVGID_26_${id})`}
      />

      <path
        d="M0.001,78.384L34.65,95.277L0.001,112.415V78.384"
        fill={`url(#SVGID_3_${id})`}
      />

      <path
        d="M68.807,78.511L34.65,95.203l34.156,16.938V78.511"
        fill={`url(#SVGID_3_${id})`}
      />
    </svg>
  );
};

export default ValveIconExact;
