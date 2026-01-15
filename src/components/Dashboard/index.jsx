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
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
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

  const MAX_VISIBLE_TABS = 6;

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

  const handleSavePanel = (panelData) => {
    if (!currentDashboard) return;
    
    let updatedPanels;
    if (editingPanel || editingScadaDiagram) {
      const editingId = editingPanel?.id || editingScadaDiagram?.id;
      updatedPanels = currentDashboard.panels.map(p => 
        p.id === editingId ? { ...panelData, id: p.id } : p
      );
    } else {
      const newPanel = {
        ...panelData,
        id: `panel_${Date.now()}`,
        x: 0,
        y: currentDashboard.panels.length > 0 
          ? Math.max(...currentDashboard.panels.map(p => p.y + p.height)) 
          : 0,
        width: panelData.width || 4,
        height: panelData.height || 2
      };
      updatedPanels = [...currentDashboard.panels, newPanel];
    }

    const updated = {
      ...currentDashboard,
      panels: updatedPanels
    };
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
    setShowOverflowMenu(false);
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
    return {
      gridColumn: `span ${panel.width || 4}`,
      gridRow: `span ${panel.height || 2}`
    };
  };

  // Split dashboards into visible and overflow
  const visibleTabs = dashboards.slice(0, MAX_VISIBLE_TABS);
  const overflowTabs = dashboards.slice(MAX_VISIBLE_TABS);

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
        height: '56px',
        padding: '0 16px',
        gap: '12px',
        flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={18} color="white" />
          </div>
          <span style={{
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            color: theme.text
          }}>
            Miralys
          </span>
        </div>

        {/* Chrome-style Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          minWidth: 0
        }}>
          {visibleTabs.map((dashboard) => (
            <button
              key={dashboard.id}
              onClick={() => handleSelectDashboard(dashboard)}
              style={{
                padding: '8px 14px',
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
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (currentDashboard?.id !== dashboard.id) {
                  e.target.style.background = theme.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (currentDashboard?.id !== dashboard.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <Grid size={14} color={currentDashboard?.id === dashboard.id ? theme.text : theme.textMuted} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {dashboard.name}
              </span>
              {dashboard.panels?.length > 0 && (
                <span style={{
                  fontSize: '10px',
                  background: currentDashboard?.id === dashboard.id ? theme.accent : theme.border,
                  color: currentDashboard?.id === dashboard.id ? 'white' : theme.textMuted,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: '700'
                }}>
                  {dashboard.panels.length}
                </span>
              )}
            </button>
          ))}

          {/* Overflow Menu */}
          {overflowTabs.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: theme.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme.hover;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                <MoreHorizontal size={16} color={theme.text} />
              </button>

              {showOverflowMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  boxShadow: darkMode 
                    ? '0 10px 30px rgba(0,0,0,0.5)' 
                    : '0 4px 20px rgba(0,0,0,0.15)',
                  minWidth: '200px',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  {overflowTabs.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleSelectDashboard(d)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        color: theme.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = theme.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      <Grid size={14} color={theme.textMuted} />
                      <span style={{ flex: 1 }}>{d.name}</span>
                      {d.panels?.length > 0 && (
                        <span style={{
                          fontSize: '10px',
                          background: theme.border,
                          color: theme.textMuted,
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontWeight: '700'
                        }}>
                          {d.panels.length}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* New Tab + Button */}
        <button
          onClick={() => setShowDashboardModal(true)}
          style={{
            width: '32px',
            height: '32px',
            background: 'transparent',
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: theme.text
          }}
          onMouseEnter={(e) => {
            e.target.style.background = theme.hover;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          <Plus size={16} color={theme.text} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: theme.border, flexShrink: 0 }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={handleAddPanel}
            disabled={!currentDashboard}
            style={{
              padding: '8px 14px',
              background: currentDashboard ? theme.accent : theme.border,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: currentDashboard ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: currentDashboard ? 1 : 0.5,
              flexShrink: 0
            }}
          >
            <BarChart3 size={14} color="white" />
            Panel
          </button>

          <button
            onClick={handleAddScada}
            disabled={!currentDashboard}
            style={{
              padding: '8px 14px',
              background: currentDashboard ? theme.success : theme.border,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: currentDashboard ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: currentDashboard ? 1 : 0.5,
              flexShrink: 0
            }}
          >
            <Settings size={14} color="white" />
            SCADA
          </button>

          <div style={{ width: '1px', height: '24px', background: theme.border, flexShrink: 0 }} />

          <button
            onClick={toggleDarkMode}
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: theme.text
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            {darkMode ? <Sun size={18} color={theme.text} /> : <Moon size={18} color={theme.text} />}
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: theme.danger
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.hover;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <LogOut size={18} color={theme.danger} />
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
        padding: '12px',
        background: theme.bg
      }}>
        {!currentDashboard || currentDashboard.panels.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: '480px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                opacity: 0.9
              }}>
                <Layers size={36} color="white" />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '12px',
                color: theme.text,
                letterSpacing: '-0.02em'
              }}>
                {currentDashboard ? 'Start Building Your Dashboard' : 'Welcome to Miralys'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                marginBottom: '28px',
                lineHeight: '1.6'
              }}>
                {currentDashboard
                  ? 'Add data panels and SCADA diagrams to visualize your real-time data streams.'
                  : 'Create your first dashboard to organize visualizations and monitor your systems.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={currentDashboard ? handleAddPanel : () => setShowDashboardModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: darkMode 
                      ? '0 4px 16px rgba(99, 102, 241, 0.4)' 
                      : '0 2px 12px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = darkMode 
                      ? '0 6px 20px rgba(99, 102, 241, 0.5)' 
                      : '0 4px 16px rgba(99, 102, 241, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = darkMode 
                      ? '0 4px 16px rgba(99, 102, 241, 0.4)' 
                      : '0 2px 12px rgba(99, 102, 241, 0.3)';
                  }}
                >
                  <Plus size={18} color="white" />
                  {currentDashboard ? 'Add Data Panel' : 'Create Dashboard'}
                </button>
                {currentDashboard && (
                  <button
                    onClick={handleAddScada}
                    style={{
                      padding: '12px 24px',
                      background: `linear-gradient(135deg, ${theme.success} 0%, #059669 100%)`,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: darkMode 
                        ? '0 4px 16px rgba(16, 185, 129, 0.4)' 
                        : '0 2px 12px rgba(16, 185, 129, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = darkMode 
                        ? '0 6px 20px rgba(16, 185, 129, 0.5)' 
                        : '0 4px 16px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = darkMode 
                        ? '0 4px 16px rgba(16, 185, 129, 0.4)' 
                        : '0 2px 12px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <Settings size={18} color="white" />
                    Add SCADA Diagram
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: '12px',
            gridAutoRows: `${ROW_HEIGHT}px`
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
                        e.target.style.opacity = '1';
                        e.target.style.boxShadow = darkMode 
                          ? '0 4px 12px rgba(99, 102, 241, 0.7)' 
                          : '0 3px 10px rgba(99, 102, 241, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '0.8';
                        e.target.style.boxShadow = darkMode 
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
                        e.target.style.opacity = '1';
                        e.target.style.boxShadow = darkMode 
                          ? '0 4px 12px rgba(99, 102, 241, 0.7)' 
                          : '0 3px 10px rgba(99, 102, 241, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '0.8';
                        e.target.style.boxShadow = darkMode 
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
