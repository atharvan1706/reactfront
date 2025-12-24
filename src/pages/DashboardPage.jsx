// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Plus, LogOut, Database, Activity, TrendingUp, BarChart3, PieChart as PieIcon,
  Edit2, Trash2, Copy, Play, RefreshCw, X, Gauge, Radar as RadarIcon,
  CircleDot, Table as TableIcon, AlertCircle, Settings, Save, Eye
} from 'lucide-react';
import authService from '../services/auth';
import questdbService from '../services/questdb';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const VIZ_TYPES = [
  { id: 'line', name: 'Line Chart', icon: Activity, description: 'Time series line chart' },
  { id: 'area', name: 'Area Chart', icon: TrendingUp, description: 'Filled area chart' },
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Vertical bars' },
  { id: 'pie', name: 'Pie Chart', icon: PieIcon, description: 'Circular pie chart' },
  { id: 'scatter', name: 'Scatter Plot', icon: CircleDot, description: 'X-Y scatter plot' },
  { id: 'radar', name: 'Radar Chart', icon: RadarIcon, description: 'Spider/radar chart' },
  { id: 'stat', name: 'Stat Panel', icon: Gauge, description: 'Single value display' },
  { id: 'table', name: 'Table', icon: TableIcon, description: 'Data table' }
];

// Helper: ensure config yAxis is always an array
const normalizeConfig = (cfg) => {
  const copy = { ...cfg };
  if (!Array.isArray(copy.yAxis)) {
    copy.yAxis = copy.yAxis ? [copy.yAxis] : [];
  }
  if (!copy.xAxis) copy.xAxis = copy.timestampField || '_time';
  return copy;
};

