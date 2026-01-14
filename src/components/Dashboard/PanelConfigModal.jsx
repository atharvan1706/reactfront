import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  X as LucideX, Database, Eye, Save, RefreshCw, AlertCircle, Plus, Trash2, Settings
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
    transformations: [],
    // NEW: Axis scaling
    yAxisScale: 'auto', // 'auto', 'linear', 'log', 'custom'
    yAxisMin: '',
    yAxisMax: '',
    xAxisScale: 'auto',
    // NEW: Time range
    timeRange: 'all', // 'all', 'last', 'custom'
    timeRangeLast: '1h', // '5m', '15m', '1h', '6h', '24h', '7d', '30d'
    timeRangeStart: '',
    timeRangeEnd: '',
    // NEW: Filters
    filters: [] // [{field: '', operator: '', value: ''}]
  });

  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [activeTab, setActiveTab] = useState('data'); // 'data', 'style', 'advanced'

  // Dark mode theme
  const theme = darkMode ? {
    bg: '#1e293b',
    card: '#0f172a',
    hover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#334155',
    borderLight: '#475569',
    accent: '#667eea'
  } : {
    bg: 'white',
    card: '#f9fafb',
    hover: '#f3f4f6',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    borderLight: '#d1d5db',
    accent: '#667eea'
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

  const buildQueryWithFiltersAndTimeRange = () => {
    let query = config.query;
    
    if (config.dataSource === 'table' && config.table) {
      query = `SELECT * FROM ${config.table}`;
      
      // Add WHERE clauses for filters and time range
      const whereClauses = [];
      
      // Time range filter
      if (config.timeRange === 'last' && config.timeRangeLast) {
        const intervals = {
          '5m': '5 minutes',
          '15m': '15 minutes',
          '1h': '1 hour',
          '6h': '6 hours',
          '24h': '24 hours',
          '7d': '7 days',
          '30d': '30 days'
        };
        whereClauses.push(`${config.timestampField} >= dateadd('${intervals[config.timeRangeLast]}', -1, now())`);
      } else if (config.timeRange === 'custom' && config.timeRangeStart && config.timeRangeEnd) {
        whereClauses.push(`${config.timestampField} BETWEEN '${config.timeRangeStart}' AND '${config.timeRangeEnd}'`);
      }
      
      // Data filters
      if (config.filters && config.filters.length > 0) {
        config.filters.forEach(filter => {
          if (filter.field && filter.operator && filter.value !== '') {
            const value = isNaN(filter.value) ? `'${filter.value}'` : filter.value;
            whereClauses.push(`${filter.field} ${filter.operator} ${value}`);
          }
        });
      }
      
      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      query += ` ORDER BY ${config.timestampField} DESC LIMIT ${config.limit}`;
    }
    
    return query;
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    
    try {
      const query = buildQueryWithFiltersAndTimeRange();
      
      if (!query) {
        setPreviewError('Please enter a query or select a table');
        setPreviewLoading(false);
        return;
      }

      const result = await questdbService.query(query);
      const formatted = questdbService.formatForChart(result, config.timestampField);
      
      // Apply transformations if any
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

  const getYAxisDomain = () => {
    if (config.yAxisScale === 'custom') {
      return [
        config.yAxisMin !== '' ? parseFloat(config.yAxisMin) : 'auto',
        config.yAxisMax !== '' ? parseFloat(config.yAxisMax) : 'auto'
      ];
    }
    return ['auto', 'auto'];
  };

  const addFilter = () => {
    const newFilter = { field: '', operator: '=', value: '' };
    setConfig({
      ...config,
      filters: [...(config.filters || []), newFilter]
    });
  };

  const updateFilter = (index, key, value) => {
    const newFilters = [...config.filters];
    newFilters[index][key] = value;
    setConfig({ ...config, filters: newFilters });
  };

  const removeFilter = (index) => {
    const newFilters = config.filters.filter((_, i) => i !== index);
    setConfig({ ...config, filters: newFilters });
  };

  const renderPreviewChart = () => {
    if (previewLoading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <RefreshCw size={24} color={theme.accent} style={{ animation: 'spin 1s linear infinite' }} />
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
          color: theme.textMuted
        }}>
          Click "Preview" to test your configuration
        </div>
      );
    }

    const chartProps = { 
      data: previewData, 
      margin: { top: 5, right: 20, left: 10, bottom: 5 } 
    };
    const yFields = (config.yAxes && config.yAxes.length > 0) ? config.yAxes : [config.yAxis].filter(Boolean);
    const yDomain = getYAxisDomain();

    return (
      <ResponsiveContainer width="100%" height={200}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10 }} />
            <YAxis 
              tick={{ fill: theme.textMuted, fontSize: 10 }}
              domain={yDomain}
              scale={config.yAxisScale === 'log' ? 'log' : 'auto'}
            />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
            <Legend />
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10 }} />
            <YAxis 
              tick={{ fill: theme.textMuted, fontSize: 10 }}
              domain={yDomain}
            />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
            <Legend />
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10 }} />
            <YAxis 
              tick={{ fill: theme.textMuted, fontSize: 10 }}
              domain={yDomain}
            />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
            <Legend />
            {yFields.map((yField, idx) => (
              <Area 
                key={yField}
                type="monotone" 
                dataKey={yField} 
                stroke={getColor(idx)} 
                fill={getColor(idx)} 
                fillOpacity={config.fillOpacity}
                name={yField}
              />
            ))}
          </AreaChart>
        )}
        {config.vizType === 'pie' && (
          <PieChart>
            <Pie 
              data={previewData.slice(0, 10)} 
              dataKey={yFields[0] || config.yAxis} 
              nameKey="_time" 
              cx="50%" 
              cy="50%" 
              outerRadius={60} 
              label
            >
              {previewData.slice(0, 10).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
            <Legend />
          </PieChart>
        )}
        {config.vizType === 'scatter' && (
          <ScatterChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10 }} />
            <YAxis 
              tick={{ fill: theme.textMuted, fontSize: 10 }}
              domain={yDomain}
            />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
            <Legend />
            {yFields.map((yField, idx) => (
              <Scatter 
                key={yField}
                dataKey={yField} 
                fill={getColor(idx)}
                name={yField}
              />
            ))}
          </ScatterChart>
        )}
        {config.vizType === 'radar' && (
          <RadarChart data={previewData.slice(0, 8)}>
            <PolarGrid stroke="rgba(0,0,0,0.1)" />
            <PolarAngleAxis dataKey="_time" tick={{ fill: theme.textMuted, fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: theme.textMuted, fontSize: 10 }} />
            {yFields.map((yField, idx) => (
              <Radar 
                key={yField}
                dataKey={yField} 
                stroke={getColor(idx)} 
                fill={getColor(idx)} 
                fillOpacity={config.fillOpacity || 0.5}
                name={yField}
              />
            ))}
            <Legend />
          </RadarChart>
        )}
        {config.vizType === 'stat' && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '200px',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: getColor(0) }}>
              {previewData[previewData.length - 1]?.[yFields[0]]?.toFixed(2) || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '8px' }}>
              {yFields[0] || 'No field selected'}
            </div>
          </div>
        )}
        {config.vizType === 'table' && (
          <div style={{ height: '200px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: theme.card }}>
                  {Object.keys(previewData[0] || {}).filter(k => !k.startsWith('_')).map(col => (
                    <th key={col} style={{ 
                      padding: '6px', 
                      textAlign: 'left', 
                      borderBottom: `2px solid ${theme.border}`,
                      fontSize: '10px',
                      color: theme.text
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 5).map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {Object.keys(row).filter(k => !k.startsWith('_')).map(col => (
                      <td key={col} style={{ padding: '6px', color: theme.text }}>
                        {typeof row[col] === 'number' ? row[col].toFixed(2) : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ResponsiveContainer>
    );
  };

  const renderDataTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        {/* Panel Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
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
              background: theme.bg,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.text,
              fontSize: '14px'
            }}
          />
        </div>

        {/* Visualization Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
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
                    background: isSelected ? theme.accent : theme.card,
                    border: '2px solid',
                    borderColor: isSelected ? theme.accent : theme.border,
                    borderRadius: '8px',
                    color: isSelected ? 'white' : theme.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  {Icon && <Icon size={18} />}
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
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Data Source
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => setConfig({ ...config, dataSource: 'table' })}
              style={{
                flex: 1,
                padding: '10px',
                background: config.dataSource === 'table' ? theme.accent : theme.card,
                border: '2px solid',
                borderColor: config.dataSource === 'table' ? theme.accent : theme.border,
                borderRadius: '8px',
                color: config.dataSource === 'table' ? 'white' : theme.text,
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
                background: config.dataSource === 'custom' ? theme.accent : theme.card,
                border: '2px solid',
                borderColor: config.dataSource === 'custom' ? theme.accent : theme.border,
                borderRadius: '8px',
                color: config.dataSource === 'custom' ? 'white' : theme.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Custom SQL
            </button>
          </div>

          {config.dataSource === 'table' ? (
            <>
              <select
                value={config.table}
                onChange={(e) => setConfig({ ...config, table: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: theme.bg,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text,
                  fontSize: '14px'
                }}
              >
                <option value="">Select a table...</option>
                {allTables && allTables.length > 0 ? (
                  allTables.map(table => (
                    <option key={table} value={table}>{table}</option>
                  ))
                ) : (
                  <option value="" disabled>No tables available</option>
                )}
              </select>
            </>
          ) : (
            <textarea
              value={config.query}
              onChange={(e) => setConfig({ ...config, query: e.target.value })}
              rows={4}
              placeholder="SELECT * FROM your_table WHERE condition ORDER BY timestamp DESC LIMIT 100"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.bg,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '13px',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
          )}
        </div>

        {/* Field Configuration */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Field Configuration
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
                Timestamp Field
              </label>
              {availableFields.length > 0 ? (
                <select
                  value={config.timestampField}
                  onChange={(e) => setConfig({ ...config, timestampField: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
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
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '13px'
                  }}
                />
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
                Value Fields (Y-Axis) - Select Multiple
              </label>
              {availableFields.length > 0 ? (
                <div style={{
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  background: theme.bg,
                  maxHeight: '150px',
                  overflow: 'auto',
                  padding: '8px'
                }}>
                  {availableFields.filter(f => f !== config.timestampField).map((field) => (
                    <label 
                      key={field}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '6px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: theme.text,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.hover}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={config.yAxes?.includes(field)}
                        onChange={(e) => {
                          const newYAxes = e.target.checked
                            ? [...(config.yAxes || []), field]
                            : (config.yAxes || []).filter(y => y !== field);
                          setConfig({ ...config, yAxes: newYAxes, yAxis: newYAxes[0] || '' });
                        }}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: getColor((config.yAxes || []).indexOf(field)),
                        marginLeft: 'auto'
                      }} />
                      {field}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={(config.yAxes || []).join(', ')}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    yAxes: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    yAxis: e.target.value.split(',')[0]?.trim() || ''
                  })}
                  placeholder="value1, value2, value3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '13px'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
              Preview
            </label>
            <button
              onClick={handlePreview}
              disabled={previewLoading}
              style={{
                padding: '6px 12px',
                background: theme.accent,
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
            background: theme.card,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '16px',
            minHeight: '200px'
          }}>
            {renderPreviewChart()}
          </div>
          {previewData.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: theme.textMuted }}>
              {previewData.length} data points loaded
            </div>
          )}
        </div>

        {/* Time Range */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Time Range
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            {['all', 'last', 'custom'].map(range => (
              <button
                key={range}
                onClick={() => setConfig({ ...config, timeRange: range })}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: config.timeRange === range ? theme.accent : theme.card,
                  border: '2px solid',
                  borderColor: config.timeRange === range ? theme.accent : theme.border,
                  borderRadius: '6px',
                  color: config.timeRange === range ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}
              >
                {range}
              </button>
            ))}
          </div>
          
          {config.timeRange === 'last' && (
            <select
              value={config.timeRangeLast}
              onChange={(e) => setConfig({ ...config, timeRangeLast: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                background: theme.bg,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.text,
                fontSize: '13px'
              }}
            >
              <option value="5m">Last 5 minutes</option>
              <option value="15m">Last 15 minutes</option>
              <option value="1h">Last 1 hour</option>
              <option value="6h">Last 6 hours</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          )}
          
          {config.timeRange === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted }}>
                  Start
                </label>
                <input
                  type="datetime-local"
                  value={config.timeRangeStart}
                  onChange={(e) => setConfig({ ...config, timeRangeStart: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '12px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted }}>
                  End
                </label>
                <input
                  type="datetime-local"
                  value={config.timeRangeEnd}
                  onChange={(e) => setConfig({ ...config, timeRangeEnd: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Data Filters */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
              Data Filters
            </label>
            <button
              onClick={addFilter}
              style={{
                padding: '6px 12px',
                background: theme.card,
                border: `2px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.text,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              Add Filter
            </button>
          </div>
          
          {config.filters && config.filters.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.filters.map((filter, idx) => (
                <div key={idx} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 0.8fr 1fr auto', 
                  gap: '8px',
                  padding: '8px',
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px'
                }}>
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                    style={{
                      padding: '6px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.text,
                      fontSize: '12px'
                    }}
                  >
                    <option value="">Select field...</option>
                    {availableFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                    style={{
                      padding: '6px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.text,
                      fontSize: '12px'
                    }}
                  >
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                    <option value="LIKE">LIKE</option>
                  </select>
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                    placeholder="Value..."
                    style={{
                      padding: '6px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.text,
                      fontSize: '12px'
                    }}
                  />
                  <button
                    onClick={() => removeFilter(idx)}
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '16px', 
              textAlign: 'center', 
              color: theme.textMuted,
              fontSize: '12px',
              background: theme.card,
              border: `1px dashed ${theme.border}`,
              borderRadius: '6px'
            }}>
              No filters applied. Click "Add Filter" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        {/* Axis Scaling */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Y-Axis Scaling
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {['auto', 'linear', 'log', 'custom'].map(scale => (
              <button
                key={scale}
                onClick={() => setConfig({ ...config, yAxisScale: scale })}
                style={{
                  padding: '8px',
                  background: config.yAxisScale === scale ? theme.accent : theme.card,
                  border: '2px solid',
                  borderColor: config.yAxisScale === scale ? theme.accent : theme.border,
                  borderRadius: '6px',
                  color: config.yAxisScale === scale ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}
              >
                {scale}
              </button>
            ))}
          </div>
          
          {config.yAxisScale === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted }}>
                  Min Value
                </label>
                <input
                  type="number"
                  value={config.yAxisMin}
                  onChange={(e) => setConfig({ ...config, yAxisMin: e.target.value })}
                  placeholder="Auto"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '13px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: theme.textMuted }}>
                  Max Value
                </label>
                <input
                  type="number"
                  value={config.yAxisMax}
                  onChange={(e) => setConfig({ ...config, yAxisMax: e.target.value })}
                  placeholder="Auto"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.text,
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Panel Size */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Panel Size
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
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
                  background: theme.bg,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
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
                  background: theme.bg,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: '13px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Data Limit & Refresh */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
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
                background: theme.bg,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
              Auto Refresh
            </label>
            <select
              value={config.refreshInterval}
              onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.bg,
                border: `2px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text,
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

      <div>
        {/* Transformations */}
        <TransformationPanel
          transformations={config.transformations || []}
          onChange={(transforms) => setConfig({ ...config, transformations: transforms })}
          darkMode={darkMode}  
        />
      </div>
    </div>
  );

  const renderStyleTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        {/* Chart Colors */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Chart Colors
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[0, 1, 2, 3, 4].map((colorIdx) => (
              <div key={colorIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '10px', color: theme.textMuted, textAlign: 'center' }}>Y{colorIdx + 1}</div>
                <select
                  value={config.colors?.[colorIdx] || COLORS[colorIdx]}
                  onChange={(e) => {
                    const newColors = [...(config.colors || COLORS.slice(0, 5))];
                    newColors[colorIdx] = e.target.value;
                    setConfig({ ...config, colors: newColors });
                  }}
                  style={{
                    width: '100%',
                    height: '36px',
                    background: config.colors?.[colorIdx] || COLORS[colorIdx],
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
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

        {/* Line/Area Specific Options */}
        {(config.vizType === 'line' || config.vizType === 'area') && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
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
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
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
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
              style={{ width: '16px', height: '16px' }}
            />
            Show Legend
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
              style={{ width: '16px', height: '16px' }}
            />
            Show Grid Lines
          </label>
          {(config.vizType === 'line' || config.vizType === 'area') && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '13px', cursor: 'pointer' }}>
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

      <div>
        {/* Preview in Style Tab */}
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            Style Preview
          </label>
          <div style={{
            background: theme.card,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '16px',
            minHeight: '300px'
          }}>
            {renderPreviewChart()}
          </div>
        </div>
      </div>
    </div>
  );

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
        background: theme.bg,
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: theme.card
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: theme.text, fontWeight: '700' }}>
              {panel ? 'Edit Panel' : 'Add New Panel'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: theme.textMuted }}>
              Configure your visualization settings
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            padding: '8px'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '16px 24px 0',
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bg
        }}>
          {[
            { id: 'data', label: 'Data & Filters', icon: Database },
            { id: 'style', label: 'Style', icon: Eye },
            { id: 'advanced', label: 'Advanced', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 20px',
                  background: activeTab === tab.id ? theme.card : 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? theme.accent : 'transparent'}`,
                  color: activeTab === tab.id ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {activeTab === 'data' && renderDataTab()}
          {activeTab === 'style' && renderStyleTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: theme.card
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: theme.bg,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.textMuted,
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
