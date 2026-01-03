import React, { useState, useEffect } from 'react';
import questdbService from '../../services/questdb';

// Import all SVG files
import BlowdownValve from '../../renderer/assets/3-D Blowdown valve.svg';
import PressureBalancedDiaphragm from '../../renderer/assets/3-D Pressure-balanced diaphragm actuated.svg';
import RegulatorExternalPressure from '../../renderer/assets/3-D Regulator with external pressure tap.svg';
import RegulatorSelfContained from '../../renderer/assets/3-D Regulator, self-contained.svg';
import RotaryPlugValve from '../../renderer/assets/3-D Rotary plug valve.svg';
import ValveLongShaft from '../../renderer/assets/3-D Valve with long shaft.svg';
import ValveFailLocked from '../../renderer/assets/3-D Valve, fail locked.svg';
import ControlValveHandActuator from '../../renderer/assets/3-D_Control_valve_with_hand_actuator.svg';
import HandControlValve from '../../renderer/assets/3-D_Hand_control_valve.svg';
import Pump3D from '../../renderer/assets/3-D_Pump.svg';
import Valve3D from '../../renderer/assets/3-D_Valve.svg';
import ValveWithActuator from '../../renderer/assets/3-D_Valve_with_actuator.svg';
import BallValve1 from '../../renderer/assets/Ball_valve_1.svg';
import BlueControlValve from '../../renderer/assets/Blue_control_valve_with_no_flange.svg';
import CentrifugalPump2 from '../../renderer/assets/Centrifugal_pump_2.svg';
import CentrifugalPump4 from '../../renderer/assets/Centrifugal_pump_4.svg';
import ClassicPump1 from '../../renderer/assets/Classic_pump_1.svg';
import CompactValve from '../../renderer/assets/Compact valve.svg';
import ControlValve3 from '../../renderer/assets/Control valve 3.svg';
import ControlValveDiaphragm from '../../renderer/assets/Control valve with diaphragm activator.svg';
import ControlValveGrayFitting from '../../renderer/assets/Control valve with gray fitting.svg';
import ControlValue from '../../renderer/assets/Control_value.svg';
import CoolPump from '../../renderer/assets/Cool_pump.svg';
import HandValveHorizontal from '../../renderer/assets/Hand valve - horizontal.svg';
import HandValve1 from '../../renderer/assets/Hand valve 1.svg';
import HandValve3 from '../../renderer/assets/Hand valve 3.svg';
import HandValve4 from '../../renderer/assets/Hand valve 4.svg';
import HorizontalPump3 from '../../renderer/assets/Horizontal pump 3.svg';
import HorizontalPump4 from '../../renderer/assets/Horizontal pump 4.svg';
import HorizontalSplitCasePump from '../../renderer/assets/Horizontal split case pump.svg';
import MagDriveNonMetallic from '../../renderer/assets/Mag drive non-metallic pump.svg';
import MagDrivePump2 from '../../renderer/assets/Mag drive pump 2.svg';
import MeteringPump4 from '../../renderer/assets/Metering pump 4.svg';
import PVCTwoWayBallValve from '../../renderer/assets/PVC two-way ball valve.svg';
import SafetyShutoffValve from '../../renderer/assets/Safety_shutoff_valve.svg';
import SeallessPump from '../../renderer/assets/Sealless pump.svg';
import SelfPrimingCentrifugalPump from '../../renderer/assets/Self-priming centrifugal pump.svg';
import SRHPump from '../../renderer/assets/SRH_pump.svg';
import VerticalPump9 from '../../renderer/assets/Vertical pump 9.svg';
import YellowPump from '../../renderer/assets/Yellow pump.svg';

