import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Trash2, Plus, Move, Pencil, Grid, ZoomIn, ZoomOut, Download, Upload, RotateCw, Check } from 'lucide-react';

// Import SVG files
import MixerSvg from '../../renderer/assets/Mixer.svg';
import MixerGreenSvg from '../../renderer/assets/MixerGreen.svg';
import PumpSvg from '../../renderer/assets/Pump.svg';
import PumpGreenSvg from '../../renderer/assets/PumpGreen.svg';
import RotationalMixerSvg from '../../renderer/assets/RotationalMixer.svg';
import RotationalPumpSvg from '../../renderer/assets/RotationalPump.svg';
import ValveSvg from '../../renderer/assets/Valve.svg';
import ValveActuatorGreenSvg from '../../renderer/assets/ValveActuatorGreen.svg';

// SVG Component Templates
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
  const canvasRef = useRef(null);

  const theme = darkMode ? {
    bg: '#0f1117',
    card: '#1a1d29',
    hover: '#232837',
    text: '#e5e7eb',
    textSecondary: '#9ca3af',
    border: '#2d3348',
    accent: '#667eea',
    success: '#10b981'
  } : {
    bg: '#ffffff',
    card: '#f9fafb',
    hover: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#667eea',
    success: '#10b981'
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
      // Cancel drawing if clicking on empty space
      setDrawingLine(null);
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
        // Start drawing a line
        setDrawingLine({
          from: comp.id,
          startX: centerX,
          startY: centerY,
          endX: centerX,
          endY: centerY
        });
      } else if (drawingLine.from !== comp.id) {
        // Complete the line
        const newLine = {
          id: `line_${Date.now()}`,
          from: drawingLine.from,
          to: comp.id,
          color: lineColor,
          width: lineWidth,
          style: 'solid'
        };
        setLines([...lines, newLine]);
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
          ? { 
              ...c, 
              x: Math.max(0, draggingComponent.initialX + deltaX),
              y: Math.max(0, draggingComponent.initialY + deltaY)
            }
          : c
      ));
    } else if (drawingLine && selectedTool === 'line') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      setDrawingLine({ ...drawingLine, endX: x, endY: y });
    }
  };

  const handleMouseUp = () => {
    setDraggingComponent(null);
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
        c.id === selectedComponent 
          ? { ...c, rotation: (c.rotation + 90) % 360 }
          : c
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
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave(diagram);
    }
    
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
    
    const dataStr = JSON.stringify(diagram, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
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
        alert('Failed to import diagram. Please check the file format.');
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: theme.bg,
        borderRadius: '16px',
        width: '95vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `2px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ margin: 0, color: theme.text, fontSize: '20px', fontWeight: '700' }}>
              SCADA Designer Pro
            </h2>
            <input
              type="text"
              value={diagramTitle}
              onChange={(e) => setDiagramTitle(e.target.value)}
              placeholder="Diagram Title"
              style={{
                padding: '8px 12px',
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '14px',
                minWidth: '200px'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleExport}
              style={{
                padding: '10px 18px',
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = theme.hover}
              onMouseOut={(e) => e.currentTarget.style.background = theme.card}
            >
              <Download size={16} />
              Export JSON
            </button>
            <label style={{
              padding: '10px 18px',
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = theme.hover}
            onMouseOut={(e) => e.currentTarget.style.background = theme.card}>
              <Upload size={16} />
              Import JSON
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button
              onClick={handleSave}
              style={{
                padding: '10px 20px',
                background: saved ? theme.success : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Saved!' : 'Save Diagram'}
            </button>
            <button onClick={onClose} style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: theme.textSecondary,
              cursor: 'pointer',
              borderRadius: '8px'
            }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Toolbar */}
          <div style={{
            width: '300px',
            borderRight: `2px solid ${theme.border}`,
            padding: '20px',
            overflowY: 'auto',
            background: theme.card
          }}>
            <h3 style={{ margin: '0 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>
              TOOLS
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <button
                onClick={() => { 
                  setSelectedTool('select'); 
                  setComponentToAdd(null); 
                  setDrawingLine(null); 
                }}
                style={{
                  padding: '12px 16px',
                  background: selectedTool === 'select' ? theme.accent : theme.bg,
                  border: `2px solid ${selectedTool === 'select' ? theme.accent : theme.border}`,
                  borderRadius: '10px',
                  color: selectedTool === 'select' ? 'white' : theme.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                <Move size={18} />
                Select & Move
              </button>
              
              <button
                onClick={() => { 
                  setSelectedTool('line'); 
                  setComponentToAdd(null); 
                  setDrawingLine(null);
                }}
                style={{
                  padding: '12px 16px',
                  background: selectedTool === 'line' ? theme.accent : theme.bg,
                  border: `2px solid ${selectedTool === 'line' ? theme.accent : theme.border}`,
                  borderRadius: '10px',
                  color: selectedTool === 'line' ? 'white' : theme.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                <Pencil size={18} />
                Draw Connection
              </button>
            </div>

            {selectedTool === 'line' && (
              <div style={{ marginBottom: '24px', padding: '16px', background: theme.bg, borderRadius: '10px' }}>
                <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '13px', fontWeight: '600' }}>
                  Connection Style
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                    Color
                  </label>
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    style={{
                      width: '100%',
                      height: '44px',
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: theme.textSecondary, fontSize: '12px' }}>
                    Width: {lineWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            <h3 style={{ margin: '0 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>
              COMPONENTS
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(SVG_COMPONENTS).map(([key, comp]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTool('component');
                    setComponentToAdd(key);
                    setDrawingLine(null);
                  }}
                  style={{
                    padding: '14px',
                    background: componentToAdd === key ? theme.accent : theme.bg,
                    border: `2px solid ${componentToAdd === key ? theme.accent : theme.border}`,
                    borderRadius: '10px',
                    color: componentToAdd === key ? 'white' : theme.text,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (componentToAdd !== key) {
                      e.currentTarget.style.borderColor = theme.accent;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (componentToAdd !== key) {
                      e.currentTarget.style.borderColor = theme.border;
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: comp.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      flexShrink: 0
                    }}>
                      <img src={comp.svg} alt={comp.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontWeight: '600' }}>{comp.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedComponent && (
              <>
                <h3 style={{ margin: '24px 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  ACTIONS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={handleRotateComponent}
                    style={{
                      padding: '12px 16px',
                      background: theme.bg,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '10px',
                      color: theme.text,
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = theme.accent}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = theme.border}
                  >
                    <RotateCw size={18} />
                    Rotate 90°
                  </button>
                  <button
                    onClick={handleDeleteComponent}
                    style={{
                      padding: '12px 16px',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                  >
                    <Trash2 size={18} />
                    Delete Component
                  </button>
                </div>
              </>
            )}

            {selectedLine && (
              <>
                <h3 style={{ margin: '24px 0 16px', color: theme.text, fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  LINE ACTIONS
                </h3>
                <button
                  onClick={handleDeleteLine}
                  style={{
                    padding: '12px 16px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  <Trash2 size={18} />
                  Delete Connection
                </button>
              </>
            )}
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: theme.bg }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              gap: '10px',
              zIndex: 10
            }}>
              <button
                onClick={() => setShowGrid(!showGrid)}
                style={{
                  padding: '10px',
                  background: theme.card,
                  border: `2px solid ${showGrid ? theme.accent : theme.border}`,
                  borderRadius: '10px',
                  color: showGrid ? theme.accent : theme.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
                style={{
                  padding: '10px',
                  background: theme.card,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '10px',
                  color: theme.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
                style={{
                  padding: '10px',
                  background: theme.card,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '10px',
                  color: theme.text,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ZoomOut size={20} />
              </button>
              <div style={{
                padding: '10px 16px',
                background: theme.card,
                border: `2px solid ${theme.border}`,
                borderRadius: '10px',
                color: theme.text,
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {selectedTool === 'component' && componentToAdd && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 24px',
                background: theme.accent,
                color: 'white',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                Click anywhere to place {SVG_COMPONENTS[componentToAdd].name}
              </div>
            )}

            {selectedTool === 'line' && !drawingLine && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 24px',
                background: theme.accent,
                color: 'white',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                Click on a component to start drawing a connection
              </div>
            )}

            {selectedTool === 'line' && drawingLine && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                Click on another component to complete the connection
              </div>
            )}

            <svg
              ref={canvasRef}
              width="100%"
              height="100%"
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ 
                cursor: selectedTool === 'component' ? 'crosshair' : 
                        selectedTool === 'line' ? 'crosshair' : 'default' 
              }}
            >
              {/* Grid */}
              {showGrid && (
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1.5" fill={darkMode ? '#374151' : '#e5e7eb'} opacity="0.4" />
                  </pattern>
                </defs>
              )}
              {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Lines */}
                {lines.map(line => {
                  const coords = getLineCoordinates(line);
                  if (!coords) return null;
                  
                  const isSelected = selectedLine === line.id;
                  
                  return (
                    <g key={line.id}>
                      {/* Invisible wider line for easier clicking */}
                      <line
                        x1={coords.x1}
                        y1={coords.y1}
                        x2={coords.x2}
                        y2={coords.y2}
                        stroke="transparent"
                        strokeWidth={line.width + 10}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedTool === 'select') {
                            setSelectedLine(line.id);
                            setSelectedComponent(null);
                          }
                        }}
                      />
                      {/* Visible line */}
                      <line
                        x1={coords.x1}
                        y1={coords.y1}
                        x2={coords.x2}
                        y2={coords.y2}
                        stroke={isSelected ? '#ef4444' : line.color}
                        strokeWidth={isSelected ? line.width + 2 : line.width}
                        strokeDasharray={line.style === 'dashed' ? '8,4' : '0'}
                        strokeLinecap="round"
                        style={{ pointerEvents: 'none' }}
                      />
                      {/* Arrow head */}
                      {(() => {
                        const angle = Math.atan2(coords.y2 - coords.y1, coords.x2 - coords.x1);
                        const arrowSize = 12;
                        return (
                          <polygon
                            points={`0,-${arrowSize/2} ${arrowSize},0 0,${arrowSize/2}`}
                            fill={isSelected ? '#ef4444' : line.color}
                            transform={`translate(${coords.x2}, ${coords.y2}) rotate(${angle * 180 / Math.PI})`}
                            style={{ pointerEvents: 'none' }}
                          />
                        );
                      })()}
                    </g>
                  );
                })}

                {/* Drawing line preview */}
                {drawingLine && (
                  <g>
                    <line
                      x1={drawingLine.startX}
                      y1={drawingLine.startY}
                      x2={drawingLine.endX}
                      y2={drawingLine.endY}
                      stroke={lineColor}
                      strokeWidth={lineWidth}
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <circle
                      cx={drawingLine.startX}
                      cy={drawingLine.startY}
                      r="6"
                      fill={lineColor}
                      opacity="0.7"
                    />
                  </g>
                )}

                {/* Components */}
                {components.map(comp => {
                  const svgData = SVG_COMPONENTS[comp.type];
                  const isSelected = selectedComponent === comp.id;
                  
                  return (
                    <g
                      key={comp.id}
                      transform={`translate(${comp.x}, ${comp.y})`}
                    >
                      <g transform={`rotate(${comp.rotation || 0}, ${svgData.width/2}, ${svgData.height/2})`}>
                        {/* Selection highlight */}
                        {isSelected && (
                          <>
                            <rect
                              x={-6}
                              y={-6}
                              width={svgData.width + 12}
                              height={svgData.height + 12}
                              fill="none"
                              stroke="#667eea"
                              strokeWidth={3}
                              strokeDasharray="0"
                              rx={10}
                              opacity="0.6"
                              style={{ pointerEvents: 'none' }}
                            />
                            <rect
                              x={-6}
                              y={-6}
                              width={svgData.width + 12}
                              height={svgData.height + 12}
                              fill="none"
                              stroke="#667eea"
                              strokeWidth={2}
                              strokeDasharray="8,4"
                              rx={10}
                              style={{ pointerEvents: 'none' }}
                            >
                              <animate
                                attributeName="stroke-dashoffset"
                                from="0"
                                to="12"
                                dur="0.5s"
                                repeatCount="indefinite"
                              />
                            </rect>
                          </>
                        )}
                        
                        {/* Invisible clickable area */}
                        <rect
                          x={0}
                          y={0}
                          width={svgData.width}
                          height={svgData.height}
                          fill="transparent"
                          style={{ 
                            cursor: selectedTool === 'select' ? 'move' : 
                                    selectedTool === 'line' ? 'pointer' : 'default'
                          }}
                          onMouseDown={(e) => handleComponentMouseDown(e, comp)}
                        />
                        
                        {/* Component SVG */}
                        <image
                          href={svgData.svg}
                          width={svgData.width}
                          height={svgData.height}
                          style={{ pointerEvents: 'none' }}
                        />
                      </g>
                      
                      {/* Label */}
                      <text
                        x={svgData.width / 2}
                        y={svgData.height + 20}
                        textAnchor="middle"
                        fill={theme.text}
                        fontSize="12"
                        fontWeight="600"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {comp.label}
                      </text>
                      
                      {/* Connection point indicator when in line mode */}
                      {selectedTool === 'line' && (
                        <circle
                          cx={svgData.width / 2}
                          cy={svgData.height / 2}
                          r="8"
                          fill="#667eea"
                          opacity="0.3"
                          style={{ pointerEvents: 'none' }}
                        >
                          <animate
                            attributeName="r"
                            values="8;12;8"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.3;0.6;0.3"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Empty state */}
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
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>⚙️</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: theme.text }}>
                  Start Building Your SCADA Diagram
                </h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Select a component from the left panel and click to place it
                </p>
              </div>
            )}

            {/* Stats */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              display: 'flex',
              gap: '12px'
            }}>
              <div style={{
                padding: '8px 16px',
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '13px',
                fontWeight: '600'
              }}>
                Components: {components.length}
              </div>
              <div style={{
                padding: '8px 16px',
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '13px',
                fontWeight: '600'
              }}>
                Connections: {lines.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
