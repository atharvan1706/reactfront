import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  X as LucideX, Database, Eye, Save, RefreshCw, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';

import { COLORS, VIZ_TYPES, DEFAULT_PANEL_CONFIG } from './constants';
import questdbService from '../../services/questdb';

import SimpleTransformations from './simpleTransformations';
import TransformationPanel from './TransformationPanel';

const X = LucideX;

function PanelConfigModal({ panel, onSave, onClose, allTables, darkMode }) {
  const [config, setConfig] = useState(panel || {
    ...DEFAULT_PANEL_CONFIG,
    id: `panel_${Date.now()}`,
    colors: [COLORS[0], COLORS[1], COLORS[2], COLORS[3], COLORS[4]],
    transformations: []
  });

  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);

  const theme = darkMode ? {
    bg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
    bgSolid: '#1e293b',
    card: '#0f172a',
    hover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.08)',
    input: 'rgba(255, 255, 255, 0.03)',
    inputBorder: 'rgba(255, 255, 255, 0.08)',
    accent: 'rgba(99, 102, 241, 0.1)',
    accentBorder: 'rgba(99, 102, 241, 0.3)'
  } : {
    bg: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    bgSolid: 'white',
    card: '#f9fafb',
    hover: '#f3f4f6',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: 'rgba(0, 0, 0, 0.06)',
    borderLight: 'rgba(0, 0, 0, 0.04)',
    input: 'white',
    inputBorder: 'rgba(0, 0, 0, 0.08)',
    accent: 'rgba(99, 102, 241, 0.06)',
    accentBorder: 'rgba(99, 102, 241, 0.2)'
  };

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
      
      let finalData = formatted;
      if (config.transformations && config.transformations.length > 0) {
        finalData = SimpleTransformations.applyTransformations(formatted, config.transformations);
      }
      
      setPreviewData(finalData);
      
      if (formatted.length > 0 && (!config.yAxes || config.yAxes.length === 0)) {
        const numericFields = Object.keys(formatted[0]).filter(key => 
          typeof formatted[0][key] === 'number' && key !== '_timestamp'
        );
        if (numericFields.length > 0) {
          setConfig({ ...config, yAxis: numericFields[0], yAxes: [numericFields[0]] });
        }
      }
    } catch (error) {
      setPreviewError(error.message);
    }
    
    setPreviewLoading(false);
  };

  const getColor = (idx) => {
    if (config.colors && config.colors.length > idx && config.colors[idx]) {
      return config.colors[idx];
    }
    return COLORS[idx % COLORS.length];
  };

  const renderPreviewChart = () => {
    if (previewLoading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid',
            borderColor: `${theme.border} ${theme.border} ${theme.border} #6366f1`,
            animation: 'spin 0.8s linear infinite'
          }} />
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
          color: darkMode ? '#fca5a5' : '#dc2626',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <AlertCircle size={36} style={{ marginBottom: '10px', opacity: 0.9 }} />
            <div style={{ 
              fontFamily: "'Outfit', sans-serif",
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {previewError}
            </div>
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
          color: theme.textMuted,
          fontFamily: "'Outfit', sans-serif",
          fontSize: '14px'
        }}>
          Click "Preview" to test your configuration
        </div>
      );
    }

    const chartProps = { data: previewData, margin: { top: 5, right: 20, left: 0, bottom: 5 } };
    const yFields = (config.yAxes && config.yAxes.length > 0) ? config.yAxes : [config.yAxis].filter(Boolean);

    return (
      <ResponsiveContainer width="100%" height={200}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10, fontFamily: "'Outfit', sans-serif" }} stroke={theme.border} />
            <YAxis tick={{ fill: theme.textMuted, fontSize: 10, fontFamily: "'Outfit', sans-serif" }} stroke={theme.border} />
            <Tooltip contentStyle={{ 
              background: theme.bgSolid, 
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '12px'
            }} />
            <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px' }} />
            {yFields.map((yField, idx) => (
              <Line 
                key={yField}
                type="monotone" 
                dataKey={yField} 
                stroke={getColor(idx)} 
                strokeWidth={config.lineWidth} 
                dot={config.showDots}
                name={yField}
              />
            ))}
          </LineChart>
        )}
        {config.vizType === 'bar' && (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10, fontFamily: "'Outfit', sans-serif" }} stroke={theme.border} />
            <YAxis tick={{ fill: theme.textMuted, fontSize: 10, fontFamily: "'Outfit', sans-serif" }} stroke={theme.border} />
            <Tooltip contentStyle={{ 
              background: theme.bgSolid, 
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '12px'
            }} />
            <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px' }} />
            {yFields.map((yField, idx) => (
              <Bar 
                key={yField}
                dataKey={yField} 
                fill={getColor(idx)}
                name={yField}
              />
            ))}
          </BarChart>
        )}
        {config.vizType === 'area' && (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10, fontFamily: "'Outfit', sans-serif" }} stroke={theme.border} />
            <YAxis tick={{ fill: theme.textMuted, fontSize: 10, fontFamily: "'Outfit', sans-serif" }} stroke={theme.border} />
            <Tooltip contentStyle={{ 
              background: theme.bgSolid, 
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '12px'
            }} />
            <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px' }} />
            {yFields.map((yField, idx) => (
              <Area 
                key={yField}
                type="monotone" 
                dataKey={yField} 
                stroke={getColor(idx)} 
                fill={getColor(idx)}
                fillOpacity={config.fillOpacity}
                strokeWidth={config.lineWidth}
                name={yField}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  const InputLabel = ({ children, icon: Icon }) => (
    <label style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px', 
      fontSize: '13px', 
      color: theme.textSecondary,
      fontFamily: "'Outfit', sans-serif",
      fontWeight: '600',
      letterSpacing: '0.01em'
    }}>
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </label>
  );

  const StyledInput = ({ ...props }) => (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '11px 14px',
        background: theme.input,
        border: `1px solid ${theme.inputBorder}`,
        borderRadius: '10px',
        color: theme.text,
        fontSize: '14px',
        fontFamily: "'Outfit', sans-serif",
        outline: 'none',
        transition: 'all 0.2s ease',
        ...(props.style || {})
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#6366f1';
        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.inputBorder;
        e.target.style.boxShadow = 'none';
      }}
    />
  );

  const StyledSelect = ({ children, ...props }) => (
    <select
      {...props}
      style={{
        width: '100%',
        padding: '11px 14px',
        background: theme.input,
        border: `1px solid ${theme.inputBorder}`,
        borderRadius: '10px',
        color: theme.text,
        fontSize: '14px',
        fontFamily: "'Outfit', sans-serif",
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...(props.style || {})
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#6366f1';
        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.inputBorder;
        e.target.style.boxShadow = 'none';
      }}
    >
      {children}
    </select>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .modal-container {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .section-card {
          background: ${theme.card};
          border: 1px solid ${theme.border};
          borderRadius: 14px;
          padding: 20px;
          marginBottom: 16px;
          transition: all 0.2s ease;
        }
        
        .section-card:hover {
          border-color: ${theme.borderLight};
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .action-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .action-btn:hover {
          transform: translateY(-1px);
        }
        
        .action-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="modal-container" style={{
        background: theme.bg,
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: darkMode 
          ? '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.05) inset'
          : '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.05) inset',
        border: `1px solid ${theme.border}`
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 32px',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: theme.accent,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #d946ef, transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite'
          }} />
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <Sparkles size={24} color="#8b5cf6" strokeWidth={2.5} />
              <h2 style={{ 
                margin: 0, 
                fontSize: '26px', 
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '700',
                letterSpacing: '-0.02em',
                color: theme.text
              }}>
                Panel <span className="gradient-text">Configuration</span>
              </h2>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: theme.textMuted,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '400'
            }}>
              {panel ? 'Edit your panel settings' : 'Create a new data visualization panel'}
            </p>
          </div>
          
          <button onClick={onClose} className="action-btn" style={{
            background: theme.input,
            border: `1px solid ${theme.inputBorder}`,
            color: theme.textMuted,
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '32px',
          background: darkMode ? 'rgba(99, 102, 241, 0.02)' : 'rgba(99, 102, 241, 0.01)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Left Column */}
            <div>
              {/* Basic Settings */}
              <div className="section-card">
                <h3 style={{
                  margin: '0 0 18px 0',
                  fontSize: '16px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '700',
                  color: theme.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '3px',
                    height: '16px',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    borderRadius: '2px'
                  }} />
                  Basic Settings
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <InputLabel>Panel Title</InputLabel>
                  <StyledInput
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder="Enter panel title..."
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <InputLabel icon={TrendingUp}>Visualization Type</InputLabel>
                  <StyledSelect
                    value={config.vizType}
                    onChange={(e) => setConfig({ ...config, vizType: e.target.value })}
                  >
                    {VIZ_TYPES.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </StyledSelect>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <InputLabel>Width</InputLabel>
                    <StyledInput
                      type="number"
                      value={config.width}
                      onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
                      min="1"
                      max="12"
                    />
                  </div>
                  <div>
                    <InputLabel>Height</InputLabel>
                    <StyledInput
                      type="number"
                      value={config.height}
                      onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) })}
                      min="1"
                      max="6"
                    />
                  </div>
                </div>
              </div>

              {/* Data Source */}
              <div className="section-card">
                <h3 style={{
                  margin: '0 0 18px 0',
                  fontSize: '16px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '700',
                  color: theme.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '3px',
                    height: '16px',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    borderRadius: '2px'
                  }} />
                  Data Source
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <InputLabel icon={Database}>Source Type</InputLabel>
                  <StyledSelect
                    value={config.dataSource}
                    onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
                  >
                    <option value="table">Table</option>
                    <option value="custom">Custom Query</option>
                  </StyledSelect>
                </div>

                {config.dataSource === 'table' ? (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <InputLabel>Table</InputLabel>
                      <StyledSelect
                        value={config.table}
                        onChange={(e) => setConfig({ ...config, table: e.target.value })}
                      >
                        <option value="">Select a table...</option>
                        {allTables.map(table => (
                          <option key={table} value={table}>{table}</option>
                        ))}
                      </StyledSelect>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <InputLabel>Timestamp Field</InputLabel>
                      <StyledSelect
                        value={config.timestampField}
                        onChange={(e) => setConfig({ ...config, timestampField: e.target.value })}
                      >
                        <option value="">Select field...</option>
                        {availableFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </StyledSelect>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <InputLabel>Y-Axis Fields (Multi-select)</InputLabel>
                      <select
                        multiple
                        value={config.yAxes || []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          setConfig({ ...config, yAxes: selected, yAxis: selected[0] || '' });
                        }}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          background: theme.input,
                          border: `1px solid ${theme.inputBorder}`,
                          borderRadius: '10px',
                          color: theme.text,
                          fontSize: '14px',
                          fontFamily: "'Outfit', sans-serif",
                          minHeight: '120px',
                          outline: 'none'
                        }}
                      >
                        {availableFields.filter(f => f !== config.timestampField).map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                      <div style={{ 
                        fontSize: '11px', 
                        color: theme.textMuted, 
                        marginTop: '6px',
                        fontFamily: "'Outfit', sans-serif"
                      }}>
                        Hold Ctrl/Cmd to select multiple
                      </div>
                    </div>

                    <div>
                      <InputLabel>Limit</InputLabel>
                      <StyledInput
                        type="number"
                        value={config.limit}
                        onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) })}
                        min="1"
                        max="10000"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <InputLabel>Custom SQL Query</InputLabel>
                    <textarea
                      value={config.query}
                      onChange={(e) => setConfig({ ...config, query: e.target.value })}
                      placeholder="SELECT * FROM table WHERE..."
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '11px 14px',
                        background: theme.input,
                        border: `1px solid ${theme.inputBorder}`,
                        borderRadius: '10px',
                        color: theme.text,
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', monospace",
                        resize: 'vertical',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = theme.inputBorder;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Refresh Settings */}
              <div className="section-card">
                <h3 style={{
                  margin: '0 0 18px 0',
                  fontSize: '16px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '700',
                  color: theme.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '3px',
                    height: '16px',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    borderRadius: '2px'
                  }} />
                  Refresh Settings
                </h3>

                <div>
                  <InputLabel>Auto-Refresh Interval (seconds)</InputLabel>
                  <StyledInput
                    type="number"
                    value={config.refreshInterval / 1000}
                    onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) * 1000 })}
                    min="0"
                    placeholder="0 = Manual only"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Preview */}
              <div className="section-card">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '700',
                    color: theme.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '3px',
                      height: '16px',
                      background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                      borderRadius: '2px'
                    }} />
                    Preview
                  </h3>
                  <button
                    onClick={handlePreview}
                    disabled={previewLoading}
                    className="action-btn"
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      cursor: previewLoading ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)'
                    }}
                  >
                    <Eye size={16} strokeWidth={2.5} />
                    {previewLoading ? 'Loading...' : 'Preview Data'}
                  </button>
                </div>
                <div style={{
                  background: theme.input,
                  border: `1px solid ${theme.inputBorder}`,
                  borderRadius: '12px',
                  padding: '16px',
                  minHeight: '200px'
                }}>
                  {renderPreviewChart()}
                </div>
                {previewData.length > 0 && (
                  <div style={{ 
                    marginTop: '10px', 
                    fontSize: '12px', 
                    color: theme.textMuted,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    ✓ {previewData.length} data points loaded
                  </div>
                )}
              </div>

              {/* Transformations */}
              <TransformationPanel
                transformations={config.transformations || []}
                onChange={(transforms) => setConfig({ ...config, transformations: transforms })}
                darkMode={darkMode}  
              />

              {/* Style Options */}
              <div className="section-card">
                <h3 style={{
                  margin: '0 0 18px 0',
                  fontSize: '16px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '700',
                  color: theme.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '3px',
                    height: '16px',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    borderRadius: '2px'
                  }} />
                  Style Options
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <InputLabel>Chart Colors</InputLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {[0, 1, 2, 3, 4].map((colorIdx) => (
                      <div key={colorIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ 
                          fontSize: '10px', 
                          color: theme.textMuted, 
                          textAlign: 'center',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: '600'
                        }}>
                          Y{colorIdx + 1}
                        </div>
                        <select
                          value={config.colors?.[colorIdx] || COLORS[colorIdx]}
                          onChange={(e) => {
                            const newColors = [...(config.colors || COLORS.slice(0, 5))];
                            newColors[colorIdx] = e.target.value;
                            setConfig({ ...config, colors: newColors });
                          }}
                          style={{
                            width: '100%',
                            height: '40px',
                            background: config.colors?.[colorIdx] || COLORS[colorIdx],
                            border: `2px solid ${theme.inputBorder}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'transparent'
                          }}
                        >
                          {COLORS.map(color => (
                            <option key={color} value={color} style={{ background: color }}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {(config.vizType === 'line' || config.vizType === 'area') && (
                  <div style={{ marginBottom: '16px' }}>
                    <InputLabel>Line Width: {config.lineWidth}px</InputLabel>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={config.lineWidth}
                      onChange={(e) => setConfig({ ...config, lineWidth: parseInt(e.target.value) })}
                      style={{ width: '100%', accentColor: '#6366f1' }}
                    />
                  </div>
                )}

                {config.vizType === 'area' && (
                  <div style={{ marginBottom: '16px' }}>
                    <InputLabel>Fill Opacity: {Math.round(config.fillOpacity * 100)}%</InputLabel>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.fillOpacity}
                      onChange={(e) => setConfig({ ...config, fillOpacity: parseFloat(e.target.value) })}
                      style={{ width: '100%', accentColor: '#6366f1' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: theme.textSecondary, 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.accent}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={config.showLegend}
                      onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
                    />
                    Show Legend
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: theme.textSecondary, 
                    fontSize: '14px', 
                    cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.accent}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={config.showGrid}
                      onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
                    />
                    Show Grid Lines
                  </label>
                  {(config.vizType === 'line' || config.vizType === 'area') && (
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      color: theme.textSecondary, 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.accent}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={config.showDots}
                        onChange={(e) => setConfig({ ...config, showDots: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
                      />
                      Show Data Points
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: theme.accent
        }}>
          <button
            onClick={onClose}
            className="action-btn"
            style={{
              padding: '12px 24px',
              background: theme.input,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '12px',
              color: theme.textMuted,
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(config)}
            className="action-btn"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Save size={18} strokeWidth={2.5} />
            {panel ? 'Save Changes' : 'Add Panel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PanelConfigModal;
