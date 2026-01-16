import React, { useState, useRef, useEffect } from 'react';
import { X as LucideX, Save, Trash2, Plus, Move, Pencil, ZoomIn, ZoomOut, Download, Upload, RotateCw, Check, Database, Tag, Maximize2, Grid3x3, Copy, Layers, Settings, Hand, MousePointer2, Minus } from 'lucide-react';
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

export default function ScadaDesignerPro({ config, onSave, onClose, darkMode }) {
  const [components, setComponents] = useState(config?.scadaElements || config?.components || []);  // ✅ Try scadaElements first, fallback to components
  const [lines, setLines] = useState(config?.scadaConnections || config?.lines || []);  // ✅ Try scadaConnections first, fallback to lines
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Multiple selection
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [drawingLine, setDrawingLine] = useState(null);
  const [editingLine, setEditingLine] = useState(null); // Which line is being edited
  const [draggingLinePoint, setDraggingLinePoint] = useState(null); // Which point is being dragged
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(10);
  const [componentToAdd, setComponentToAdd] = useState(null);
  const [lineColor, setLineColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(3);
  const [lineStyle, setLineStyle] = useState('solid');
  const [saved, setSaved] = useState(false);
  const [diagramTitle, setDiagramTitle] = useState(config?.title || 'SCADA Diagram');
  const [showTagModal, setShowTagModal] = useState(false);
  const [editingComponentTag, setEditingComponentTag] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagValues, setTagValues] = useState({});
  const [selectionBox, setSelectionBox] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);

  const theme = darkMode ? {
    bg: '#0a0b0f',
    card: '#13141a',
    hover: '#1a1c24',
    text: '#e5e7eb',
    textSecondary: '#9ca3af',
    border: '#242731',
    accent: '#5b68ea',
    success: '#10b981',
    danger: '#ef4444'
  } : {
    bg: '#fafafa',
    card: '#ffffff',
    hover: '#f5f5f5',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#5b68ea',
    success: '#10b981',
    danger: '#ef4444'
  };

  // Snap to grid function
  const snapToGridFn = (value) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Save state to history for undo/redo
  const saveToHistory = () => {
    const newState = { components: [...components], lines: [...lines] };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setComponents(prevState.components);
      setLines(prevState.lines);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setComponents(nextState.components);
      setLines(nextState.lines);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponent) {
          handleDeleteComponent();
        } else if (selectedLine) {
          handleDeleteLine();
        }
      }
      // Undo/Redo
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
        // Copy
        if (e.key === 'c' && selectedComponent) {
          e.preventDefault();
          handleCopyComponent();
        }
        // Select All
        if (e.key === 'a') {
          e.preventDefault();
          setSelectedItems(components.map(c => c.id));
        }
      }
      // Escape - deselect
      if (e.key === 'Escape') {
        setSelectedComponent(null);
        setSelectedLine(null);
        setSelectedItems([]);
        setDrawingLine(null);
        setSelectedTool('select');
      }
      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') {
        setSelectedTool('select');
        setComponentToAdd(null);
      }
      if (e.key === 'l' || e.key === 'L') {
        setSelectedTool('line');
        setComponentToAdd(null);
      }
      if (e.key === 'h' || e.key === 'H') {
        setSelectedTool('pan');
        setComponentToAdd(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, selectedLine, components, historyIndex, history]);

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

  const handleCanvasMouseDown = (e) => {
    if (e.button === 2) return; // Ignore right click
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Pan tool or space key
    if (selectedTool === 'pan' || e.spaceKey || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (selectedTool === 'component' && componentToAdd) {
      const newComponent = {
        id: `comp_${Date.now()}`,
        type: componentToAdd,
        x: snapToGridFn(x - SVG_COMPONENTS[componentToAdd].width / 2),
        y: snapToGridFn(y - SVG_COMPONENTS[componentToAdd].height / 2),
        rotation: 0,
        label: SVG_COMPONENTS[componentToAdd].name,
        tagName: '',
        colorMappings: [
          { value: '0', color: '#ef4444', label: 'Off' },
          { value: '1', color: '#10b981', label: 'On' }
        ],
        defaultColor: '#64748b'
      };
      setComponents([...components, newComponent]);
      saveToHistory();
      setSelectedComponent(newComponent.id);
      setComponentToAdd(null);
      setSelectedTool('select');
    } else if (selectedTool === 'select' && !e.target.closest('[data-component]') && !e.target.closest('[data-line]')) {
      // Start selection box
      setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
      setSelectedComponent(null);
      setSelectedLine(null);
      setSelectedItems([]);
    } else if (selectedTool === 'line' && drawingLine) {
      // Cancel line drawing
      setDrawingLine(null);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (draggingComponent && selectedTool === 'select') {
      const deltaX = (e.clientX - draggingComponent.startX) / zoom;
      const deltaY = (e.clientY - draggingComponent.startY) / zoom;
      
      setComponents(components.map(c => 
        c.id === draggingComponent.id 
          ? { 
              ...c, 
              x: snapToGridFn(Math.max(0, draggingComponent.initialX + deltaX)), 
              y: snapToGridFn(Math.max(0, draggingComponent.initialY + deltaY)) 
            }
          : c
      ));
    } else if (draggingLinePoint) {
      // Dragging a line control point
      const line = lines.find(l => l.id === draggingLinePoint.lineId);
      if (line) {
        const newControlPoints = [...(line.controlPoints || [])];
        if (draggingLinePoint.pointIndex >= 0 && draggingLinePoint.pointIndex < newControlPoints.length) {
          newControlPoints[draggingLinePoint.pointIndex] = { x, y };
          setLines(lines.map(l => l.id === draggingLinePoint.lineId ? { ...l, controlPoints: newControlPoints } : l));
        }
      }
    } else if (drawingLine && selectedTool === 'line') {
      setDrawingLine({ ...drawingLine, endX: x, endY: y });
    } else if (selectionBox) {
      setSelectionBox({ ...selectionBox, endX: x, endY: y });
    }
  };

  const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    
    if (draggingComponent) {
      saveToHistory();
      setDraggingComponent(null);
    }
    
    if (draggingLinePoint) {
      saveToHistory();
      setDraggingLinePoint(null);
    }
    
    if (selectionBox) {
      // Select components within box
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);
      
      const selected = components.filter(comp => {
        const svgData = SVG_COMPONENTS[comp.type];
        return comp.x >= minX && 
               comp.x + svgData.width <= maxX &&
               comp.y >= minY && 
               comp.y + svgData.height <= maxY;
      }).map(c => c.id);
      
      setSelectedItems(selected);
      setSelectionBox(null);
    }
  };

  const handleComponentMouseDown = (e, comp) => {
    e.stopPropagation();
    
    if (selectedTool === 'select') {
      setSelectedComponent(comp.id);
      setSelectedLine(null);
      setDraggingComponent({ 
        id: comp.id, 
        startX: e.clientX, 
        startY: e.clientY,
        initialX: comp.x, 
        initialY: comp.y
      });
    } else if (selectedTool === 'line') {
      const svgData = SVG_COMPONENTS[comp.type];
      const centerX = comp.x + svgData.width / 2;
      const centerY = comp.y + svgData.height / 2;
      
      if (!drawingLine) {
        setDrawingLine({ 
          from: comp.id, 
          startX: centerX, 
          startY: centerY, 
          endX: centerX, 
          endY: centerY 
        });
      } else if (drawingLine.from !== comp.id) {
        const newLine = {
          id: `line_${Date.now()}`, 
          from: drawingLine.from, 
          to: comp.id,
          color: lineColor, 
          width: lineWidth, 
          style: lineStyle,
          controlPoints: [] // Array of {x, y} for bezier curves and bending
        };
        setLines([...lines, newLine]);
        saveToHistory();
        setDrawingLine(null);
        setSelectedTool('select');
      }
    }
  };

  const handleLineClick = (e, line) => {
    e.stopPropagation();
    if (selectedTool === 'select') {
      setSelectedLine(line.id);
      setSelectedComponent(null);
      setEditingLine(line.id);
    }
  };

  const handleLinePointMouseDown = (e, lineId, pointIndex) => {
    e.stopPropagation();
    if (selectedTool === 'select') {
      setDraggingLinePoint({ lineId, pointIndex, startX: e.clientX, startY: e.clientY });
    }
  };

  const handleAddControlPoint = (lineId, x, y) => {
    const line = lines.find(l => l.id === lineId);
    if (!line) return;
    
    const newControlPoints = [...(line.controlPoints || []), { x, y }];
    setLines(lines.map(l => l.id === lineId ? { ...l, controlPoints: newControlPoints } : l));
    saveToHistory();
  };

  const handleConfigureTag = () => {
    if (selectedComponent) {
      const comp = components.find(c => c.id === selectedComponent);
      setEditingComponentTag(comp);
      setShowTagModal(true);
    }
  };

  const handleSaveTagConfig = (updatedComponent) => {
    setComponents(components.map(c => c.id === updatedComponent.id ? updatedComponent : c));
    saveToHistory();
    setShowTagModal(false);
    setEditingComponentTag(null);
    fetchSingleTagValue(updatedComponent.tagName);
  };

  const handleDeleteComponent = () => {
    if (selectedComponent) {
      setComponents(components.filter(c => c.id !== selectedComponent));
      setLines(lines.filter(l => l.from !== selectedComponent && l.to !== selectedComponent));
      saveToHistory();
      setSelectedComponent(null);
    }
  };

  const handleDeleteLine = () => {
    if (selectedLine) {
      setLines(lines.filter(l => l.id !== selectedLine));
      saveToHistory();
      setSelectedLine(null);
    }
  };

  const handleCopyComponent = () => {
    if (selectedComponent) {
      const comp = components.find(c => c.id === selectedComponent);
      const newComponent = {
        ...comp,
        id: `comp_${Date.now()}`,
        x: comp.x + 20,
        y: comp.y + 20
      };
      setComponents([...components, newComponent]);
      saveToHistory();
      setSelectedComponent(newComponent.id);
    }
  };

  const handleRotateComponent = () => {
    if (selectedComponent) {
      setComponents(components.map(c => 
        c.id === selectedComponent ? { ...c, rotation: (c.rotation + 90) % 360 } : c
      ));
      saveToHistory();
    }
  };

  const handleSave = () => {
    const diagram = {
      id: config?.id || `scada_${Date.now()}`,
      title: diagramTitle,
      type: 'scada',
      scadaElements: components,  // ✅ Changed from 'components' to 'scadaElements'
      scadaConnections: lines,     // ✅ Changed from 'lines' to 'scadaConnections'
      width: config?.width || 12,  // Full width by default
      height: config?.height || 8,  // Larger height by default
      createdAt: new Date().toISOString()
    };
    if (onSave) onSave(diagram);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const diagram = { 
      title: diagramTitle, 
      components, 
      lines, 
      exportedAt: new Date().toISOString() 
    };
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
        saveToHistory();
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
    
    const fromSvg = SVG_COMPONENTS[fromComp.type];
    const toSvg = SVG_COMPONENTS[toComp.type];
    
    return {
      x1: fromComp.x + fromSvg.width / 2,
      y1: fromComp.y + fromSvg.height / 2,
      x2: toComp.x + toSvg.width / 2,
      y2: toComp.y + toSvg.height / 2
    };
  };

  // Generate SVG path for line with control points
  const getLinePath = (line) => {
    const coords = getLineCoordinates(line);
    if (!coords) return null;

    const { x1, y1, x2, y2 } = coords;
    const controlPoints = line.controlPoints || [];

    if (controlPoints.length === 0) {
      // Straight line
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (controlPoints.length === 1) {
      // Quadratic bezier curve
      const cp = controlPoints[0];
      return `M ${x1} ${y1} Q ${cp.x} ${cp.y} ${x2} ${y2}`;
    } else {
      // Multiple control points - create smooth curve through all points
      let path = `M ${x1} ${y1}`;
      
      // Add first control point
      path += ` L ${controlPoints[0].x} ${controlPoints[0].y}`;
      
      // Add middle control points
      for (let i = 1; i < controlPoints.length; i++) {
        path += ` L ${controlPoints[i].x} ${controlPoints[i].y}`;
      }
      
      // Connect to end
      path += ` L ${x2} ${y2}`;
      return path;
    }
  };

  // Get the end point and angle for arrow placement
  const getLineEndPoint = (line) => {
    const coords = getLineCoordinates(line);
    if (!coords) return null;

    const { x1, y1, x2, y2 } = coords;
    const controlPoints = line.controlPoints || [];

    let endX = x2;
    let endY = y2;
    let prevX, prevY;

    if (controlPoints.length === 0) {
      prevX = x1;
      prevY = y1;
    } else {
      const lastCP = controlPoints[controlPoints.length - 1];
      prevX = lastCP.x;
      prevY = lastCP.y;
    }

    const angle = Math.atan2(endY - prevY, endX - prevX);
    
    return { x: endX, y: endY, angle };
  };

  // Tool button component
  const ToolButton = ({ tool, icon: Icon, label, shortcut }) => (
    <button
      onClick={() => {
        setSelectedTool(tool);
        setComponentToAdd(null);
        setDrawingLine(null);
      }}
      style={{
        padding: '10px 14px',
        background: selectedTool === tool ? theme.accent : theme.card,
        border: `2px solid ${selectedTool === tool ? theme.accent : theme.border}`,
        borderRadius: '8px',
        color: selectedTool === tool ? 'white' : theme.text,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'all 0.2s ease'
      }}
      title={`${label} ${shortcut ? `(${shortcut})` : ''}`}
    >
      <Icon size={18} />
      <span>{label}</span>
      {shortcut && <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: 'auto' }}>{shortcut}</span>}
    </button>
  );

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.85)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000, 
      backdropFilter: 'blur(4px)' 
    }}>
      <div style={{ 
        background: theme.bg, 
        borderRadius: '12px', 
        width: '98vw', 
        height: '95vh', 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        border: `1px solid ${theme.border}`
      }}>
        {/* Top Toolbar */}
        <div style={{ 
          padding: '12px 20px', 
          borderBottom: `1px solid ${theme.border}`, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: theme.card
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color={theme.accent} />
              <h2 style={{ margin: 0, color: theme.text, fontSize: '16px', fontWeight: '700' }}>
                SCADA Designer
              </h2>
            </div>
            <div style={{ height: '24px', width: '1px', background: theme.border }} />
            <input 
              type="text" 
              value={diagramTitle} 
              onChange={(e) => setDiagramTitle(e.target.value)} 
              placeholder="Diagram Title" 
              style={{ 
                padding: '6px 12px', 
                background: theme.bg, 
                border: `1px solid ${theme.border}`, 
                borderRadius: '6px', 
                color: theme.text, 
                fontSize: '13px', 
                minWidth: '200px',
                fontWeight: '500'
              }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
              <button 
                onClick={handleUndo} 
                disabled={historyIndex <= 0}
                style={{ 
                  padding: '6px 10px', 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px', 
                  color: historyIndex <= 0 ? theme.textSecondary : theme.text, 
                  cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button 
                onClick={handleRedo} 
                disabled={historyIndex >= history.length - 1}
                style={{ 
                  padding: '6px 10px', 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px', 
                  color: historyIndex >= history.length - 1 ? theme.textSecondary : theme.text, 
                  cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
            </div>
            
            <button 
              onClick={handleExport} 
              style={{ 
                padding: '8px 14px', 
                background: theme.card, 
                border: `1px solid ${theme.border}`, 
                borderRadius: '6px', 
                color: theme.text, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '13px', 
                fontWeight: '600' 
              }}
            >
              <Download size={16} />
              Export
            </button>
            
            <label style={{ 
              padding: '8px 14px', 
              background: theme.card, 
              border: `1px solid ${theme.border}`, 
              borderRadius: '6px', 
              color: theme.text, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '13px', 
              fontWeight: '600' 
            }}>
              <Upload size={16} />
              Import
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            
            <button 
              onClick={handleSave} 
              style={{ 
                padding: '8px 16px', 
                background: saved ? theme.success : theme.accent, 
                border: 'none', 
                borderRadius: '6px', 
                color: 'white', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '13px', 
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Saved!' : 'Save'}
            </button>
            
            <button 
              onClick={onClose} 
              style={{ 
                padding: '8px', 
                background: 'transparent', 
                border: 'none', 
                color: theme.textSecondary, 
                cursor: 'pointer' 
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar */}
          <div style={{ 
            width: '280px', 
            borderRight: `1px solid ${theme.border}`, 
            background: theme.card,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Tools Section */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tools
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <ToolButton tool="select" icon={MousePointer2} label="Select" shortcut="V" />
                <ToolButton tool="pan" icon={Hand} label="Pan" shortcut="H" />
                <ToolButton tool="line" icon={Minus} label="Connect" shortcut="L" />
              </div>
            </div>

            {/* Line Settings (when line tool is active) */}
            {selectedTool === 'line' && (
              <div style={{ padding: '16px', borderBottom: `1px solid ${theme.border}`, background: theme.hover }}>
                <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '700' }}>
                  Line Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '11px', fontWeight: '600' }}>
                      Color
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="color" 
                        value={lineColor} 
                        onChange={(e) => setLineColor(e.target.value)} 
                        style={{ width: '50px', height: '36px', border: `1px solid ${theme.border}`, borderRadius: '6px', cursor: 'pointer' }} 
                      />
                      <input 
                        type="text" 
                        value={lineColor} 
                        onChange={(e) => setLineColor(e.target.value)} 
                        style={{ 
                          flex: 1, 
                          padding: '8px', 
                          background: theme.bg, 
                          border: `1px solid ${theme.border}`, 
                          borderRadius: '6px', 
                          color: theme.text, 
                          fontSize: '12px', 
                          fontFamily: 'monospace' 
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '11px', fontWeight: '600' }}>
                      Width: {lineWidth}px
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      value={lineWidth} 
                      onChange={(e) => setLineWidth(parseInt(e.target.value))} 
                      style={{ width: '100%' }} 
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '11px', fontWeight: '600' }}>
                      Style
                    </label>
                    <select 
                      value={lineStyle} 
                      onChange={(e) => setLineStyle(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        background: theme.bg, 
                        border: `1px solid ${theme.border}`, 
                        borderRadius: '6px', 
                        color: theme.text, 
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Component Library */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Components
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {Object.entries(SVG_COMPONENTS).map(([key, comp]) => (
                  <button 
                    key={key} 
                    onClick={() => { 
                      setSelectedTool('component'); 
                      setComponentToAdd(key); 
                      setDrawingLine(null); 
                    }} 
                    style={{ 
                      padding: '12px 8px', 
                      background: componentToAdd === key ? theme.accent : theme.bg, 
                      border: `1px solid ${componentToAdd === key ? theme.accent : theme.border}`, 
                      borderRadius: '8px', 
                      color: componentToAdd === key ? 'white' : theme.text, 
                      cursor: 'pointer', 
                      textAlign: 'center', 
                      fontSize: '11px', 
                      fontWeight: '500',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <div style={{ 
                      width: '100%', 
                      height: '50px', 
                      borderRadius: '6px', 
                      background: componentToAdd === key ? 'rgba(255,255,255,0.1)' : theme.hover, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '6px' 
                    }}>
                      <img 
                        src={comp.svg} 
                        alt={comp.name} 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain',
                          filter: componentToAdd === key ? 'brightness(0) invert(1)' : 'none'
                        }} 
                      />
                    </div>
                    <span style={{ lineHeight: '1.2' }}>{comp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Properties Panel */}
            {selectedComponent && (
              <div style={{ borderTop: `1px solid ${theme.border}`, padding: '16px', background: theme.hover }}>
                <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '700' }}>
                  Properties
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={handleConfigureTag} 
                    style={{ 
                      padding: '10px 12px', 
                      background: theme.bg, 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: '6px', 
                      color: theme.text, 
                      cursor: 'pointer', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <Tag size={16} />
                    Configure Tag
                  </button>
                  <button 
                    onClick={handleRotateComponent} 
                    style={{ 
                      padding: '10px 12px', 
                      background: theme.bg, 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: '6px', 
                      color: theme.text, 
                      cursor: 'pointer', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <RotateCw size={16} />
                    Rotate 90°
                  </button>
                  <button 
                    onClick={handleCopyComponent} 
                    style={{ 
                      padding: '10px 12px', 
                      background: theme.bg, 
                      border: `1px solid ${theme.border}`, 
                      borderRadius: '6px', 
                      color: theme.text, 
                      cursor: 'pointer', 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}
                  >
                    <Copy size={16} />
                    Duplicate
                  </button>
                  <button 
                    onClick={handleDeleteComponent} 
                    style={{ 
                      padding: '10px 12px', 
                      background: theme.danger, 
                      border: 'none', 
                      borderRadius: '6px', 
                      color: 'white', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '12px', 
                      fontWeight: '600' 
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {selectedLine && (
              <div style={{ borderTop: `1px solid ${theme.border}`, padding: '16px', background: theme.hover }}>
                <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '700' }}>
                  Line Properties
                </h3>
                <div style={{ marginBottom: '12px', padding: '8px', background: theme.bg, borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: theme.textSecondary, marginBottom: '4px' }}>
                    Control Points: {(lines.find(l => l.id === selectedLine)?.controlPoints || []).length}
                  </div>
                  <div style={{ fontSize: '10px', color: theme.textSecondary, lineHeight: '1.4' }}>
                    • Double-click line to add bend point
                    <br />
                    • Drag points to reshape
                    <br />
                    • Click × to remove point
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const line = lines.find(l => l.id === selectedLine);
                    if (line) {
                      const coords = getLineCoordinates(line);
                      if (coords) {
                        // Add control point at midpoint
                        const midX = (coords.x1 + coords.x2) / 2;
                        const midY = (coords.y1 + coords.y2) / 2;
                        handleAddControlPoint(selectedLine, midX, midY);
                      }
                    }
                  }}
                  style={{ 
                    padding: '10px 12px', 
                    background: theme.bg, 
                    border: `1px solid ${theme.border}`, 
                    borderRadius: '6px', 
                    color: theme.text, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    width: '100%',
                    marginBottom: '8px'
                  }}
                >
                  <Plus size={16} />
                  Add Bend Point
                </button>
                <button 
                  onClick={handleDeleteLine} 
                  style={{ 
                    padding: '10px 12px', 
                    background: theme.danger, 
                    border: 'none', 
                    borderRadius: '6px', 
                    color: 'white', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    width: '100%'
                  }}
                >
                  <Trash2 size={16} />
                  Delete Connection
                </button>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: theme.bg }}>
            {/* Top Canvas Toolbar */}
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '16px', 
              display: 'flex', 
              gap: '8px', 
              zIndex: 10 
            }}>
              <button 
                onClick={() => setShowGrid(!showGrid)} 
                style={{ 
                  padding: '8px 12px', 
                  background: theme.card, 
                  border: `1px solid ${showGrid ? theme.accent : theme.border}`, 
                  borderRadius: '6px', 
                  color: showGrid ? theme.accent : theme.text, 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Grid3x3 size={16} />
                Grid
              </button>
              
              <button 
                onClick={() => setSnapToGrid(!snapToGrid)} 
                style={{ 
                  padding: '8px 12px', 
                  background: theme.card, 
                  border: `1px solid ${snapToGrid ? theme.accent : theme.border}`, 
                  borderRadius: '6px', 
                  color: snapToGrid ? theme.accent : theme.text, 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Snap to Grid"
              >
                <Maximize2 size={16} />
                Snap
              </button>
              
              <div style={{ width: '1px', background: theme.border, margin: '0 4px' }} />
              
              <button 
                onClick={() => setZoom(Math.min(zoom + 0.1, 3))} 
                style={{ 
                  padding: '8px 10px', 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px', 
                  color: theme.text, 
                  cursor: 'pointer' 
                }}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              
              <button 
                onClick={() => setZoom(Math.max(zoom - 0.1, 0.3))} 
                style={{ 
                  padding: '8px 10px', 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px', 
                  color: theme.text, 
                  cursor: 'pointer' 
                }}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              
              <button 
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} 
                style={{ 
                  padding: '8px 12px', 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px', 
                  color: theme.text, 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
                title="Reset View"
              >
                {Math.round(zoom * 100)}%
              </button>
            </div>

            {/* Status Banner */}
            {selectedTool === 'component' && componentToAdd && (
              <div style={{ 
                position: 'absolute', 
                top: '16px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                padding: '10px 20px', 
                background: theme.accent, 
                color: 'white', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '600', 
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                Click to place {SVG_COMPONENTS[componentToAdd].name}
              </div>
            )}

            {selectedTool === 'line' && !drawingLine && (
              <div style={{ 
                position: 'absolute', 
                top: '16px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                padding: '10px 20px', 
                background: theme.accent, 
                color: 'white', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '600', 
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                Click on a component to start connection
              </div>
            )}

            {selectedTool === 'line' && drawingLine && (
              <div style={{ 
                position: 'absolute', 
                top: '16px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                padding: '10px 20px', 
                background: theme.success, 
                color: 'white', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '600', 
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                Click on another component to complete connection
              </div>
            )}

            {/* Canvas SVG */}
            <svg 
              ref={canvasRef} 
              width="100%" 
              height="100%" 
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              style={{ 
                cursor: selectedTool === 'component' ? 'crosshair' : 
                       selectedTool === 'line' ? 'crosshair' : 
                       selectedTool === 'pan' || isPanning ? 'grab' : 
                       'default',
                display: 'block'
              }}
            >
              {/* Grid Pattern */}
              {showGrid && (
                <defs>
                  <pattern id="grid" width={gridSize * zoom} height={gridSize * zoom} patternUnits="userSpaceOnUse">
                    <circle 
                      cx={gridSize * zoom / 2} 
                      cy={gridSize * zoom / 2} 
                      r="1" 
                      fill={darkMode ? '#2d3348' : '#d1d5db'} 
                      opacity="0.5" 
                    />
                  </pattern>
                </defs>
              )}
              {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Lines */}
                {lines.map(line => {
                  const coords = getLineCoordinates(line);
                  const path = getLinePath(line);
                  const endPoint = getLineEndPoint(line);
                  if (!coords || !path || !endPoint) return null;
                  
                  const isSelected = selectedLine === line.id;
                  const isEditing = editingLine === line.id;
                  
                  return (
                    <g key={line.id}>
                      {/* Invisible wider path for easier clicking */}
                      <path
                        d={path}
                        stroke="transparent" 
                        strokeWidth={Math.max(line.width + 12, 20)} 
                        fill="none"
                        style={{ cursor: 'pointer' }} 
                        onClick={(e) => handleLineClick(e, line)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          // Add control point at click location
                          const rect = canvasRef.current.getBoundingClientRect();
                          const x = (e.clientX - rect.left - pan.x) / zoom;
                          const y = (e.clientY - rect.top - pan.y) / zoom;
                          handleAddControlPoint(line.id, x, y);
                        }}
                        data-line="true"
                      />
                      
                      {/* Actual line */}
                      <path
                        d={path}
                        stroke={isSelected ? theme.accent : line.color} 
                        strokeWidth={isSelected ? line.width + 2 : line.width} 
                        fill="none"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        strokeDasharray={
                          line.style === 'dashed' ? '8,4' : 
                          line.style === 'dotted' ? '2,3' : 
                          '0'
                        }
                        style={{ pointerEvents: 'none' }} 
                      />
                      
                      {/* Arrow */}
                      {(() => {
                        const arrowSize = 10 + line.width;
                        return (
                          <polygon
                            points={`0,-${arrowSize/2} ${arrowSize},0 0,${arrowSize/2}`}
                            fill={isSelected ? theme.accent : line.color}
                            transform={`translate(${endPoint.x}, ${endPoint.y}) rotate(${endPoint.angle * 180 / Math.PI})`}
                            style={{ pointerEvents: 'none' }}
                          />
                        );
                      })()}
                      
                      {/* Control points (when selected) */}
                      {isEditing && (line.controlPoints || []).map((cp, index) => (
                        <g key={`cp-${index}`}>
                          {/* Control point handle */}
                          <circle 
                            cx={cp.x} 
                            cy={cp.y} 
                            r="8" 
                            fill="white"
                            stroke={theme.accent}
                            strokeWidth="2"
                            style={{ cursor: 'move' }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleLinePointMouseDown(e, line.id, index);
                            }}
                          />
                          {/* Delete button for control point */}
                          <g
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newControlPoints = line.controlPoints.filter((_, i) => i !== index);
                              setLines(lines.map(l => l.id === line.id ? { ...l, controlPoints: newControlPoints } : l));
                              saveToHistory();
                            }}
                          >
                            <circle 
                              cx={cp.x + 12} 
                              cy={cp.y - 12} 
                              r="8" 
                              fill={theme.danger}
                            />
                            <text
                              x={cp.x + 12}
                              y={cp.y - 8}
                              textAnchor="middle"
                              fill="white"
                              fontSize="12"
                              fontWeight="bold"
                              style={{ pointerEvents: 'none' }}
                            >
                              ×
                            </text>
                          </g>
                        </g>
                      ))}
                      
                      {/* Start and end point indicators (when selected) */}
                      {isEditing && (
                        <>
                          <circle cx={coords.x1} cy={coords.y1} r="6" fill={theme.success} />
                          <circle cx={coords.x2} cy={coords.y2} r="6" fill={theme.danger} />
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Drawing Line Preview */}
                {drawingLine && (
                  <g>
                    <line 
                      x1={drawingLine.startX} 
                      y1={drawingLine.startY} 
                      x2={drawingLine.endX} 
                      y2={drawingLine.endY} 
                      stroke={lineColor} 
                      strokeWidth={lineWidth} 
                      strokeDasharray="6,3" 
                      strokeLinecap="round" 
                      opacity="0.7" 
                    />
                    <circle cx={drawingLine.startX} cy={drawingLine.startY} r="5" fill={lineColor} />
                  </g>
                )}

                {/* Components */}
                {components.map(comp => {
                  const svgData = SVG_COMPONENTS[comp.type];
                  const isSelected = selectedComponent === comp.id;
                  const componentColor = getComponentColor(comp);
                  const status = getComponentStatus(comp);
                  
                  return (
                    <g 
                      key={comp.id} 
                      transform={`translate(${comp.x}, ${comp.y})`}
                      data-component="true"
                    >
                      <g transform={`rotate(${comp.rotation || 0}, ${svgData.width/2}, ${svgData.height/2})`}>
                        {/* Selection highlight */}
                        {isSelected && (
                          <rect 
                            x={-4} 
                            y={-4} 
                            width={svgData.width + 8} 
                            height={svgData.height + 8} 
                            fill="none" 
                            stroke={theme.accent} 
                            strokeWidth={2} 
                            rx={8} 
                            opacity="0.8"
                            strokeDasharray="4,2"
                            style={{ pointerEvents: 'none' }} 
                          />
                        )}
                        
                        {/* Interactive area */}
                        <rect 
                          x={0} 
                          y={0} 
                          width={svgData.width} 
                          height={svgData.height} 
                          fill="transparent" 
                          style={{ 
                            cursor: selectedTool === 'select' ? 'move' : 
                                   selectedTool === 'line' ? 'pointer' : 
                                   'default' 
                          }} 
                          onMouseDown={(e) => handleComponentMouseDown(e, comp)} 
                        />
                        
                        {/* Component SVG */}
                        <g>
                          <image 
                            href={svgData.svg} 
                            width={svgData.width} 
                            height={svgData.height} 
                            style={{ pointerEvents: 'none' }}
                          />
                          <rect
                            x={0}
                            y={0}
                            width={svgData.width}
                            height={svgData.height}
                            fill={componentColor}
                            opacity="0.5"
                            style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
                          />
                        </g>
                      </g>
                      
                      {/* Label */}
                      <text 
                        x={svgData.width / 2} 
                        y={svgData.height + 18} 
                        textAnchor="middle" 
                        fill={theme.text} 
                        fontSize="11" 
                        fontWeight="600" 
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {comp.label}
                      </text>
                      
                      {/* Status badge */}
                      {status && (
                        <g>
                          <rect
                            x={svgData.width / 2 - 28}
                            y={svgData.height + 26}
                            width="56"
                            height="16"
                            fill={componentColor}
                            rx="3"
                            opacity="0.95"
                          />
                          <text
                            x={svgData.width / 2}
                            y={svgData.height + 37}
                            textAnchor="middle"
                            fill="white"
                            fontSize="9"
                            fontWeight="700"
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          >
                            {status}
                          </text>
                        </g>
                      )}
                      
                      {/* Tag value */}
                      {comp.tagName && (
                        <text 
                          x={svgData.width / 2} 
                          y={svgData.height + (status ? 50 : 34)} 
                          textAnchor="middle" 
                          fill={theme.accent} 
                          fontSize="8" 
                          fontWeight="500" 
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {comp.tagName}
                          {tagValues[comp.tagName] && `: ${tagValues[comp.tagName]}`}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Selection Box */}
                {selectionBox && (
                  <rect
                    x={Math.min(selectionBox.startX, selectionBox.endX)}
                    y={Math.min(selectionBox.startY, selectionBox.endY)}
                    width={Math.abs(selectionBox.endX - selectionBox.startX)}
                    height={Math.abs(selectionBox.endY - selectionBox.startY)}
                    fill={theme.accent}
                    fillOpacity="0.1"
                    stroke={theme.accent}
                    strokeWidth="1"
                    strokeDasharray="4,2"
                  />
                )}
              </g>
            </svg>

            {/* Empty State */}
            {components.length === 0 && (
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                textAlign: 'center', 
                color: theme.textSecondary, 
                pointerEvents: 'none' 
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.2 }}>⚙️</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: theme.text }}>
                  Start Building Your SCADA Diagram
                </h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Select a component from the left panel and click to place it
                </p>
              </div>
            )}

            {/* Bottom Status Bar */}
            <div style={{ 
              position: 'absolute', 
              bottom: '16px', 
              left: '16px', 
              display: 'flex', 
              gap: '8px',
              zIndex: 10
            }}>
              <div style={{ 
                padding: '6px 12px', 
                background: theme.card, 
                border: `1px solid ${theme.border}`, 
                borderRadius: '6px', 
                color: theme.text, 
                fontSize: '12px', 
                fontWeight: '600' 
              }}>
                Components: {components.length}
              </div>
              <div style={{ 
                padding: '6px 12px', 
                background: theme.card, 
                border: `1px solid ${theme.border}`, 
                borderRadius: '6px', 
                color: theme.text, 
                fontSize: '12px', 
                fontWeight: '600' 
              }}>
                Connections: {lines.length}
              </div>
              {selectedComponent && (
                <div style={{ 
                  padding: '6px 12px', 
                  background: theme.accent, 
                  borderRadius: '6px', 
                  color: 'white', 
                  fontSize: '12px', 
                  fontWeight: '600' 
                }}>
                  Selected: {components.find(c => c.id === selectedComponent)?.label}
                </div>
              )}
            </div>

            {/* Help overlay */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              padding: '10px 14px',
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '11px',
              color: theme.textSecondary,
              maxWidth: '320px',
              zIndex: 10
            }}>
              <div style={{ fontWeight: '700', marginBottom: '6px', color: theme.text }}>Shortcuts & Tips</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
                <span>V</span><span>Select tool</span>
                <span>L</span><span>Line tool</span>
                <span>H</span><span>Pan tool</span>
                <span>Del</span><span>Delete selected</span>
                <span>Ctrl+Z</span><span>Undo</span>
                <span>Ctrl+Y</span><span>Redo</span>
                <span>Esc</span><span>Deselect</span>
                <span style={{ gridColumn: '1 / -1', marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${theme.border}`, color: theme.text, fontWeight: '600' }}>
                  Line Editing:
                </span>
                <span>Double-click</span><span>Add bend point</span>
                <span>Drag point</span><span>Reshape line</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Configuration Modal */}
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
