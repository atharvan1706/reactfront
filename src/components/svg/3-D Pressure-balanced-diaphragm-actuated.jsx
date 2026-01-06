import React from 'react';

const VerticalTankIcon = ({
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
      viewBox="0 0 354 530"
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
        <linearGradient id={`${gradientId}_metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="45%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>

      {/* ===== Vertical Shaft ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M194,148 l0,266 -35,0 0,-266 35,0z" fill={`url(#${gradientId}_metal)`} />
        <path d="M191,148 l0,266 -28,0 0,-266 28,0z" fill={`url(#${gradientId}_metal)`} />
        <path d="M186,148 l0,266 -19,0 0,-266 19,0z" fill={`url(#${gradientId}_metal)`} />
        <path d="M180,148 l0,266 -7,0 0,-266 7,0z" fill={endColor} />

        <path d="M159,148 l0,266" stroke="#000" strokeWidth="2" />
        <path d="M194,414 l0,-266" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Base Support ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M38,515 l0,-207 274,207 0,-207 -274,207z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38,505 l0,-186 274,186 0,-186 -274,186z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38,483 l0,-143 274,143 0,-143 -274,143z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38,462 l0,-101 274,101 0,-101 -274,101z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38,446 l0,-69 274,69 0,-69 -274,69z" fill={`url(#${gradientId}_metal)`} />
        <path d="M38,425 l0,-27 274,27 0,-27 -274,27z" fill={endColor} />

        <path
          d="M38,515 l0,-207 274,207 0,-207 -274,207"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </g>

      {/* ===== Top Tank Ellipses ===== */}
      <g filter={`url(#${filterId})`}>
        <ellipse cx="177" cy="85" rx="139" ry="70" fill={`url(#${gradientId}_metal)`} />
        <ellipse cx="177" cy="85" rx="126" ry="70" fill={`url(#${gradientId}_metal)`} />
        <ellipse cx="177" cy="85" rx="100" ry="70" fill={`url(#${gradientId}_metal)`} />
        <ellipse cx="177" cy="85" rx="74" ry="70" fill={`url(#${gradientId}_metal)`} />
        <ellipse cx="177" cy="85" rx="48" ry="70" fill={`url(#${gradientId}_metal)`} />
        <ellipse cx="177" cy="85" rx="13" ry="70" fill={endColor} />

        <ellipse
          cx="177"
          cy="85"
          rx="139"
          ry="70"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </g>

      {/* ===== Horizontal Pipe ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M47,66 l261,0 0,34 -261,0 0,-34z" fill={`url(#${gradientId}_metal)`} />
        <path d="M47,69 l261,0 0,28 -261,0 0,-28z" fill={`url(#${gradientId}_metal)`} />
        <path d="M47,73 l261,0 0,20 -261,0 0,-20z" fill={`url(#${gradientId}_metal)`} />
        <path d="M47,80 l261,0 0,6 -261,0 0,-6z" fill={endColor} />

        <path d="M47,100 l261,0" stroke="#000" strokeWidth="2" />
        <path d="M308,66 l-261,0" stroke="#000" strokeWidth="2" />
      </g>

      {/* ===== Right Nozzle ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M322,66 l-18,0 0,35 18,0 6,-1 6,-4 4,-6 1,-7 -1,-7 -4,-5 -6,-4 -6,-1z" fill={`url(#${gradientId}_metal)`} />
        <path d="M304,101 l18,0 6,-1 6,-4 4,-6 1,-7 -1,-7 -4,-5 -6,-4 -6,-1 -18,0"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </g>

      {/* ===== Left Nozzle ===== */}
      <g filter={`url(#${filterId})`}>
        <path d="M32,101 l18,0 0,-36 -18,0 -6,1 -6,4 -4,6 -1,7 1,7 4,6 6,4 6,1z" fill={`url(#${gradientId}_metal)`} />
        <path d="M50,65 l-18,0 -6,1 -6,4 -4,6 -1,7 1,7 4,6 6,4 6,1 18,0"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};

export default VerticalTankIcon;
