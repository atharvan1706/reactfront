// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush
} from 'recharts';
import {
  Plus, LogOut, Database, Activity, TrendingUp,
  BarChart3, PieChart as PieIcon,
  Copy, Play, RefreshCw, X,
  Gauge, Radar as RadarIcon,
  CircleDot, Table as TableIcon,
  AlertCircle, Settings, Save, Eye,
  Sun, Moon
} from 'lucide-react';

import authService from '../services/auth';
import questdbService from '../services/questdb';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

/* -------------------------------------------------------------------------- */
/*                                   THEME                                    */
/* -------------------------------------------------------------------------- */

const THEMES = {
  dark: {
    bg: '#0b1020',
    panel: '#161b2e',
    panelHeader: '#0f1424',
    border: '#2a3150',
    text: '#e5e7eb',
    subtext: '#9ca3af'
  },
  light: {
    bg: '#f4f6fb',
    panel: '#ffffff',
    panelHeader: '#f1f3f8',
    border: '#d1d5db',
    text: '#111827',
    subtext: '#6b7280'
  }
};

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899'
];

/* -------------------------------------------------------------------------- */
/*                               VISUAL TYPES                                 */
/* -------------------------------------------------------------------------- */

const VIZ_TYPES = [
  { id: 'line', name: 'Line', icon: Activity },
  { id: 'area', name: 'Area', icon: TrendingUp },
  { id: 'bar', name: 'Bar', icon: BarChart3 },
  { id: 'pie', name: 'Pie', icon: PieIcon },
  { id: 'scatter', name: 'Scatter', icon: CircleDot },
  { id: 'radar', name: 'Radar', icon: RadarIcon },
  { id: 'stat', name: 'Stat', icon: Gauge },
  { id: 'table', name: 'Table', icon: TableIcon }
];

/* -------------------------------------------------------------------------- */
/*                           PANEL CONFIG MODAL                                */
/* -------------------------------------------------------------------------- */

