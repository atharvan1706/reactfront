// PanelConfigModal.jsx - ENHANCED WITH GRAFANA-LIKE AXIS CONFIGURATIONS
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  X as LucideX, Database, Eye, Save, RefreshCw, AlertCircle, Plus, Trash2, Settings, Globe,
  AlignLeft, RotateCw, Hash, Type
} from 'lucide-react';

import { COLORS, VIZ_TYPES, DEFAULT_PANEL_CONFIG } from './constants';
import questdbService from '../../services/questdb';

import SimpleTransformations from './simpleTransformations';
import TransformationPanel from './TransformationPanel';

const X = LucideX;

// Timezone options
const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'local', label: 'Local Browser Time' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

// Number format presets
const NUMBER_FORMATS = [
  { value: 'none', label: 'None', example: '1234.567' },
  { value: 'number', label: 'Number', example: '1,234.57' },
  { value: 'percent', label: 'Percent (0-100)', example: '12.35%' },
  { value: 'percent_decimal', label: 'Percent (0-1)', example: '0.12%' },
  { value: 'scientific', label: 'Scientific', example: '1.23e+3' },
  { value: 'bytes', label: 'Bytes', example: '1.21 KB' },
  { value: 'bits', label: 'Bits', example: '9.87 Kbit' },
  { value: 'bps', label: 'Bits/sec', example: '9.87 Kbps' },
  { value: 'Bps', label: 'Bytes/sec', example: '1.21 KB/s' },
  { value: 'duration_ms', label: 'Duration (ms)', example: '1m 23s' },
  { value: 'duration_s', label: 'Duration (s)', example: '20m 34s' },
  { value: 'currency_usd', label: 'Currency (USD)', example: '$1,234.57' },
  { value: 'currency_eur', label: 'Currency (EUR)', example: '€1,234.57' },
  { value: 'custom', label: 'Custom Format', example: 'Custom' }
];

// Axis label rotation options
const LABEL_ROTATIONS = [
  { value: 0, label: 'Horizontal (0°)' },
  { value: -45, label: 'Diagonal (-45°)' },
  { value: -90, label: 'Vertical (-90°)' },
  { value: 45, label: 'Diagonal (45°)' },
  { value: 90, label: 'Vertical (90°)' }
];

