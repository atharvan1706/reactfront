import React from 'react';

// Import SVG files
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

// SVG Component Templates
const SVG_COMPONENTS = {
 // 3D Valves
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
  
  // Ball Valves
  ballValve1: { name: 'Ball Valve', width: 70, height: 70, svg: BallValve1, color: '#64748b' },
  pvcTwoWayBallValve: { name: 'PVC Ball Valve', width: 60, height: 70, svg: PVCTwoWayBallValve, color: '#64748b' },
  
  // Control Valves
  blueControlValve: { name: 'Control Valve (Blue)', width: 70, height: 90, svg: BlueControlValve, color: '#3b82f6' },
  compactValve: { name: 'Compact Valve', width: 60, height: 70, svg: CompactValve, color: '#06b6d4' },
  controlValve3: { name: 'Control Valve 3', width: 70, height: 80, svg: ControlValve3, color: '#3b82f6' },
  controlValveDiaphragm: { name: 'Control Valve (Diaphragm)', width: 70, height: 90, svg: ControlValveDiaphragm, color: '#3b82f6' },
  controlValveGrayFitting: { name: 'Control Valve (Gray)', width: 70, height: 90, svg: ControlValveGrayFitting, color: '#64748b' },
  controlValue: { name: 'Control Value', width: 70, height: 80, svg: ControlValue, color: '#3b82f6' },
  safetyShutoffValve: { name: 'Safety Shutoff Valve', width: 70, height: 90, svg: SafetyShutoffValve, color: '#ef4444' },
  
  // Hand Valves
  handValveHorizontal: { name: 'Hand Valve (H)', width: 80, height: 60, svg: HandValveHorizontal, color: '#f59e0b' },
  handValve1: { name: 'Hand Valve 1', width: 60, height: 80, svg: HandValve1, color: '#f59e0b' },
  handValve3: { name: 'Hand Valve 3', width: 70, height: 80, svg: HandValve3, color: '#f59e0b' },
  handValve4: { name: 'Hand Valve 4', width: 70, height: 80, svg: HandValve4, color: '#f59e0b' },
  
  // Pumps
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