const SVG_COMPONENTS = {
  blowdownValve: { name: 'Blowdown Valve', width: 60, height: 80, svg: BlowdownValve, color: '#ef4444' },
  pressureBalancedDiaphragm: { name: 'Pressure Balanced Diaphragm', width: 70, height: 90, svg: PressureBalancedDiaphragm, color: '#06b6d4' },
  regulatorExternalPressure: { name: 'Regulator (External)', width: 80, height: 80, svg: RegulatorExternalPressure, color: '#8b5cf6' },
  regulatorSelfContained: { name: 'Regulator (Self-Contained)', width: 80, height: 80, svg: RegulatorSelfContained, color: '#8b5cf6' },
  rotaryPlugValve: { name: 'Rotary Plug Valve', width: 70, height: 70, svg: RotaryPlugValve, color: '#f59e0b' },
  valveLongShaft: { name: 'Valve (Long Shaft)', width: 60, height: 90, svg: ValveLongShaft, color: '#f59e0b' },
  valveFailLocked: { name: 'Valve (Fail Locked)', width: 70, height: 80, svg: ValveFailLocked, color: '#ef4444' },
  controlValveHandActuator: { name: 'Control Valve (Hand)', width: 70, height: 80, svg: ControlValveHandActuator, color: '#3b82f6' },
  handControlValve: { name: 'Hand Control Valve', width: 60, height: 70, svg: HandControlValve, color: '#f59e0b' },
  valve3D: { name: '3D Valve', width: 60, height: 80, svg: Valve3D, color: '#f59e0b' },
  valveWithActuator: { name: 'Valve with Actuator', width: 70, height: 90, svg: ValveWithActuator, color: '#10b981' },
  ballValve1: { name: 'Ball Valve', width: 70, height: 70, svg: BallValve1, color: '#64748b' },
  pvcTwoWayBallValve: { name: 'PVC Ball Valve', width: 60, height: 70, svg: PVCTwoWayBallValve, color: '#64748b' },
  blueControlValve: { name: 'Control Valve (Blue)', width: 70, height: 90, svg: BlueControlValve, color: '#3b82f6' },
  compactValve: { name: 'Compact Valve', width: 60, height: 70, svg: CompactValve, color: '#06b6d4' },
  controlValve3: { name: 'Control Valve 3', width: 70, height: 80, svg: ControlValve3, color: '#3b82f6' },
  controlValveDiaphragm: { name: 'Control Valve (Diaphragm)', width: 70, height: 90, svg: ControlValveDiaphragm, color: '#3b82f6' },
  controlValveGrayFitting: { name: 'Control Valve (Gray)', width: 70, height: 90, svg: ControlValveGrayFitting, color: '#64748b' },
  controlValue: { name: 'Control Value', width: 70, height: 80, svg: ControlValue, color: '#3b82f6' },
  safetyShutoffValve: { name: 'Safety Shutoff Valve', width: 70, height: 90, svg: SafetyShutoffValve, color: '#ef4444' },
  handValveHorizontal: { name: 'Hand Valve (H)', width: 80, height: 60, svg: HandValveHorizontal, color: '#f59e0b' },
  handValve1: { name: 'Hand Valve 1', width: 60, height: 80, svg: HandValve1, color: '#f59e0b' },
  handValve3: { name: 'Hand Valve 3', width: 70, height: 80, svg: HandValve3, color: '#f59e0b' },
  handValve4: { name: 'Hand Valve 4', width: 70, height: 80, svg: HandValve4, color: '#f59e0b' },
  pump3D: { name: '3D Pump', width: 90, height: 80, svg: Pump3D, color: '#3b82f6' },
  centrifugalPump2: { name: 'Centrifugal Pump 2', width: 90, height: 80, svg: CentrifugalPump2, color: '#3b82f6' },
  centrifugalPump4: { name: 'Centrifugal Pump 4', width: 80, height: 80, svg: CentrifugalPump4, color: '#3b82f6' },
  classicPump1: { name: 'Classic Pump', width: 70, height: 70, svg: ClassicPump1, color: '#3b82f6' },
  coolPump: { name: 'Cool Pump', width: 80, height: 80, svg: CoolPump, color: '#06b6d4' },
  horizontalPump3: { name: 'Horizontal Pump 3', width: 100, height: 70, svg: HorizontalPump3, color: '#3b82f6' },
  horizontalPump4: { name: 'Horizontal Pump 4', width: 100, height: 70, svg: HorizontalPump4, color: '#3b82f6' },
  horizontalSplitCasePump: { name: 'Split Case Pump', width: 100, height: 80, svg: HorizontalSplitCasePump, color: '#3b82f6' },
  magDriveNonMetallic: { name: 'Mag Drive (Non-Metal)', width: 80, height: 80, svg: MagDriveNonMetallic, color: '#06b6d4' },
  magDrivePump2: { name: 'Mag Drive Pump 2', width: 90, height: 80, svg: MagDrivePump2, color: '#3b82f6' },
  meteringPump4: { name: 'Metering Pump', width: 80, height: 80, svg: MeteringPump4, color: '#8b5cf6' },
  seallessPump: { name: 'Sealless Pump', width: 80, height: 80, svg: SeallessPump, color: '#10b981' },
  selfPrimingCentrifugalPump: { name: 'Self-Priming Pump', width: 90, height: 80, svg: SelfPrimingCentrifugalPump, color: '#3b82f6' },
  srhPump: { name: 'SRH Pump', width: 90, height: 90, svg: SRHPump, color: '#3b82f6' },
  verticalPump9: { name: 'Vertical Pump', width: 70, height: 100, svg: VerticalPump9, color: '#3b82f6' },
  yellowPump: { name: 'Yellow Pump', width: 80, height: 80, svg: YellowPump, color: '#eab308' }
};

