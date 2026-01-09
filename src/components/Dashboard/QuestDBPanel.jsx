import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Trash2, Copy, RefreshCw, Settings, Play, Clock, Database, AlertCircle, 
  Move, TrendingUp
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
  const timerRef = useRef(null);

  const theme = darkMode ? {
    card: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
    cardSolid: '#1e293b',
    hover: '#334155',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.08)',
    borderGlow: 'rgba(99, 102, 241, 0.2)',
    chartGrid: 'rgba(148, 163, 184, 0.1)',
    chartAxis: '#475569',
    chartText: '#94a3b8',
    accent: 'rgba(99, 102, 241, 0.1)',
    accentBorder: 'rgba(99, 102, 241, 0.3)',
    glassBg: 'rgba(255, 255, 255, 0.03)'
  } : {
    card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    cardSolid: 'white',
    hover: '#f9fafb',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: 'rgba(0, 0, 0, 0.06)',
    borderGlow: 'rgba(99, 102, 241, 0.15)',
    chartGrid: 'rgba(0,0,0,0.05)',
    chartAxis: '#e5e7eb',
    chartText: '#6b7280',
    accent: 'rgba(99, 102, 241, 0.06)',
    accentBorder: 'rgba(99, 102, 241, 0.2)',
    glassBg: 'rgba(255, 255, 255, 0.6)'
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
    
    let finalData = formatted;
    if (config.transformations && config.transformations.length > 0) {
      finalData = SimpleTransformations.applyTransformations(formatted, config.transformations);
    }
    
    const endTime = Date.now();
    setQueryTime(new Date(endTime));
    
    if (result.length > 0 && result[0][config.timestampField]) {
      setLatestRecordTime(new Date(result[0][config.timestampField]));
    }
    
    setData(finalData);
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

  const getColor = (idx) => {
    if (config.colors && config.colors.length > idx && config.colors[idx]) {
      return config.colors[idx];
    }
    return COLORS[idx % COLORS.length];
  };

  const renderChart = () => {
    if (loading && data.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              border: '3px solid',
              borderColor: `${theme.border} ${theme.border} ${theme.border} #6366f1`,
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: theme.textMuted, fontSize: '14px', fontFamily: "'Outfit', sans-serif", fontWeight: '500' }}>
              Loading data...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
          <div style={{
            padding: '24px 32px',
            background: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 242, 242, 1)',
            border: `1px solid ${darkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            borderRadius: '16px',
            color: darkMode ? '#fca5a5' : '#dc2626',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <AlertCircle size={40} style={{ marginBottom: '12px', opacity: 0.9 }} />
            <div style={{ fontSize: '15px', fontWeight: '600', fontFamily: "'Outfit', sans-serif", marginBottom: '6px' }}>
              Error loading data
            </div>
            <div style={{ fontSize: '13px', opacity: 0.8, fontFamily: "'Outfit', sans-serif" }}>{error}</div>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center', color: theme.textMuted }}>
            <Database size={48} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ fontSize: '14px', fontFamily: "'Outfit', sans-serif", fontWeight: '500' }}>
              No data available
            </p>
          </div>
        </div>
      );
    }

    const chartProps = {
      data,
      margin: { top: 10, right: 20, left: 10, bottom: 5 }
    };

    const yFields = (config.yAxes && config.yAxes.length > 0) ? config.yAxes : [config.yAxis].filter(Boolean);
    const filteredYFields = yFields.filter(field => field && field !== 'value');

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
                  background: theme.cardSolid, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px',
                  color: theme.text,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontFamily: "'Outfit', sans-serif" }} />}
              {filteredYFields.map((yField, idx) => (
                <Line 
                  key={yField}
                  type="monotone" 
                  dataKey={yField} 
                  stroke={getColor(idx)} 
                  strokeWidth={config.lineWidth} 
                  dot={config.showDots}
                  name={yField}
                  animationDuration={600}
                  animationEasing="ease-out"
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
                  background: theme.cardSolid, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px',
                  color: theme.text,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontFamily: "'Outfit', sans-serif" }} />}
              {filteredYFields.map((yField, idx) => (
                <Area 
                  key={yField}
                  type="monotone" 
                  dataKey={yField} 
                  stroke={getColor(idx)} 
                  fill={getColor(idx)} 
                  fillOpacity={config.fillOpacity}
                  strokeWidth={config.lineWidth}
                  name={yField}
                  animationDuration={600}
                  animationEasing="ease-out"
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
                  background: theme.cardSolid, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px',
                  color: theme.text,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ color: theme.text, fontFamily: "'Outfit', sans-serif" }} />}
              {filteredYFields.map((yField, idx) => (
                <Bar 
                  key={yField}
                  dataKey={yField} 
                  fill={getColor(idx)}
                  name={yField}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = data.slice(0, 10).map((item, idx) => ({
          name: item._time,
          value: item[filteredYFields[0]] || 0
        }));
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                animationDuration={600}
                animationEasing="ease-out"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: theme.cardSolid, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px'
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif" }} />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <YAxis tick={{ fill: theme.chartText, fontSize: 11 }} stroke={theme.chartAxis} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.cardSolid, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px'
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif" }} />}
              {filteredYFields.map((yField, idx) => (
                <Scatter 
                  key={yField}
                  name={yField} 
                  dataKey={yField} 
                  fill={getColor(idx)}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.slice(0, 8)}>
              <PolarGrid stroke={theme.chartGrid} />
              <PolarAngleAxis dataKey="_time" tick={{ fill: theme.chartText, fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: theme.chartText, fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  background: theme.cardSolid, 
                  border: `1px solid ${theme.border}`, 
                  borderRadius: '10px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '13px'
                }} 
              />
              {config.showLegend && <Legend wrapperStyle={{ fontFamily: "'Outfit', sans-serif" }} />}
              {filteredYFields.map((yField, idx) => (
                <Radar 
                  key={yField}
                  name={yField} 
                  dataKey={yField} 
                  stroke={getColor(idx)} 
                  fill={getColor(idx)} 
                  fillOpacity={0.3}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'table':
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Outfit', sans-serif" }}>
              <thead>
                <tr style={{ background: theme.glassBg, position: 'sticky', top: 0, zIndex: 1 }}>
                  {columns.map(col => (
                    <th key={col} style={{ 
                      padding: '12px 14px', 
                      textAlign: 'left', 
                      borderBottom: `2px solid ${theme.border}`, 
                      color: theme.textSecondary, 
                      fontWeight: '600',
                      fontSize: '12px',
                      letterSpacing: '0.025em',
                      textTransform: 'uppercase'
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ 
                    borderBottom: `1px solid ${theme.border}`,
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.accent}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {columns.map(col => (
                      <td key={col} style={{ 
                        padding: '12px 14px', 
                        color: theme.text,
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', monospace"
                      }}>
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
        return <div style={{ textAlign: 'center', color: theme.textMuted }}>Unsupported chart type</div>;
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
        border: `1px solid ${theme.border}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: darkMode 
          ? '0 10px 30px rgba(0,0,0,0.4), 0 0 1px rgba(255, 255, 255, 0.05) inset' 
          : '0 4px 16px rgba(0,0,0,0.06), 0 0 1px rgba(0, 0, 0, 0.03) inset',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
      className="panel-card"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px currentColor; }
          50% { box-shadow: 0 0 16px currentColor; }
        }
        
        .panel-card:hover {
          box-shadow: ${darkMode 
            ? '0 16px 40px rgba(0,0,0,0.5), 0 0 1px rgba(99, 102, 241, 0.2) inset' 
            : '0 8px 24px rgba(0,0,0,0.1), 0 0 1px rgba(99, 102, 241, 0.1) inset'} !important;
          transform: translateY(-2px);
        }
        
        .action-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .action-btn:hover {
          transform: translateY(-1px) scale(1.05);
        }
        
        .action-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '16px 18px',
        background: theme.glassBg,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '60px',
          background: `linear-gradient(90deg, ${getColor(0)}, transparent)`,
          opacity: 0.6
        }} />
        
        <div style={{
          fontWeight: '600',
          color: theme.text,
          fontSize: '15px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.01em'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: getColor(0),
            animation: 'glow 2s ease-in-out infinite'
          }} />
          {config.title}
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => fetchData()} 
            className="action-btn"
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
            title="Refresh"
          >
            <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} strokeWidth={2} />
          </button>
          <button 
            onClick={() => onDuplicate(config)} 
            className="action-btn"
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Duplicate"
          >
            <Copy size={15} strokeWidth={2} />
          </button>
          <button 
            onClick={() => onEdit(config)} 
            className="action-btn"
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Edit"
          >
            <Settings size={15} strokeWidth={2} />
          </button>
          <button 
            onClick={() => onDelete(config.id)} 
            className="action-btn"
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: darkMode ? 'rgba(248, 113, 113, 0.8)' : '#ef4444',
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Delete"
          >
            <Trash2 size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ flex: 1, minHeight: 0, padding: '20px' }}>
        {renderChart()}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 18px',
        borderTop: `1px solid ${theme.border}`,
        background: theme.glassBg
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: theme.textMuted,
          marginBottom: '6px',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '500'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <Play size={11} strokeWidth={2.5} />
              <span>{config.refreshInterval > 0 ? `${config.refreshInterval / 1000}s` : 'Manual'}</span>
            </div>
            <div style={{ opacity: 0.4 }}>•</div>
            <div style={{ 
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <TrendingUp size={11} strokeWidth={2.5} />
              {config.vizType}
            </div>
          </div>
          <div style={{ 
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px'
          }}>
            {data.length} pts • {config.width}×{config.height}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '10px',
          color: theme.textMuted,
          paddingTop: '8px',
          borderTop: `1px solid ${theme.border}`,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }} title="Query executed at">
            <Clock size={10} strokeWidth={2.5} />
            <span>{formatTimestamp(queryTime)}</span>
          </div>
          <div style={{ opacity: 0.4 }}>•</div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }} title="Latest record timestamp">
            <Database size={10} strokeWidth={2.5} />
            <span>{formatTimestamp(latestRecordTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestDBPanel;