function PanelConfigModal({ panel, onSave, onClose, allTables, theme }) {
  const [config, setConfig] = useState(panel || {
    id: `panel_${Date.now()}`,
    title: 'New Panel',
    vizType: 'line',
    dataSource: 'table',
    table: '',
    query: '',
    timestampField: 'timestamp',
    yAxis: '',
    limit: 100,
    refreshInterval: 5000,
    color: COLORS[0]
  });

  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const preview = async () => {
    setLoading(true);
    setError(null);
    try {
      let q = config.query;
      if (config.dataSource === 'table' && config.table) {
        q = `SELECT * FROM ${config.table} ORDER BY ${config.timestampField} DESC LIMIT ${config.limit}`;
      }
      const res = await questdbService.query(q);
      setPreviewData(
        questdbService.formatForChart(res, config.timestampField)
      );
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const renderPreview = () => {
    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!previewData.length) return <p>No preview data</p>;

    const common = {
      data: previewData,
      margin: { top: 10, right: 20, left: 0, bottom: 10 }
    };

    return (
      <ResponsiveContainer width="100%" height={220}>
        {{
          line: (
            <LineChart {...common}>
              <XAxis dataKey="_time" />
              <YAxis />
              <Tooltip />
              <Line dataKey={config.yAxis} stroke={config.color} />
              <Brush />
            </LineChart>
          ),
          area: (
            <AreaChart {...common}>
              <XAxis dataKey="_time" />
              <YAxis />
              <Tooltip />
              <Area dataKey={config.yAxis} stroke={config.color} fill={config.color} />
              <Brush />
            </AreaChart>
          ),
          bar: (
            <BarChart {...common}>
              <XAxis dataKey="_time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={config.yAxis} fill={config.color} />
              <Brush />
            </BarChart>
          ),
          pie: (
            <PieChart>
              <Pie data={previewData.slice(0, 8)} dataKey={config.yAxis} label>
                {previewData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ),
          scatter: (
            <ScatterChart {...common}>
              <XAxis dataKey="_time" />
              <YAxis dataKey={config.yAxis} />
              <Tooltip />
              <Scatter dataKey={config.yAxis} fill={config.color} />
              <Brush />
            </ScatterChart>
          ),
          radar: (
            <RadarChart data={previewData.slice(0, 8)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="_time" />
              <PolarRadiusAxis />
              <Radar dataKey={config.yAxis} fill={config.color} />
            </RadarChart>
          ),
          stat: (
            <div style={{ fontSize: 42, textAlign: 'center' }}>
              {previewData.at(-1)?.[config.yAxis] ?? 0}
            </div>
          ),
          table: (
            <table width="100%">
              <tbody>
                {previewData.slice(0, 5).map((r, i) => (
                  <tr key={i}>
                    {Object.values(r).map((v, j) => (
                      <td key={j}>{String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }[config.vizType]}
      </ResponsiveContainer>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        width: 900, maxHeight: '90vh', overflow: 'auto',
        background: theme.panel, padding: 20, borderRadius: 12
      }}>
        <h2>{panel ? 'Edit Panel' : 'Add Panel'}</h2>

        <input
          value={config.title}
          onChange={e => setConfig({ ...config, title: e.target.value })}
          placeholder="Panel title"
        />

        <select
          value={config.vizType}
          onChange={e => setConfig({ ...config, vizType: e.target.value })}
        >
          {VIZ_TYPES.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        <select
          value={config.table}
          onChange={e => setConfig({ ...config, table: e.target.value })}
        >
          <option value="">Select table</option>
          {allTables.map(t => <option key={t}>{t}</option>)}
        </select>

        <input
          placeholder="Y Field"
          value={config.yAxis}
          onChange={e => setConfig({ ...config, yAxis: e.target.value })}
        />

        <button onClick={preview}><Eye size={14} /> Preview</button>

        {renderPreview()}

        <div style={{ marginTop: 20 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave(config)}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 PANEL                                      */
/* -------------------------------------------------------------------------- */

function QuestDBPanel({ config, theme, onEdit, onDelete, onDuplicate }) {
  const [data, setData] = useState([]);
  const ref = useRef();

  const fetchData = async () => {
    const q = config.query || `SELECT * FROM ${config.table} ORDER BY ${config.timestampField} DESC LIMIT ${config.limit}`;
    const res = await questdbService.query(q);
    setData(questdbService.formatForChart(res, config.timestampField));
  };

  useEffect(() => {
    fetchData();
    if (config.refreshInterval)
      ref.current = setInterval(fetchData, config.refreshInterval);
    return () => clearInterval(ref.current);
  }, [config]);

  return (
    <div style={{
      height: '100%',
      background: theme.panel,
      border: `1px solid ${theme.border}`,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: 10,
        background: theme.panelHeader,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <strong>{config.title}</strong>
        <div>
          <RefreshCw onClick={fetchData} size={14} />
          <Copy onClick={() => onDuplicate(config)} size={14} />
          <Settings onClick={() => onEdit(config)} size={14} />
          <X onClick={() => onDelete(config.id)} size={14} />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="_time" />
            <YAxis />
            <Tooltip />
            <Line dataKey={config.yAxis} stroke={config.color} />
            <Brush />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               DASHBOARD                                    */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const [themeName, setThemeName] = useState(
    localStorage.getItem('theme') || 'dark'
  );
  const theme = THEMES[themeName];

  const [panels, setPanels] = useState([]);
  const [layout, setLayout] = useState([]);
  const [tables, setTables] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    questdbService.getTables().then(t =>
      setTables(t.map(x => x.table_name))
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', themeName);
  }, [themeName]);

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text }}>
      {/* TOP BAR */}
      <div style={{
        padding: 16,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <strong>Dashboard</strong>
        <div>
          <button onClick={() => setThemeName(t => t === 'dark' ? 'light' : 'dark')}>
            {themeName === 'dark' ? <Sun /> : <Moon />}
          </button>
          <button onClick={() => authService.logout() && navigate('/login')}>
            <LogOut />
          </button>
        </div>
      </div>

      <GridLayout
        cols={12}
        rowHeight={30}
        width={1200}
        layout={layout}
        onLayoutChange={setLayout}
      >
        {panels.map(p => (
          <div key={p.id}>
            <QuestDBPanel
              config={p}
              theme={theme}
              onEdit={setEditing}
              onDelete={id => setPanels(ps => ps.filter(x => x.id !== id))}
              onDuplicate={p => setPanels(ps => [...ps, { ...p, id: Date.now() }])}
            />
          </div>
        ))}
      </GridLayout>

      {editing && (
        <PanelConfigModal
          panel={editing}
          onSave={p => {
            setPanels(ps => {
              const i = ps.findIndex(x => x.id === p.id);
              if (i >= 0) ps[i] = p;
              else ps.push(p);
              return [...ps];
            });
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
          allTables={tables}
          theme={theme}
        />
      )}
    </div>
  );
}
