import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  X, Database, Eye, Save, RefreshCw, AlertCircle
} from 'lucide-react';
import { COLORS, VIZ_TYPES, DEFAULT_PANEL_CONFIG } from './constants';
import questdbService from '../../services/questdb';

function PanelConfigModal({ panel, onSave, onClose, allTables }) {
  const [config, setConfig] = useState(panel || {
    ...DEFAULT_PANEL_CONFIG,
    id: `panel_${Date.now()}`
  });

  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    if (config.table && config.dataSource === 'table') {
      fetchTableFields(config.table);
    }
  }, [config.table]);

  const fetchTableFields = async (tableName) => {
    try {
      const query = `SELECT * FROM ${tableName} LIMIT 1`;
      const result = await questdbService.query(query);
      if (result.length > 0) {
        const fields = Object.keys(result[0]);
        setAvailableFields(fields);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    
    try {
      let query = config.query;
      
      if (config.dataSource === 'table' && config.table) {
        query = `SELECT * FROM ${config.table} ORDER BY ${config.timestampField} DESC LIMIT ${config.limit}`;
      }
      
      if (!query) {
        setPreviewError('Please enter a query or select a table');
        setPreviewLoading(false);
        return;
      }

      const result = await questdbService.query(query);
      const formatted = questdbService.formatForChart(result, config.timestampField);
      setPreviewData(formatted);
      
      if (formatted.length > 0 && !config.yAxis) {
        const numericFields = Object.keys(formatted[0]).filter(key => 
          typeof formatted[0][key] === 'number' && key !== '_timestamp'
        );
        if (numericFields.length > 0) {
          setConfig({ ...config, yAxis: numericFields[0] });
        }
      }
    } catch (error) {
      setPreviewError(error.message);
    }
    
    setPreviewLoading(false);
  };

  const renderPreviewChart = () => {
    if (previewLoading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <RefreshCw size={24} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      );
    }

    if (previewError) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '200px',
          color: '#ef4444',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <AlertCircle size={32} style={{ marginBottom: '8px' }} />
            <div>{previewError}</div>
          </div>
        </div>
      );
    }

    if (previewData.length === 0) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '200px',
          color: '#9ca3af'
        }}>
          Click "Preview" to test your configuration
        </div>
      );
    }

    const chartProps = { data: previewData, margin: { top: 5, right: 20, left: 0, bottom: 5 } };

    return (
      <ResponsiveContainer width="100%" height={200}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }} />
            <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={config.lineWidth} dot={config.showDots} />
          </LineChart>
        )}
        {config.vizType === 'bar' && (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }} />
            <Bar dataKey={config.yAxis} fill={config.colors[0]} />
          </BarChart>
        )}
        {config.vizType === 'area' && (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 10 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb' }} />
            <Area type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} fill={config.colors[0]} fillOpacity={config.fillOpacity} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f9fafb'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#111827', fontWeight: '700' }}>
              {panel ? 'Edit Panel' : 'Add New Panel'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
              Configure your visualization settings
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div>
              {/* Panel Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  Panel Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="My Panel Title"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Visualization Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  Visualization Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {VIZ_TYPES.map(type => {
                    const Icon = type.icon;
                    const isSelected = config.vizType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setConfig({ ...config, vizType: type.id })}
                        style={{
                          padding: '12px',
                          background: isSelected ? '#667eea' : '#f9fafb',
                          border: '2px solid',
                          borderColor: isSelected ? '#667eea' : '#e5e7eb',
                          borderRadius: '8px',
                          color: isSelected ? 'white' : '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '13px',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                      >
                        <Icon size={18} />
                        <div>
                          <div style={{ fontWeight: '600' }}>{type.name}</div>
                          <div style={{ fontSize: '11px', opacity: 0.7 }}>{type.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data Source */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  Data Source
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setConfig({ ...config, dataSource: 'table' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: config.dataSource === 'table' ? '#667eea' : '#f9fafb',
                      border: '2px solid',
                      borderColor: config.dataSource === 'table' ? '#667eea' : '#e5e7eb',
                      borderRadius: '8px',
                      color: config.dataSource === 'table' ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    <Database size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    From Table
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, dataSource: 'custom' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: config.dataSource === 'custom' ? '#667eea' : '#f9fafb',
                      border: '2px solid',
                      borderColor: config.dataSource === 'custom' ? '#667eea' : '#e5e7eb',
                      borderRadius: '8px',
                      color: config.dataSource === 'custom' ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    Custom SQL
                  </button>
                </div>

                {config.dataSource === 'table' ? (
                  <select
                    value={config.table}
                    onChange={(e) => setConfig({ ...config, table: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select a table...</option>
                    {allTables.map(table => (
                      <option key={table} value={table}>{table}</option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    value={config.query}
                    onChange={(e) => setConfig({ ...config, query: e.target.value })}
                    rows={4}
                    placeholder="SELECT * FROM your_table WHERE condition ORDER BY timestamp DESC LIMIT 100"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                )}
              </div>

              {/* Field Configuration */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  Field Configuration
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                      Timestamp Field
                    </label>
                    {availableFields.length > 0 ? (
                      <select
                        value={config.timestampField}
                        onChange={(e) => setConfig({ ...config, timestampField: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#111827',
                          fontSize: '13px'
                        }}
                      >
                        {availableFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={config.timestampField}
                        onChange={(e) => setConfig({ ...config, timestampField: e.target.value })}
                        placeholder="timestamp"
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#111827',
                          fontSize: '13px'
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                      Value Field (Y-Axis)
                    </label>
                    {availableFields.length > 0 ? (
                      <select
                        value={config.yAxis}
                        onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#111827',
                          fontSize: '13px'
                        }}
                      >
                        <option value="">Select field...</option>
                        {availableFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={config.yAxis}
                        onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
                        placeholder="value"
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#111827',
                          fontSize: '13px'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Size Configuration */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  Panel Size
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                      Width (columns)
                    </label>
                    <input
                      type="number"
                      value={config.width}
                      onChange={(e) => setConfig({ ...config, width: Math.max(1, Math.min(12, parseInt(e.target.value) || 1)) })}
                      min="1"
                      max="12"
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        color: '#111827',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                      Height (rows)
                    </label>
                    <input
                      type="number"
                      value={config.height}
                      onChange={(e) => setConfig({ ...config, height: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
                      min="1"
                      max="10"
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        color: '#111827',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Data Limit & Refresh */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                    Data Limit
                  </label>
                  <input
                    type="number"
                    value={config.limit}
                    onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) })}
                    min="10"
                    max="10000"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                    Auto Refresh
                  </label>
                  <select
                    value={config.refreshInterval}
                    onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '14px'
                    }}
                  >
                    <option value={0}>None</option>
                    <option value={1000}>1s</option>
                    <option value={5000}>5s</option>
                    <option value={10000}>10s</option>
                    <option value={30000}>30s</option>
                    <option value={60000}>1m</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Preview & Style */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                    Preview
                  </label>
                  <button
                    onClick={handlePreview}
                    disabled={previewLoading}
                    style={{
                      padding: '6px 12px',
                      background: '#667eea',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: previewLoading ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={14} />
                    {previewLoading ? 'Loading...' : 'Preview Data'}
                  </button>
                </div>
                <div style={{
                  background: '#f9fafb',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  minHeight: '200px'
                }}>
                  {renderPreviewChart()}
                </div>
                {previewData.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                    {previewData.length} data points loaded
                  </div>
                )}
              </div>

              {/* Style Options */}
              <div>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
                  Style Options
                </label>
                
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                    Chart Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setConfig({ ...config, colors: [color] })}
                        style={{
                          width: '36px',
                          height: '36px',
                          background: color,
                          border: config.colors[0] === color ? '3px solid #374151' : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {(config.vizType === 'line' || config.vizType === 'area') && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                      Line Width: {config.lineWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={config.lineWidth}
                      onChange={(e) => setConfig({ ...config, lineWidth: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                {config.vizType === 'area' && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#6b7280' }}>
                      Fill Opacity: {Math.round(config.fillOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.fillOpacity}
                      onChange={(e) => setConfig({ ...config, fillOpacity: parseFloat(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.showLegend}
                      onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Show Legend
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.showGrid}
                      onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Show Grid Lines
                  </label>
                  {(config.vizType === 'line' || config.vizType === 'area') && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={config.showDots}
                        onChange={(e) => setConfig({ ...config, showDots: e.target.checked })}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Show Data Points
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: '#f9fafb'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(config)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} />
            {panel ? 'Save Changes' : 'Add Panel'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PanelConfigModal;
