import React from 'react';

// Import SVG files
import MixerSvg from '../../assets/Mixer.svg';
import MixerGreenSvg from '../../assets/MixerGreen.svg';
import PumpSvg from '../../assets/Pump.svg';
import PumpGreenSvg from '../../assets/PumpGreen.svg';
import RotationalMixerSvg from '../../assets/RotationalMixer.svg';
import RotationalPumpSvg from '../../assets/RotationalPump.svg';
import ValveSvg from '../../assets/Valve.svg';
import ValveActuatorGreenSvg from '../../assets/ValveActuatorGreen.svg';

const SVG_COMPONENTS = {
  mixer: { name: 'Mixer', width: 60, height: 60, svg: MixerSvg, color: '#3b82f6' },
  mixerGreen: { name: 'Mixer (Active)', width: 60, height: 60, svg: MixerGreenSvg, color: '#10b981' },
  pump: { name: 'Pump', width: 80, height: 80, svg: PumpSvg, color: '#3b82f6' },
  pumpGreen: { name: 'Pump (Active)', width: 80, height: 80, svg: PumpGreenSvg, color: '#10b981' },
  rotationalMixer: { name: 'Rotational Mixer', width: 70, height: 70, svg: RotationalMixerSvg, color: '#8b5cf6' },
  rotationalPump: { name: 'Rotational Pump', width: 80, height: 80, svg: RotationalPumpSvg, color: '#8b5cf6' },
  valve: { name: 'Valve', width: 50, height: 70, svg: ValveSvg, color: '#f59e0b' },
  valveGreen: { name: 'Valve (Active)', width: 50, height: 70, svg: ValveActuatorGreenSvg, color: '#10b981' }
};

export default function ScadaPanel({ config, darkMode }) {
  const theme = darkMode ? {
    bg: '#1a1d29',
    text: '#e5e7eb',
    border: '#374151'
  } : {
    bg: '#ffffff',
    text: '#111827',
    border: '#e5e7eb'
  };

  const getLineCoordinates = (line) => {
    const fromComp = config.components?.find(c => c.id === line.from);
    const toComp = config.components?.find(c => c.id === line.to);
    
    if (!fromComp || !toComp) return null;
    
    const fromSvg = SVG_COMPONENTS[fromComp.type];
    const toSvg = SVG_COMPONENTS[toComp.type];
    
    return {
      x1: fromComp.x + (fromSvg?.width || 60) / 2,
      y1: fromComp.y + (fromSvg?.height || 60) / 2,
      x2: toComp.x + (toSvg?.width || 60) / 2,
      y2: toComp.y + (toSvg?.height || 60) / 2
    };
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: theme.bg,
      overflow: 'hidden',
      position: 'relative'
    }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1000 600" 
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* Grid background */}
        <defs>
          <pattern id={`grid-${config.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={darkMode ? '#374151' : '#e5e7eb'} opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${config.id})`} />

        {/* Lines */}
        {config.lines?.map(line => {
          const coords = getLineCoordinates(line);
          if (!coords) return null;
          
          return (
            <line
              key={line.id}
              x1={coords.x1}
              y1={coords.y1}
              x2={coords.x2}
              y2={coords.y2}
              stroke={line.color || '#3b82f6'}
              strokeWidth={line.width || 2}
              strokeDasharray={line.style === 'dashed' ? '5,5' : '0'}
            />
          );
        })}

        {/* Components */}
        {config.components?.map(comp => {
          const svgData = SVG_COMPONENTS[comp.type];
          if (!svgData) return null;
          
          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y})`}
            >
              <g transform={`rotate(${comp.rotation || 0}, ${svgData.width/2}, ${svgData.height/2})`}>
                <image
                  href={svgData.svg}
                  width={svgData.width}
                  height={svgData.height}
                />
              </g>
              <text
                x={svgData.width / 2}
                y={svgData.height + 15}
                textAnchor="middle"
                fill={theme.text}
                fontSize="11"
                fontWeight="500"
              >
                {comp.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