export default function ScadaPanel({ config, darkMode }) {
  const [tagValues, setTagValues] = useState({});

  const theme = darkMode ? {
    bg: '#1a1d29',
    text: '#e5e7eb',
    textSecondary: '#9ca3af',
    border: '#374151'
  } : {
    bg: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb'
  };

  // Fetch real-time tag values from scada_wide table
  useEffect(() => {
    const fetchTagValues = async () => {
      try {
        // Get all unique tag names from components
        const tagNames = [...new Set(
          config.components
            ?.filter(comp => comp.tagName)
            .map(comp => comp.tagName)
        )];

        if (tagNames.length === 0) return;

        // Fetch latest row from scada_wide table with only the needed columns
        const columnsToSelect = ['timestamp', ...tagNames].join(', ');
        const sql = `SELECT ${columnsToSelect} FROM scada_wide ORDER BY timestamp DESC LIMIT 1`;
        
        const result = await questdbService.query(sql);
        
        if (result.length > 0) {
          // Create a map of column_name -> value
          const valueMap = {};
          const latestRow = result[0];
          
          tagNames.forEach(tagName => {
            if (latestRow[tagName] !== undefined && latestRow[tagName] !== null) {
              valueMap[tagName] = String(latestRow[tagName]);
            }
          });
          
          setTagValues(valueMap);
        }
      } catch (error) {
        console.error('Error fetching tag values:', error);
      }
    };

    // Initial fetch
    fetchTagValues();

    // Set up polling interval (every 2 seconds)
    const interval = setInterval(fetchTagValues, 2000);

    return () => clearInterval(interval);
  }, [config.components]);

  // Get color for a component based on its tag value
  const getComponentColor = (comp) => {
    if (!comp.tagName || !tagValues[comp.tagName]) {
      return comp.defaultColor || '#64748b';
    }

    const tagValue = tagValues[comp.tagName];
    const mapping = comp.colorMappings?.find(m => String(m.value) === String(tagValue));
    
    return mapping ? mapping.color : (comp.defaultColor || '#64748b');
  };

  // Get status label for a component
  const getComponentStatus = (comp) => {
    if (!comp.tagName || !tagValues[comp.tagName]) {
      return null;
    }

    const tagValue = tagValues[comp.tagName];
    const mapping = comp.colorMappings?.find(m => String(m.value) === String(tagValue));
    
    return mapping?.label || tagValue;
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
            <g key={line.id}>
              <line
                x1={coords.x1}
                y1={coords.y1}
                x2={coords.x2}
                y2={coords.y2}
                stroke={line.color || '#3b82f6'}
                strokeWidth={line.width || 2}
                strokeDasharray={line.style === 'dashed' ? '5,5' : '0'}
                strokeLinecap="round"
              />
              {/* Arrow head */}
              {(() => {
                const angle = Math.atan2(coords.y2 - coords.y1, coords.x2 - coords.x1);
                const arrowSize = 10;
                return (
                  <polygon
                    points={`0,-${arrowSize/2} ${arrowSize},0 0,${arrowSize/2}`}
                    fill={line.color || '#3b82f6'}
                    transform={`translate(${coords.x2}, ${coords.y2}) rotate(${angle * 180 / Math.PI})`}
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Components */}
        {config.components?.map(comp => {
          const svgData = SVG_COMPONENTS[comp.type];
          if (!svgData) return null;
          
          const componentColor = getComponentColor(comp);
          const status = getComponentStatus(comp);
          
          return (
            <g
              key={comp.id}
              transform={`translate(${comp.x}, ${comp.y})`}
            >
              <g transform={`rotate(${comp.rotation || 0}, ${svgData.width/2}, ${svgData.height/2})`}>
                {/* Color indicator background */}
                <rect
                  x={-4}
                  y={-4}
                  width={svgData.width + 8}
                  height={svgData.height + 8}
                  fill={componentColor}
                  rx="8"
                  opacity="0.3"
                />
                
                {/* Colored border */}
                <rect
                  x={-2}
                  y={-2}
                  width={svgData.width + 4}
                  height={svgData.height + 4}
                  fill="none"
                  stroke={componentColor}
                  strokeWidth="3"
                  rx="6"
                />
                
                {/* SVG Image */}
                <image
                  href={svgData.svg}
                  width={svgData.width}
                  height={svgData.height}
                  style={{ 
                    filter: comp.tagName 
                      ? `drop-shadow(0 0 8px ${componentColor})` 
                      : 'none'
                  }}
                />
              </g>
              
              {/* Label */}
              <text
                x={svgData.width / 2}
                y={svgData.height + 18}
                textAnchor="middle"
                fill={theme.text}
                fontSize="11"
                fontWeight="600"
              >
                {comp.label}
              </text>
              
              {/* Status indicator */}
              {status && (
                <g>
                  <rect
                    x={svgData.width / 2 - 30}
                    y={svgData.height + 24}
                    width="60"
                    height="18"
                    fill={componentColor}
                    rx="4"
                    opacity="0.9"
                  />
                  <text
                    x={svgData.width / 2}
                    y={svgData.height + 36}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {status}
                  </text>
                </g>
              )}
              
              {/* Value display */}
              {comp.tagName && tagValues[comp.tagName] && (
                <text
                  x={svgData.width / 2}
                  y={svgData.height + 50}
                  textAnchor="middle"
                  fill={theme.textSecondary}
                  fontSize="9"
                  fontWeight="500"
                >
                  {comp.tagName}: {tagValues[comp.tagName]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {config.components?.some(c => c.tagName) && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: darkMode ? 'rgba(26, 29, 41, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          padding: '12px',
          fontSize: '11px',
          color: theme.text,
          maxWidth: '200px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '12px' }}>
            Status Legend
          </div>
          {[...new Set(
            config.components
              .filter(c => c.colorMappings)
              .flatMap(c => c.colorMappings)
              .map(m => JSON.stringify(m))
          )].map(m => JSON.parse(m)).map((mapping, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: mapping.color,
                borderRadius: '3px',
                border: `1px solid ${theme.border}`
              }} />
              <span>{mapping.label || mapping.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
