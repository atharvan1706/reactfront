import { 
  TrendingUp, BarChart3, PieChart, Activity, 
  Scatter, Radar, Hash, Table 
} from 'lucide-react';

export const COLORS = [
  '#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea',
  '#38b2ac', '#e53e3e', '#dd6b20', '#805ad5', '#319795',
  '#3182ce', '#d69e2e', '#00b5d8', '#d53f8c', '#718096'
];

export const VIZ_TYPES = [
  { 
    id: 'line', 
    name: 'Line Chart', 
    description: 'Trends over time',
    icon: TrendingUp
  },
  { 
    id: 'bar', 
    name: 'Bar Chart', 
    description: 'Compare values',
    icon: BarChart3
  },
  { 
    id: 'area', 
    name: 'Area Chart', 
    description: 'Filled trends',
    icon: Activity
  },
  { 
    id: 'pie', 
    name: 'Pie Chart', 
    description: 'Proportions',
    icon: PieChart
  },
  { 
    id: 'scatter', 
    name: 'Scatter Plot', 
    description: 'Data distribution',
    icon: Scatter
  },
  { 
    id: 'radar', 
    name: 'Radar Chart', 
    description: 'Multi-axis',
    icon: Radar
  },
  { 
    id: 'stat', 
    name: 'Stat Panel', 
    description: 'Single value',
    icon: Hash
  },
  { 
    id: 'table', 
    name: 'Table View', 
    description: 'Raw data',
    icon: Table
  }
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
  width: 6,
  height: 4,
  limit: 100,
  refreshInterval: 0,
  colors: COLORS.slice(0, 5),
  lineWidth: 2,
  fillOpacity: 0.3,
  showLegend: true,
  showGrid: true,
  showDots: false,
  transformations: [],
  
  // Axis scaling
  yAxisScale: 'auto',
  yAxisMin: '',
  yAxisMax: '',
  xAxisScale: 'auto',
  
  // Time range
  timeRange: 'all',
  timeRangeLast: '1h',
  timeRangeStart: '',
  timeRangeEnd: '',
  
  // Filters
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
  { value: '5m', label: 'Last 5 minutes' },
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last 1 hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
];

export const AXIS_SCALES = [
  { value: 'auto', label: 'Auto', description: 'Automatically scale axis' },
  { value: 'linear', label: 'Linear', description: 'Linear scaling' },
  { value: 'log', label: 'Logarithmic', description: 'Log scale (base 10)' },
  { value: 'custom', label: 'Custom', description: 'Custom min/max values' }
];
