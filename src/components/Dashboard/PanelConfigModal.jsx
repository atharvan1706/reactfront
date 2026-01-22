// PanelConfigModal.jsx - REFINED MINIMAL PREMIUM DESIGN
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// ✅ FIX 2: Legend position options
const LEGEND_POSITIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

// ✅ FIX 1: Move Input/Select OUTSIDE component to prevent recreation
const Input = React.memo(({ label, value, onChange, placeholder, type = "text", theme, ...props }) => (
  <div style={{ marginBottom: '12px' }}>
    {label && (
      <label style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '11px', 
        fontWeight: '500',
        color: theme.textMuted,
        letterSpacing: '0.02em'
      }}>
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '8px 10px',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '6px',
        color: theme.text,
        fontSize: '13px',
        transition: 'all 0.15s ease',
        outline: 'none',
        ...props.style
      }}
      onFocus={(e) => e.target.style.borderColor = theme.accent}
      onBlur={(e) => e.target.style.borderColor = theme.border}
      {...props}
    />
  </div>
));

const Select = React.memo(({ label, value, onChange, children, theme, ...props }) => (
  <div style={{ marginBottom: '12px' }}>
    {label && (
      <label style={{ 
        display: 'block', 
        marginBottom: '6px', 
        fontSize: '11px', 
        fontWeight: '500',
        color: theme.textMuted,
        letterSpacing: '0.02em'
      }}>
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '8px 10px',
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: '6px',
        color: theme.text,
        fontSize: '13px',
        transition: 'all 0.15s ease',
        outline: 'none',
        cursor: 'pointer',
        ...props.style
      }}
      onFocus={(e) => e.target.style.borderColor = theme.accent}
      onBlur={(e) => e.target.style.borderColor = theme.border}
      {...props}
    >
      {children}
    </select>
  </div>
));

