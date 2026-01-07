// TransformationPanel.jsx
// Put this file in the same folder as your PanelConfigModal.jsx

import React from 'react';
import { Filter, Plus, X, TrendingUp } from 'lucide-react';

function TransformationPanel({ transformations, onChange }) {
  
  // Add a new transformation
  const addTransformation = () => {
    onChange([
      ...transformations,
      { type: 'movingAverage', window: 5 }
    ]);
  };
  
  // Remove a transformation
  const removeTransformation = (index) => {
    onChange(transformations.filter((_, i) => i !== index));
  };
  
  // Update a transformation
  const updateTransformation = (index, updates) => {
    const newTransforms = [...transformations];
    newTransforms[index] = { ...newTransforms[index], ...updates };
    onChange(newTransforms);
  };
  
  return (
    <div style={{
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
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
            color: '#374151',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Filter size={14} />
            Data Transformations (ETL)
          </h3>
          <p style={{ 
            margin: '4px 0 0', 
            fontSize: '11px', 
            color: '#6b7280' 
          }}>
            Clean and transform your data before displaying
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
      
      {/* Show message if no transformations */}
      {transformations.length === 0 && (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '12px',
          border: '2px dashed #e5e7eb',
          borderRadius: '6px',
          background: 'white'
        }}>
          <TrendingUp size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <div>No transformations applied</div>
          <div style={{ marginTop: '4px', fontSize: '11px' }}>
            Click "Add" to start transforming your data
          </div>
        </div>
      )}
      
      {/* List of transformations */}
      {transformations.map((transform, index) => (
        <div
          key={index}
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            {/* Transformation Type */}
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontSize: '11px', 
                color: '#6b7280',
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
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  color: '#111827',
                  fontSize: '12px'
                }}
              >
                <option value="movingAverage">Moving Average (Smooth data)</option>
                <option value="removeOutliers">Remove Outliers (Remove bad values)</option>
                <option value="fillMissing">Fill Missing Values</option>
                <option value="scale">Scale (Multiply all values)</option>
                <option value="offset">Offset (Add to all values)</option>
              </select>
            </div>
            
            {/* Settings for each type */}
            <div style={{ flex: 1 }}>
              {transform.type === 'movingAverage' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontSize: '11px', 
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    Window Size
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={transform.window || 5}
                    onChange={(e) => updateTransformation(index, { window: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      color: '#111827',
                      fontSize: '12px'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                    Higher = smoother (try 5-10)
                  </div>
                </div>
              )}
              
              {transform.type === 'scale' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontSize: '11px', 
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
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
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      color: '#111827',
                      fontSize: '12px'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                    Example: 2 = double all values
                  </div>
                </div>
              )}
              
              {transform.type === 'offset' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px', 
                    fontSize: '11px', 
                    color: '#6b7280',
                    fontWeight: '600'
                  }}>
                    Add amount
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={transform.amount || 0}
                    onChange={(e) => updateTransformation(index, { amount: parseFloat(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      color: '#111827',
                      fontSize: '12px'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                    Example: 10 = add 10 to all values
                  </div>
                </div>
              )}
              
              {(transform.type === 'removeOutliers' || transform.type === 'fillMissing') && (
                <div style={{ 
                  padding: '6px 8px',
                  background: '#eff6ff',
                  border: '1px solid #dbeafe',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: '#1e40af',
                  marginTop: '18px'
                }}>
                  ℹ️ No settings needed - automatic
                </div>
              )}
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
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>💡</span>
          <span>
            Transformations apply in order. The first one processes raw data, 
            the second processes the result of the first, etc.
          </span>
        </div>
      )}
    </div>
  );
}

export default TransformationPanel;
