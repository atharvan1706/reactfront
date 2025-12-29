import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Trash2, Copy, RefreshCw, Settings, Play, Clock, Database, AlertCircle, 
  Move
} from 'lucide-react';
import { COLORS } from './constants';
import questdbService from '../../services/questdb';

function QuestDBPanel({ config, onEdit, onDelete, onDuplicate, onResize, style, darkMode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryTime, setQueryTime] = useState(null);
  const [latestRecordTime, setLatestRecordTime] = useState(null);
  const timerRef = useRef(null);

  const theme = darkMode ? {
    card: '#1e293b',
    hover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#334155',
    chartGrid: 'rgba(148, 163, 184, 0.1)',
    chartAxis: '#475569',
    chartText: '#94a3b8'
  } : {
    card: 'white',
    hover: '#f9fafb',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    chartGrid: 'rgba(0,0,0,0.1)',
    chartAxis: '#e5e7eb',
    chartText: '#6b7280'
  };

  const fetchData = async () => {
    try {
      setError(null);
      const startTime = Date.now();
      let query = config.query;
      
      if (config.dataSource === 'table' && config.table) {
        query = `SELECT * FROM ${config.table} ORDER BY ${config.timestampField} DESC LIMIT ${config.limit}`;
      }

      if (!query) {
        throw new Error('No query specified');
      }

      const result = await questdbService.query(query);
      const formatted = questdbService.formatForChart(result, config.timestampField);
      
      const endTime = Date.now();
      setQueryTime(new Date(endTime));
      
      if (result.length > 0 && result[0][config.timestampField]) {
        setLatestRecordTime(new Date(result[0][config.timestampField]));
      }
      
      setData(formatted);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const renderChart = () => {
    if (loading && data.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw size={32} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '13px' }}>Loading data...</p>
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

    const chartProps = {
      data,
      margin: { top: 10, right: 20, left: 10, bottom: 5 }
    };

    switch (config.vizType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <YAxis tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px',
                  color: theme.text
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text }} />}
              {(config.yAxes || [config.yAxis]).filter(Boolean).map((yField, idx) => (
                <Line 
                  key={yField}
                  type="monotone" 
                  dataKey={yField} 
                  stroke={config.colors[idx] || COLORS[idx % COLORS.length]} 
                  strokeWidth={config.lineWidth} 
                  dot={config.showDots}
                  name={yField}
                  animationDuration={800}
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
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <YAxis tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px',
                  color: theme.text
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text }} />}
              {(config.yAxes || [config.yAxis]).filter(Boolean).map((yField, idx) => (
                <Area 
                  key={yField}
                  type="monotone" 
                  dataKey={yField} 
                  stroke={config.colors[idx] || COLORS[idx % COLORS.length]} 
                  fill={config.colors[idx] || COLORS[idx % COLORS.length]} 
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.lineWidth}
                  name={yField}
                  animationDuration={800}
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
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <YAxis tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.card, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '6px',
                  color: theme.text
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text }} />}
              {(config.yAxes || [config.yAxis]).filter(Boolean).map((yField, idx) => (
                <Bar 
                  key={yField}
                  dataKey={yField} 
                  fill={config.colors[idx] || COLORS[idx % COLORS.length]}
                  name={yField}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data.slice(0, 10)} 
                dataKey={config.yAxis} 
                nameKey="_time" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label
                isAnimationActive={false}
              >
                {data.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <YAxis dataKey={config.yAxis} tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              {config.showLegend && <Legend />}
              <Scatter dataKey={config.yAxis} fill={config.colors[0]} isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.slice(0, 8)}>
              <PolarGrid stroke="rgba(0,0,0,0.1)" />
              <PolarAngleAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Radar 
                dataKey={config.yAxis} 
                stroke={config.colors[0]} 
                fill={config.colors[0]} 
                fillOpacity={config.fillOpacity || 0.5}
                isAnimationActive={false}
              />
              {config.showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'stat':
        const values = data.map(d => d[config.yAxis] || 0);
        const latest = values[values.length - 1] || 0;
        const previous = values[values.length - 2] || 0;
        const change = latest - previous;
        const avg = values.reduce((a, b) => a + b, 0) / values.length;

        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: config.colors[0], marginBottom: '8px' }}>
              {latest.toFixed(2)}
            </div>
            <div style={{
              fontSize: '16px',
              color: change >= 0 ? '#10b981' : '#ef4444',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)} ({((change / previous) * 100).toFixed(1)}%)
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#6b7280' }}>
              <div>Min: <span style={{ color: '#111827', fontWeight: '600' }}>{Math.min(...values).toFixed(2)}</span></div>
              <div>Max: <span style={{ color: '#111827', fontWeight: '600' }}>{Math.max(...values).toFixed(2)}</span></div>
              <div>Avg: <span style={{ color: '#111827', fontWeight: '600' }}>{avg.toFixed(2)}</span></div>
            </div>
          </div>
        );

      case 'table':
        const columns = Object.keys(data[0] || {}).filter(key => !key.startsWith('_'));
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', position: 'sticky', top: 0, zIndex: 1 }}>
                  {columns.map(col => (
                    <th key={col} style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #e5e7eb', 
                      color: '#374151', 
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
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    {columns.map(col => (
                      <td key={col} style={{ padding: '10px', color: '#111827' }}>
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
        return <div style={{ textAlign: 'center', color: '#6b7280' }}>Unsupported chart type</div>;
    }
  };

  return (
    <div 
      style={{
        ...style,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.card,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = darkMode ? '0 12px 32px rgba(0,0,0,0.4)' : '0 8px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.05)'}
    >
      <div style={{
        padding: '12px 16px',
        background: theme.hover,
        borderBottom: `2px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          fontWeight: '600',
          color: theme.text,
          fontSize: '14px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'color 0.3s ease'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: config.colors[0],
            boxShadow: `0 0 8px ${config.colors[0]}`,
            animation: 'pulse 2s infinite'
          }} />
          {config.title}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => fetchData()} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }} 
          onMouseEnter={(e) => {
            e.target.style.background = darkMode ? '#475569' : '#e5e7eb';
            e.target.style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = theme.textMuted;
          }}
          title="Refresh">
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={() => onDuplicate(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode ? '#475569' : '#e5e7eb';
            e.target.style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = theme.textMuted;
          }}
          title="Duplicate">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode ? '#475569' : '#e5e7eb';
            e.target.style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = theme.textMuted;
          }}
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
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '16px' }}>
        {renderChart()}
      </div>

      <div style={{
        padding: '8px 12px',
        borderTop: `1px solid ${theme.border}`,
        background: theme.hover,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: theme.textMuted,
          marginBottom: '4px',
          transition: 'color 0.3s ease'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Play size={10} />
              <span>{config.refreshInterval > 0 ? `${config.refreshInterval / 1000}s` : 'Manual'}</span>
            </div>
            <div>•</div>
            <div style={{ textTransform: 'capitalize' }}>{config.vizType}</div>
          </div>
          <div>{data.length} pts • {config.width}×{config.height}</div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '10px',
          color: theme.textMuted,
          paddingTop: '6px',
          borderTop: `1px solid ${theme.border}`,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} title="Query executed at">
            <Clock size={10} />
            <span>Query: {formatTimestamp(queryTime)}</span>
          </div>
          <div>•</div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} title="Latest record timestamp">
            <Database size={10} />
            <span>Latest: {formatTimestamp(latestRecordTime)}</span>
          </div>
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
      `}</style>
    </div>
  );
}

export default QuestDBPanel;
