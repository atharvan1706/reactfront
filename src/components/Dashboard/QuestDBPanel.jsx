// QuestDBPanel.jsx - FIXED TICK COLORS
import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Trash2, Copy, RefreshCw, Settings, Play, Clock, Database, AlertCircle, 
  Move, Filter
} from 'lucide-react';
import { COLORS } from './constants';
import questdbService from '../../services/questdb';
import SimpleTransformations from './simpleTransformations';

function QuestDBPanel({ config, onEdit, onDelete, onDuplicate, onResize, style, darkMode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryTime, setQueryTime] = useState(null);
  const [latestRecordTime, setLatestRecordTime] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const timerRef = useRef(null);

  const theme = darkMode ? {
    card: '#1a1f35',
    hover: '#252b45',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#2d3548',
    chartGrid: 'rgba(148, 163, 184, 0.08)',
    chartAxis: '#94a3b8',
    chartText: '#94a3b8'
  } : {
    card: '#ffffff',
    hover: '#f3f4f6',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#e2e8f0',
    chartGrid: 'rgba(0,0,0,0.06)',
    chartAxis: '#94a3b8',
    chartText: '#64748b'
  };

  // ✅ CORRECT VERSION
const buildQueryWithFiltersAndTimeRange = () => {
  let query = config.query;
  
  if (config.dataSource === 'table' && config.table) {
    query = `SELECT * FROM ${config.table}`;
    
    const whereClauses = [];
    
    // ✅ FIX 1: Use dateadd() with proper interval format
    if (config.timeRange === 'last' && config.timeRangeLast) {
      const intervals = {
        '5m': '5 minutes',      // ✅ Use full word format
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
          `${config.timestampField} >= dateadd('${interval}', -1, now())` // ✅ Correct syntax
        );
      }
    }
    
    // ✅ FIX 2: Use cast() instead of timestamp()
    else if (config.timeRange === 'custom' && config.timeRangeStart && config.timeRangeEnd) {
      whereClauses.push(
        `${config.timestampField} BETWEEN cast('${config.timeRangeStart}:00' as timestamp) AND cast('${config.timeRangeEnd}:00' as timestamp)` // ✅ Use cast()
      );
    }
    
    // Filters (unchanged)
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
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    
    const num = parseFloat(value);
    
    switch (config.yAxisNumberFormat) {
      case 'none':
        return value.toString();
        
      case 'number':
        if (config.yAxisUseCommas) {
          const formatted = num.toFixed(config.yAxisDecimals ?? 2);
          const parts = formatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return parts.join('.');
        }
        return num.toFixed(config.yAxisDecimals ?? 2);
        
      case 'percent':
        return `${(num).toFixed(config.yAxisDecimals ?? 2)}%`;
        
      case 'percent_decimal':
        return `${(num * 100).toFixed(config.yAxisDecimals ?? 2)}%`;
        
      case 'scientific':
        return num.toExponential(config.yAxisDecimals ?? 2);
        
      case 'bytes':
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let size = Math.abs(num);
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
        return `${size.toFixed(config.yAxisDecimals ?? 2)} ${units[unitIndex]}`;
        
      case 'bits':
        const bitUnits = ['bit', 'Kbit', 'Mbit', 'Gbit', 'Tbit', 'Pbit'];
        let bits = Math.abs(num);
        let bitUnitIndex = 0;
        while (bits >= 1000 && bitUnitIndex < bitUnits.length - 1) {
          bits /= 1000;
          bitUnitIndex++;
        }
        return `${bits.toFixed(config.yAxisDecimals ?? 2)} ${bitUnits[bitUnitIndex]}`;
        
      case 'bps':
        const bpsUnits = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
        let bps = Math.abs(num);
        let bpsUnitIndex = 0;
        while (bps >= 1000 && bpsUnitIndex < bpsUnits.length - 1) {
          bps /= 1000;
          bpsUnitIndex++;
        }
        return `${bps.toFixed(config.yAxisDecimals ?? 2)} ${bpsUnits[bpsUnitIndex]}`;
        
      case 'Bps':
        const BpsUnits = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
        let Bps = Math.abs(num);
        let BpsUnitIndex = 0;
        while (Bps >= 1024 && BpsUnitIndex < BpsUnits.length - 1) {
          Bps /= 1024;
          BpsUnitIndex++;
        }
        return `${Bps.toFixed(config.yAxisDecimals ?? 2)} ${BpsUnits[BpsUnitIndex]}`;
        
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
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: config.yAxisDecimals ?? 2, maximumFractionDigits: config.yAxisDecimals ?? 2 })}`;
        
      case 'currency_eur':
        return `€${num.toLocaleString('en-US', { minimumFractionDigits: config.yAxisDecimals ?? 2, maximumFractionDigits: config.yAxisDecimals ?? 2 })}`;
        
      case 'currency_gbp':
        return `£${num.toLocaleString('en-US', { minimumFractionDigits: config.yAxisDecimals ?? 2, maximumFractionDigits: config.yAxisDecimals ?? 2 })}`;
        
      case 'currency_jpy':
        return `¥${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        
      case 'currency_inr':
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: config.yAxisDecimals ?? 2, maximumFractionDigits: config.yAxisDecimals ?? 2 })}`;
        
      case 'custom':
        if (config.yAxisCustomFormat) {
          try {
            return config.yAxisCustomFormat.replace('{value}', num.toFixed(config.yAxisDecimals ?? 2));
          } catch (e) {
            return num.toFixed(config.yAxisDecimals ?? 2);
          }
        }
        return num.toFixed(config.yAxisDecimals ?? 2);
        
      default:
        return num.toFixed(config.yAxisDecimals ?? 2);
    }
  };

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

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const startTime = Date.now();
      
      const query = buildQueryWithFiltersAndTimeRange();

      if (!query) {
        throw new Error('No query specified');
      }

      console.log('🚀 Executing query:', query);
      const result = await questdbService.query(query);
      console.log('📊 Raw query result:', result);
      console.log('🌍 Using timezone:', config.timezone || 'UTC');
      
      const formatted = questdbService.formatForChart(result, config.timestampField, config.timezone || 'UTC');
      console.log('📈 Formatted data sample:', formatted.slice(0, 3));
      
      let finalData = formatted.reverse();
      if (config.transformations && config.transformations.length > 0) {
        console.log('🔄 Applying transformations:', config.transformations);
        finalData = SimpleTransformations.applyTransformations(formatted, config.transformations);
      }
      
      const endTime = Date.now();
      setQueryTime(new Date(endTime));
      
      if (result.length > 0 && result[0][config.timestampField]) {
        setLatestRecordTime(new Date(result[0][config.timestampField]));
      }
      
      console.log('✅ Final data count:', finalData.length);
      setData(finalData);
      setIsInitialLoad(false);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message);
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  useEffect(() => {
    console.log('🔄 Config changed, refetching data');
    console.log('Current config:', config);
    setIsInitialLoad(true);
    setLoading(true);
    fetchData();

    if (config.refreshInterval > 0) {
      timerRef.current = setInterval(fetchData, config.refreshInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [config]);

  const formatTimestamp = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getColor = (idx) => {
    if (config.colors && config.colors.length > idx && config.colors[idx]) {
      return config.colors[idx];
    }
    return COLORS[idx % COLORS.length];
  };

  const getYAxisDomain = () => {
    console.log('📊 Y-axis config:', {
      scale: config.yAxisScale,
      min: config.yAxisMin,
      max: config.yAxisMax
    });
    
    if (config.yAxisScale === 'custom') {
      const min = config.yAxisMin !== '' ? parseFloat(config.yAxisMin) : 'auto';
      const max = config.yAxisMax !== '' ? parseFloat(config.yAxisMax) : 'auto';
      console.log('📊 Custom Y-axis domain:', [min, max]);
      return [min, max];
    }
    return ['auto', 'auto'];
  };

  const panelWidth = config.width || 4;
  const isSmall = panelWidth <= 2;
  const isMedium = panelWidth > 2 && panelWidth <= 4;
  const fontSize = isSmall ? 9 : isMedium ? 10 : 11;

  const renderChart = () => {
    if (loading && data.length === 0 && isInitialLoad) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw size={32} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '13px' }}>Loading data...</p>
          </div>
        </div>
      );
    }

    if (error && data.length === 0 && isInitialLoad) {
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

    const chartProps = {
      data,
      margin: isSmall 
        ? { top: 50, right: 15, left: 5, bottom: 28 }
        : isMedium
        ? { top: 55, right: 18, left: 8, bottom: 30 }
        : { top: 58, right: 22, left: 12, bottom: 32 }
    };

    const yFields = (config.yAxes && config.yAxes.length > 0) ? config.yAxes : [config.yAxis].filter(Boolean);
    const filteredYFields = yFields.filter(field => field && field !== 'value');
    const yDomain = getYAxisDomain();
    
    const yAxisScaleType = config.yAxisScale === 'log' ? 'log' : config.yAxisScale === 'linear' ? 'linear' : 'auto';
    console.log('📊 Using Y-axis scale:', yAxisScaleType, 'domain:', yDomain);

    const xAxisConfig = {
      dataKey: "_time",
      tick: config.xAxisShowTicks !== false ? { 
        fill: theme.chartText,
        fontSize: config.xAxisTickFontSize ?? fontSize,
        angle: config.xAxisTickRotation ?? 0,
        textAnchor: (config.xAxisTickRotation ?? 0) !== 0 ? 'end' : 'middle'
      } : false,
      label: (config.xAxisShowLabel !== false && config.xAxisLabel) ? {
        value: config.xAxisLabel,
        position: 'insideBottom',
        offset: -5,
        fontSize: config.xAxisLabelFontSize ?? 12,
        angle: config.xAxisLabelRotation ?? 0,
        fill: theme.text
      } : undefined,
      tickCount: config.xAxisTickCount !== 'auto' ? parseInt(config.xAxisTickCount) : undefined,
      interval: config.xAxisTickInterval !== 'auto' ? parseInt(config.xAxisTickInterval) : undefined,
      stroke: theme.chartAxis,
      tickLine: { stroke: theme.chartAxis }
    };

    const yAxisConfig = {
      tick: config.yAxisShowTicks !== false ? { 
        fill: theme.chartText,
        fontSize: config.yAxisTickFontSize ?? fontSize,
        angle: config.yAxisTickRotation ?? 0,
        textAnchor: (config.yAxisTickRotation ?? 0) !== 0 ? 'end' : 'end'
      } : false,
      tickFormatter: formatTickValue,
      label: (config.yAxisShowLabel !== false && config.yAxisLabel) ? {
        value: config.yAxisLabel,
        angle: -90,
        position: 'insideLeft',
        fontSize: config.yAxisLabelFontSize ?? 12,
        fill: theme.text
      } : undefined,
      domain: yDomain,
      scale: yAxisScaleType,
      width: config.yAxisWidth !== 'auto' ? parseInt(config.yAxisWidth) : undefined,
      orientation: config.yAxisPosition || 'left',
      tickCount: config.yAxisTickCount !== 'auto' ? parseInt(config.yAxisTickCount) : undefined,
      stroke: theme.chartAxis,
      tickLine: { stroke: theme.chartAxis }
    };

    const gridConfig = config.showGrid ? {
      strokeDasharray: config.gridStrokeDashArray || '3 3',
      stroke: darkMode 
        ? `rgba(148, 163, 184, ${config.gridOpacity ?? 0.1})` 
        : `rgba(0, 0, 0, ${config.gridOpacity ?? 0.1})`
    } : false;

    switch (config.vizType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              {gridConfig && <CartesianGrid {...gridConfig} />}
              <XAxis {...xAxisConfig} />
              <YAxis {...yAxisConfig} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: `${fontSize}px`
                }}
                formatter={(value) => formatTickValue(value)}
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontSize: `${fontSize}px` }} />}
              {filteredYFields.map((yField, idx) => (
                <Line 
                  key={yField}
                  type="monotone" 
                  dataKey={yField} 
                  stroke={getColor(idx)} 
                  strokeWidth={isSmall ? 1.5 : config.lineWidth} 
                  dot={config.showDots && !isSmall}
                  name={yField}
                  animationDuration={300}
                  animationEasing="ease-in-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              {gridConfig && <CartesianGrid {...gridConfig} />}
              <XAxis {...xAxisConfig} />
              <YAxis {...yAxisConfig} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: `${fontSize}px`
                }}
                formatter={(value) => formatTickValue(value)}
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontSize: `${fontSize}px` }} />}
              {filteredYFields.map((yField, idx) => (
                <Area 
                  key={yField}
                  type="monotone" 
                  dataKey={yField} 
                  stroke={getColor(idx)} 
                  fill={getColor(idx)} 
                  fillOpacity={config.fillOpacity}
                  strokeWidth={isSmall ? 1.5 : config.lineWidth}
                  name={yField}
                  animationDuration={300}
                  animationEasing="ease-in-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              {gridConfig && <CartesianGrid {...gridConfig} />}
              <XAxis {...xAxisConfig} />
              <YAxis {...yAxisConfig} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px',
                  color: theme.text,
                  fontSize: `${fontSize}px`
                }}
                formatter={(value) => formatTickValue(value)}
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontSize: `${fontSize}px` }} />}
              {filteredYFields.map((yField, idx) => (
                <Bar 
                  key={yField}
                  dataKey={yField} 
                  fill={getColor(idx)}
                  name={yField}
                  animationDuration={300}
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieDataKey = filteredYFields[0] || config.yAxis;
        const pieRadius = isSmall ? 50 : isMedium ? 65 : 80;
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data.slice(0, 10)} 
                dataKey={pieDataKey} 
                nameKey="_time" 
                cx="50%" 
                cy="50%" 
                outerRadius={pieRadius} 
                label={!isSmall}
                isAnimationActive={true}
              >
                {data.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.text, fontSize: `${fontSize}px` }}
                formatter={(value) => formatTickValue(value)}
              />
              {config.showLegend && !isSmall && <Legend wrapperStyle={{ color: theme.text, fontSize: `${fontSize}px` }} />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart {...chartProps}>
              {gridConfig && <CartesianGrid {...gridConfig} />}
              <XAxis {...xAxisConfig} />
              <YAxis {...yAxisConfig} />
              <Tooltip 
                contentStyle={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.text, fontSize: `${fontSize}px` }}
                formatter={(value) => formatTickValue(value)}
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontSize: `${fontSize}px` }} />}
              {filteredYFields.map((yField, idx) => (
                <Scatter 
                  key={yField}
                  dataKey={yField} 
                  fill={getColor(idx)} 
                  name={yField}
                  isAnimationActive={true} 
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        const radarMargin = isSmall 
          ? { top: 45, right: 15, bottom: 35, left: 15 }
          : isMedium
          ? { top: 50, right: 18, bottom: 38, left: 18 }
          : { top: 55, right: 22, bottom: 42, left: 22 };
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.slice(0, 8)} margin={radarMargin}>
              <PolarGrid stroke={theme.chartGrid} />
              <PolarAngleAxis dataKey="_time" tick={{ fill: theme.chartText, fontSize }} />
              <PolarRadiusAxis tick={{ fill: theme.chartText, fontSize }} />
              {filteredYFields.map((yField, idx) => (
                <Radar 
                  key={yField}
                  dataKey={yField} 
                  stroke={getColor(idx)} 
                  fill={getColor(idx)} 
                  fillOpacity={config.fillOpacity || 0.5}
                  name={yField}
                  isAnimationActive={true}
                />
              ))}
              {config.showLegend && !isSmall && <Legend wrapperStyle={{ color: theme.text, fontSize: `${fontSize}px` }} />}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'stat':
        const statField = filteredYFields[0] || config.yAxis;
        const values = data.map(d => d[statField] || 0);
        const latest = values[values.length - 1] || 0;
        const previous = values[values.length - 2] || 0;
        const change = latest - previous;
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        
        const statFontSize = isSmall ? '28px' : isMedium ? '38px' : '48px';
        const changeFontSize = isSmall ? '12px' : isMedium ? '14px' : '16px';
        const metricFontSize = isSmall ? '10px' : isMedium ? '12px' : '14px';

        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            paddingTop: isSmall ? '35px' : '40px',
            paddingBottom: isSmall ? '25px' : '30px',
            paddingLeft: '8px',
            paddingRight: '8px'
          }}>
            <div style={{ fontSize: statFontSize, fontWeight: 'bold', color: getColor(0), marginBottom: '8px' }}>
              {formatTickValue(latest)}
            </div>
            <div style={{
              fontSize: changeFontSize,
              color: change >= 0 ? '#10b981' : '#ef4444',
              marginBottom: isSmall ? '12px' : '16px',
              fontWeight: '600'
            }}>
              {change >= 0 ? '↑' : '↓'} {formatNumber(Math.abs(change))} ({((change / previous) * 100).toFixed(1)}%)
            </div>
            <div style={{ 
              display: 'flex', 
              gap: isSmall ? '12px' : '24px', 
              fontSize: metricFontSize, 
              color: theme.textMuted,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div>Min: <span style={{ color: theme.text, fontWeight: '600' }}>{formatTickValue(Math.min(...values))}</span></div>
              <div>Max: <span style={{ color: theme.text, fontWeight: '600' }}>{formatTickValue(Math.max(...values))}</span></div>
              <div>Avg: <span style={{ color: theme.text, fontWeight: '600' }}>{formatTickValue(avg)}</span></div>
            </div>
          </div>
        );

      case 'table':
        const columns = Object.keys(data[0] || {}).filter(key => !key.startsWith('_'));
        const tableFontSize = isSmall ? '11px' : isMedium ? '12px' : '13px';
        const headerFontSize = isSmall ? '10px' : isMedium ? '11px' : '12px';
        
        return (
          <div style={{ height: '100%', overflow: 'auto', paddingTop: isSmall ? '35px' : '40px', paddingBottom: isSmall ? '25px' : '30px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: tableFontSize }}>
              <thead>
                <tr style={{ background: theme.hover, position: 'sticky', top: 0, zIndex: 1 }}>
                  {columns.map(col => (
                    <th key={col} style={{ 
                      padding: isSmall ? '6px' : '10px', 
                      textAlign: 'left', 
                      borderBottom: `2px solid ${theme.border}`, 
                      color: theme.textSecondary, 
                      fontWeight: '600',
                      fontSize: headerFontSize
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {columns.map(col => (
                      <td key={col} style={{ padding: isSmall ? '6px' : '10px', color: theme.text }}>
                        {typeof row[col] === 'number' ? formatTickValue(row[col]) : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div style={{ textAlign: 'center', color: theme.textMuted }}>Unsupported chart type</div>;
    }
  };

  return (
    <div 
      style={{
        ...style,
        height: '100%',
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = darkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'}
    >
      {renderChart()}

      {/* Header overlay */}
      <div style={{
        position: 'absolute',
        top: '6px',
        left: '6px',
        right: '140px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <div style={{
          fontWeight: '700',
          color: theme.text,
          fontSize: isSmall ? '11px' : '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          textShadow: darkMode 
            ? '1px 1px 3px rgba(0,0,0,0.9), -1px -1px 3px rgba(0,0,0,0.9)' 
            : '1px 1px 2px rgba(255,255,255,1), -1px -1px 2px rgba(255,255,255,1)',
          pointerEvents: 'auto'
        }}>
          <div style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: getColor(0),
            boxShadow: `0 0 8px ${getColor(0)}`,
            animation: 'pulse 2s infinite',
            flexShrink: 0
          }} />
          <span style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px'
          }}>
            {config.title}
          </span>
        </div>
        
        {(config.timeRange || config.filters?.length > 0 || (config.yAxisScale && config.yAxisScale !== 'auto')) && (
          <div style={{ 
            display: 'flex', 
            gap: '3px', 
            flexWrap: 'wrap', 
            alignItems: 'center',
            pointerEvents: 'auto'
          }}>
            {config.timeRange === 'last' && config.timeRangeLast && (
              <div style={{
                padding: '2px 6px',
                background: darkMode ? 'rgba(102, 126, 234, 0.35)' : 'rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(102, 126, 234, 0.6)',
                borderRadius: '6px',
                fontSize: '8px',
                color: darkMode ? '#c7d2fe' : '#4f46e5',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.15)',
                textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
              }}>
                <Clock size={7} />
                {config.timeRangeLast}
              </div>
            )}
            {config.timeRange === 'custom' && config.timeRangeStart && (
              <div style={{
                padding: '2px 6px',
                background: darkMode ? 'rgba(102, 126, 234, 0.35)' : 'rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(102, 126, 234, 0.6)',
                borderRadius: '6px',
                fontSize: '8px',
                color: darkMode ? '#c7d2fe' : '#4f46e5',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.15)',
                textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
              }}>
                <Clock size={7} />
                Custom
              </div>
            )}
            {config.filters && config.filters.length > 0 && (
              <div style={{
                padding: '2px 6px',
                background: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.3)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '6px',
                fontSize: '8px',
                color: darkMode ? '#a7f3d0' : '#047857',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.15)',
                textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
              }}>
                <Filter size={7} />
                {config.filters.length}
              </div>
            )}
            {config.yAxisScale && config.yAxisScale !== 'auto' && (
              <div style={{
                padding: '2px 6px',
                background: darkMode ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.3)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(245, 158, 11, 0.6)',
                borderRadius: '6px',
                fontSize: '8px',
                color: darkMode ? '#fde68a' : '#d97706',
                fontWeight: '700',
                textTransform: 'capitalize',
                boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.15)',
                textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
              }}>
                {config.yAxisScale}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        position: 'absolute',
        top: '6px',
        right: '6px',
        display: 'flex',
        gap: '3px',
        zIndex: 10
      }}>
        <button onClick={() => fetchData()} style={{
          padding: isSmall ? '5px' : '6px',
          background: 'transparent',
          border: 'none',
          color: theme.text,
          cursor: 'pointer',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.9)' : '1px 1px 2px rgba(255,255,255,1)'
        }} 
        onMouseEnter={(e) => {
          e.currentTarget.style.background = darkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        title="Refresh">
          <RefreshCw size={isSmall ? 12 : 13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
        <button onClick={() => onDuplicate(config)} style={{
          padding: isSmall ? '5px' : '6px',
          background: 'transparent',
          border: 'none',
          color: theme.text,
          cursor: 'pointer',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.9)' : '1px 1px 2px rgba(255,255,255,1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = darkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        title="Duplicate">
          <Copy size={isSmall ? 11 : 12} />
        </button>
        <button onClick={() => onEdit(config)} style={{
          padding: isSmall ? '5px' : '6px',
          background: 'transparent',
          border: 'none',
          color: theme.text,
          cursor: 'pointer',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.9)' : '1px 1px 2px rgba(255,255,255,1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = darkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        title="Edit">
          <Settings size={isSmall ? 11 : 12} />
        </button>
        <button onClick={() => onDelete(config.id)} style={{
          padding: isSmall ? '5px' : '6px',
          background: 'transparent',
          border: 'none',
          color: '#ef4444',
          cursor: 'pointer',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.9)' : '1px 1px 2px rgba(255,255,255,1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        title="Delete">
          <Trash2 size={isSmall ? 11 : 12} />
        </button>
      </div>

      {/* Footer info */}
      <div style={{
        position: 'absolute',
        bottom: '6px',
        left: '6px',
        right: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <div style={{
          fontSize: isSmall ? '7px' : '8px',
          color: error ? '#ef4444' : theme.textMuted,
          display: 'flex',
          gap: isSmall ? '4px' : '6px',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontWeight: '600',
          textShadow: darkMode ? '1px 1px 3px rgba(0,0,0,0.9)' : '1px 1px 2px rgba(255,255,255,1)'
        }}>
          {error ? (
            <>
              <AlertCircle size={isSmall ? 8 : 9} color="#ef4444" />
              <span style={{ color: '#ef4444' }}>Error: {error}</span>
              <div>•</div>
              <span style={{ color: theme.textMuted }}>Showing last data</span>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                {loading && <RefreshCw size={isSmall ? 7 : 8} style={{ animation: 'spin 1s linear infinite' }} />}
                {!loading && <Play size={isSmall ? 7 : 8} />}
                <span>{config.refreshInterval > 0 ? `${config.refreshInterval / 1000}s` : 'Manual'}</span>
              </div>
              <div>•</div>
              <div style={{ textTransform: 'capitalize' }}>{config.vizType}</div>
              <div>•</div>
              <div>{data.length} pts</div>
              <div>•</div>
              <div>TZ: {config.timezone || 'UTC'}</div>
              {!isSmall && (
                <>
                  <div>•</div>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <Clock size={7} />
                    <span title="Query time">Q: {formatTimestamp(queryTime)}</span>
                  </div>
                  <div>•</div>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <Database size={7} />
                    <span title="Latest record time">L: {formatTimestamp(latestRecordTime)}</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Force Recharts tick colors */
        .recharts-cartesian-axis-tick text {
          fill: ${theme.chartText} !important;
        }
        
        .recharts-label text {
          fill: ${theme.text} !important;
        }
        
        .recharts-cartesian-axis-line {
          stroke: ${theme.chartAxis} !important;
        }
        
        .recharts-cartesian-axis-tick-line {
          stroke: ${theme.chartAxis} !important;
        }
        
        .recharts-polar-angle-axis-tick text,
        .recharts-polar-radius-axis-tick text {
          fill: ${theme.chartText} !important;
        }
      `}</style>
    </div>
  );
}

export default QuestDBPanel;
