// Dashboard.jsx - COMPLETE VERSION WITH LEGEND POSITION FIX
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, LogOut, Database, Zap, Folder, Save, Download, Upload, Moon, Sun, Settings, X,
  Grid, BarChart3, Activity, TrendingUp, Layers, Maximize2, MoreHorizontal
} from 'lucide-react';
import authService from '../../services/auth';
import questdbService from '../../services/questdb';
import dashboardService from '../../services/dashboardService';
import DashboardModal from './DashboardModal';
import PanelConfigModal from './PanelConfigModal';
import QuestDBPanel from './QuestDBPanel';
import ScadaDesigner from './ScadaDesigner';
import ScadaPanel from './ScadaPanel';
import { GRID_COLS, ROW_HEIGHT, DARK_COLORS } from './constants';

const getPlantId = (user) => {
  if (!user) {
    console.error('❌ No user object provided');
    return null;
  }
  
  if (user.plantId) {
    console.log('✅ Found plantId:', user.plantId);
    return user.plantId;
  }
  
  if (user.plantAccess && Array.isArray(user.plantAccess) && user.plantAccess.length > 0) {
    const plantId = user.plantAccess[0].plantId;
    console.log('✅ Found plantId from plantAccess:', plantId);
    return plantId;
  }
  
  console.error('❌ No plantId found in user object:', user);
  return null;
};

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [dashboards, setDashboards] = useState([]);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showScadaModal, setShowScadaModal] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [editingScadaDiagram, setEditingScadaDiagram] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [draggingPanel, setDraggingPanel] = useState(null);
  const [resizingPanel, setResizingPanel] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('miralys_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive grid columns based on window width
  const getResponsiveGridCols = () => {
    if (windowWidth < 640) return 1;        // Mobile: 1 column
    if (windowWidth < 1024) return 2;       // Tablet: 2 columns
    if (windowWidth < 1440) return 4;       // Laptop: 4 columns
    return GRID_COLS;                       // Desktop: 6 columns
  };

  const responsiveGridCols = getResponsiveGridCols();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('👤 Current user object:', user);
    console.log('🏭 Extracted plantId:', getPlantId(user));
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const result = await questdbService.getTables();
        const tableNames = result.map(row => row.table_name);
        setAvailableTables(tableNames);
        console.log('Loaded tables:', tableNames);
      } catch (error) {
        console.error('Error fetching tables:', error);
        setAvailableTables([]);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    setSyncError(null);
    
    try {
      const remoteDashboards = await dashboardService.syncDashboards();
      
      if (remoteDashboards && remoteDashboards.length > 0) {
        setDashboards(remoteDashboards);
        
        const defaultDashboard = remoteDashboards.find(d => d.isDefault);
        const activeDashboardId = localStorage.getItem('miralys_active_dashboard');
        const activeDashboard = remoteDashboards.find(d => d.id === activeDashboardId);
        
        setCurrentDashboard(activeDashboard || defaultDashboard || remoteDashboards[0]);
      } else {
        await createDefaultDashboard();
      }
    } catch (error) {
      console.error('Error loading dashboards:', error);
      setSyncError('Failed to load dashboards. Using offline mode.');
      
      const saved = localStorage.getItem('miralys_dashboards');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setDashboards(parsed);
            setCurrentDashboard(parsed[0]);
          } else {
            createDefaultDashboardOffline();
          }
        } catch (e) {
          console.error('Error parsing localStorage dashboards:', e);
          createDefaultDashboardOffline();
        }
      } else {
        createDefaultDashboardOffline();
      }
    } finally {
      setLoading(false);
    }
  };

  const createDefaultDashboard = async () => {
    try {
      const plantId = getPlantId(user);
      
      if (!plantId) {
        console.error('❌ No plantId found for user - creating offline dashboard');
        createDefaultDashboardOffline();
        return;
      }

      console.log('📝 Creating default dashboard for plant:', plantId);
      const newDashboard = await dashboardService.createDashboard(
        'Default Dashboard',
        plantId,
        [],
        true
      );

      setDashboards([newDashboard]);
      setCurrentDashboard(newDashboard);
      console.log('✅ Default dashboard created successfully');
    } catch (error) {
      console.error('❌ Error creating default dashboard:', error);
      createDefaultDashboardOffline();
    }
  };

  const createDefaultDashboardOffline = () => {
    console.log('📝 Creating offline default dashboard');
    const defaultDashboard = {
      id: `dashboard_${Date.now()}`,
      name: 'Default Dashboard',
      panels: []
    };
    setDashboards([defaultDashboard]);
    setCurrentDashboard(defaultDashboard);
    localStorage.setItem('miralys_dashboards', JSON.stringify([defaultDashboard]));
  };

  useEffect(() => {
    if (dashboards.length > 0) {
      localStorage.setItem('miralys_dashboards', JSON.stringify(dashboards));
    }
    if (currentDashboard) {
      localStorage.setItem('miralys_active_dashboard', currentDashboard.id);
    }
  }, [dashboards, currentDashboard]);

  useEffect(() => {
    localStorage.setItem('miralys_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = darkMode ? {
    bg: '#0a0e1a',
    bgSecondary: '#111827',
    card: '#1a1f35',
    cardHover: '#252b45',
    hover: '#1e2538',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    border: '#2d3548',
    borderLight: '#3f4a61',
    accent: '#6366f1',
    accentHover: '#7c3aed',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  } : {
    bg: '#f9fafb',
    bgSecondary: '#ffffff',
    card: '#ffffff',
    cardHover: '#f3f4f6',
    hover: '#f3f4f6',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#e2e8f0',
    borderLight: '#cbd5e1',
    accent: '#6366f1',
    accentHover: '#7c3aed',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const handleAddPanel = () => {
    setEditingPanel(null);
    setShowConfigModal(true);
  };

  const handleAddScada = () => {
    setEditingScadaDiagram(null);
    setShowScadaModal(true);
  };

  const handleEdit = (panel) => {
    if (panel.type === 'scada') {
      setEditingScadaDiagram(panel);
      setShowScadaModal(true);
    } else {
      setEditingPanel(panel);
      setShowConfigModal(true);
    }
  };

  const handleDelete = (panelId) => {
    if (!currentDashboard) return;
    const updated = {
      ...currentDashboard,
      panels: currentDashboard.panels.filter(p => p.id !== panelId)
    };
    updateDashboard(updated);
  };

  const handleDuplicate = (panel) => {
    if (!currentDashboard) return;
    const newPanel = {
      ...panel,
      id: `panel_${Date.now()}`,
      title: `${panel.title} (Copy)`,
      x: (panel.x + 2) % GRID_COLS,
      y: panel.y + 1
    };
    const updated = {
      ...currentDashboard,
      panels: [...currentDashboard.panels, newPanel]
    };
    updateDashboard(updated);
  };

  // ✅ FIXED: handleSavePanel with explicit legendPosition preservation
  const handleSavePanel = (panelData) => {
    if (!currentDashboard) return;
    
    console.log('💾 SAVE PANEL - Received panelData:', {
      id: panelData.id,
      title: panelData.title,
      legendPosition: panelData.legendPosition,
      showLegend: panelData.showLegend,
      vizType: panelData.vizType
    });
    
    let updatedPanels;
    if (editingPanel || editingScadaDiagram) {
      const editingId = editingPanel?.id || editingScadaDiagram?.id;
      updatedPanels = currentDashboard.panels.map(p => {
        if (p.id === editingId) {
          // ✅ CRITICAL FIX: Explicitly preserve all properties including legendPosition
          const mergedPanel = {
            ...p,              // Start with existing panel
            ...panelData,      // Override with new data
            id: p.id,          // Always preserve ID
            // ✅ Explicitly ensure critical properties are not lost
           // legendPosition: panelData.legendPosition || p.legendPosition || 'top',
           // showLegend: panelData.showLegend !== undefined ? panelData.showLegend : (p.showLegend !== undefined ? p.showLegend : true)
          };
          
          console.log('✅ MERGED PANEL:', {
            id: mergedPanel.id,
            title: mergedPanel.title,
            legendPosition: mergedPanel.legendPosition,
            showLegend: mergedPanel.showLegend
          });
          
          return mergedPanel;
        }
        return p;
      });
    } else {
      const newPanel = {
        ...panelData,
        id: `panel_${Date.now()}`,
        x: 0,
        y: currentDashboard.panels.length > 0 
          ? Math.max(...currentDashboard.panels.map(p => p.y + p.height)) 
          : 0,
        width: panelData.width || 4,
        height: panelData.height || 2,
        legendPosition: panelData.legendPosition 
      };
      
      console.log('✅ NEW PANEL:', {
        id: newPanel.id,
        title: newPanel.title,
        legendPosition: newPanel.legendPosition
      });
      
      updatedPanels = [...currentDashboard.panels, newPanel];
    }

    const updated = {
      ...currentDashboard,
      panels: updatedPanels
    };
    
    console.log('📦 DASHBOARD UPDATE - Panels:', updated.panels.map(p => ({
      id: p.id,
      title: p.title,
      legendPosition: p.legendPosition
    })));
    
    updateDashboard(updated);
    
    setShowConfigModal(false);
    setShowScadaModal(false);
    setEditingPanel(null);
    setEditingScadaDiagram(null);
  };

  const handleResize = (panelId, newWidth, newHeight) => {
    if (!currentDashboard) return;
    const updated = {
      ...currentDashboard,
      panels: currentDashboard.panels.map(p =>
        p.id === panelId ? { ...p, width: newWidth, height: newHeight } : p
      )
    };
    updateDashboard(updated);
  };

  const handleDragStart = (e, panel) => {
    setDraggingPanel(panel);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPanel) => {
    e.preventDefault();
    if (!draggingPanel || !currentDashboard || draggingPanel.id === targetPanel.id) {
      setDraggingPanel(null);
      return;
    }

    const updatedPanels = currentDashboard.panels.map(p => {
      if (p.id === draggingPanel.id) {
        return { ...p, x: targetPanel.x, y: targetPanel.y };
      }
      if (p.id === targetPanel.id) {
        return { ...p, x: draggingPanel.x, y: draggingPanel.y };
      }
      return p;
    });

    const updated = {
      ...currentDashboard,
      panels: updatedPanels
    };
    updateDashboard(updated);
    setDraggingPanel(null);
  };

  const handleResizeStart = (e, panel, corner) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingPanel({ id: panel.id, corner });
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: panel.width,
      height: panel.height
    });
  };

  const handleResizeMove = (e) => {
    if (!resizingPanel || !currentDashboard) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    const gridWidth = window.innerWidth / GRID_COLS;
    const newWidthCols = Math.max(2, Math.round(resizeStart.width + deltaX / gridWidth));
    const newHeightRows = Math.max(1, Math.round(resizeStart.height + deltaY / ROW_HEIGHT));

    const updatedPanels = currentDashboard.panels.map(p => {
      if (p.id === resizingPanel.id) {
        return { ...p, width: newWidthCols, height: newHeightRows };
      }
      return p;
    });

    const updated = {
      ...currentDashboard,
      panels: updatedPanels
    };
    setCurrentDashboard(updated);
  };

  const handleResizeEnd = () => {
    if (resizingPanel && currentDashboard) {
      updateDashboard(currentDashboard);
    }
    setResizingPanel(null);
  };

  React.useEffect(() => {
    if (resizingPanel) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingPanel, resizeStart, currentDashboard]);

  const updateDashboard = async (updatedDashboard) => {
    try {
      const saved = await dashboardService.updateDashboard(updatedDashboard.id, {
        name: updatedDashboard.name,
        panels: updatedDashboard.panels
      });
      
      setDashboards(dashboards.map(d => d.id === saved.id ? saved : d));
      setCurrentDashboard(saved);
    } catch (error) {
      console.error('Error updating dashboard:', error);
      setDashboards(dashboards.map(d => d.id === updatedDashboard.id ? updatedDashboard : d));
      setCurrentDashboard(updatedDashboard);
    }
  };

  const handleSelectDashboard = (dashboard) => {
    setCurrentDashboard(dashboard);
    setShowDashboardModal(false);
  };

  const handleCreateDashboard = async (name) => {
    try {
      const plantId = getPlantId(user);
      if (!plantId) {
        throw new Error('No plantId found');
      }

      const newDashboard = await dashboardService.createDashboard(name, plantId, [], false);
      setDashboards([...dashboards, newDashboard]);
      setCurrentDashboard(newDashboard);
      setShowDashboardModal(false);
    } catch (error) {
      console.error('Error creating dashboard:', error);
      const offlineDashboard = {
        id: `dashboard_${Date.now()}`,
        name,
        panels: []
      };
      setDashboards([...dashboards, offlineDashboard]);
      setCurrentDashboard(offlineDashboard);
      setShowDashboardModal(false);
    }
  };

  const handleRenameDashboard = async (dashboardId, newName) => {
    try {
      const dashboard = dashboards.find(d => d.id === dashboardId);
      if (!dashboard) return;

      const updated = await dashboardService.updateDashboard(dashboardId, {
        name: newName,
        panels: dashboard.panels
      });

      setDashboards(dashboards.map(d => d.id === dashboardId ? updated : d));
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(updated);
      }
    } catch (error) {
      console.error('Error renaming dashboard:', error);
      const updatedDashboards = dashboards.map(d =>
        d.id === dashboardId ? { ...d, name: newName } : d
      );
      setDashboards(updatedDashboards);
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(updatedDashboards.find(d => d.id === dashboardId));
      }
    }
  };

  const handleDeleteDashboard = async (dashboardId) => {
    try {
      await dashboardService.deleteDashboard(dashboardId);
      const remaining = dashboards.filter(d => d.id !== dashboardId);
      setDashboards(remaining);
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(remaining[0] || null);
      }
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      const remaining = dashboards.filter(d => d.id !== dashboardId);
      setDashboards(remaining);
      
      if (currentDashboard?.id === dashboardId) {
        setCurrentDashboard(remaining[0] || null);
      }
    }
  };

  const calculatePanelStyle = (panel) => {
    // Adjust panel width to fit responsive grid
    const adjustedWidth = Math.min(panel.width || 4, responsiveGridCols);
    const adjustedHeight = windowWidth < 640 ? 1 : (panel.height || 2);
    
    return {
      gridColumn: `span ${adjustedWidth}`,
      gridRow: `span ${adjustedHeight}`
    };
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.bg,
        color: theme.text
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${theme.border}`,
            borderTopColor: theme.accent,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '14px', color: theme.textMuted }}>Loading dashboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: theme.bg,
      color: theme.text,
      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
     
      {/* Premium Header */}
      <div style={{
        background: theme.card,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        minHeight: windowWidth < 640 ? '48px' : '56px',
        padding: windowWidth < 640 ? '0 8px' : '0 16px',
        gap: windowWidth < 640 ? '6px' : '12px',
        flexShrink: 0,
        flexWrap: windowWidth < 1024 ? 'wrap' : 'nowrap'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: windowWidth < 640 ? '6px' : '8px',
          flexShrink: 0
        }}>
          <div style={{
            width: windowWidth < 640 ? '28px' : '32px',
            height: windowWidth < 640 ? '28px' : '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/vite.svg" 
              alt="Miralys Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          {windowWidth >= 640 && (
            <span style={{
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: theme.text
            }}>
              Miralys
            </span>
          )}
        </div>

        {/* Chrome-style Auto-shrinking Tabs - Hide on mobile */}
        {windowWidth >= 640 && (
          <div style={{
            display: 'flex',
            gap: '4px',
            flex: '1 1 auto',
            minWidth: 0,
            alignItems: 'flex-end',
            overflow: 'hidden'
          }}>
            {dashboards.slice(0, windowWidth < 1024 ? 2 : dashboards.length).map((dashboard) => (
              <button
                key={dashboard.id}
                onClick={() => handleSelectDashboard(dashboard)}
                style={{
                  padding: windowWidth < 1024 ? '6px 10px' : '8px 14px',
                  background: currentDashboard?.id === dashboard.id ? theme.card : 'transparent',
                  color: currentDashboard?.id === dashboard.id ? theme.text : theme.textMuted,
                  border: 'none',
                  borderBottom: currentDashboard?.id === dashboard.id
                    ? `2px solid ${theme.accent}`
                    : '2px solid transparent',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px 6px 0 0',
                  fontSize: windowWidth < 1024 ? '12px' : '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flex: '1 1 auto',
                  minWidth: windowWidth < 1024 ? '80px' : '120px',
                  maxWidth: windowWidth < 1024 ? '140px' : '200px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (currentDashboard?.id !== dashboard.id) {
                    e.currentTarget.style.background = theme.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentDashboard?.id !== dashboard.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Grid size={windowWidth < 1024 ? 12 : 14} color={currentDashboard?.id === dashboard.id ? theme.text : theme.textMuted} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dashboard.name}
                </span>
                {dashboard.panels?.length > 0 && windowWidth >= 1024 && (
                  <span style={{
                    fontSize: '10px',
                    background: currentDashboard?.id === dashboard.id ? theme.accent : theme.border,
                    color: currentDashboard?.id === dashboard.id ? 'white' : theme.textMuted,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {dashboard.panels.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* New Tab + Button */}
        <button
          onClick={() => setShowDashboardModal(true)}
          style={{
            padding: windowWidth < 640 ? '8px' : '10px',
            background: 'transparent',
            border: `2px solid ${theme.border}`,
            borderRadius: windowWidth < 640 ? '6px' : '8px',
            color: theme.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.accent;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus size={windowWidth < 640 ? 14 : 16} />
        </button>

        {/* Divider - Hide on mobile */}
        {windowWidth >= 640 && (
          <div style={{ width: '1px', height: '28px', background: theme.border, flexShrink: 0 }} />
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: windowWidth < 640 ? '4px' : '6px', flexShrink: 0 }}>
          <button
            onClick={handleAddPanel}
            disabled={!currentDashboard}
            style={{
              padding: windowWidth < 640 ? '3px 6px' : '4px 8px',
              background: currentDashboard ? theme.accent : theme.border,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: windowWidth < 640 ? '9px' : '11px',
              fontWeight: '600',
              cursor: currentDashboard ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: windowWidth < 640 ? '2px' : '4px',
              opacity: currentDashboard ? 1 : 0.5,
              flexShrink: 0
            }}
          >
            <BarChart3 size={windowWidth < 640 ? 10 : 12} />
            {windowWidth >= 1024 && 'Panel'}
          </button>

          <button
            onClick={handleAddScada}
            disabled={!currentDashboard}
            style={{
              padding: windowWidth < 640 ? '3px 6px' : '4px 8px',
              background: currentDashboard ? theme.success : theme.border,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: windowWidth < 640 ? '9px' : '11px',
              fontWeight: '600',
              cursor: currentDashboard ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: windowWidth < 640 ? '2px' : '4px',
              opacity: currentDashboard ? 1 : 0.5,
              flexShrink: 0
            }}
          >
            <Layers size={windowWidth < 640 ? 10 : 12} />
            {windowWidth >= 1024 && 'SCADA'}
          </button>

          {windowWidth >= 640 && (
            <div style={{ width: '1px', height: '24px', background: theme.border, flexShrink: 0 }} />
          )}

          <button
            onClick={toggleDarkMode}
            style={{
              padding: windowWidth < 640 ? '8px' : '10px',
              background: darkMode ? theme.cardHover : '#f9fafb',
              border: `2px solid ${theme.border}`,
              borderRadius: windowWidth < 640 ? '6px' : '8px',
              color: theme.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={windowWidth < 640 ? 16 : 18} /> : <Moon size={windowWidth < 640 ? 16 : 18} />}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: windowWidth < 640 ? '6px' : '8px',
              background: 'transparent',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? theme.cardHover : '#e5e7eb';
              e.currentTarget.style.color = theme.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.textMuted;
            }}
            title="Logout"
          >
            <LogOut size={windowWidth < 640 ? 16 : 18} />
          </button>
        </div>
      </div>

      {/* Sync Error Banner */}
      {syncError && (
        <div style={{
          padding: '10px 16px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderBottom: `1px solid ${theme.warning}`,
          color: theme.warning,
          fontSize: '13px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          <Database size={16} color={theme.warning} />
          {syncError}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: windowWidth < 640 ? '8px' : windowWidth < 1024 ? '10px' : '12px',
        background: theme.bg
      }}>
        {!currentDashboard || currentDashboard.panels.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: windowWidth < 640 ? '16px' : '0'
          }}>
            <div style={{ maxWidth: windowWidth < 640 ? '320px' : '480px' }}>
              <div style={{
                width: windowWidth < 640 ? '60px' : '80px',
                height: windowWidth < 640 ? '60px' : '80px',
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                borderRadius: windowWidth < 640 ? '16px' : '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                opacity: 0.9
              }}>
                <Layers size={windowWidth < 640 ? 28 : 36} color="white" />
              </div>
              <h2 style={{
                fontSize: windowWidth < 640 ? '20px' : '24px',
                fontWeight: '700',
                marginBottom: '12px',
                color: theme.text,
                letterSpacing: '-0.02em'
              }}>
                {currentDashboard ? 'Start Building Your Dashboard' : 'Welcome to Miralys'}
              </h2>
              <p style={{
                fontSize: windowWidth < 640 ? '13px' : '14px',
                color: theme.textMuted,
                marginBottom: '28px',
                lineHeight: '1.6'
              }}>
                {currentDashboard
                  ? 'Add data panels and SCADA diagrams to visualize your real-time data streams.'
                  : 'Create your first dashboard to organize visualizations and monitor your systems.'}
              </p>
              <div style={{ 
                display: 'flex', 
                gap: windowWidth < 640 ? '8px' : '10px', 
                justifyContent: 'center',
                flexDirection: windowWidth < 640 ? 'column' : 'row'
              }}>
                <button
                  onClick={currentDashboard ? handleAddPanel : () => setShowDashboardModal(true)}
                  style={{
                    padding: windowWidth < 640 ? '10px 20px' : '12px 24px',
                    background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: windowWidth < 640 ? '13px' : '14px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: darkMode 
                      ? '0 4px 16px rgba(99, 102, 241, 0.4)' 
                      : '0 2px 12px rgba(99, 102, 241, 0.3)',
                    width: windowWidth < 640 ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 6px 20px rgba(99, 102, 241, 0.5)' 
                      : '0 4px 16px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 4px 16px rgba(99, 102, 241, 0.4)' 
                      : '0 2px 12px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  <Plus size={windowWidth < 640 ? 16 : 18} color="white" />
                  {currentDashboard ? 'Add Data Panel' : 'Create Dashboard'}
                </button>
                {currentDashboard && (
                  <button
                    onClick={handleAddScada}
                    style={{
                      padding: windowWidth < 640 ? '10px 20px' : '12px 24px',
                      background: `linear-gradient(135deg, ${theme.success} 0%, #059669 100%)`,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: windowWidth < 640 ? '13px' : '14px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: darkMode 
                        ? '0 4px 16px rgba(16, 185, 129, 0.4)' 
                        : '0 2px 12px rgba(16, 185, 129, 0.3)',
                      width: windowWidth < 640 ? '100%' : 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = darkMode 
                        ? '0 6px 20px rgba(16, 185, 129, 0.5)' 
                        : '0 4px 16px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = darkMode 
                        ? '0 4px 16px rgba(16, 185, 129, 0.4)' 
                        : '0 2px 12px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <Layers size={windowWidth < 640 ? 16 : 18} color="white" />
                    Add SCADA Diagram
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${responsiveGridCols}, 1fr)`,
            gap: windowWidth < 640 ? '8px' : windowWidth < 1024 ? '10px' : '12px',
            gridAutoRows: windowWidth < 640 ? '180px' : `${ROW_HEIGHT}px`
          }}>
            {currentDashboard.panels.map((panel) => (
              <div 
                key={panel.id} 
                style={{
                  ...calculatePanelStyle(panel),
                  cursor: draggingPanel?.id === panel.id ? 'grabbing' : 'grab',
                  opacity: draggingPanel?.id === panel.id ? 0.5 : 1,
                  transition: 'opacity 0.2s ease',
                  position: 'relative'
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, panel)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, panel)}
              >
                {panel.type === 'scada' ? (
                  <div style={{
                    height: '100%',
                    background: theme.card,
                    borderRadius: '10px',
                    border: `1px solid ${theme.border}`,
                    overflow: 'hidden',
                    boxShadow: darkMode 
                      ? '0 2px 8px rgba(0,0,0,0.3)' 
                      : '0 1px 4px rgba(0,0,0,0.06)',
                    position: 'relative'
                  }}>
                    <div style={{
                      padding: '10px 12px',
                      borderBottom: `1px solid ${theme.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: theme.cardHover
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: theme.text 
                      }}>
                        {panel.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleEdit(panel)}
                          style={{
                            padding: '5px',
                            background: 'transparent',
                            border: 'none',
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Settings size={14} color={theme.textSecondary} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(panel)}
                          style={{
                            padding: '5px',
                            background: 'transparent',
                            border: 'none',
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Plus size={14} color={theme.textSecondary} />
                        </button>
                        <button
                          onClick={() => handleDelete(panel.id)}
                          style={{
                            padding: '5px',
                            background: 'transparent',
                            border: 'none',
                            color: theme.danger,
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <X size={14} color={theme.danger} />
                        </button>
                      </div>
                    </div>
                    <ScadaPanel config={panel} darkMode={darkMode} />
                    
                    <div
                      onMouseDown={(e) => handleResizeStart(e, panel, 'se')}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '24px',
                        height: '24px',
                        cursor: 'nwse-resize',
                        background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                        borderRadius: '0 0 10px 0',
                        opacity: 0.8,
                        zIndex: 10,
                        boxShadow: darkMode 
                          ? `0 2px 8px rgba(99, 102, 241, 0.5)` 
                          : `0 2px 6px rgba(99, 102, 241, 0.4)`,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: `1px solid ${theme.border}`,
                        borderTop: `1px solid ${theme.border}`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.boxShadow = darkMode 
                          ? '0 4px 12px rgba(99, 102, 241, 0.7)' 
                          : '0 3px 10px rgba(99, 102, 241, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.boxShadow = darkMode 
                          ? '0 2px 8px rgba(99, 102, 241, 0.5)' 
                          : '0 2px 6px rgba(99, 102, 241, 0.4)';
                      }}
                    >
                      <Maximize2 size={14} color="white" style={{ opacity: 0.95 }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', height: '100%' }}>
                    <QuestDBPanel
                      config={panel}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onResize={handleResize}
                      darkMode={darkMode}
                    />
                    
                    <div
                      onMouseDown={(e) => handleResizeStart(e, panel, 'se')}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '24px',
                        height: '24px',
                        cursor: 'nwse-resize',
                        background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                        borderRadius: '0 0 10px 0',
                        opacity: 0.8,
                        zIndex: 10,
                        boxShadow: darkMode 
                          ? `0 2px 8px rgba(99, 102, 241, 0.5)` 
                          : `0 2px 6px rgba(99, 102, 241, 0.4)`,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: `1px solid ${theme.border}`,
                        borderTop: `1px solid ${theme.border}`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.boxShadow = darkMode 
                          ? '0 4px 12px rgba(99, 102, 241, 0.7)' 
                          : '0 3px 10px rgba(99, 102, 241, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                        e.currentTarget.style.boxShadow = darkMode 
                          ? '0 2px 8px rgba(99, 102, 241, 0.5)' 
                          : '0 2px 6px rgba(99, 102, 241, 0.4)';
                      }}
                    >
                      <Maximize2 size={14} color="white" style={{ opacity: 0.95 }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showConfigModal && (
        <PanelConfigModal
          panel={editingPanel}
          onSave={handleSavePanel}
          onClose={() => {
            setShowConfigModal(false);
            setEditingPanel(null);
          }}
          allTables={availableTables}
          darkMode={darkMode}
        />
      )}

      {showDashboardModal && (
        <DashboardModal
          currentDashboard={currentDashboard}
          dashboards={dashboards}
          onSelect={handleSelectDashboard}
          onCreate={handleCreateDashboard}
          onRename={handleRenameDashboard}
          onDelete={handleDeleteDashboard}
          onClose={() => setShowDashboardModal(false)}
          darkMode={darkMode}
        />
      )}

      {showScadaModal && (
        <ScadaDesigner
          config={editingScadaDiagram}
          onSave={handleSavePanel}
          onClose={() => {
            setShowScadaModal(false);
            setEditingScadaDiagram(null);
          }}
          darkMode={darkMode}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: ${theme.border} transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background: ${theme.border};
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: ${theme.borderLight};
        }
      `}</style>
    </div>
  );
}