function PanelConfigModal({ panel, onSave, onClose, allTables, darkMode }) {
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
      //  legendPosition: panel.legendPosition || 'top', // ✅ ADD THIS
        
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
        
        yAxisNumberFormat: panel.yAxisNumberFormat || 'number',
        yAxisDecimals: panel.yAxisDecimals ?? 2,
        yAxisUnit: panel.yAxisUnit || '',
        yAxisUnitPosition: panel.yAxisUnitPosition || 'suffix',
        yAxisCustomFormat: panel.yAxisCustomFormat || '',
        
        yAxisUseCommas: panel.yAxisUseCommas ?? true,
        
        yAxisWidth: panel.yAxisWidth || 'auto',
        yAxisPosition: panel.yAxisPosition || 'left',
        
        gridStrokeDashArray: panel.gridStrokeDashArray || '3 3',
        gridOpacity: panel.gridOpacity ?? 0.1,
        
        xAxisTickCount: panel.xAxisTickCount || 'auto',
        yAxisTickCount: panel.yAxisTickCount || 'auto',
        xAxisTickInterval: panel.xAxisTickInterval || 'auto',
        
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
        dataSource: 'table',
       // legendPosition: 'top', // ✅ ADD THIS
        
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

  // ✅ Memoize theme to prevent recreation
  const theme = useMemo(() => darkMode ? {
    bg: '#0f172a',
    card: '#1e293b',
    cardHover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#334155',
    borderLight: '#475569',
    accent: '#6366f1',
    accentHover: '#4f46e5',
    shadow: '0 1px 3px rgba(0,0,0,0.3)',
    shadowMd: '0 4px 12px rgba(0,0,0,0.4)',
    shadowLg: '0 10px 40px rgba(0,0,0,0.5)'
  } : {
    bg: '#ffffff',
    card: '#f8fafc',
    cardHover: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#e2e8f0',
    borderLight: '#cbd5e1',
    accent: '#6366f1',
    accentHover: '#4f46e5',
    shadow: '0 1px 2px rgba(0,0,0,0.05)',
    shadowMd: '0 4px 6px rgba(0,0,0,0.07)',
    shadowLg: '0 20px 25px rgba(0,0,0,0.1)'
  }, [darkMode]);

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

  const buildQueryWithFiltersAndTimeRange = useCallback(() => {
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
        
        const interval = intervals[config.timeRangeLast];
        if (interval) {
          whereClauses.push(
            `${config.timestampField} >= dateadd('${interval}', -1, now())`
          );
        }
      }
      
      else if (config.timeRange === 'custom' && config.timeRangeStart && config.timeRangeEnd) {
        whereClauses.push(
          `${config.timestampField} BETWEEN cast('${config.timeRangeStart}:00' as timestamp) AND cast('${config.timeRangeEnd}:00' as timestamp)`
        );
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
  }, [config]);

  const formatNumber = useCallback((value) => {
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
  }, [config]);

  const formatTickValue = useCallback((value) => {
    const formatted = formatNumber(value);
    
    if (config.yAxisUnit) {
      if (config.yAxisUnitPosition === 'prefix') {
        return `${config.yAxisUnit}${formatted}`;
      } else {
        return `${formatted}${config.yAxisUnit}`;
      }
    }
    
    return formatted;
  }, [formatNumber, config]);

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

  const getColor = useCallback((idx) => {
    if (config.colors && config.colors.length > idx && config.colors[idx]) {
      return config.colors[idx];
    }
    return COLORS[idx % COLORS.length];
  }, [config.colors]);

  const getYAxisDomain = useCallback(() => {
    if (config.yAxisScale === 'custom') {
      const min = config.yAxisMin !== '' ? parseFloat(config.yAxisMin) : 'auto';
      const max = config.yAxisMax !== '' ? parseFloat(config.yAxisMax) : 'auto';
      return [min, max];
    }
    return ['auto', 'auto'];
  }, [config]);

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
          <RefreshCw size={20} color={theme.accent} style={{ animation: 'spin 1s linear infinite' }} />
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
          padding: '20px',
          fontSize: '13px'
        }}>
          <div>
            <AlertCircle size={24} style={{ marginBottom: '8px' }} />
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
          color: theme.textMuted,
          fontSize: '13px'
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

    // ✅ Legend config based on position
    const legendConfig = config.showLegend ? {
      wrapperStyle: { 
        color: theme.text, 
        fontSize: '11px',
        paddingTop: config.legendPosition === 'top' ? '5px' : '0',
        paddingBottom: config.legendPosition === 'bottom' ? '5px' : '0'
      },
      layout: (config.legendPosition === 'left' || config.legendPosition === 'right') 
        ? 'vertical' 
        : 'horizontal',
      verticalAlign: (config.legendPosition === 'top' || config.legendPosition === 'bottom') 
        ? config.legendPosition 
        : 'middle',
      align: (config.legendPosition === 'left' || config.legendPosition === 'right') 
        ? config.legendPosition 
        : 'center',
      iconSize: 8
    } : null;

    return (
      <ResponsiveContainer width="100%" height={200}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            {gridConfig && <CartesianGrid {...gridConfig} />}
            <XAxis {...xAxisConfig} />
            <YAxis {...yAxisConfig} />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.border}` }} />
            {legendConfig && <Legend {...legendConfig} />}
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
            {legendConfig && <Legend {...legendConfig} />}
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
            {legendConfig && <Legend {...legendConfig} />}
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

  const renderDataTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '500px' }}>
      <div>
        <Input
          label="Panel Title"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="My Dashboard Panel"
          theme={theme}
        />

        {/* Visualization Type - Compact Grid */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Visualization Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {VIZ_TYPES.map(type => {
              const Icon = type.icon;
              const isSelected = config.vizType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setConfig({ ...config, vizType: type.id })}
                  style={{
                    padding: '8px 10px',
                    background: isSelected ? theme.accent : theme.card,
                    border: `1px solid ${isSelected ? theme.accent : theme.border}`,
                    borderRadius: '6px',
                    color: isSelected ? 'white' : theme.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    transition: 'all 0.15s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = theme.cardHover)}
                  onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = theme.card)}
                >
                  {Icon && <Icon size={14} />}
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Source - Inline Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Data Source
          </label>
          <div style={{ display: 'inline-flex', gap: '4px', marginBottom: '10px', padding: '3px', background: theme.card, borderRadius: '6px' }}>
            <button
              onClick={() => setConfig({ ...config, dataSource: 'table' })}
              style={{
                padding: '6px 14px',
                background: config.dataSource === 'table' ? theme.bg : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: config.dataSource === 'table' ? theme.text : theme.textMuted,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.15s ease',
                boxShadow: config.dataSource === 'table' ? theme.shadow : 'none'
              }}
            >
              <Database size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Table
            </button>
            <button
              onClick={() => setConfig({ ...config, dataSource: 'custom' })}
              style={{
                padding: '6px 14px',
                background: config.dataSource === 'custom' ? theme.bg : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: config.dataSource === 'custom' ? theme.text : theme.textMuted,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.15s ease',
                boxShadow: config.dataSource === 'custom' ? theme.shadow : 'none'
              }}
            >
              Custom SQL
            </button>
          </div>

          {config.dataSource === 'table' ? (
            <Select
              value={config.table}
              onChange={(e) => setConfig({ ...config, table: e.target.value })}
              theme={theme}
            >
              <option value="">Select a table...</option>
              {allTables && allTables.length > 0 ? (
                allTables.map(table => (
                  <option key={table} value={table}>{table}</option>
                ))
              ) : (
                <option value="" disabled>No tables available</option>
              )}
            </Select>
          ) : (
            <textarea
              value={config.query}
              onChange={(e) => setConfig({ ...config, query: e.target.value })}
              rows={3}
              placeholder="SELECT * FROM your_table WHERE condition ORDER BY timestamp DESC LIMIT 100"
              style={{
                width: '100%',
                padding: '8px 10px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.text,
                fontSize: '12px',
                fontFamily: 'ui-monospace, monospace',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = theme.accent}
              onBlur={(e) => e.target.style.borderColor = theme.border}
            />
          )}
        </div>

        {/* Field Configuration - Improved for many columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
          <Select
            label="Timestamp Field"
            value={config.timestampField}
            onChange={(e) => setConfig({ ...config, timestampField: e.target.value })}
            theme={theme}
          >
            {availableFields.length > 0 ? (
              availableFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))
            ) : (
              <option value={config.timestampField || 'timestamp'}>{config.timestampField || 'timestamp'}</option>
            )}
          </Select>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ 
                fontSize: '11px', 
                fontWeight: '500',
                color: theme.textMuted,
                letterSpacing: '0.02em'
              }}>
                Value Fields (Y-Axis)
              </label>
              {availableFields.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', fontSize: '10px' }}>
                  <button
                    onClick={() => {
                      const numericFields = availableFields.filter(f => f !== config.timestampField);
                      setConfig({ ...config, yAxes: numericFields, yAxis: numericFields[0] || '' });
                    }}
                    style={{
                      padding: '3px 8px',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.textMuted,
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, yAxes: [], yAxis: '' })}
                    style={{
                      padding: '3px 8px',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.textMuted,
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            {availableFields.length > 0 ? (
              <div style={{
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                background: theme.bg,
                maxHeight: '180px',
                overflow: 'auto',
                padding: '4px'
              }}>
                {availableFields.filter(f => f !== config.timestampField).map((field) => (
                  <label 
                    key={field}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      padding: '5px 8px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: theme.text,
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.cardHover}
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
                      style={{ width: '14px', height: '14px', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span style={{ flex: 1 }}>{field}</span>
                    {config.yAxes?.includes(field) && (
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '2px',
                        background: getColor(config.yAxes.indexOf(field)),
                        flexShrink: 0
                      }} />
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <Input
                value={(config.yAxes || []).join(', ')}
                onChange={(e) => setConfig({ 
                  ...config, 
                  yAxes: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  yAxis: e.target.value.split(',')[0]?.trim() || ''
                })}
                placeholder="value1, value2"
                theme={theme}
              />
            )}
            {config.yAxes && config.yAxes.length > 0 && (
              <div style={{ marginTop: '6px', fontSize: '10px', color: theme.textMuted }}>
                {config.yAxes.length} field{config.yAxes.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>

        <Select
          label={<><Globe size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />Timezone</>}
          value={config.timezone || 'UTC'}
          onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
          theme={theme}
        >
          {TIMEZONES.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </Select>
      </div>

      {/* Right Column - Preview & Filters */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ 
              fontSize: '11px', 
              fontWeight: '500',
              color: theme.textMuted,
              letterSpacing: '0.02em'
            }}>
              Preview
            </label>
            <button
              onClick={handlePreview}
              disabled={previewLoading}
              style={{
                padding: '5px 12px',
                background: theme.accent,
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: previewLoading ? 'not-allowed' : 'pointer',
                fontSize: '11px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
                opacity: previewLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => !previewLoading && (e.currentTarget.style.background = theme.accentHover)}
              onMouseLeave={(e) => !previewLoading && (e.currentTarget.style.background = theme.accent)}
            >
              <Eye size={12} />
              {previewLoading ? 'Loading...' : 'Preview'}
            </button>
          </div>
          <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '12px',
            minHeight: '200px'
          }}>
            {renderPreviewChart()}
          </div>
        </div>

        {/* Time Range - Compact */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Time Range
          </label>
          <div style={{ display: 'inline-flex', gap: '4px', marginBottom: '10px', padding: '3px', background: theme.card, borderRadius: '6px', width: '100%' }}>
            {['all', 'last', 'custom'].map(range => (
              <button
                key={range}
                onClick={() => setConfig({ ...config, timeRange: range })}
                style={{
                  flex: 1,
                  padding: '5px',
                  background: config.timeRange === range ? theme.bg : 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  color: config.timeRange === range ? theme.text : theme.textMuted,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                  boxShadow: config.timeRange === range ? theme.shadow : 'none'
                }}
              >
                {range}
              </button>
            ))}
          </div>
          
          {config.timeRange === 'last' && (
            <Select
              value={config.timeRangeLast}
              onChange={(e) => setConfig({ ...config, timeRangeLast: e.target.value })}
              theme={theme}
            >
              <option value="5m">Last 5 minutes</option>
              <option value="15m">Last 15 minutes</option>
              <option value="1h">Last 1 hour</option>
              <option value="6h">Last 6 hours</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </Select>
          )}
          
          {config.timeRange === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Input
                label="Start"
                type="datetime-local"
                value={config.timeRangeStart}
                onChange={(e) => setConfig({ ...config, timeRangeStart: e.target.value })}
                theme={theme}
              />
              <Input
                label="End"
                type="datetime-local"
                value={config.timeRangeEnd}
                onChange={(e) => setConfig({ ...config, timeRangeEnd: e.target.value })}
                theme={theme}
              />
            </div>
          )}
        </div>

        {/* Data Filters */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ 
              fontSize: '11px', 
              fontWeight: '500',
              color: theme.textMuted,
              letterSpacing: '0.02em'
            }}>
              Filters
            </label>
            <button
              onClick={addFilter}
              style={{
                padding: '4px 10px',
                background: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '5px',
                color: theme.text,
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.cardHover}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.card}
            >
              <Plus size={12} />
              Add
            </button>
          </div>
          
          {config.filters && config.filters.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {config.filters.map((filter, idx) => (
                <div key={idx} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 0.7fr 1fr auto', 
                  gap: '6px',
                  padding: '6px',
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px'
                }}>
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                    style={{
                      padding: '5px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.text,
                      fontSize: '11px',
                      outline: 'none'
                    }}
                  >
                    <option value="">Field...</option>
                    {availableFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                    style={{
                      padding: '5px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.text,
                      fontSize: '11px',
                      outline: 'none'
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
                      padding: '5px',
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.text,
                      fontSize: '11px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => removeFilter(idx)}
                    style={{
                      padding: '5px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '12px', 
              textAlign: 'center', 
              color: theme.textMuted,
              fontSize: '11px',
              background: theme.card,
              border: `1px dashed ${theme.border}`,
              borderRadius: '6px'
            }}>
              No filters applied
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAxisTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '500px' }}>
      <div>
        {/* X-Axis */}
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px', 
          background: theme.card, 
          borderRadius: '8px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '12px', 
            fontWeight: '600', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.02em'
          }}>
            <AlignLeft size={13} />
            X-Axis
          </h3>

          <Input
            label="Axis Label"
            value={config.xAxisLabel}
            onChange={(e) => setConfig({ ...config, xAxisLabel: e.target.value })}
            placeholder="e.g., Time"
            theme={theme}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <Input
              label="Label Size"
              type="number"
              value={config.xAxisLabelFontSize}
              onChange={(e) => setConfig({ ...config, xAxisLabelFontSize: parseInt(e.target.value) || 12 })}
              min="8"
              max="24"
              theme={theme}
            />
            <Select
              label="Label Rotation"
              value={config.xAxisLabelRotation}
              onChange={(e) => setConfig({ ...config, xAxisLabelRotation: parseInt(e.target.value) })}
              theme={theme}
            >
              {LABEL_ROTATIONS.map(rot => (
                <option key={rot.value} value={rot.value}>{rot.label}</option>
              ))}
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <Input
              label="Tick Size"
              type="number"
              value={config.xAxisTickFontSize}
              onChange={(e) => setConfig({ ...config, xAxisTickFontSize: parseInt(e.target.value) || 11 })}
              min="6"
              max="18"
              theme={theme}
            />
            <Select
              label="Tick Rotation"
              value={config.xAxisTickRotation}
              onChange={(e) => setConfig({ ...config, xAxisTickRotation: parseInt(e.target.value) })}
              theme={theme}
            >
              {LABEL_ROTATIONS.map(rot => (
                <option key={rot.value} value={rot.value}>{rot.label}</option>
              ))}
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <Input
              label="Tick Count"
              value={config.xAxisTickCount}
              onChange={(e) => setConfig({ ...config, xAxisTickCount: e.target.value })}
              placeholder="auto"
              theme={theme}
            />
            <Input
              label="Tick Interval"
              value={config.xAxisTickInterval}
              onChange={(e) => setConfig({ ...config, xAxisTickInterval: e.target.value })}
              placeholder="auto"
              theme={theme}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textSecondary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.xAxisShowLabel}
                onChange={(e) => setConfig({ ...config, xAxisShowLabel: e.target.checked })}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              Show Label
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textSecondary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.xAxisShowTicks}
                onChange={(e) => setConfig({ ...config, xAxisShowTicks: e.target.checked })}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              Show Ticks
            </label>
          </div>
        </div>

        {/* Grid */}
        <div style={{ 
          padding: '12px', 
          background: theme.card, 
          borderRadius: '8px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '12px', 
            fontWeight: '600', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.02em'
          }}>
            <Hash size={13} />
            Grid
          </h3>

          <Input
            label={`Stroke Pattern`}
            value={config.gridStrokeDashArray}
            onChange={(e) => setConfig({ ...config, gridStrokeDashArray: e.target.value })}
            placeholder="3 3"
            theme={theme}
          />
          <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '-8px', marginBottom: '12px' }}>
            Examples: "3 3" (dashed), "1 0" (solid), "0 0" (hidden)
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '11px', 
              fontWeight: '500',
              color: theme.textMuted
            }}>
              Opacity: {Math.round(config.gridOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.gridOpacity}
              onChange={(e) => setConfig({ ...config, gridOpacity: parseFloat(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Y-Axis */}
      <div>
        <div style={{ 
          padding: '12px', 
          background: theme.card, 
          borderRadius: '8px',
          border: `1px solid ${theme.border}`
        }}>
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '12px', 
            fontWeight: '600', 
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.02em'
          }}>
            <RotateCw size={13} />
            Y-Axis
          </h3>

          <Input
            label="Axis Label"
            value={config.yAxisLabel}
            onChange={(e) => setConfig({ ...config, yAxisLabel: e.target.value })}
            placeholder="e.g., Value, Temperature"
            theme={theme}
          />

          <Select
            label={<><Type size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />Number Format</>}
            value={config.yAxisNumberFormat}
            onChange={(e) => setConfig({ ...config, yAxisNumberFormat: e.target.value })}
            theme={theme}
          >
            {NUMBER_FORMATS.map(format => (
              <option key={format.value} value={format.value}>
                {format.label} - {format.example}
              </option>
            ))}
          </Select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '12px' }}>
            <Input
              label="Decimals"
              type="number"
              value={config.yAxisDecimals}
              onChange={(e) => setConfig({ ...config, yAxisDecimals: parseInt(e.target.value) || 0 })}
              min="0"
              max="10"
              theme={theme}
            />
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: theme.textSecondary, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input
                  type="checkbox"
                  checked={config.yAxisUseCommas}
                  onChange={(e) => setConfig({ ...config, yAxisUseCommas: e.target.checked })}
                  style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                />
                Commas
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <Input
              label="Unit"
              value={config.yAxisUnit}
              onChange={(e) => setConfig({ ...config, yAxisUnit: e.target.value })}
              placeholder="e.g., °C, MB"
              theme={theme}
            />
            <Select
              label="Position"
              value={config.yAxisUnitPosition}
              onChange={(e) => setConfig({ ...config, yAxisUnitPosition: e.target.value })}
              theme={theme}
            >
              <option value="prefix">Prefix</option>
              <option value="suffix">Suffix</option>
            </Select>
          </div>

          {config.yAxisNumberFormat === 'custom' && (
            <Input
              label="Custom Format ({value})"
              value={config.yAxisCustomFormat}
              onChange={(e) => setConfig({ ...config, yAxisCustomFormat: e.target.value })}
              placeholder="e.g., {value} units"
              style={{ fontFamily: 'ui-monospace, monospace' }}
              theme={theme}
            />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <Input
              label="Label Size"
              type="number"
              value={config.yAxisLabelFontSize}
              onChange={(e) => setConfig({ ...config, yAxisLabelFontSize: parseInt(e.target.value) || 12 })}
              min="8"
              max="24"
              theme={theme}
            />
            <Input
              label="Tick Size"
              type="number"
              value={config.yAxisTickFontSize}
              onChange={(e) => setConfig({ ...config, yAxisTickFontSize: parseInt(e.target.value) || 11 })}
              min="6"
              max="18"
              theme={theme}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <Input
              label="Width"
              value={config.yAxisWidth}
              onChange={(e) => setConfig({ ...config, yAxisWidth: e.target.value })}
              placeholder="auto"
              theme={theme}
            />
            <Select
              label="Side"
              value={config.yAxisPosition}
              onChange={(e) => setConfig({ ...config, yAxisPosition: e.target.value })}
              theme={theme}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </Select>
            <Input
              label="Ticks"
              value={config.yAxisTickCount}
              onChange={(e) => setConfig({ ...config, yAxisTickCount: e.target.value })}
              placeholder="auto"
              theme={theme}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textSecondary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.yAxisShowLabel}
                onChange={(e) => setConfig({ ...config, yAxisShowLabel: e.target.checked })}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              Show Label
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: theme.textSecondary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.yAxisShowTicks}
                onChange={(e) => setConfig({ ...config, yAxisShowTicks: e.target.checked })}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              Show Ticks
            </label>
          </div>

          {/* Format Preview */}
          <div style={{ 
            padding: '10px', 
            background: theme.bg, 
            borderRadius: '6px',
            border: `1px dashed ${theme.border}`
          }}>
            <div style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px' }}>
              Format Preview:
            </div>
            <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', fontFamily: 'ui-monospace, monospace' }}>
              {formatTickValue(1234.567)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '500px' }}>
      <div>
        {/* Axis Scaling */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Y-Axis Scaling
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
            {['auto', 'linear', 'log', 'custom'].map(scale => (
              <button
                key={scale}
                onClick={() => setConfig({ ...config, yAxisScale: scale })}
                style={{
                  padding: '6px',
                  background: config.yAxisScale === scale ? theme.accent : theme.card,
                  border: `1px solid ${config.yAxisScale === scale ? theme.accent : theme.border}`,
                  borderRadius: '5px',
                  color: config.yAxisScale === scale ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => config.yAxisScale !== scale && (e.currentTarget.style.background = theme.cardHover)}
                onMouseLeave={(e) => config.yAxisScale !== scale && (e.currentTarget.style.background = theme.card)}
              >
                {scale}
              </button>
            ))}
          </div>
          
          {config.yAxisScale === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Input
                label="Min"
                type="number"
                value={config.yAxisMin}
                onChange={(e) => setConfig({ ...config, yAxisMin: e.target.value })}
                placeholder="Auto"
                theme={theme}
              />
              <Input
                label="Max"
                type="number"
                value={config.yAxisMax}
                onChange={(e) => setConfig({ ...config, yAxisMax: e.target.value })}
                placeholder="Auto"
                theme={theme}
              />
            </div>
          )}
        </div>

        {/* Panel Size */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Panel Size
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="Width (1-12)"
              type="number"
              value={config.width}
              onChange={(e) => setConfig({ ...config, width: Math.max(1, Math.min(12, parseInt(e.target.value) || 1)) })}
              min="1"
              max="12"
              theme={theme}
            />
            <Input
              label="Height (1-10)"
              type="number"
              value={config.height}
              onChange={(e) => setConfig({ ...config, height: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
              min="1"
              max="10"
              theme={theme}
            />
          </div>
        </div>

        {/* Data Limit & Refresh */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Input
            label="Data Limit"
            type="number"
            value={config.limit}
            onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) })}
            min="10"
            max="10000"
            theme={theme}
          />
          <Select
            label="Auto Refresh"
            value={config.refreshInterval}
            onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
            theme={theme}
          >
            <option value={0}>None</option>
            <option value={1000}>1s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1m</option>
          </Select>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '500px' }}>
      <div>
        {/* Chart Colors */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Chart Colors
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[0, 1, 2, 3, 4].map((colorIdx) => (
              <div key={colorIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '9px', color: theme.textMuted, textAlign: 'center', fontWeight: '500' }}>Y{colorIdx + 1}</div>
                <select
                  value={config.colors?.[colorIdx] || COLORS[colorIdx]}
                  onChange={(e) => {
                    const newColors = [...(config.colors || COLORS.slice(0, 5))];
                    newColors[colorIdx] = e.target.value;
                    setConfig({ ...config, colors: newColors });
                  }}
                  style={{
                    width: '100%',
                    height: '32px',
                    background: config.colors?.[colorIdx] || COLORS[colorIdx],
                    border: `1px solid ${theme.border}`,
                    borderRadius: '5px',
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

        {/* ✅ Legend Position Control */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Legend Position
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
            {LEGEND_POSITIONS.map(pos => (
              <button
                key={pos.value}
                onClick={() => setConfig({ ...config, legendPosition: pos.value })}
                style={{
                  padding: '8px',
                  background: config.legendPosition === pos.value ? theme.accent : theme.card,
                  border: `1px solid ${config.legendPosition === pos.value ? theme.accent : theme.border}`,
                  borderRadius: '6px',
                  color: config.legendPosition === pos.value ? 'white' : theme.text,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => config.legendPosition !== pos.value && (e.currentTarget.style.background = theme.cardHover)}
                onMouseLeave={(e) => config.legendPosition !== pos.value && (e.currentTarget.style.background = theme.card)}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Line/Area Options */}
        {(config.vizType === 'line' || config.vizType === 'area') && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '11px', 
              fontWeight: '500',
              color: theme.textMuted
            }}>
              Line Width: {config.lineWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={config.lineWidth}
              onChange={(e) => setConfig({ ...config, lineWidth: parseInt(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        )}

        {config.vizType === 'area' && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '11px', 
              fontWeight: '500',
              color: theme.textMuted
            }}>
              Fill Opacity: {Math.round(config.fillOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.fillOpacity}
              onChange={(e) => setConfig({ ...config, fillOpacity: parseFloat(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        )}

        {/* Display Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.showLegend}
              onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
              style={{ width: '14px', height: '14px', cursor: 'pointer' }}
            />
            Show Legend
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
              style={{ width: '14px', height: '14px', cursor: 'pointer' }}
            />
            Show Grid Lines
          </label>
          {(config.vizType === 'line' || config.vizType === 'area') && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.textSecondary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.showDots}
                onChange={(e) => setConfig({ ...config, showDots: e.target.checked })}
                style={{ width: '14px', height: '14px', cursor: 'pointer' }}
              />
              Show Data Points
            </label>
          )}
        </div>
      </div>

      <div>
        {/* Preview */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '11px', 
            fontWeight: '500',
            color: theme.textMuted,
            letterSpacing: '0.02em'
          }}>
            Style Preview
          </label>
          <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '12px',
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
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: theme.bg,
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1100px',
        height: '700px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadowLg,
        border: `1px solid ${theme.border}`,
        overflow: 'hidden'
      }}>
        {/* Compact Header with Tabs */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.border}`,
          background: theme.card,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: theme.text, 
                fontWeight: '600',
                letterSpacing: '-0.01em'
              }}>
                {panel ? 'Edit Panel' : 'Add New Panel'}
              </h2>
              <p style={{ 
                margin: '2px 0 0', 
                fontSize: '11px', 
                color: theme.textMuted 
              }}>
                Configure your visualization
              </p>
            </div>

            {/* Tabs integrated in header */}
            <div style={{
              display: 'flex',
              gap: '4px',
              marginLeft: '20px'
            }}>
              {[
                { id: 'data', label: 'Data', icon: Database },
                { id: 'axes', label: 'Axes', icon: AlignLeft },
                { id: 'style', label: 'Style', icon: Eye },
                { id: 'advanced', label: 'Advanced', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '6px 14px',
                      background: activeTab === tab.id ? theme.bg : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      color: activeTab === tab.id ? theme.text : theme.textMuted,
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      boxShadow: activeTab === tab.id ? theme.shadow : 'none'
                    }}
                    onMouseEnter={(e) => activeTab !== tab.id && (e.currentTarget.style.color = theme.text)}
                    onMouseLeave={(e) => activeTab !== tab.id && (e.currentTarget.style.color = theme.textMuted)}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions in header */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px 14px',
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textMuted,
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.cardHover}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.bg}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log('💾 Saving config with axes:', config);
                onSave(config);
              }}
              style={{
                padding: '6px 18px',
                background: theme.accent,
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                boxShadow: theme.shadow
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = theme.accentHover}
              onMouseLeave={(e) => e.currentTarget.style.background = theme.accent}
            >
              <Save size={14} />
              {panel ? 'Save' : 'Add'}
            </button>
          </div>
        </div>

        {/* Content - takes all remaining space */}
        <div style={{ 
          flex: 1,
          overflow: 'auto', 
          padding: '20px',
          background: theme.bg
        }}>
          {activeTab === 'data' && renderDataTab()}
          {activeTab === 'axes' && renderAxisTab()}
          {activeTab === 'style' && renderStyleTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: ${theme.border};
          border-radius: 2px;
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: ${theme.accent};
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: ${theme.accent};
          border-radius: 50%;
          cursor: 'pointer';
          border: none;
          transition: all 0.15s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

export default PanelConfigModal;
