import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Plus, Database, Activity, TrendingUp, BarChart3, PieChart as PieIcon,
  Trash2, Copy, Play, RefreshCw, X, Gauge, Radar as RadarIcon,
  CircleDot, Table as TableIcon, AlertCircle, Settings, Save, Eye, Zap,
  Sun, Moon, Maximize2, Minimize2
} from 'lucide-react';

const COLORS = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

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

// Mock QuestDB Service (since we don't have the actual service)
const mockQuestDBService = {
  query: async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        timestamp: new Date(Date.now() - (20 - i) * 60000).toISOString(),
        value: Math.random() * 100,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
        pressure: 1000 + Math.random() * 50
      });
    }
    return data;
  },
  
  formatForChart: (data, timestampField) => {
    return data.map(item => ({
      ...item,
      _time: new Date(item[timestampField]).toLocaleTimeString(),
      _timestamp: new Date(item[timestampField]).getTime()
    }));
  },
  
  getTables: async () => {
    return [
      { table_name: 'sensor_data' },
      { table_name: 'metrics' },
      { table_name: 'logs' }
    ];
  }
};

// Theme Context
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('miralys_theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('miralys_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? {
    bg: '#f3f4f6',
    cardBg: 'white',
    border: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280',
    headerBg: 'white',
    modalBg: 'white',
    inputBg: 'white',
    hoverBg: '#f9fafb',
    chartGrid: 'rgba(0,0,0,0.1)',
    chartText: '#6b7280',
    chartStroke: '#e5e7eb'
  } : {
    bg: '#0f172a',
    cardBg: '#1e293b',
    border: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    headerBg: '#1e293b',
    modalBg: '#1e293b',
    inputBg: '#0f172a',
    hoverBg: '#334155',
    chartGrid: 'rgba(255,255,255,0.1)',
    chartText: '#94a3b8',
    chartStroke: '#334155'
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Panel Configuration Modal
function PanelConfigModal({ panel, onSave, onClose, allTables }) {
  const { colors } = React.useContext(ThemeContext);
  const [config, setConfig] = useState(panel || {
    id: `panel_${Date.now()}`,
    title: 'New Panel',
    vizType: 'line',
    dataSource: 'custom',
    query: '',
    table: '',
    timestampField: 'timestamp',
    xAxis: 'timestamp',
    yAxis: 'value',
    limit: 100,
    refreshInterval: 5000,
    colors: [COLORS[0]],
    showLegend: true,
    showGrid: true,
    lineWidth: 2,
    showDots: false,
    fillOpacity: 0.3,
    aggregate: 'none'
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
      const result = await mockQuestDBService.query(query);
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

      const result = await mockQuestDBService.query(query);
      const formatted = mockQuestDBService.formatForChart(result, config.timestampField);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
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
          height: '250px',
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
          height: '250px',
          color: colors.textSecondary
        }}>
          Click "Preview" to test your configuration
        </div>
      );
    }

    const chartProps = { data: previewData, margin: { top: 10, right: 20, left: 10, bottom: 5 } };

    return (
      <ResponsiveContainer width="100%" height={250}>
        {config.vizType === 'line' && (
          <LineChart {...chartProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
            <XAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <YAxis tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
            {config.showLegend && <Legend />}
            <Line type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} strokeWidth={config.lineWidth} dot={config.showDots} />
          </LineChart>
        )}
        {config.vizType === 'bar' && (
          <BarChart {...chartProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
            <XAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <YAxis tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
            {config.showLegend && <Legend />}
            <Bar dataKey={config.yAxis} fill={config.colors[0]} />
          </BarChart>
        )}
        {config.vizType === 'area' && (
          <AreaChart {...chartProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
            <XAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <YAxis tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
            {config.showLegend && <Legend />}
            <Area type="monotone" dataKey={config.yAxis} stroke={config.colors[0]} fill={config.colors[0]} fillOpacity={config.fillOpacity} />
          </AreaChart>
        )}
        {config.vizType === 'pie' && (
          <PieChart>
            <Pie 
              data={previewData.slice(0, 10)} 
              dataKey={config.yAxis} 
              nameKey="_time" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label
            >
              {previewData.slice(0, 10).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
            {config.showLegend && <Legend />}
          </PieChart>
        )}
        {config.vizType === 'scatter' && (
          <ScatterChart {...chartProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
            <XAxis dataKey="_timestamp" tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <YAxis dataKey={config.yAxis} tick={{ fill: colors.chartText, fontSize: 10 }} stroke={colors.chartStroke} />
            <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
            {config.showLegend && <Legend />}
            <Scatter dataKey={config.yAxis} fill={config.colors[0]} />
          </ScatterChart>
        )}
        {config.vizType === 'radar' && (
          <RadarChart data={previewData.slice(0, 8)}>
            <PolarGrid stroke={colors.chartGrid} />
            <PolarAngleAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: colors.chartText, fontSize: 10 }} />
            <Radar 
              dataKey={config.yAxis} 
              stroke={config.colors[0]} 
              fill={config.colors[0]} 
              fillOpacity={config.fillOpacity || 0.5} 
            />
            {config.showLegend && <Legend />}
          </RadarChart>
        )}
        {config.vizType === 'stat' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: config.colors[0], marginBottom: '8px' }}>
              {previewData.length > 0 ? previewData[previewData.length - 1][config.yAxis]?.toFixed(2) : '0.00'}
            </div>
            <div style={{ fontSize: '14px', color: colors.textSecondary }}>
              {previewData.length} data points
            </div>
          </div>
        )}
        {config.vizType === 'table' && (
          <div style={{ height: '250px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: colors.hoverBg, position: 'sticky', top: 0 }}>
                  {Object.keys(previewData[0] || {}).filter(k => !k.startsWith('_')).map(col => (
                    <th key={col} style={{ 
                      padding: '8px', 
                      textAlign: 'left', 
                      borderBottom: `2px solid ${colors.border}`, 
                      color: colors.text, 
                      fontWeight: '600',
                      fontSize: '11px'
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    {Object.keys(row).filter(k => !k.startsWith('_')).map(col => (
                      <td key={col} style={{ padding: '8px', color: colors.text }}>
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
        background: colors.modalBg,
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
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: colors.hoverBg
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: colors.text, fontWeight: '700' }}>
              {panel ? 'Edit Panel' : 'Add New Panel'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.textSecondary }}>
              Configure your visualization settings
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            padding: '8px'
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
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
                    background: colors.inputBg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.text,
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
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
                          background: isSelected ? '#667eea' : colors.hoverBg,
                          border: '2px solid',
                          borderColor: isSelected ? '#667eea' : colors.border,
                          borderRadius: '8px',
                          color: isSelected ? 'white' : colors.text,
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
                  Data Source
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setConfig({ ...config, dataSource: 'table' })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: config.dataSource === 'table' ? '#667eea' : colors.hoverBg,
                      border: '2px solid',
                      borderColor: config.dataSource === 'table' ? '#667eea' : colors.border,
                      borderRadius: '8px',
                      color: config.dataSource === 'table' ? 'white' : colors.text,
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
                      background: config.dataSource === 'custom' ? '#667eea' : colors.hoverBg,
                      border: '2px solid',
                      borderColor: config.dataSource === 'custom' ? '#667eea' : colors.border,
                      borderRadius: '8px',
                      color: config.dataSource === 'custom' ? 'white' : colors.text,
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
                      background: colors.inputBg,
                      border: `2px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text,
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
                      background: colors.inputBg,
                      border: `2px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
                  Field Configuration
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: colors.textSecondary }}>
                      Timestamp Field
                    </label>
                    {availableFields.length > 0 ? (
                      <select
                        value={config.timestampField}
                        onChange={(e) => setConfig({ ...config, timestampField: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: colors.inputBg,
                          border: `2px solid ${colors.border}`,
                          borderRadius: '6px',
                          color: colors.text,
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
                          background: colors.inputBg,
                          border: `2px solid ${colors.border}`,
                          borderRadius: '6px',
                          color: colors.text,
                          fontSize: '13px'
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: colors.textSecondary }}>
                      Value Field (Y-Axis)
                    </label>
                    {availableFields.length > 0 ? (
                      <select
                        value={config.yAxis}
                        onChange={(e) => setConfig({ ...config, yAxis: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: colors.inputBg,
                          border: `2px solid ${colors.border}`,
                          borderRadius: '6px',
                          color: colors.text,
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
                          background: colors.inputBg,
                          border: `2px solid ${colors.border}`,
                          borderRadius: '6px',
                          color: colors.text,
                          fontSize: '13px'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
                  Data Point Limit
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
                    background: colors.inputBg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.text,
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
                  Auto Refresh Interval
                </label>
                <select
                  value={config.refreshInterval}
                  onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: colors.inputBg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.text,
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

            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: colors.text, fontWeight: '600' }}>
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
                  background: colors.hoverBg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '16px',
                  minHeight: '250px'
                }}>
                  {renderPreviewChart()}
                </div>
                {previewData.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: colors.textSecondary }}>
                    {previewData.length} data points loaded
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: colors.text, fontWeight: '600' }}>
                  Style Options
                </label>
                
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: colors.textSecondary }}>
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
                          border: config.colors[0] === color ? `3px solid ${colors.text}` : `2px solid ${colors.border}`,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {(config.vizType === 'line' || config.vizType === 'area') && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: colors.textSecondary }}>
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
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: colors.textSecondary }}>
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.text, fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.showLegend}
                      onChange={(e) => setConfig({ ...config, showLegend: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Show Legend
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.text, fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.showGrid}
                      onChange={(e) => setConfig({ ...config, showGrid: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Show Grid Lines
                  </label>
                  {(config.vizType === 'line' || config.vizType === 'area') && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.text, fontSize: '13px', cursor: 'pointer' }}>
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
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: colors.hoverBg
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: colors.inputBg,
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.textSecondary,
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

// Panel Component with Real QuestDB Data
function QuestDBPanel({ config, onEdit, onDelete, onDuplicate }) {
  const { colors } = React.useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef(null);
  const panelRef = useRef(null);

  const fetchData = async () => {
    try {
      setError(null);
      let query = config.query;
      
      if (config.dataSource === 'table' && config.table) {
        query = `SELECT * FROM ${config.table} ORDER BY ${config.timestampField} DESC LIMIT ${config.limit}`;
      }

      if (!query) {
        throw new Error('No query specified');
      }

      const result = await mockQuestDBService.query(query);
      const formatted = mockQuestDBService.formatForChart(result, config.timestampField);
      setData(formatted);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
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
  }, [config]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (panelRef.current.requestFullscreen) {
        panelRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw size={32} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: colors.textSecondary, marginTop: '12px', fontSize: '13px' }}>Loading data...</p>
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
          <div style={{ textAlign: 'center', color: colors.textSecondary }}>
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
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <YAxis tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
              {config.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={config.yAxis} 
                stroke={config.colors[0]} 
                strokeWidth={config.lineWidth} 
                dot={config.showDots} 
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <YAxis tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
              {config.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey={config.yAxis} 
                stroke={config.colors[0]} 
                fill={config.colors[0]} 
                fillOpacity={config.fillOpacity}
                strokeWidth={config.lineWidth}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
              <XAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <YAxis tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
              {config.showLegend && <Legend />}
              <Bar dataKey={config.yAxis} fill={config.colors[0]} />
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
              >
                {data.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart {...chartProps}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />}
              <XAxis dataKey="_timestamp" tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <YAxis dataKey={config.yAxis} tick={{ fill: colors.chartText, fontSize: 11 }} stroke={colors.chartStroke} />
              <Tooltip contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '6px', color: colors.text }} />
              {config.showLegend && <Legend />}
              <Scatter dataKey={config.yAxis} fill={config.colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.slice(0, 8)}>
              <PolarGrid stroke={colors.chartGrid} />
              <PolarAngleAxis dataKey="_time" tick={{ fill: colors.chartText, fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: colors.chartText, fontSize: 11 }} />
              <Radar 
                dataKey={config.yAxis} 
                stroke={config.colors[0]} 
                fill={config.colors[0]} 
                fillOpacity={config.fillOpacity || 0.5} 
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
            <div style={{ fontSize: isFullscreen ? '72px' : '48px', fontWeight: 'bold', color: config.colors[0], marginBottom: '8px' }}>
              {latest.toFixed(2)}
            </div>
            <div style={{
              fontSize: isFullscreen ? '24px' : '16px',
              color: change >= 0 ? '#10b981' : '#ef4444',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)} ({((change / previous) * 100).toFixed(1)}%)
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: isFullscreen ? '18px' : '14px', color: colors.textSecondary }}>
              <div>Min: <span style={{ color: colors.text, fontWeight: '600' }}>{Math.min(...values).toFixed(2)}</span></div>
              <div>Max: <span style={{ color: colors.text, fontWeight: '600' }}>{Math.max(...values).toFixed(2)}</span></div>
              <div>Avg: <span style={{ color: colors.text, fontWeight: '600' }}>{avg.toFixed(2)}</span></div>
            </div>
          </div>
        );

      case 'table':
        const columns = Object.keys(data[0] || {}).filter(key => !key.startsWith('_'));
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isFullscreen ? '16px' : '13px' }}>
              <thead>
                <tr style={{ background: colors.hoverBg, position: 'sticky', top: 0, zIndex: 1 }}>
                  {columns.map(col => (
                    <th key={col} style={{ 
                      padding: isFullscreen ? '14px' : '10px', 
                      textAlign: 'left', 
                      borderBottom: `2px solid ${colors.border}`, 
                      color: colors.text, 
                      fontWeight: '600',
                      fontSize: isFullscreen ? '14px' : '12px'
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    {columns.map(col => (
                      <td key={col} style={{ padding: isFullscreen ? '14px' : '10px', color: colors.text }}>
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
        return <div style={{ textAlign: 'center', color: colors.textSecondary }}>Unsupported chart type</div>;
    }
  };

  return (
    <div 
      ref={panelRef}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: colors.cardBg,
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1
      }}
      onMouseEnter={(e) => !isFullscreen && (e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)')}
      onMouseLeave={(e) => !isFullscreen && (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)')}
    >
      <div style={{
        padding: '12px 16px',
        background: colors.hoverBg,
        borderBottom: `2px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontWeight: '600',
          color: colors.text,
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
          <button onClick={toggleFullscreen} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }} 
          onMouseEnter={(e) => e.target.style.background = colors.border}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={() => fetchData()} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }} 
          onMouseEnter={(e) => e.target.style.background = colors.border}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => onDuplicate(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = colors.border}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
          title="Duplicate">
            <Copy size={14} />
          </button>
          <button onClick={() => onEdit(config)} style={{
            padding: '6px',
            background: 'transparent',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = colors.border}
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
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: colors.textSecondary,
        background: colors.hoverBg
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Play size={10} />
            <span>{config.refreshInterval > 0 ? `${config.refreshInterval / 1000}s` : 'Manual'}</span>
          </div>
          <div>•</div>
          <div style={{ textTransform: 'capitalize' }}>{config.vizType}</div>
        </div>
        <div>{data.length} pts</div>
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

// Main Dashboard Component
function DashboardApp() {
  const { theme, toggleTheme, colors } = React.useContext(ThemeContext);
  const [panels, setPanels] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [user] = useState({ name: 'Admin', email: 'admin@example.com' });

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const result = await mockQuestDBService.getTables();
        const tableNames = result.map(row => row.table_name);
        setAvailableTables(tableNames);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('miralys_dashboard_panels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPanels(parsed || []);
      } catch (e) {
        console.error('Error loading dashboard:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (panels.length > 0) {
      localStorage.setItem('miralys_dashboard_panels', JSON.stringify(panels));
    }
  }, [panels]);

  const handleAddPanel = () => {
    setEditingPanel(null);
    setShowConfigModal(true);
  };

  const handleSavePanel = (config) => {
    const exists = panels.some(p => p.id === config.id);
    
    if (exists) {
      setPanels(panels.map(p => p.id === config.id ? config : p));
    } else {
      setPanels([...panels, config]);
    }
    
    setShowConfigModal(false);
    setEditingPanel(null);
  };

  const handleEdit = (panel) => {
    setEditingPanel(panel);
    setShowConfigModal(true);
  };

  const handleDelete = (panelId) => {
    if (window.confirm('Are you sure you want to delete this panel?')) {
      setPanels(panels.filter(p => p.id !== panelId));
    }
  };

  const handleDuplicate = (panel) => {
    const newPanel = {
      ...panel,
      id: `panel_${Date.now()}`,
      title: `${panel.title} (Copy)`
    };
    setPanels([...panels, newPanel]);
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <div style={{
        background: colors.headerBg,
        borderBottom: `2px solid ${colors.border}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: colors.text }}>
              Miralys
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: colors.textSecondary }}>
              Real-Time Data Intelligence
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '10px',
              background: colors.inputBg,
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button
            onClick={handleAddPanel}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
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
            background: colors.hoverBg,
            border: `2px solid ${colors.border}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: colors.textSecondary }}>{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {panels.length === 0 ? (
          <div style={{
            background: colors.cardBg,
            border: `2px dashed ${colors.border}`,
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '60px auto'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Database size={40} color="white" />
            </div>
            <h3 style={{ margin: '0 0 12px', color: colors.text, fontSize: '24px', fontWeight: '700' }}>
              Create Your First Dashboard
            </h3>
            <p style={{ margin: '0 0 32px', color: colors.textSecondary, fontSize: '15px', lineHeight: '1.6' }}>
              Build powerful visualizations from your QuestDB data. Click the button below to add your first panel and start monitoring in real-time.
            </p>
            <button
              onClick={handleAddPanel}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
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
              Add Your First Panel
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '20px',
            maxWidth: '1600px',
            margin: '0 auto'
          }}>
            {panels.map(panel => (
              <div key={panel.id} style={{ height: '350px' }}>
                <QuestDBPanel
                  config={panel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}

export default function MiralysDashboard() {
  return (
    <ThemeProvider>
      <DashboardApp />
    </ThemeProvider>
  );
}
