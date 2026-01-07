// TransformationPanel.jsx - ADVANCED VERSION
// UI for all 15 transformations

import React from 'react';
import { Filter, Plus, X, TrendingUp, Info } from 'lucide-react';

function TransformationPanel({ transformations, onChange, darkMode }) {
  
  // Dark mode theme
  const theme = darkMode ? {
    bg: '#1e293b',
    card: '#0f172a',
    hover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#334155'
  } : {
    bg: 'white',
    card: '#f9fafb',
    hover: '#f3f4f6',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: '#e5e7eb'
  };
  
  const addTransformation = () => {
    onChange([
      ...transformations,
      { type: 'movingAverage', window: 5 }
    ]);
  };
  
  const removeTransformation = (index) => {
    onChange(transformations.filter((_, i) => i !== index));
  };
  
  const updateTransformation = (index, updates) => {
    const newTransforms = [...transformations];
    newTransforms[index] = { ...newTransforms[index], ...updates };
    onChange(newTransforms);
  };
  
  // Transform options grouped by category
  const transformOptions = [
    { 
      category: '📊 Basic Smoothing',
      options: [
        { value: 'movingAverage', label: 'Moving Average', desc: 'Smooth noisy data' },
        { value: 'exponentialMovingAverage', label: 'EMA (Exponential)', desc: 'Smoother, weights recent data' }
      ]
    },
    {
      category: '🔢 Math Operations',
      options: [
        { value: 'scale', label: 'Scale (Multiply)', desc: 'Multiply all values' },
        { value: 'offset', label: 'Offset (Add/Subtract)', desc: 'Add or subtract from values' },
        { value: 'logTransform', label: 'Log Transform', desc: 'Reduce exponential growth' },
        { value: 'clip', label: 'Clip Values', desc: 'Cap at min/max' }
      ]
    },
    {
      category: '📈 Change Analysis',
      options: [
        { value: 'rateOfChange', label: 'Rate of Change', desc: 'Show change between points' },
        { value: 'percentChange', label: 'Percent Change', desc: 'Change as percentage' },
        { value: 'cumulativeSum', label: 'Cumulative Sum', desc: 'Running total' }
      ]
    },
    {
      category: '🎯 Data Cleaning',
      options: [
        { value: 'removeOutliers', label: 'Remove Outliers', desc: 'Remove extreme values' },
        { value: 'fillMissing', label: 'Fill Missing', desc: 'Interpolate null values' },
        { value: 'normalize', label: 'Normalize (0-1)', desc: 'Scale to 0-1 range' },
        { value: 'zScore', label: 'Z-Score', desc: 'Standardize (mean=0, std=1)' }
      ]
    },
    {
      category: '⏱️ Data Reduction',
      options: [
        { value: 'resample', label: 'Resample', desc: 'Keep every Nth point' },
        { value: 'aggregateByWindow', label: 'Aggregate', desc: 'Combine points in windows' }
      ]
    }
  ];

  // Render settings based on transformation type
  const renderSettings = (transform, index) => {
    switch (transform.type) {
      case 'movingAverage':
        return (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
              Window Size
            </label>
            <input
              type="number"
              min="2"
              max="100"
              value={transform.window || 5}
              onChange={(e) => updateTransformation(index, { window: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '6px 8px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.text,
                fontSize: '12px'
              }}
            />
            <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>
              5-10 for light smoothing, 20+ for heavy
            </div>
          </div>
        );
      
      case 'exponentialMovingAverage':
        return (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
              Alpha (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={transform.alpha || 0.3}
              onChange={(e) => updateTransformation(index, { alpha: parseFloat(e.target.value) })}
              style={{
                width: '100%',
                padding: '6px 8px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.text,
                fontSize: '12px'
              }}
            />
            <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>
              Higher = more responsive (0.3 is good)
            </div>
          </div>
        );
      
      case 'scale':
        return (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
              Multiply by
            </label>
            <input
              type="number"
              step="0.1"
              value={transform.multiplier || 1}
              onChange={(e) => updateTransformation(index, { multiplier: parseFloat(e.target.value) })}
              style={{
                width: '100%',
                padding: '6px 8px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.text,
                fontSize: '12px'
              }}
            />
            <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>
              2 = double, 0.5 = half, 1.8 = Celsius to F
            </div>
          </div>
        );
      
      case 'offset':
        return (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
              Add amount
            </label>
            <input
              type="number"
              value={transform.amount || 0}
              onChange={(e) => updateTransformation(index, { amount: parseFloat(e.target.value) })}
              style={{
                width: '100%',
                padding: '6px 8px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.text,
                fontSize: '12px'
              }}
            />
            <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>
              32 for Celsius to Fahrenheit offset
            </div>
          </div>
        );
      
      case 'clip':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
                Min Value
              </label>
              <input
                type="number"
                value={transform.min ?? ''}
                placeholder="No min"
                onChange={(e) => updateTransformation(index, { min: e.target.value ? parseFloat(e.target.value) : null })}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
                Max Value
              </label>
              <input
                type="number"
                value={transform.max ?? ''}
                placeholder="No max"
                onChange={(e) => updateTransformation(index, { max: e.target.value ? parseFloat(e.target.value) : null })}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
          </div>
        );
      
      case 'resample':
        return (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
              Keep every Nth point
            </label>
            <input
              type="number"
              min="2"
              max="100"
              value={transform.factor || 2}
              onChange={(e) => updateTransformation(index, { factor: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '6px 8px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '4px',
                color: theme.text,
                fontSize: '12px'
              }}
            />
            <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>
              2 = keep every 2nd point (50% reduction)
            </div>
          </div>
        );
      
      case 'aggregateByWindow':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
                Window Size
              </label>
              <input
                type="number"
                min="2"
                value={transform.windowSize || 5}
                onChange={(e) => updateTransformation(index, { windowSize: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted, fontWeight: '600' }}>
                Method
              </label>
              <select
                value={transform.method || 'avg'}
                onChange={(e) => updateTransformation(index, { method: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              >
                <option value="avg">Average</option>
                <option value="sum">Sum</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
                <option value="first">First</option>
                <option value="last">Last</option>
              </select>
            </div>
          </div>
        );
      
      default:
        return (
          <div style={{ 
            padding: '6px 8px',
            background: darkMode ? '#1e3a5f' : '#eff6ff',
border: `1px solid ${darkMode ? '#2563eb' : '#dbeafe'}`,
            borderRadius: '4px',
            fontSize: '11px',
            color: darkMode ? '#93c5fd' : '#1e40af',
            marginTop: '4px'
          }}>
            ℹ️ No settings needed
          </div>
        );
    }
  };

  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: theme.textSecondary,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Filter size={14} />
            Data Transformations (Advanced ETL)
          </h3>
          <p style={{ 
            margin: '4px 0 0', 
            fontSize: '11px', 
            color: theme.textMuted 
          }}>
            15 transformations available - apply multiple in sequence
          </p>
        </div>
        <button
          onClick={addTransformation}
          style={{
            padding: '6px 12px',
            background: '#667eea',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Plus size={12} />
          Add
        </button>
      </div>
      
      {/* Empty state */}
      {transformations.length === 0 && (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: theme.textMuted,
          fontSize: '12px',
         border: `2px dashed ${theme.border}`,
          borderRadius: '6px',
          background: theme.bg
        }}>
          <TrendingUp size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <div>No transformations applied</div>
          <div style={{ marginTop: '4px', fontSize: '11px' }}>
            Click "Add" to transform your data
          </div>
        </div>
      )}
      
      {/* Transformations list */}
      {transformations.map((transform, index) => (
        <div
          key={index}
          style={{
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            {/* Type selector */}
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '11px', 
                color: theme.textMuted,
                fontWeight: '600'
              }}>
                Transformation #{index + 1}
              </label>
              <select
                value={transform.type}
                onChange={(e) => updateTransformation(index, { type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              >
                {transformOptions.map(group => (
                  <optgroup key={group.category} label={group.category}>
                    {group.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} - {opt.desc}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            {/* Settings */}
            <div style={{ flex: 1 }}>
              {renderSettings(transform, index)}
            </div>
            
            {/* Delete button */}
            <button
              onClick={() => removeTransformation(index)}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                marginTop: '18px'
              }}
              title="Remove transformation"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
      
      {/* Info box */}
      {transformations.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: darkMode ? '#451a03' : '#fef3c7',
          border: `1px solid ${darkMode ? '#78350f' : '#fde68a'}`,
          borderRadius: '6px',
          fontSize: '11px',
          color: darkMode ? '#fcd34d' : '#92400e',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px'
        }}>
          <Info size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
          <span>
            <strong>Transformations apply in order:</strong> Each transformation processes 
            the output of the previous one. 
          </span>
        </div>
      )}
    </div>
  );
}

export default TransformationPanel;