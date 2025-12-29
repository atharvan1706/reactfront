import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Trash2, Copy, RefreshCw, Settings, Play, Clock, Database, AlertCircle, 
  Maximize2, Minimize2
} from 'lucide-react';
import { COLORS } from './constants';
import questdbService from '../../services/questdb';

function QuestDBPanel({ config, onEdit, onDelete, onDuplicate, onResize }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryTime, setQueryTime] = useState(null);
  const [latestRecordTime, setLatestRecordTime] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef(null);
  const timerRef = useRef(null);

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

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = config.width;
    const startHeight = config.height;
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const cellWidth = panelRef.current?.offsetWidth / startWidth;
      const cellHeight = panelRef.current?.offsetHeight / startHeight;
      
      const newWidth = Math.max(1, Math.min(12, startWidth + Math.round(deltaX / cellWidth)));
      const newHeight = Math.max(1, Math.min(10, startHeight + Math.round(deltaY / cellHeight)));
      
      if (newWidth !== config.width || newHeight !== config.height) {
        onResize(config.id, newWidth, newHeight);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              {config.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={config.yAxis} 
                stroke={config.colors[0]} 
                strokeWidth={config.lineWidth} 
                dot={config.showDots}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              {config.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey={config.yAxis} 
                stroke={config.colors[0]} 
                fill={config.colors[0]} 
                fillOpacity={config.fillOpacity}
                strokeWidth={config.lineWidth}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey="_time" tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              {config.showLegend && <Legend />}
              <Bar dataKey={config.yAxis} fill={config.colors[0]} isAnimationActive={false} />
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
      ref={panelRef}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
    >
      <div style={{
        padding: '12px 16px',
        background: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontWeight: '600',
          color: '#111827',
          fontSize: '14px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: config.colors[0]
          }} />
          {config.title}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => fetchData()} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }} 
          onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title="Refresh">
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button onClick={() => onDuplicate(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title="Duplicate">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
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

      <div style={{ flex: 1, minHeight: 0, padding: '16px' }}>
        {renderChart()}
      </div>

      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6b7280',
          marginBottom: '4px'
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
          color: '#6b7280',
          paddingTop: '6px',
          borderTop: '1px solid #e5e7eb'
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

      {/* Resize Handle */}
      <div
        onMouseDown={handleResizeStart}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '20px',
          height: '20px',
          cursor: 'nwse-resize',
          background: isResizing ? '#667eea' : 'transparent',
          borderTop: '2px solid',
          borderLeft: '2px solid',
          borderColor: isResizing ? '#667eea' : '#d1d5db',
          borderTopLeftRadius: '4px',
          transition: 'all 0.2s'
        }}
        title="Drag to resize"
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default QuestDBPanel;
