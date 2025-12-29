import {
  Activity, TrendingUp, BarChart3, PieChart as PieIcon,
  CircleDot, Radar as RadarIcon, Gauge, Table as TableIcon
} from 'lucide-react';

export const COLORS = [
  '#667eea', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

export const VIZ_TYPES = [
  { id: 'line', name: 'Line Chart', icon: Activity, description: 'Time series line chart' },
  { id: 'area', name: 'Area Chart', icon: TrendingUp, description: 'Filled area chart' },
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Vertical bars' },
  { id: 'pie', name: 'Pie Chart', icon: PieIcon, description: 'Circular pie chart' },
  { id: 'scatter', name: 'Scatter Plot', icon: CircleDot, description: 'X-Y scatter plot' },
  { id: 'radar', name: 'Radar Chart', icon: RadarIcon, description: 'Spider/radar chart' },
  { id: 'stat', name: 'Stat Panel', icon: Gauge, description: 'Single value display' },
  { id: 'table', name: 'Table', icon: TableIcon, description: 'Data table' }
];

export const DEFAULT_PANEL_CONFIG = {
  title: 'New Panel',
  vizType: 'line',
  dataSource: 'custom',
  query: '',
  table: '',
  timestampField: 'timestamp',
  xAxis: 'timestamp',
  yAxes: ['value'],
  limit: 100,
  refreshInterval: 5000,
  colors: [COLORS[0]],
  showLegend: true,
  showGrid: true,
  lineWidth: 2,
  showDots: false,
  fillOpacity: 0.3,
  aggregate: 'none',
  width: 1,
  height: 1
};

export const GRID_COLS = 12;
export const ROW_HEIGHT = 100;

// Dark mode colors
export const DARK_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  
  bg: {
    main: '#0f172a',
    card: '#1e293b',
    hover: '#334155',
    elevated: '#1e293b'
  },
  
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    muted: '#94a3b8'
  },
  
  border: {
    main: '#334155',
    light: '#475569',
    accent: '#6366f1'
  },
  
  chart: {
    grid: 'rgba(148, 163, 184, 0.1)',
    axis: '#475569',
    text: '#94a3b8'
  }
};