function PanelConfigModal({ panel, onSave, onClose, allTables, darkMode }) {
  // ✅ ENHANCED: Added axis configuration fields
  const [config, setConfig] = useState(() => {
    if (panel) {
      return {
        ...DEFAULT_PANEL_CONFIG,
        ...panel,
        timezone: panel.timezone || 'UTC',
        yAxisScale: panel.yAxisScale || 'auto',
        yAxisMin: panel.yAxisMin || '',
        yAxisMax: panel.yAxisMax || '',
        xAxisScale: panel.xAxisScale || 'auto',
        timeRange: panel.timeRange || 'all',
        timeRangeLast: panel.timeRangeLast || '1h',
        timeRangeStart: panel.timeRangeStart || '',
        timeRangeEnd: panel.timeRangeEnd || '',
        filters: panel.filters || [],
        transformations: panel.transformations || [],
        
        // ✅ NEW: Advanced Axis Configurations
        xAxisLabel: panel.xAxisLabel || '',
        yAxisLabel: panel.yAxisLabel || '',
        xAxisLabelRotation: panel.xAxisLabelRotation ?? 0,
        yAxisLabelRotation: panel.yAxisLabelRotation ?? 0,
        xAxisTickRotation: panel.xAxisTickRotation ?? 0,
        yAxisTickRotation: panel.yAxisTickRotation ?? 0,
        xAxisShowLabel: panel.xAxisShowLabel ?? true,
        yAxisShowLabel: panel.yAxisShowLabel ?? true,
        xAxisShowTicks: panel.xAxisShowTicks ?? true,
        yAxisShowTicks: panel.yAxisShowTicks ?? true,
        
        // Number formatting
        yAxisNumberFormat: panel.yAxisNumberFormat || 'number',
        yAxisDecimals: panel.yAxisDecimals ?? 2,
        yAxisUnit: panel.yAxisUnit || '',
        yAxisUnitPosition: panel.yAxisUnitPosition || 'suffix', // 'prefix' or 'suffix'
        yAxisCustomFormat: panel.yAxisCustomFormat || '',
        
        // Comma separated values
        yAxisUseCommas: panel.yAxisUseCommas ?? true,
        
        // Axis width/position
        yAxisWidth: panel.yAxisWidth || 'auto',
        yAxisPosition: panel.yAxisPosition || 'left', // 'left' or 'right'
        
        // Grid customization
        gridStrokeDashArray: panel.gridStrokeDashArray || '3 3',
        gridOpacity: panel.gridOpacity ?? 0.1,
        
        // Tick customization
        xAxisTickCount: panel.xAxisTickCount || 'auto',
        yAxisTickCount: panel.yAxisTickCount || 'auto',
        xAxisTickInterval: panel.xAxisTickInterval || 'auto',
        
        // Label styling
        xAxisLabelFontSize: panel.xAxisLabelFontSize || 12,
        yAxisLabelFontSize: panel.yAxisLabelFontSize || 12,
        xAxisTickFontSize: panel.xAxisTickFontSize || 11,
        yAxisTickFontSize: panel.yAxisTickFontSize || 11
      };
    } else {
      return {
        ...DEFAULT_PANEL_CONFIG,
        id: `panel_${Date.now()}`,
        colors: [COLORS[0], COLORS[1], COLORS[2], COLORS[3], COLORS[4]],
        transformations: [],
        timezone: 'UTC',
        yAxisScale: 'auto',
        yAxisMin: '',
        yAxisMax: '',
        xAxisScale: 'auto',
        timeRange: 'all',
        timeRangeLast: '1h',
        timeRangeStart: '',
        timeRangeEnd: '',
        filters: [],
        
        // ✅ NEW: Default axis configurations
        xAxisLabel: '',
        yAxisLabel: '',
        xAxisLabelRotation: 0,
        yAxisLabelRotation: 0,
        xAxisTickRotation: 0,
        yAxisTickRotation: 0,
        xAxisShowLabel: true,
        yAxisShowLabel: true,
        xAxisShowTicks: true,
        yAxisShowTicks: true,
        yAxisNumberFormat: 'number',
        yAxisDecimals: 2,
        yAxisUnit: '',
        yAxisUnitPosition: 'suffix',
        yAxisCustomFormat: '',
        yAxisUseCommas: true,
        yAxisWidth: 'auto',
        yAxisPosition: 'left',
        gridStrokeDashArray: '3 3',
        gridOpacity: 0.1,
        xAxisTickCount: 'auto',
        yAxisTickCount: 'auto',
        xAxisTickInterval: 'auto',
        xAxisLabelFontSize: 12,
        yAxisLabelFontSize: 12,
        xAxisTickFontSize: 11,
        yAxisTickFontSize: 11
      };
    }
  });

  const [previewData, setPreviewData] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [activeTab, setActiveTab] = useState('data');

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
    console.log('📝 Config updated:', config);
  }, [config]);

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
      
      const whereClauses = [];
      
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
        whereClauses.push(`${config.timestampField} BETWEEN timestamp('${config.timeRangeStart}:00') AND timestamp('${config.timeRangeEnd}:00')`);
      }
      
      if (config.filters && config.filters.length > 0) {
        config.filters.forEach(filter => {
          if (filter.field && filter.operator && filter.value !== '') {
            const isNumber = !isNaN(parseFloat(filter.value)) && isFinite(filter.value);
            const value = isNumber ? filter.value : `'${filter.value.replace(/'/g, "''")}'`;
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

  // ✅ NEW: Format number based on configuration
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    
    const num = parseFloat(value);
    
    switch (config.yAxisNumberFormat) {
      case 'none':
        return value.toString();
        
      case 'number':
        if (config.yAxisUseCommas) {
          const formatted = num.toFixed(config.yAxisDecimals);
          const parts = formatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return parts.join('.');
        }
        return num.toFixed(config.yAxisDecimals);
        
      case 'percent':
        return `${(num).toFixed(config.yAxisDecimals)}%`;
        
      case 'percent_decimal':
        return `${(num * 100).toFixed(config.yAxisDecimals)}%`;
        
      case 'scientific':
        return num.toExponential(config.yAxisDecimals);
        
      case 'bytes':
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let size = Math.abs(num);
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
        return `${size.toFixed(config.yAxisDecimals)} ${units[unitIndex]}`;
        
      case 'bits':
        const bitUnits = ['bit', 'Kbit', 'Mbit', 'Gbit', 'Tbit', 'Pbit'];
        let bits = Math.abs(num);
        let bitUnitIndex = 0;
        while (bits >= 1000 && bitUnitIndex < bitUnits.length - 1) {
          bits /= 1000;
          bitUnitIndex++;
        }
        return `${bits.toFixed(config.yAxisDecimals)} ${bitUnits[bitUnitIndex]}`;
        
      case 'bps':
        const bpsUnits = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
        let bps = Math.abs(num);
        let bpsUnitIndex = 0;
        while (bps >= 1000 && bpsUnitIndex < bpsUnits.length - 1) {
          bps /= 1000;
          bpsUnitIndex++;
        }
        return `${bps.toFixed(config.yAxisDecimals)} ${bpsUnits[bpsUnitIndex]}`;
        
      case 'Bps':
        const BpsUnits = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
        let Bps = Math.abs(num);
        let BpsUnitIndex = 0;
        while (Bps >= 1024 && BpsUnitIndex < BpsUnits.length - 1) {
          Bps /= 1024;
          BpsUnitIndex++;
        }
        return `${Bps.toFixed(config.yAxisDecimals)} ${BpsUnits[BpsUnitIndex]}`;
        
      case 'duration_ms':
        const totalSeconds = Math.floor(num / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
        
      case 'duration_s':
        const h = Math.floor(num / 3600);
        const m = Math.floor((num % 3600) / 60);
        const s = Math.floor(num % 60);
        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
        
      case 'currency_usd':
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: config.yAxisDecimals, maximumFractionDigits: config.yAxisDecimals })}`;
        
      case 'currency_eur':
        return `€${num.toLocaleString('en-US', { minimumFractionDigits: config.yAxisDecimals, maximumFractionDigits: config.yAxisDecimals })}`;
        
      case 'custom':
        if (config.yAxisCustomFormat) {
          try {
            return config.yAxisCustomFormat.replace('{value}', num.toFixed(config.yAxisDecimals));
          } catch (e) {
            return num.toFixed(config.yAxisDecimals);
          }
        }
        return num.toFixed(config.yAxisDecimals);
        
      default:
        return num.toFixed(config.yAxisDecimals);
    }
  };

  // ✅ NEW: Format tick value with unit
  const formatTickValue = (value) => {
    const formatted = formatNumber(value);
    
    if (config.yAxisUnit) {
      if (config.yAxisUnitPosition === 'prefix') {
        return `${config.yAxisUnit}${formatted}`;
      } else {
        return `${formatted}${config.yAxisUnit}`;
      }
    }
    
    return formatted;
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
      const formatted = questdbService.formatForChart(result, config.timestampField, config.timezone);
      
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
      console.error('Query error:', error);
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
      const min = config.yAxisMin !== '' ? parseFloat(config.yAxisMin) : 'auto';
      const max = config.yAxisMax !== '' ? parseFloat(config.yAxisMax) : 'auto';
      return [min, max];
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

    // ✅ ENHANCED: Apply axis configurations
    const xAxisConfig = {
      dataKey: "_time",
      tick: config.xAxisShowTicks ? { 
        fill: theme.textMuted, 
        fontSize: config.xAxisTickFontSize,
        angle: config.xAxisTickRotation,
        textAnchor: config.xAxisTickRotation !== 0 ? 'end' : 'middle'
      } : false,
      label: config.xAxisShowLabel && config.xAxisLabel ? {
        value: config.xAxisLabel,
        position: 'insideBottom',
        offset: -5,
        fontSize: config.xAxisLabelFontSize,
        angle: config.xAxisLabelRotation
      } : undefined,
      tickCount: config.xAxisTickCount !== 'auto' ? parseInt(config.xAxisTickCount) : undefined,
      interval: config.xAxisTickInterval !== 'auto' ? parseInt(config.xAxisTickInterval) : undefined
    };

    const yAxisConfig = {
      tick: config.yAxisShowTicks ? { 
        fill: theme.textMuted, 
        fontSize: config.yAxisTickFontSize,
        angle: config.yAxisTickRotation,
        textAnchor: config.yAxisTickRotation !== 0 ? 'end' : 'end'
      } : false,
      tickFormatter: formatTickValue,
      label: config.yAxisShowLabel && config.yAxisLabel ? {
        value: config.yAxisLabel,
        angle: -90,
        position: 'insideLeft',
        fontSize: config.yAxisLabelFontSize,
        angle: config.yAxisLabelRotation !== 0 ? config.yAxisLabelRotation : -90
      } : undefined,
      domain: yDomain,
      scale: config.yAxisScale === 'log' ? 'log' : config.yAxisScale === 'linear' ? 'linear' : 'auto',
      width: config.yAxisWidth !== 'auto' ? parseInt(config.yAxisWidth) : undefined,
      orientation: config.yAxisPosition,
      tickCount: config.yAxisTickCount !== 'auto' ? parseInt(config.yAxisTickCount) : undefined
    };

    const gridConfig = config.showGrid ? {
      strokeDasharray: config.gridStrokeDashArray,
      stroke: `rgba(0,0,0,${config.gridOpacity})`
    } : false;

    return (
      <ResponsiveContainer width="100%" height={200}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            {gridConfig && <CartesianGrid {...gridConfig} />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
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
            {gridConfig && <CartesianGrid {...gridConfig} />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
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
            {gridConfig && <CartesianGrid {...gridConfig} />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
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
                strokeWidth={config.lineWidth}
                name={yField}
              />
            ))}
          </AreaChart>
        )}
        {/* Other chart types remain the same */}
      </ResponsiveContainer>
    );
  };

  const renderDataTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Left column - same as before */}
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

        {/* Timezone Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: theme.textSecondary, fontWeight: '600' }}>
            <Globe size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Timezone Display
          </label>
          <select
            value={config.timezone || 'UTC'}
            onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
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
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
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

  const renderAxisTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div>
        {/* ✅ X-AXIS CONFIGURATION */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          background: theme.card, 
          borderRadius: '8px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            fontWeight: '700', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlignLeft size={16} />
            X-Axis Configuration
          </h3>

          {/* X-Axis Label */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
              Axis Label
            </label>
            <input
              type="text"
              value={config.xAxisLabel}
              onChange={(e) => setConfig({ ...config, xAxisLabel: e.target.value })}
              placeholder="e.g., Time"
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

          {/* X-Axis Label Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Label Font Size
              </label>
              <input
                type="number"
                value={config.xAxisLabelFontSize}
                onChange={(e) => setConfig({ ...config, xAxisLabelFontSize: parseInt(e.target.value) || 12 })}
                min="8"
                max="24"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Label Rotation
              </label>
              <select
                value={config.xAxisLabelRotation}
                onChange={(e) => setConfig({ ...config, xAxisLabelRotation: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              >
                {LABEL_ROTATIONS.map(rot => (
                  <option key={rot.value} value={rot.value}>{rot.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* X-Axis Tick Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Tick Font Size
              </label>
              <input
                type="number"
                value={config.xAxisTickFontSize}
                onChange={(e) => setConfig({ ...config, xAxisTickFontSize: parseInt(e.target.value) || 11 })}
                min="6"
                max="18"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Tick Rotation
              </label>
              <select
                value={config.xAxisTickRotation}
                onChange={(e) => setConfig({ ...config, xAxisTickRotation: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              >
                {LABEL_ROTATIONS.map(rot => (
                  <option key={rot.value} value={rot.value}>{rot.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* X-Axis Advanced Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Tick Count
              </label>
              <input
                type="text"
                value={config.xAxisTickCount}
                onChange={(e) => setConfig({ ...config, xAxisTickCount: e.target.value })}
                placeholder="auto"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Tick Interval
              </label>
              <input
                type="text"
                value={config.xAxisTickInterval}
                onChange={(e) => setConfig({ ...config, xAxisTickInterval: e.target.value })}
                placeholder="auto"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          {/* X-Axis Visibility Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.xAxisShowLabel}
                onChange={(e) => setConfig({ ...config, xAxisShowLabel: e.target.checked })}
                style={{ width: '14px', height: '14px' }}
              />
              Show Axis Label
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.xAxisShowTicks}
                onChange={(e) => setConfig({ ...config, xAxisShowTicks: e.target.checked })}
                style={{ width: '14px', height: '14px' }}
              />
              Show Tick Labels
            </label>
          </div>
        </div>

        {/* ✅ GRID CONFIGURATION */}
        <div style={{ 
          padding: '16px', 
          background: theme.card, 
          borderRadius: '8px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            fontWeight: '700', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Hash size={16} />
            Grid Configuration
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
              Stroke Pattern (e.g., "3 3" for dashed)
            </label>
            <input
              type="text"
              value={config.gridStrokeDashArray}
              onChange={(e) => setConfig({ ...config, gridStrokeDashArray: e.target.value })}
              placeholder="3 3"
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
            <div style={{ marginTop: '4px', fontSize: '10px', color: theme.textMuted }}>
              Examples: "3 3" (dashed), "1 0" (solid), "5 10" (long dash), "0 0" (hidden)
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
              Grid Opacity: {Math.round(config.gridOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.gridOpacity}
              onChange={(e) => setConfig({ ...config, gridOpacity: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Y-Axis Configuration */}
      <div>
        {/* ✅ Y-AXIS CONFIGURATION */}
        <div style={{ 
          padding: '16px', 
          background: theme.card, 
          borderRadius: '8px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            fontWeight: '700', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <RotateCw size={16} />
            Y-Axis Configuration
          </h3>

          {/* Y-Axis Label */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
              Axis Label
            </label>
            <input
              type="text"
              value={config.yAxisLabel}
              onChange={(e) => setConfig({ ...config, yAxisLabel: e.target.value })}
              placeholder="e.g., Value, Temperature, Count"
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

          {/* Y-Axis Number Format */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: theme.textMuted }}>
              <Type size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Number Format
            </label>
            <select
              value={config.yAxisNumberFormat}
              onChange={(e) => setConfig({ ...config, yAxisNumberFormat: e.target.value })}
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
              {NUMBER_FORMATS.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label} - {format.example}
                </option>
              ))}
            </select>
          </div>

          {/* Decimals and Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Decimal Places
              </label>
              <input
                type="number"
                value={config.yAxisDecimals}
                onChange={(e) => setConfig({ ...config, yAxisDecimals: parseInt(e.target.value) || 0 })}
                min="0"
                max="10"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '11px', color: theme.textMuted, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.yAxisUseCommas}
                  onChange={(e) => setConfig({ ...config, yAxisUseCommas: e.target.checked })}
                  style={{ width: '14px', height: '14px' }}
                />
                Use Commas (1,000)
              </label>
            </div>
          </div>

          {/* Custom Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Custom Unit
              </label>
              <input
                type="text"
                value={config.yAxisUnit}
                onChange={(e) => setConfig({ ...config, yAxisUnit: e.target.value })}
                placeholder="e.g., °C, MB, rpm"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Position
              </label>
              <select
                value={config.yAxisUnitPosition}
                onChange={(e) => setConfig({ ...config, yAxisUnitPosition: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              >
                <option value="prefix">Prefix</option>
                <option value="suffix">Suffix</option>
              </select>
            </div>
          </div>

          {/* Custom Format String (for custom format type) */}
          {config.yAxisNumberFormat === 'custom' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Custom Format String (use {'{value}'} as placeholder)
              </label>
              <input
                type="text"
                value={config.yAxisCustomFormat}
                onChange={(e) => setConfig({ ...config, yAxisCustomFormat: e.target.value })}
                placeholder="e.g., {value} units"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
            </div>
          )}

          {/* Y-Axis Label & Tick Styling */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Label Font Size
              </label>
              <input
                type="number"
                value={config.yAxisLabelFontSize}
                onChange={(e) => setConfig({ ...config, yAxisLabelFontSize: parseInt(e.target.value) || 12 })}
                min="8"
                max="24"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Tick Font Size
              </label>
              <input
                type="number"
                value={config.yAxisTickFontSize}
                onChange={(e) => setConfig({ ...config, yAxisTickFontSize: parseInt(e.target.value) || 11 })}
                min="6"
                max="18"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          {/* Y-Axis Advanced Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Width
              </label>
              <input
                type="text"
                value={config.yAxisWidth}
                onChange={(e) => setConfig({ ...config, yAxisWidth: e.target.value })}
                placeholder="auto"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Position
              </label>
              <select
                value={config.yAxisPosition}
                onChange={(e) => setConfig({ ...config, yAxisPosition: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', color: theme.textMuted }}>
                Tick Count
              </label>
              <input
                type="text"
                value={config.yAxisTickCount}
                onChange={(e) => setConfig({ ...config, yAxisTickCount: e.target.value })}
                placeholder="auto"
                style={{
                  width: '100%',
                  padding: '6px',
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '4px',
                  color: theme.text,
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          {/* Y-Axis Visibility Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.yAxisShowLabel}
                onChange={(e) => setConfig({ ...config, yAxisShowLabel: e.target.checked })}
                style={{ width: '14px', height: '14px' }}
              />
              Show Axis Label
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.yAxisShowTicks}
                onChange={(e) => setConfig({ ...config, yAxisShowTicks: e.target.checked })}
                style={{ width: '14px', height: '14px' }}
              />
              Show Tick Labels
            </label>
          </div>

          {/* Format Preview */}
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: theme.bg, 
            borderRadius: '6px',
            border: `1px dashed ${theme.border}`
          }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>
              Format Preview:
            </div>
            <div style={{ fontSize: '14px', color: theme.text, fontWeight: '600', fontFamily: 'monospace' }}>
              {formatTickValue(1234.567)}
            </div>
          </div>
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

        {/* ✅ ENHANCED: Added Axes tab */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '16px 24px 0',
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bg
        }}>
          {[
            { id: 'data', label: 'Data & Filters', icon: Database },
            { id: 'axes', label: 'Axes & Format', icon: AlignLeft },
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
          {activeTab === 'axes' && renderAxisTab()}
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
            onClick={() => {
              console.log('💾 Saving config with axes:', config);
              onSave(config);
            }}
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
