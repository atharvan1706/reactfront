import React, { useState, useRef, useEffect } from 'react';
import { X as LucideX, Save, Trash2, Plus, Move, Pencil, Grid, ZoomIn, ZoomOut, Download, Upload, RotateCw, Check, Database, Tag } from 'lucide-react';
import questdbService from '../../services/questdb';

// Import all SVG files (keeping your existing imports)
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
const X = LucideX;
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

// Component Tag Configuration Modal
function ComponentTagModal({ component, availableTags, onSave, onClose, darkMode }) {
  const [tagName, setTagName] = useState(component?.tagName || '');
  const [label, setLabel] = useState(component?.label || '');
  const [colorMappings, setColorMappings] = useState(component?.colorMappings || [
    { value: '0', color: '#ef4444', label: 'Off' },
    { value: '1', color: '#10b981', label: 'On' }
  ]);
  const [defaultColor, setDefaultColor] = useState(component?.defaultColor || '#64748b');

  const theme = darkMode ? {
    bg: '#0f1117', card: '#1a1d29', text: '#e5e7eb', textSecondary: '#9ca3af',
    border: '#374151', accent: '#667eea', hover: '#232837'
  } : {
    bg: '#ffffff', card: '#f9fafb', text: '#111827', textSecondary: '#6b7280',
    border: '#e5e7eb', accent: '#667eea', hover: '#f3f4f6'
  };

  const handleSave = () => {
    onSave({ ...component, tagName, label, colorMappings, defaultColor });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div style={{ background: theme.bg, borderRadius: '16px', width: '100%', maxWidth: '650px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '20px 24px', borderBottom: `2px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Database size={24} color={theme.accent} />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: theme.text }}>Configure Component Tag</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: theme.textSecondary }}>Assign tag and define color mappings</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '8px', background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.text, fontWeight: '600' }}>Component Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Enter label..." style={{ width: '100%', padding: '12px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.text, fontWeight: '600' }}>Assign Tag</label>
            <select value={tagName} onChange={(e) => setTagName(e.target.value)} style={{ width: '100%', padding: '12px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '14px', cursor: 'pointer' }}>
              <option value="">No tag assigned</option>
              {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: theme.textSecondary }}>Select a tag from QuestDB</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: theme.text, fontWeight: '600' }}>Default Color</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="color" value={defaultColor} onChange={(e) => setDefaultColor(e.target.value)} style={{ width: '60px', height: '44px', border: `2px solid ${theme.border}`, borderRadius: '8px', cursor: 'pointer' }} />
              <input type="text" value={defaultColor} onChange={(e) => setDefaultColor(e.target.value)} style={{ flex: 1, padding: '12px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '14px', fontFamily: 'monospace' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', color: theme.text, fontWeight: '600' }}>Value → Color Mappings</label>
              <button onClick={() => setColorMappings([...colorMappings, { value: '', color: '#3b82f6', label: '' }])} style={{ padding: '8px 16px', background: theme.accent, border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} />Add
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {colorMappings.map((m, i) => (
                <div key={i} style={{ padding: '16px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>Value</label>
                      <input type="text" value={m.value} onChange={(e) => { const u = [...colorMappings]; u[i].value = e.target.value; setColorMappings(u); }} placeholder="0, 1..." style={{ width: '100%', padding: '10px', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.text, fontSize: '13px' }} />
                    </div>
                    <div style={{ width: '80px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>Color</label>
                      <input type="color" value={m.color} onChange={(e) => { const u = [...colorMappings]; u[i].color = e.target.value; setColorMappings(u); }} style={{ width: '100%', height: '42px', border: `1px solid ${theme.border}`, borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textSecondary, fontWeight: '600' }}>Label</label>
                      <input type="text" value={m.label} onChange={(e) => { const u = [...colorMappings]; u[i].label = e.target.value; setColorMappings(u); }} placeholder="Off, On..." style={{ width: '100%', padding: '10px', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.text, fontSize: '13px' }} />
                    </div>
                    <button onClick={() => setColorMappings(colorMappings.filter((_, idx) => idx !== i))} style={{ marginTop: '24px', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `2px solid ${theme.border}`, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '12px 24px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function ScadaDesigner({ config, onSave, onClose, darkMode }) {
  const [components, setComponents] = useState(config?.components || []);
  const [lines, setLines] = useState(config?.lines || []);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [drawingLine, setDrawingLine] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [componentToAdd, setComponentToAdd] = useState(null);
  const [lineColor, setLineColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(3);
  const [saved, setSaved] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState(config?.title || 'SCADA Diagram');
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingComponentTag, setEditingComponentTag] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagValues, setTagValues] = useState({}); 
  const canvasRef = useRef(null);

  const theme = darkMode ? {
    bg: '#0f1117', card: '#1a1d29', hover: '#232837', text: '#e5e7eb',
    textSecondary: '#9ca3af', border: '#2d3348', accent: '#667eea', success: '#10b981'
  } : {
    bg: '#ffffff', card: '#f9fafb', hover: '#f3f4f6', text: '#111827',
    textSecondary: '#6b7280', border: '#e5e7eb', accent: '#667eea', success: '#10b981'
  };

  useEffect(() => {
  const fetchTags = async () => {
    try {
      const sql = `SELECT * FROM scada_wide LIMIT 1`;
      const result = await questdbService.query(sql);
      
      if (result.length > 0) {
        const columns = Object.keys(result[0]).filter(col => col !== 'timestamp' && col !== 'bridge_id');
        setAvailableTags(columns);
      }
    } catch (error) {
      console.error('Error fetching tags from scada_wide:', error);
    }
  };
  fetchTags();
}, []);

// NEW useEffect - ADD THIS RIGHT AFTER THE ABOVE
useEffect(() => {
  const fetchTagValues = async () => {
    try {
      const tagNames = [...new Set(
        components.filter(comp => comp.tagName).map(comp => comp.tagName)
      )];
      
      if (tagNames.length === 0) return;

      const columnsToSelect = ['timestamp', ...tagNames].join(', ');
      const sql = `SELECT ${columnsToSelect} FROM scada_wide ORDER BY timestamp DESC LIMIT 1`;
      
      const result = await questdbService.query(sql);
      
      if (result.length > 0) {
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

  fetchTagValues();
  const interval = setInterval(fetchTagValues, 2000);
  return () => clearInterval(interval);
}, [components]);

// ADD THESE THREE FUNCTIONS
const getComponentColor = (comp) => {
  if (!comp.tagName || !tagValues[comp.tagName]) {
    return comp.defaultColor || '#64748b';
  }

  const tagValue = tagValues[comp.tagName];
  const mapping = comp.colorMappings?.find(m => String(m.value) === String(tagValue));
  
  return mapping ? mapping.color : (comp.defaultColor || '#64748b');
};

const getComponentStatus = (comp) => {
  if (!comp.tagName || !tagValues[comp.tagName]) {
    return null;
  }

  const tagValue = tagValues[comp.tagName];
  const mapping = comp.colorMappings?.find(m => String(m.value) === String(tagValue));
  
  return mapping?.label || tagValue;
};
const getSVGColorFilter = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  const brightness = (r + g + b) / 3;
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  return `brightness(${brightness * 2}) saturate(${saturation * 5 + 1}) hue-rotate(${getHueRotation(r, g, b)}deg)`;
};

const getHueRotation = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }
  return Math.round(h * 360);
};
const fetchSingleTagValue = async (tagName) => {
  if (!tagName) return;
  try {
    const sql = `SELECT timestamp, ${tagName} FROM scada_wide ORDER BY timestamp DESC LIMIT 1`;
    const result = await questdbService.query(sql);
    
    if (result.length > 0 && result[0][tagName] !== undefined) {
      setTagValues(prev => ({
        ...prev,
        [tagName]: String(result[0][tagName])
      }));
    }
  } catch (error) {
    console.error('Error fetching single tag value:', error);
  }
};

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (selectedTool === 'component' && componentToAdd) {
      const newComponent = {
        id: `comp_${Date.now()}`,
        type: componentToAdd,
        x: x - SVG_COMPONENTS[componentToAdd].width / 2,
        y: y - SVG_COMPONENTS[componentToAdd].height / 2,
        rotation: 0,
        label: SVG_COMPONENTS[componentToAdd].name,
        tagName: '',
        colorMappings: [
          { value: '0', color: '#ef4444', label: 'Off' },
          { value: '1', color: '#10b981', label: 'On' }
        ],
        defaultColor: '#64748b',
        config: {}
      };
      setComponents([...components, newComponent]);
      setSelectedComponent(newComponent.id);
      setSelectedTool('select');
      setComponentToAdd(null);
    } else if (selectedTool === 'select') {
      setSelectedComponent(null);
      setSelectedLine(null);
    } else if (selectedTool === 'line' && drawingLine) {
      setDrawingLine(null);
    }
  };

  const handleComponentMouseDown = (e, comp) => {
    e.stopPropagation();
    if (selectedTool === 'select') {
      setSelectedComponent(comp.id);
      setSelectedLine(null);
      setDraggingComponent({ 
        id: comp.id, startX: e.clientX, startY: e.clientY,
        initialX: comp.x, initialY: comp.y
      });
    } else if (selectedTool === 'line') {
      const svgData = SVG_COMPONENTS[comp.type];
      const centerX = comp.x + svgData.width / 2;
      const centerY = comp.y + svgData.height / 2;
      if (!drawingLine) {
        setDrawingLine({ from: comp.id, startX: centerX, startY: centerY, endX: centerX, endY: centerY });
      } else if (drawingLine.from !== comp.id) {
        setLines([...lines, {
          id: `line_${Date.now()}`, from: drawingLine.from, to: comp.id,
          color: lineColor, width: lineWidth, style: 'solid'
        }]);
        setDrawingLine(null);
        setSelectedTool('select');
      }
    }
  };

  const handleMouseMove = (e) => {
    if (draggingComponent && selectedTool === 'select') {
      const deltaX = (e.clientX - draggingComponent.startX) / zoom;
      const deltaY = (e.clientY - draggingComponent.startY) / zoom;
      setComponents(components.map(c => 
        c.id === draggingComponent.id 
          ? { ...c, x: Math.max(0, draggingComponent.initialX + deltaX), y: Math.max(0, draggingComponent.initialY + deltaY) }
          : c
      ));
    } else if (drawingLine && selectedTool === 'line') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setDrawingLine({ ...drawingLine, endX: x, endY: y });
    }
  };

  const handleMouseUp = () => setDraggingComponent(null);

  const handleConfigureTag = () => {
    if (selectedComponent) {
      const comp = components.find(c => c.id === selectedComponent);
      setEditingComponentTag(comp);
      setShowTagModal(true);
    }
  };

const handleSaveTagConfig = (updatedComponent) => {
  setComponents(components.map(c => c.id === updatedComponent.id ? updatedComponent : c));
  setShowTagModal(false);
  setEditingComponentTag(null);
  // Immediately fetch the tag value
  fetchSingleTagValue(updatedComponent.tagName);
};

  const handleDeleteComponent = () => {
    if (selectedComponent) {
      setComponents(components.filter(c => c.id !== selectedComponent));
      setLines(lines.filter(l => l.from !== selectedComponent && l.to !== selectedComponent));
      setSelectedComponent(null);
    }
  };

  const handleDeleteLine = () => {
    if (selectedLine) {
      setLines(lines.filter(l => l.id !== selectedLine));
      setSelectedLine(null);
    }
  };

  const handleRotateComponent = () => {
    if (selectedComponent) {
      setComponents(components.map(c => 
        c.id === selectedComponent ? { ...c, rotation: (c.rotation + 90) % 360 } : c
      ));
    }
  };

  const handleSave = () => {
    const diagram = {
      id: config?.id || `scada_${Date.now()}`,
      title: diagramTitle,
      type: 'scada',
      components,
      lines,
      width: config?.width || 2,
      height: config?.height || 2,
      createdAt: new Date().toISOString()
    };
    if (onSave) onSave(diagram);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const diagram = { title: diagramTitle, components, lines, exportedAt: new Date().toISOString() };
    const dataBlob = new Blob([JSON.stringify(diagram, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramTitle.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setComponents(imported.components || []);
        setLines(imported.lines || []);
        if (imported.title) setDiagramTitle(imported.title);
      } catch (error) {
        alert('Failed to import diagram.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getLineCoordinates = (line) => {
    const fromComp = components.find(c => c.id === line.from);
    const toComp = components.find(c => c.id === line.to);
    if (!fromComp || !toComp) return null;
    return {
      x1: fromComp.x + SVG_COMPONENTS[fromComp.type].width / 2,
      y1: fromComp.y + SVG_COMPONENTS[fromComp.type].height / 2,
      x2: toComp.x + SVG_COMPONENTS[toComp.type].width / 2,
      y2: toComp.y + SVG_COMPONENTS[toComp.type].height / 2
    };
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: theme.bg, borderRadius: '16px', width: '95vw', height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '16px 24px', borderBottom: `2px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ margin: 0, color: theme.text, fontSize: '20px', fontWeight: '700' }}>SCADA Designer Pro</h2>
            <input type="text" value={diagramTitle} onChange={(e) => setDiagramTitle(e.target.value)} placeholder="Diagram Title" style={{ padding: '8px 12px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '14px', minWidth: '200px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleExport} style={{ padding: '10px 18px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <Download size={16} />Export
            </button>
            <label style={{ padding: '10px 18px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <Upload size={16} />Import
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button onClick={handleSave} style={{ padding: '10px 20px', background: saved ? theme.success : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button onClick={onClose} style={{ padding: '8px', background: 'transparent', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: '300px', borderRight: `2px solid ${theme.border}`, padding: '20px', overflowY: 'auto', background: theme.card }}>
            <h3 style={{ margin: '0 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700' }}>TOOLS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <button onClick={() => { setSelectedTool('select'); setComponentToAdd(null); setDrawingLine(null); }} style={{ padding: '12px 16px', background: selectedTool === 'select' ? theme.accent : theme.bg, border: `2px solid ${selectedTool === 'select' ? theme.accent : theme.border}`, borderRadius: '10px', color: selectedTool === 'select' ? 'white' : theme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                <Move size={18} />Select & Move
              </button>
              <button onClick={() => { setSelectedTool('line'); setComponentToAdd(null); setDrawingLine(null); }} style={{ padding: '12px 16px', background: selectedTool === 'line' ? theme.accent : theme.bg, border: `2px solid ${selectedTool === 'line' ? theme.accent : theme.border}`, borderRadius: '10px', color: selectedTool === 'line' ? 'white' : theme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                <Pencil size={18} />Draw Connection
              </button>
            </div>

            {selectedTool === 'line' && (
              <div style={{ marginBottom: '24px', padding: '16px', background: theme.bg, borderRadius: '10px' }}>
                <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '600' }}>Connection Style</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '12px' }}>Color</label>
                  <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} style={{ width: '100%', height: '44px', border: `2px solid ${theme.border}`, borderRadius: '8px', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '12px' }}>Width: {lineWidth}px</label>
                  <input type="range" min="1" max="8" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
            )}

            <h3 style={{ margin: '0 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700' }}>COMPONENTS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(SVG_COMPONENTS).map(([key, comp]) => (
                <button key={key} onClick={() => { setSelectedTool('component'); setComponentToAdd(key); setDrawingLine(null); }} style={{ padding: '14px', background: componentToAdd === key ? theme.accent : theme.bg, border: `2px solid ${componentToAdd === key ? theme.accent : theme.border}`, borderRadius: '10px', color: componentToAdd === key ? 'white' : theme.text, cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '500' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: comp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
                      <img src={comp.svg} alt={comp.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontWeight: '600' }}>{comp.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedComponent && (
              <>
                <h3 style={{ margin: '24px 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700' }}>ACTIONS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={handleConfigureTag} style={{ padding: '12px 16px', background: theme.bg, border: `2px solid ${theme.border}`, borderRadius: '10px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Tag size={18} />Configure Tag
                  </button>
                  <button onClick={handleRotateComponent} style={{ padding: '12px 16px', background: theme.bg, border: `2px solid ${theme.border}`, borderRadius: '10px', color: theme.text, cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RotateCw size={18} />Rotate 90°
                  </button>
                  <button onClick={handleDeleteComponent} style={{ padding: '12px 16px', background: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' }}>
                    <Trash2 size={18} />Delete
                  </button>
                </div>
              </>
            )}

            {selectedLine && (
              <>
                <h3 style={{ margin: '24px 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700' }}>LINE ACTIONS</h3>
                <button onClick={handleDeleteLine} style={{ padding: '12px 16px', background: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', width: '100%' }}>
                  <Trash2 size={18} />Delete Connection
                </button>
              </>
            )}
          </div>

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: theme.bg }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 10 }}>
              <button onClick={() => setShowGrid(!showGrid)} style={{ padding: '10px', background: theme.card, border: `2px solid ${showGrid ? theme.accent : theme.border}`, borderRadius: '10px', color: showGrid ? theme.accent : theme.text, cursor: 'pointer' }}>
                <Grid size={20} />
              </button>
              <button onClick={() => setZoom(Math.min(zoom + 0.1, 2))} style={{ padding: '10px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '10px', color: theme.text, cursor: 'pointer' }}>
                <ZoomIn size={20} />
              </button>
              <button onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} style={{ padding: '10px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '10px', color: theme.text, cursor: 'pointer' }}>
                <ZoomOut size={20} />
              </button>
              <div style={{ padding: '10px 16px', background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '10px', color: theme.text, fontSize: '14px', fontWeight: '600' }}>
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {selectedTool === 'component' && componentToAdd && (
              <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', background: theme.accent, color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', zIndex: 10 }}>
                Click to place {SVG_COMPONENTS[componentToAdd].name}
              </div>
            )}

            <svg ref={canvasRef} width="100%" height="100%" onClick={handleCanvasClick} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ cursor: selectedTool === 'component' || selectedTool === 'line' ? 'crosshair' : 'default' }}>
              {showGrid && (
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1.5" fill={darkMode ? '#374151' : '#e5e7eb'} opacity="0.4" />
                  </pattern>
                </defs>
              )}
              {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {lines.map(line => {
                  const coords = getLineCoordinates(line);
                  if (!coords) return null;
                  const isSelected = selectedLine === line.id;
                  return (
                    <g key={line.id}>
                      <line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke="transparent" strokeWidth={line.width + 10} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); if (selectedTool === 'select') { setSelectedLine(line.id); setSelectedComponent(null); }}} />
                      <line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={isSelected ? '#ef4444' : line.color} strokeWidth={isSelected ? line.width + 2 : line.width} strokeLinecap="round" style={{ pointerEvents: 'none' }} />
                    </g>
                  );
                })}

                {drawingLine && (
                  <g>
                    <line x1={drawingLine.startX} y1={drawingLine.startY} x2={drawingLine.endX} y2={drawingLine.endY} stroke={lineColor} strokeWidth={lineWidth} strokeDasharray="8,4" strokeLinecap="round" opacity="0.7" />
                  </g>
                )}

               {components.map(comp => {
  const svgData = SVG_COMPONENTS[comp.type];
  const isSelected = selectedComponent === comp.id;
  const componentColor = getComponentColor(comp);
  const status = getComponentStatus(comp);
  
  return (
    <g key={comp.id} transform={`translate(${comp.x}, ${comp.y})`}>
                      <g transform={`rotate(${comp.rotation || 0}, ${svgData.width/2}, ${svgData.height/2})`}>
                        {isSelected && (
                          <rect x={-6} y={-6} width={svgData.width + 12} height={svgData.height + 12} fill="none" stroke="#667eea" strokeWidth={3} rx={10} opacity="0.6" style={{ pointerEvents: 'none' }} />
                        )}
                        <rect x={0} y={0} width={svgData.width} height={svgData.height} fill="transparent" style={{ cursor: selectedTool === 'select' ? 'move' : selectedTool === 'line' ? 'pointer' : 'default' }} onMouseDown={(e) => handleComponentMouseDown(e, comp)} />
                       {comp.tagName && (
  <>
    <rect
      x={-4}
      y={-4}
      width={svgData.width + 8}
      height={svgData.height + 8}
      fill={componentColor}
      rx="8"
      opacity="0.25"
    />
    <rect
      x={-2}
      y={-2}
      width={svgData.width + 4}
      height={svgData.height + 4}
      fill="none"
      stroke={componentColor}
      strokeWidth="2.5"
      rx="6"
    />
  </>
)}
<g>
  <image 
    href={svgData.svg} 
    width={svgData.width} 
    height={svgData.height} 
    style={{ pointerEvents: 'none' }}
  />
  {comp.tagName && (
    <rect
      x={0}
      y={0}
      width={svgData.width}
      height={svgData.height}
      fill={componentColor}
      opacity="0.6"
      style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
    />
  )}
</g>
 </g>
                     <text x={svgData.width / 2} y={svgData.height + 20} textAnchor="middle" fill={theme.text} fontSize="12" fontWeight="600" style={{ pointerEvents: 'none' }}>
  {comp.label}
</text>

{status && (
  <g>
    <rect
      x={svgData.width / 2 - 30}
      y={svgData.height + 30}
      width="60"
      height="18"
      fill={componentColor}
      rx="4"
      opacity="0.9"
    />
    <text
      x={svgData.width / 2}
      y={svgData.height + 42}
      textAnchor="middle"
      fill="white"
      fontSize="10"
      fontWeight="700"
      style={{ pointerEvents: 'none' }}
    >
      {status}
    </text>
  </g>
)}

{comp.tagName && (
  <text 
    x={svgData.width / 2} 
    y={svgData.height + (status ? 56 : 35)} 
    textAnchor="middle" 
    fill={theme.accent} 
    fontSize="9" 
    fontWeight="500" 
    style={{ pointerEvents: 'none' }}
  >
    🏷️ {comp.tagName}
    {tagValues[comp.tagName] && `: ${tagValues[comp.tagName]}`}
  </text>
)}
                    </g>
                  );
                })}

                {drawingLine && (
                  <g>
                    <line x1={drawingLine.startX} y1={drawingLine.startY} x2={drawingLine.endX} y2={drawingLine.endY} stroke={lineColor} strokeWidth={lineWidth} strokeDasharray="8,4" strokeLinecap="round" opacity="0.7" />
                  </g>
                )}
              </g>
            </svg>

            {components.length === 0 && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: theme.textSecondary, pointerEvents: 'none' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>⚙️</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: theme.text }}>Start Building</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>Select a component and click to place</p>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '12px' }}>
              <div style={{ padding: '8px 16px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '13px', fontWeight: '600' }}>
                Components: {components.length}
              </div>
              <div style={{ padding: '8px 16px', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '13px', fontWeight: '600' }}>
                Connections: {lines.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTagModal && editingComponentTag && (
        <ComponentTagModal
          component={editingComponentTag}
          availableTags={availableTags}
          onSave={handleSaveTagConfig}
          onClose={() => { setShowTagModal(false); setEditingComponentTag(null); }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
