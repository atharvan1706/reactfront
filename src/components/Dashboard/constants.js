import {
  Activity, TrendingUp, BarChart3, PieChart as PieIcon,
  CircleDot, Radar as RadarIcon, Gauge, Table as TableIcon
} from 'lucide-react';

export const COLORS = [
  '#667eea', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#f43f5e', '#a855f7', '#84cc16',
  '#fb923c', '#38bdf8', '#fb7185'
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
  dataSource: 'table',
  table: '',
  query: '',
  timestampField: 'timestamp',
  yAxis: '',
  yAxes: [],
  limit: 100,
  refreshInterval: 0,
  x: 0,
  y: 0,
  width: 4,
  height: 2,
  colors: [COLORS[0], COLORS[1], COLORS[2], COLORS[3], COLORS[4]],
  lineWidth: 2,
  fillOpacity: 0.5,
  showLegend: true,
  showGrid: true,
  showDots: false,
  transformations: [],
  
  // ✅ NEW FIELDS
  timezone: 'UTC',
  yAxisScale: 'auto',
  yAxisMin: '',
  yAxisMax: '',
  xAxisScale: 'auto',
  timeRange: 'all',
  timeRangeLast: '1h',
  timeRangeStart: '',
  timeRangeEnd: '',
  filters: []
};

export const FILTER_OPERATORS = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '>=', label: 'Greater or Equal' },
  { value: '<=', label: 'Less or Equal' },
  { value: 'LIKE', label: 'Contains' },
  { value: 'NOT LIKE', label: 'Not Contains' },
  { value: 'IN', label: 'In List' },
  { value: 'NOT IN', label: 'Not In List' }
];

export const TIME_RANGES = [
  { value: '5m', label: 'Last 5 minutes', interval: '5 minutes' },
  { value: '15m', label: 'Last 15 minutes', interval: '15 minutes' },
  { value: '1h', label: 'Last 1 hour', interval: '1 hour' },
  { value: '6h', label: 'Last 6 hours', interval: '6 hours' },
  { value: '24h', label: 'Last 24 hours', interval: '24 hours' },
  { value: '7d', label: 'Last 7 days', interval: '7 days' },
  { value: '30d', label: 'Last 30 days', interval: '30 days' }
];

export const AXIS_SCALES = [
  { value: 'auto', label: 'Auto', description: 'Automatically scale axis' },
  { value: 'linear', label: 'Linear', description: 'Linear scaling' },
  { value: 'log', label: 'Logarithmic', description: 'Log scale (base 10)' },
  { value: 'custom', label: 'Custom', description: 'Custom min/max values' }
];

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

// Light mode colors
export const LIGHT_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  
  bg: {
    main: '#ffffff',
    card: '#f9fafb',
    hover: '#f3f4f6',
    elevated: '#ffffff'
  },
  
  text: {
    primary: '#111827',
    secondary: '#374151',
    muted: '#6b7280'
  },
  
  border: {
    main: '#e5e7eb',
    light: '#d1d5db',
    accent: '#6366f1'
  },
  
  chart: {
    grid: 'rgba(0, 0, 0, 0.1)',
    axis: '#d1d5db',
    text: '#6b7280'
  }
};
