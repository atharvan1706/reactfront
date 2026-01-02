import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Trash2, Plus, Move, Pencil, Grid, ZoomIn, ZoomOut, Download, Upload, Settings } from 'lucide-react';

// SVG Component Templates
const SVG_COMPONENTS = {
  mixer: { name: 'Mixer', width: 60, height: 60, color: '#3b82f6' },
  mixerGreen: { name: 'Mixer (Active)', width: 60, height: 60, color: '#10b981' },
  pump: { name: 'Pump', width: 80, height: 80, color: '#3b82f6' },
  pumpGreen: { name: 'Pump (Active)', width: 80, height: 80, color: '#10b981' },
  rotationalMixer: { name: 'Rotational Mixer', width: 70, height: 70, color: '#8b5cf6' },
  rotationalPump: { name: 'Rotational Pump', width: 80, height: 80, color: '#8b5cf6' },
  valve: { name: 'Valve', width: 50, height: 70, color: '#f59e0b' },
  valveGreen: { name: 'Valve (Active)', width: 50, height: 70, color: '#10b981' }
};

export default function ScadaDesigner({ config, onSave, onClose, darkMode }) {
  const [components, setComponents] = useState(config?.components || []);
  const [lines, setLines] = useState(config?.lines || []);
  const [selectedTool, setSelectedTool] = useState('select'); // select, line, component
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [drawingLine, setDrawingLine] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [componentToAdd, setComponentToAdd] = useState(null);
  const canvasRef = useRef(null);

  const theme = darkMode ? {
    bg: '#1a1d29',
    card: '#232837',
    hover: '#2d3348',
    text: '#e5e7eb',
    textSecondary: '#9ca3af',
    border: '#374151',
    accent: '#667eea'
  } : {
    bg: '#ffffff',
    card: '#f9fafb',
    hover: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#667eea'
  };

  const handleCanvasClick = (e) => {
    if (selectedTool === 'component' && componentToAdd) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const newComponent = {
        id: `comp_${Date.now()}`,
        type: componentToAdd,
        x,
        y,
        rotation: 0,
        label: SVG_COMPONENTS[componentToAdd].name,
        config: {}
      };
      
      setComponents([...components, newComponent]);
      setSelectedTool('select');
      setComponentToAdd(null);
    }
  };

  const handleComponentMouseDown = (e, comp) => {
    e.stopPropagation();
    
    if (selectedTool === 'select') {
      setSelectedComponent(comp.id);
      setDraggingComponent({ 
        id: comp.id, 
        startX: e.clientX, 
        startY: e.clientY,
        initialX: comp.x,
        initialY: comp.y
      });
    } else if (selectedTool === 'line') {
      if (!drawingLine) {
        setDrawingLine({
          from: comp.id,
          startX: comp.x + SVG_COMPONENTS[comp.type].width / 2,
          startY: comp.y + SVG_COMPONENTS[comp.type].height / 2,
          endX: comp.x + SVG_COMPONENTS[comp.type].width / 2,
          endY: comp.y + SVG_COMPONENTS[comp.type].height / 2
        });
      } else {
        const newLine = {
          id: `line_${Date.now()}`,
          from: drawingLine.from,
          to: comp.id,
          color: '#3b82f6',
          width: 2,
          style: 'solid'
        };
        setLines([...lines, newLine]);
        setDrawingLine(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (draggingComponent) {
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - draggingComponent.startX) / zoom;
      const deltaY = (e.clientY - draggingComponent.startY) / zoom;
      
      setComponents(components.map(c => 
        c.id === draggingComponent.id 
          ? { ...c, x: draggingComponent.initialX + deltaX, y: draggingComponent.initialY + deltaY }
          : c
      ));
    } else if (drawingLine) {
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
    onSave({
      id: config?.id || `scada_${Date.now()}`,
      title: config?.title || 'SCADA Diagram',
      type: 'scada',
      components,
      lines,
      width: config?.width || 2,
      height: config?.height || 2
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ components, lines }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scada_diagram_${Date.now()}.json`;
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
      } catch (error) {
        alert('Failed to import diagram');
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
          <h2 style={{ margin: 0, color: theme.text, fontSize: '20px', fontWeight: '700' }}>
            SCADA Designer
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleExport}
              style={{
                padding: '8px 16px',
                background: theme.card,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <Download size={16} />
              Export
            </button>
            <label style={{
              padding: '8px 16px',
              background: theme.card,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <Save size={16} />
              Save
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
            width: '280px',
            borderRight: `2px solid ${theme.border}`,
            padding: '16px',
            overflowY: 'auto',
            background: theme.card
          }}>
            <h3 style={{ margin: '0 0 12px', color: theme.text, fontSize: '14px', fontWeight: '700' }}>
              Tools
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <button
                onClick={() => { setSelectedTool('select'); setComponentToAdd(null); }}
                style={{
                  padding: '10px',
                  background: selectedTool === 'select' ? theme.accent : theme.bg,
                  border: `2px solid ${selectedTool === 'select' ? theme.accent : theme.border}`,
                  borderRadius: '8px',
                  color: selectedTool === 'select' ? 'white' : theme.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <Move size={16} />
                Select & Move
              </button>
              
              <button
                onClick={() => { setSelectedTool('line'); setComponentToAdd(null); }}
                style={{
                  padding: '10px',
                  background: selectedTool === 'line' ? theme.accent : theme.bg,
                  border: `2px solid ${selectedTool === 'line' ? theme.accent : theme.border}`,
                  borderRadius: '8px',
                  color: selectedTool === 'line' ? 'white' : theme.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <Pencil size={16} />
                Draw Line
              </button>
            </div>

            <h3 style={{ margin: '20px 0 12px', color: theme.text, fontSize: '14px', fontWeight: '700' }}>
              Components
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(SVG_COMPONENTS).map(([key, comp]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTool('component');
                    setComponentToAdd(key);
                  }}
                  style={{
                    padding: '12px',
                    background: componentToAdd === key ? theme.accent : theme.bg,
                    border: `2px solid ${componentToAdd === key ? theme.accent : theme.border}`,
                    borderRadius: '8px',
                    color: componentToAdd === key ? 'white' : theme.text,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: comp.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '700'
                    }}>
                      {comp.name.substring(0, 2).toUpperCase()}
                    </div>
                    {comp.name}
                  </div>
                </button>
              ))}
            </div>

            {selectedComponent && (
              <>
                <h3 style={{ margin: '20px 0 12px', color: theme.text, fontSize: '14px', fontWeight: '700' }}>
                  Component Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={handleRotateComponent}
                    style={{
                      padding: '10px',
                      background: theme.bg,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.text,
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Rotate 90°
                  </button>
                  <button
                    onClick={handleDeleteComponent}
                    style={{
                      padding: '10px',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: theme.bg }}>
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
                  padding: '8px',
                  background: theme.card,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: showGrid ? theme.accent : theme.text,
                  cursor: 'pointer'
                }}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
                style={{
                  padding: '8px',
                  background: theme.card,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  cursor: 'pointer'
                }}
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
                style={{
                  padding: '8px',
                  background: theme.card,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  cursor: 'pointer'
                }}
              >
                <ZoomOut size={18} />
              </button>
            </div>

            <svg
              ref={canvasRef}
              width="100%"
              height="100%"
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: selectedTool === 'component' ? 'crosshair' : 'default' }}
            >
              {/* Grid */}
              {showGrid && (
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill={darkMode ? '#374151' : '#e5e7eb'} />
                  </pattern>
                </defs>
              )}
              {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Lines */}
                {lines.map(line => {
                  const coords = getLineCoordinates(line);
                  if (!coords) return null;
                  
                  return (
                    <line
                      key={line.id}
                      x1={coords.x1}
                      y1={coords.y1}
                      x2={coords.x2}
                      y2={coords.y2}
                      stroke={selectedLine === line.id ? '#ef4444' : line.color}
                      strokeWidth={line.width}
                      strokeDasharray={line.style === 'dashed' ? '5,5' : '0'}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLine(line.id);
                        setSelectedComponent(null);
                      }}
                    />
                  );
                })}

                {/* Drawing line preview */}
                {drawingLine && (
                  <line
                    x1={drawingLine.startX}
                    y1={drawingLine.startY}
                    x2={drawingLine.endX}
                    y2={drawingLine.endY}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                  />
                )}

                {/* Components */}
                {components.map(comp => {
                  const svgData = SVG_COMPONENTS[comp.type];
                  return (
                    <g
                      key={comp.id}
                      transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation}, ${svgData.width/2}, ${svgData.height/2})`}
                      onMouseDown={(e) => handleComponentMouseDown(e, comp)}
                      style={{ cursor: selectedTool === 'select' ? 'move' : 'pointer' }}
                    >
                      <rect
                        width={svgData.width}
                        height={svgData.height}
                        fill={svgData.color}
                        stroke={selectedComponent === comp.id ? '#ef4444' : theme.border}
                        strokeWidth={selectedComponent === comp.id ? 3 : 1}
                        rx={8}
                        opacity={0.9}
                      />
                      <text
                        x={svgData.width / 2}
                        y={svgData.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {svgData.name.substring(0, 2).toUpperCase()}
                      </text>
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
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
