import React from 'react';

const PumpIcon = ({
  width = 64,
  height = 64,
  className = '',
  startColor = '#1f7a1f',
  midColor = '#4fae4f',
  endColor = '#0f3d0f'
}) => {
  const id = Math.random().toString(36).slice(2, 9);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 125.921 121.105"
      className={className}
    >
      <defs>
        {/* ================= PREMIUM METAL BODY ================= */}
        <radialGradient id={`body-${id}`} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor={midColor} stopOpacity="1" />
          <stop offset="25%" stopColor={startColor} />
          <stop offset="60%" stopColor={startColor} />
          <stop offset="85%" stopColor={endColor} />
          <stop offset="100%" stopColor={endColor} stopOpacity="0.95" />
        </radialGradient>

        {/* Enhanced rim highlight with shine */}
        <radialGradient id={`rim-${id}`} cx="50%" cy="50%" r="52%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="82%" stopColor="rgba(255,255,255,0)" />
          <stop offset="92%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
        </radialGradient>

        {/* Top light reflection */}
        <radialGradient id={`toplight-${id}`} cx="40%" cy="25%" r="45%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Impeller with metallic sheen */}
        <linearGradient id={`impeller-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="35%" stopColor={startColor} />
          <stop offset="70%" stopColor={endColor} />
          <stop offset="100%" stopColor={startColor} />
        </linearGradient>

        {/* Impeller center shine */}
        <radialGradient id={`center-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="60%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </radialGradient>

        {/* Outlet pipe gradient */}
        <linearGradient id={`outlet-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="50%" stopColor={midColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* Leg gradient */}
        <linearGradient id={`leg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={midColor} />
          <stop offset="50%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* Enhanced depth shadow */}
        <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Inner shadow for depth */}
        <filter id={`innershadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feFlood floodColor="#000000" floodOpacity="0.3"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Smooth rotation animation */}
        <animateTransform
          xlinkHref="#Group_Impeller"
          attributeName="transform"
          type="rotate"
          from="0 53 57"
          to="360 53 57"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </defs>

      {/* ================= OUTLET PIPE ================= */}
      <g filter={`url(#shadow-${id})`}>
        {/* Main outlet pipe */}
        <rect x="112.8" y="0.7" width="13.1" height="50.4" fill={`url(#outlet-${id})`} rx="1.5" />
        <rect x="113.5" y="1.5" width="11.7" height="48.8" fill="rgba(255,255,255,0.08)" rx="1" />
        
        {/* Horizontal connector */}
        <path
          d="M53.2,6.2 L112.9,6.2 L112.9,45.2 L102.5,45.2"
          fill={`url(#outlet-${id})`}
        />
        <path
          d="M54,7.5 L111.5,7.5 L111.5,43.5"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
      </g>

      {/* ================= SUPPORT LEGS ================= */}
      <g filter={`url(#shadow-${id})`}>
        <path
          d="M11.3,120.4 l10.3,-35.9 h61.9 l10.3,35.9 L73,120.4 L52.5,89.5 l-20.8,30.9 z"
          fill={`url(#leg-${id})`}
        />
        {/* Highlight on legs */}
        <path
          d="M22,86 l9,33 M82,86 l-9,33"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* ================= BASE PLATES ================= */}
      <rect x="0.8" y="115.9" width="37.5" height="5.2" fill={endColor} rx="1" filter={`url(#shadow-${id})`} />
      <rect x="2" y="116.5" width="35" height="3" fill="rgba(255,255,255,0.1)" rx="0.5" />
      
      <rect x="66.6" y="115.9" width="37.9" height="5.2" fill={endColor} rx="1" filter={`url(#shadow-${id})`} />
      <rect x="68" y="116.5" width="35" height="3" fill="rgba(255,255,255,0.1)" rx="0.5" />

      {/* ================= MAIN PUMP BODY ================= */}
      <g filter={`url(#shadow-${id})`}>
        {/* Main cylinder body */}
        <circle
          cx="53"
          cy="57"
          r="51.5"
          fill={`url(#body-${id})`}
        />
        
        {/* Top light reflection */}
        <ellipse
          cx="53"
          cy="57"
          rx="51.5"
          ry="51.5"
          fill={`url(#toplight-${id})`}
        />
        
        {/* Rim highlight */}
        <circle
          cx="53"
          cy="57"
          r="51.5"
          fill={`url(#rim-${id})`}
        />
        
        {/* Outer ring detail */}
        <circle
          cx="53"
          cy="57"
          r="51.5"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />
        <circle
          cx="53"
          cy="57"
          r="49"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1"
        />
      </g>

      {/* ================= INNER CHAMBER ================= */}
      <g filter={`url(#innershadow-${id})`}>
        <circle
          cx="53"
          cy="57"
          r="28"
          fill={endColor}
          opacity="0.85"
        />
        {/* Inner ring highlight */}
        <circle
          cx="53"
          cy="57"
          r="28"
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1.5"
        />
        <circle
          cx="53"
          cy="57"
          r="26.5"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
        />
      </g>

      {/* ================= IMPELLER WITH ENHANCED DESIGN ================= */}
      <g id="Group_Impeller">
        {/* Impeller blades - 4-blade design */}
        <g opacity="0.95">
          {/* Blade 1 */}
          <path
            d="M53,57 L53,77 L51,75 L53,57"
            fill={`url(#impeller-${id})`}
            stroke={startColor}
            strokeWidth="0.5"
          />
          <path
            d="M53,57 L56,77"
            stroke={midColor}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Blade 2 */}
          <path
            d="M53,57 L73,67 L71,65 L53,57"
            fill={`url(#impeller-${id})`}
            stroke={startColor}
            strokeWidth="0.5"
          />
          <path
            d="M53,57 L72,65"
            stroke={midColor}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Blade 3 */}
          <path
            d="M53,57 L53,37 L55,39 L53,57"
            fill={`url(#impeller-${id})`}
            stroke={startColor}
            strokeWidth="0.5"
          />
          <path
            d="M53,57 L50,37"
            stroke={midColor}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Blade 4 */}
          <path
            d="M53,57 L33,47 L35,49 L53,57"
            fill={`url(#impeller-${id})`}
            stroke={startColor}
            strokeWidth="0.5"
          />
          <path
            d="M53,57 L34,49"
            stroke={midColor}
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Central hub */}
        <circle
          cx="53"
          cy="57"
          r="8.5"
          fill={`url(#center-${id})`}
          filter={`url(#shadow-${id})`}
        />
        
        {/* Hub ring */}
        <circle
          cx="53"
          cy="57"
          r="8.5"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.8"
        />
        <circle
          cx="53"
          cy="57"
          r="7"
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.8"
        />
        
        {/* Central shine */}
        <circle
          cx="51"
          cy="55"
          r="3"
          fill="rgba(255,255,255,0.25)"
        />
      </g>

      {/* ================= BOLT DETAILS ================= */}
      <g opacity="0.6">
        <circle cx="25" cy="30" r="2.5" fill={endColor} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <circle cx="81" cy="30" r="2.5" fill={endColor} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <circle cx="25" cy="84" r="2.5" fill={endColor} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
        <circle cx="81" cy="84" r="2.5" fill={endColor} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

export default PumpIcon;