// Panel Configuration Modal
function PanelConfigModal({ panel, onSave, onClose, allTables }) {
  const initial = panel ? normalizeConfig(panel) : {
    id: `panel_${Date.now()}`,
    title: 'New Panel',
    vizType: 'line',
    dataSource: 'custom',
    query: '',
    table: '',
    timestampField: 'timestamp',
    xAxis: 'timestamp',
    yAxis: [],
    limit: 100,
    refreshInterval: 5000,
    colors: [COLORS[0]],
    showLegend: true,
    showGrid: true,
    lineWidth: 2,
    showDots: false,
    fillOpacity: 0.3,
    aggregate: 'none'
  };

  const [config, setConfig] = useState(initial);
  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);

  // Load available fields when table changes
  useEffect(() => {
    if (config.table && config.dataSource === 'table') {
      fetchTableFields(config.table);
    }
  }, [config.table, config.dataSource]);

  const fetchTableFields = async (tableName) => {
    try {
      const query = `SELECT * FROM ${tableName} LIMIT 1`;
      const result = await questdbService.query(query);
      if (result.length > 0) {
        const fields = Object.keys(result[0]);
        setAvailableFields(fields);
      } else {
        setAvailableFields([]);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
      setAvailableFields([]);
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    setPreviewError(null);

    try {
      let query = config.query;

      if (config.dataSource === 'table' && config.table) {
        const orderField = config.timestampField || config.xAxis || 'timestamp';
        // Include only requested fields if multiple selected, else select all
        const fieldsToSelect = config.xAxis && config.yAxis.length > 0
          ? [config.xAxis, ...config.yAxis].join(', ')
          : '*';
        query = `SELECT ${fieldsToSelect} FROM ${config.table} ORDER BY ${orderField} DESC LIMIT ${config.limit}`;
      }

      if (!query) {
        setPreviewError('Please enter a query or select a table');
        setPreviewLoading(false);
        return;
      }

      const result = await questdbService.query(query);
      // Try to preserve a format compatible with your charting helpers
      const formatted = questdbService.formatForChart
        ? questdbService.formatForChart(result, config.timestampField || config.xAxis)
        : result.map(r => ({ ...r }));

      setPreviewData(formatted);

      // Auto-detect fields if not set
      if (formatted.length > 0 && (!config.yAxis || config.yAxis.length === 0)) {
        const numericFields = Object.keys(formatted[0]).filter(key =>
          typeof formatted[0][key] === 'number' && !key.startsWith('_')
        );
        if (numericFields.length > 0) {
          setConfig({ ...config, yAxis: [numericFields[0]] });
        }
      }

      // populate availableFields if empty
      if (availableFields.length === 0 && result.length > 0) {
        setAvailableFields(Object.keys(result[0]));
      }
    } catch (error) {
      setPreviewError(error.message || String(error));
    }

    setPreviewLoading(false);
  };

  const renderPreviewChart = () => {
    if (previewLoading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <RefreshCw size={24} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
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

    const xKey = config.xAxis || '_time';
    const chartProps = { data: previewData, margin: { top: 5, right: 20, left: 0, bottom: 5 } };

    return (
      <ResponsiveContainer width="100%" height={200}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
            {Array.isArray(config.yAxis) && config.yAxis.map((field, idx) => (
              <Line key={field} type="monotone" dataKey={field} stroke={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} strokeWidth={config.lineWidth} dot={config.showDots} />
            ))}
          </LineChart>
        )}
        {config.vizType === 'bar' && (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
            {Array.isArray(config.yAxis) && config.yAxis.map((field, idx) => (
              <Bar key={field} dataKey={field} fill={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} />
            ))}
          </BarChart>
        )}
        {config.vizType === 'area' && (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
            {Array.isArray(config.yAxis) && config.yAxis.map((field, idx) => (
              <Area key={field} type="monotone" dataKey={field} stroke={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} fill={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} fillOpacity={config.fillOpacity} />
            ))}
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
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: '#1a1d23',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '1px solid #2d3139',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #2d3139',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0f1117'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#fff', fontWeight: '700' }}>
              {panel ? 'Edit Panel' : 'Add New Panel'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
              Configure your visualization settings
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* Left Column */}
            <div>
              {/* Panel Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
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
                    background: '#0f1117',
                    border: '1px solid #2d3139',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Visualization Type */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
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
                          background: isSelected ? '#3b82f6' : '#0f1117',
                          border: '1px solid',
                          borderColor: isSelected ? '#3b82f6' : '#2d3139',
                          borderRadius: '8px',
                          color: '#fff',
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

              {/* Data Source Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                  Data Source
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setConfig({ ...config, dataSource: 'table' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: config.dataSource === 'table' ? '#3b82f6' : '#0f1117',
                      border: '1px solid',
                      borderColor: config.dataSource === 'table' ? '#3b82f6' : '#2d3139',
                      borderRadius: '8px',
                      color: '#fff',
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
                      background: config.dataSource === 'custom' ? '#3b82f6' : '#0f1117',
                      border: '1px solid',
                      borderColor: config.dataSource === 'custom' ? '#3b82f6' : '#2d3139',
                      borderRadius: '8px',
                      color: '#fff',
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
                      background: '#0f1117',
                      border: '1px solid #2d3139',
                      borderRadius: '8px',
                      color: '#fff',
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
                    placeholder="SELECT timestamp, field1, field2 FROM your_table WHERE condition ORDER BY timestamp DESC LIMIT 100"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0f1117',
                      border: '1px solid #2d3139',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                )}
              </div>

              {/* Field Configuration */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                  Field Configuration
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#9ca3af' }}>
                      X-Axis Field
                    </label>
                    {availableFields.length > 0 ? (
                      <select
                        value={config.xAxis}
                        onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: '#0f1117',
                          border: '1px solid #2d3139',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px'
                        }}
                      >
                        <option value="_time">_time (formatted)</option>
                        {availableFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={config.xAxis}
                        onChange={(e) => setConfig({ ...config, xAxis: e.target.value })}
                        placeholder="timestamp or your field name"
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: '#0f1117',
                          border: '1px solid #2d3139',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px'
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#9ca3af' }}>
                      Value Fields (Y-Axis) — select multiple
                    </label>

                    {availableFields.length > 0 ? (
                      <div>
                        <select
                          multiple
                          value={config.yAxis}
                          onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions).map(o => o.value);
                            setConfig({ ...config, yAxis: values });
                          }}
                          style={{
                            width: '100%',
                            padding: '8px',
                            height: '120px',
                            background: '#0f1117',
                            border: '1px solid #2d3139',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '13px'
                          }}
                        >
                          {availableFields.filter(f => f !== config.xAxis).map(field => (
                            <option key={field} value={field}>{field}</option>
                          ))}
                        </select>

                        {/* Show selected as chips */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {(config.yAxis || []).map((f, i) => (
                            <div key={f} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#0b1220',
                              border: '1px solid #2d3139',
                              padding: '6px 8px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              color: '#fff'
                            }}>
                              <span style={{ width: 10, height: 10, borderRadius: 2, background: config.colors[i % config.colors.length] || COLORS[i % COLORS.length], display: 'inline-block' }} />
                              <span>{f}</span>
                              <button onClick={() => {
                                setConfig({ ...config, yAxis: config.yAxis.filter(x => x !== f) });
                              }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={(config.yAxis || []).join(',')}
                        onChange={(e) => setConfig({ ...config, yAxis: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="comma,separated,fields"
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: '#0f1117',
                          border: '1px solid #2d3139',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Limit */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                  Data Point Limit
                </label>
                <input
                  type="number"
                  value={config.limit}
                  onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value || '0') })}
                  min="10"
                  max="10000"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0f1117',
                    border: '1px solid #2d3139',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Refresh Interval */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                  Auto Refresh Interval
                </label>
                <select
                  value={config.refreshInterval}
                  onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0f1117',
                    border: '1px solid #2d3139',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                >
                  <option value={0}>No auto-refresh</option>
                  <option value={1000}>1 second</option>
                  <option value={2000}>2 seconds</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={30000}>30 seconds</option>
                  <option value={60000}>1 minute</option>
                  <option value={300000}>5 minutes</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Preview */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                    Preview
                  </label>
                  <button
                    onClick={handlePreview}
                    disabled={previewLoading}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
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
                  background: '#0f1117',
                  border: '1px solid #2d3139',
                  borderRadius: '8px',
                  padding: '16px',
                  minHeight: '200px'
                }}>
                  {renderPreviewChart()}
                </div>
                {previewData.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
                    {previewData.length} data points loaded
                  </div>
                )}
              </div>

              {/* Style Options */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#e5e7eb', fontWeight: '600' }}>
                  Style Options
                </label>

                {/* Color Picker */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#9ca3af' }}>
                    Chart Colors (will be applied in order to selected fields)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setConfig({ ...config, colors: [color] })}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: color,
                          border: config.colors[0] === color ? '2px solid #fff' : '1px solid #2d3139',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          boxShadow: config.colors[0] === color ? '0 0 0 2px #3b82f6' : 'none'
                        }}
                      />
                    ))}
                    <div style={{ color: '#9ca3af', fontSize: '12px', alignSelf: 'center' }}>Tip: first color is primary</div>
                  </div>
                </div>

                {/* Line Width (for line/area charts) */}
                {(config.vizType === 'line' || config.vizType === 'area') && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#9ca3af' }}>
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

                {/* Fill Opacity (for area charts) */}
                {config.vizType === 'area' && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#9ca3af' }}>
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

                {/* Display Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.showLegend}
                      onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Show Legend
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.showGrid}
                      onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Show Grid Lines
                  </label>
                  {(config.vizType === 'line' || config.vizType === 'area') && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb', fontSize: '13px', cursor: 'pointer' }}>
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

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #2d3139',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: '#0f1117'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#2d3139',
              border: 'none',
              borderRadius: '8px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(normalizeConfig(config))}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
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

// Panel Component with Real QuestDB Data
function QuestDBPanel({ config: rawConfig, onEdit, onDelete, onDuplicate }) {
  const config = normalizeConfig(rawConfig);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      let query = config.query;

      if (config.dataSource === 'table' && config.table) {
        const orderField = config.timestampField || config.xAxis || 'timestamp';
        const fieldsToSelect = (config.xAxis ? [config.xAxis] : ['*']).concat(config.yAxis || []).join(', ');
        // If user selected no Y fields, keep '*' to get full record
        const selectClause = (config.yAxis && config.yAxis.length > 0) ? `${config.xAxis}, ${config.yAxis.join(', ')}` : '*';
        query = `SELECT ${selectClause} FROM ${config.table} ORDER BY ${orderField} DESC LIMIT ${config.limit}`;
      }

      if (!query) {
        throw new Error('No query specified');
      }

      const result = await questdbService.query(query);
      const formatted = questdbService.formatForChart
        ? questdbService.formatForChart(result, config.timestampField || config.xAxis)
        : result.map(r => ({ ...r }));

      setData(formatted);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || String(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (config.refreshInterval > 0) {
      timerRef.current = setInterval(fetchData, config.refreshInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config)]); // refetch when config changes

  const renderChart = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#9ca3af', marginTop: '12px', fontSize: '13px' }}>Loading data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
          <div style={{
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            textAlign: 'center'
          }}>
            <AlertCircle size={32} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Error loading data</div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>{error}</div>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <Database size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ fontSize: '13px' }}>No data available</p>
          </div>
        </div>
      );
    }

    const xKey = config.xAxis || '_time';
    const chartProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (config.vizType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
              {config.showLegend && <Legend />}
              {(config.yAxis && config.yAxis.length > 0) ? config.yAxis.map((field, idx) => (
                <Line
                  key={field}
                  type="monotone"
                  dataKey={field}
                  stroke={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]}
                  strokeWidth={config.lineWidth}
                  dot={config.showDots}
                  isAnimationActive={false}
                />
              )) : <div style={{ color: '#9ca3af' }}>No Y fields selected</div>}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
              {config.showLegend && <Legend />}
              {(config.yAxis && config.yAxis.length > 0) ? config.yAxis.map((field, idx) => (
                <Area
                  key={field}
                  type="monotone"
                  dataKey={field}
                  stroke={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]}
                  fill={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]}
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.lineWidth}
                  isAnimationActive={false}
                />
              )) : <div style={{ color: '#9ca3af' }}>No Y fields selected</div>}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
              {config.showLegend && <Legend />}
              {(config.yAxis && config.yAxis.length > 0) ? config.yAxis.map((field, idx) => (
                <Bar key={field} dataKey={field} fill={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} />
              )) : <div style={{ color: '#9ca3af' }}>No Y fields selected</div>}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // For pie: use latest record and show selected Y fields as slices
        const latest = data[0] || data[data.length - 1] || {};
        const pieData = (config.yAxis && config.yAxis.length > 0) ? config.yAxis.map((field) => ({
          name: field,
          value: Number(latest[field] || 0)
        })) : [];
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        // scatter with x=selected xKey and y each selected field shown as separate Scatter series
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
              <XAxis dataKey={xKey} tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} stroke="#2d3139" />
              <Tooltip contentStyle={{ background: '#1a1d23', border: '1px solid #2d3139' }} />
              {config.showLegend && <Legend />}
              {(config.yAxis && config.yAxis.length > 0) ? config.yAxis.map((field, idx) => (
                <Scatter key={field} name={field} data={data} dataKey={field} fill={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} />
              )) : <div style={{ color: '#9ca3af' }}>No Y fields selected</div>}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        // radar: use aggregated/sliced dataset — use first N rows or calculated averages
        const radarData = data.slice(0, 8).map((row, i) => {
          const obj = { _time: row[xKey] || row._time || `r${i}` };
          (config.yAxis || []).forEach(field => {
            obj[field] = Number(row[field] || 0);
          });
          return obj;
        });
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="_time" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              {(config.yAxis || []).map((field, idx) => (
                <Radar key={field} name={field} dataKey={field} stroke={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} fill={config.colors[idx % config.colors.length] || COLORS[idx % COLORS.length]} fillOpacity={config.fillOpacity || 0.5} />
              ))}
              {config.showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'stat':
        const values = data.map(d => Number(d[config.yAxis[0]] || 0));
        const latestVal = values[0] ?? 0;
        const previous = values[1] ?? latestVal;
        const change = latestVal - previous;
        const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length) : 0;
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
              {Number(latestVal).toFixed(2)}
            </div>
            <div style={{
              fontSize: '16px',
              color: change >= 0 ? '#10b981' : '#ef4444',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)} ({previous !== 0 ? ((change / previous) * 100).toFixed(1) : '—'}%)
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#9ca3af' }}>
              <div>Min: <span style={{ color: '#fff', fontWeight: '600' }}>{(Math.min(...values) || 0).toFixed(2)}</span></div>
              <div>Max: <span style={{ color: '#fff', fontWeight: '600' }}>{(Math.max(...values) || 0).toFixed(2)}</span></div>
              <div>Avg: <span style={{ color: '#fff', fontWeight: '600' }}>{(avg || 0).toFixed(2)}</span></div>
            </div>
          </div>
        );

      case 'table':
        const columns = Object.keys(data[0] || {}).filter(key => !key.startsWith('_'));
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0f1117', position: 'sticky', top: 0, zIndex: 1 }}>
                  {columns.map(col => (
                    <th key={col} style={{
                      padding: '10px',
                      textAlign: 'left',
                      borderBottom: '1px solid #2d3139',
                      color: '#9ca3af',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #2d3139' }}>
                    {columns.map(col => (
                      <td key={col} style={{ padding: '10px', color: '#e5e7eb' }}>
                        {typeof row[col] === 'number' ? row[col].toFixed(2) : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div style={{ textAlign: 'center', color: '#9ca3af' }}>Unsupported chart type</div>;
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#1a1d23',
      border: '1px solid #2d3139',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: '#0f1117',
        borderBottom: '1px solid #2d3139',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="drag-handle" style={{
          cursor: 'move',
          fontWeight: '600',
          color: '#fff',
          fontSize: '14px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Database size={16} color={config.colors[0]} />
          {config.title}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => fetchData()} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
            onMouseEnter={(e) => e.target.style.background = '#2d3139'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => onDuplicate(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
            onMouseEnter={(e) => e.target.style.background = '#2d3139'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            title="Duplicate">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
            onMouseEnter={(e) => e.target.style.background = '#2d3139'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            title="Edit">
            <Settings size={14} />
          </button>
          <button onClick={() => onDelete(config.id)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, padding: '12px' }}>
        {renderChart()}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #2d3139',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#6b7280',
        background: '#0f1117'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Play size={10} />
            <span>{config.refreshInterval > 0 ? `${config.refreshInterval / 1000}s` : 'Manual'}</span>
          </div>
          <div>•</div>
          <div>{config.vizType}</div>
        </div>
        <div>{data.length} pts</div>
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [panels, setPanels] = useState([]);
  const [layout, setLayout] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);

  // Load available tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const result = await questdbService.getTables();
        const tableNames = result.map(row => row.table_name);
        setAvailableTables(tableNames);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);

  // Load saved dashboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_panels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPanels(parsed.panels || []);
        setLayout(parsed.layout || []);
      } catch (e) {
        console.error('Error loading dashboard:', e);
      }
    }
  }, []);

  // Save dashboard to localStorage
  useEffect(() => {
    if (panels.length > 0) {
      localStorage.setItem('dashboard_panels', JSON.stringify({ panels, layout }));
    } else {
      localStorage.removeItem('dashboard_panels');
    }
  }, [panels, layout]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleAddPanel = () => {
    setEditingPanel(null);
    setShowConfigModal(true);
  };

  const handleSavePanel = (cfg) => {
    const config = normalizeConfig(cfg);
    const exists = panels.some(p => p.id === config.id);

    if (exists) {
      setPanels(panels.map(p => p.id === config.id ? config : p));
    } else {
      setPanels([...panels, config]);
      setLayout([...layout, {
        i: config.id,
        x: (layout.length * 6) % 12,
        y: Infinity,
        w: 6,
        h: 12,
        minH: 8,
        minW: 3
      }]);
    }

    setShowConfigModal(false);
    setEditingPanel(null);
  };

  const handleEdit = (panel) => {
    setEditingPanel(panel);
    setShowConfigModal(true);
  };

  const handleDelete = (panelId) => {
    if (confirm('Are you sure you want to delete this panel?')) {
      setPanels(panels.filter(p => p.id !== panelId));
      setLayout(layout.filter(l => l.i !== panelId));
    }
  };

  const handleDuplicate = (panel) => {
    const newPanel = {
      ...panel,
      id: `panel_${Date.now()}`,
      title: `${panel.title} (Copy)`
    };
    setPanels([...panels, newPanel]);
    setLayout([...layout, {
      i: newPanel.id,
      x: (layout.length * 6) % 12,
      y: Infinity,
      w: 6,
      h: 12,
      minH: 8,
      minW: 3
    }]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e1a 0%, #080b14 100%)',
      color: '#e5e7eb'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        background: '#1a1d23',
        borderBottom: '1px solid #2d3139',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              Dashboard Studio
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Real-time QuestDB monitoring
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleAddPanel}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Plus size={16} />
            Add Panel
          </button>

          <div style={{
            padding: '8px 16px',
            background: '#0f1117',
            border: '1px solid #2d3139',
            borderRadius: '8px',                
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{ padding: '24px' }}>
        {panels.length === 0 ? (
          <div style={{
            background: '#1a1d23',
            border: '2px dashed #2d3139',
            borderRadius: '16px',
            padding: '80px 40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '80px auto'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Database size={40} color="#fff" />
            </div>
            <h3 style={{ margin: '0 0 12px', color: '#fff', fontSize: '24px', fontWeight: '700' }}>
              Welcome to Dashboard Studio
            </h3>
            <p style={{ margin: '0 0 32px', color: '#9ca3af', fontSize: '15px', lineHeight: '1.6' }}>
              Create powerful visualizations from your QuestDB data. Click the button below to add your first panel and start monitoring your metrics in real-time.
            </p>
            <button
              onClick={handleAddPanel}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Plus size={20} />
              Create Your First Panel
            </button>
          </div>
        ) : (
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            width={1200}
            onLayoutChange={setLayout}
            draggableHandle=".drag-handle"
            compactType="vertical"
          >
            {panels.map(panel => (
              <div key={panel.id}>
                <QuestDBPanel
                  config={panel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <PanelConfigModal
          panel={editingPanel}
          onSave={handleSavePanel}
          onClose={() => {
            setShowConfigModal(false);
            setEditingPanel(null);
          }}
          allTables={availableTables}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .layout {
          margin: 0 auto;
        }

        .react-grid-item.react-grid-placeholder {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
 