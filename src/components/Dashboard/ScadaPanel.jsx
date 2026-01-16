import React, { useState, useEffect } from 'react';
import ScadaDesigner from './ScadaDesigner';
import dashboardService from '../../services/dashboardService';

function ScadaPanel({ 
  panel, 
  onUpdate, 
  onDelete, 
  editMode, 
  darkMode,
  dashboardId // Important: need dashboardId to save
}) {
  const [isDesigning, setIsDesigning] = useState(false);
  const [scadaData, setScadaData] = useState({
    elements: panel.scadaElements || [],
    connections: panel.scadaConnections || [],
    config: panel.scadaConfig || {}
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load SCADA data when panel loads
  useEffect(() => {
    if (panel.scadaElements || panel.scadaConnections) {
      setScadaData({
        elements: panel.scadaElements || [],
        connections: panel.scadaConnections || [],
        config: panel.scadaConfig || {}
      });
    }
  }, [panel.id]);

  const handleSaveScada = async (components, lines, config) => {
    try {
      setIsSaving(true);
      
      // Update local state
      const updatedScadaData = {
        elements: components,
        connections: lines,
        config: config || scadaData.config
      };
      
      setScadaData(updatedScadaData);

      // Update panel with SCADA data
      const updatedPanel = {
        ...panel,
        scadaElements: components,
        scadaConnections: lines,
        scadaConfig: config || scadaData.config
      };

      // Save to parent component (which will trigger dashboard save)
      if (onUpdate) {
        await onUpdate(updatedPanel);
      }

      console.log('✅ SCADA design saved successfully:', {
        elements: components.length,
        connections: lines.length
      });

      return true;
    } catch (error) {
      console.error('❌ Error saving SCADA design:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDesigner = () => {
    setIsDesigning(true);
  };

  const handleCloseDesigner = async (saved, components, lines, config) => {
    if (saved) {
      await handleSaveScada(components, lines, config);
    }
    setIsDesigning(false);
  };

  const theme = darkMode ? {
    bg: '#1a1d29',
    card: '#0f1117',
    text: '#e5e7eb',
    textSecondary: '#9ca3af',
    border: '#374151',
    accent: '#667eea'
  } : {
    bg: '#ffffff',
    card: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#667eea'
  };

  if (isDesigning) {
    return (
      <ScadaDesigner
        initialComponents={scadaData.elements}
        initialLines={scadaData.connections}
        initialConfig={scadaData.config}
        onClose={handleCloseDesigner}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div style={{
      background: theme.bg,
      borderRadius: '12px',
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${theme.border}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: theme.text
        }}>
          {panel.title || 'SCADA Diagram'}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isSaving && (
            <span style={{
              fontSize: '12px',
              color: theme.accent,
              padding: '4px 8px'
            }}>
              Saving...
            </span>
          )}
          {editMode && (
            <button
              onClick={handleOpenDesigner}
              style={{
                padding: '8px 16px',
                background: theme.accent,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {scadaData.elements.length > 0 ? 'Edit Design' : 'Open Designer'}
            </button>
          )}
        </div>
      </div>

      <div style={{
        flex: 1,
        background: theme.card,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {scadaData.elements.length > 0 ? (
          // Render SCADA preview
          <ScadaPreview
            elements={scadaData.elements}
            connections={scadaData.connections}
            config={scadaData.config}
            darkMode={darkMode}
            onOpen={handleOpenDesigner}
          />
        ) : (
          // Empty state
          <div style={{
            textAlign: 'center',
            color: theme.textSecondary,
            padding: '40px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>⚙️</div>
            <h4 style={{
              margin: '0 0 8px',
              fontSize: '16px',
              color: theme.text
            }}>
              No SCADA Design Yet
            </h4>
            <p style={{
              margin: 0,
              fontSize: '14px'
            }}>
              {editMode ? 'Click "Open Designer" to start building' : 'Enable edit mode to create a design'}
            </p>
          </div>
        )}
      </div>

      {scadaData.elements.length > 0 && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: theme.textSecondary,
          display: 'flex',
          gap: '16px'
        }}>
          <span>Components: {scadaData.elements.length}</span>
          <span>Connections: {scadaData.connections.length}</span>
        </div>
      )}
    </div>
  );
}

// SCADA Preview Component
function ScadaPreview({ elements, connections, config, darkMode, onOpen }) {
  const theme = darkMode ? {
    bg: '#0f1117',
    text: '#e5e7eb',
    border: '#374151'
  } : {
    bg: '#ffffff',
    text: '#111827',
    border: '#e5e7eb'
  };

  // Calculate bounds of all elements
  const bounds = elements.reduce((acc, el) => {
    const right = el.x + (el.width || 100);
    const bottom = el.y + (el.height || 100);
    return {
      minX: Math.min(acc.minX, el.x),
      minY: Math.min(acc.minY, el.y),
      maxX: Math.max(acc.maxX, right),
      maxY: Math.max(acc.maxY, bottom)
    };
  }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

  const padding = 50;
  const viewBoxWidth = bounds.maxX - bounds.minX + padding * 2;
  const viewBoxHeight = bounds.maxY - bounds.minY + padding * 2;
  const viewBoxX = bounds.minX - padding;
  const viewBoxY = bounds.minY - padding;

  return (
    <div 
      onClick={onOpen}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        style={{ background: theme.bg }}
      >
        {/* Render connections */}
        {connections.map((line, idx) => (
          <g key={`conn-${idx}`}>
            {line.type === 'straight' ? (
              <line
                x1={line.startX}
                y1={line.startY}
                x2={line.endX}
                y2={line.endY}
                stroke={line.color || '#64748b'}
                strokeWidth={line.strokeWidth || 2}
              />
            ) : (
              <polyline
                points={line.points?.map(p => `${p.x},${p.y}`).join(' ') || `${line.startX},${line.startY} ${line.endX},${line.endY}`}
                fill="none"
                stroke={line.color || '#64748b'}
                strokeWidth={line.strokeWidth || 2}
              />
            )}
          </g>
        ))}

        {/* Render elements */}
        {elements.map((el) => (
          <g key={el.id} transform={`translate(${el.x}, ${el.y})`}>
            {el.svgContent ? (
              <g dangerouslySetInnerHTML={{ __html: el.svgContent }} />
            ) : (
              <rect
                width={el.width || 100}
                height={el.height || 100}
                fill={el.color || '#667eea'}
                opacity={0.3}
              />
            )}
            {el.label && (
              <text
                x={(el.width || 100) / 2}
                y={(el.height || 100) + 20}
                textAnchor="middle"
                fill={theme.text}
                fontSize="12"
                fontWeight="600"
              >
                {el.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Hover overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
      >
        <div style={{
          background: 'rgba(102, 126, 234, 0.9)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Click to edit
        </div>
      </div>
    </div>
  );
}

export default ScadaPanel;
