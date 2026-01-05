import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, LogOut, Database, Zap, Folder, Save, Download, Upload, Moon, Sun, Settings, X
} from 'lucide-react';
import authService from '../../services/auth';
import questdbService from '../../services/questdb';
import DashboardModal from './DashboardModal';
import PanelConfigModal from './PanelConfigModal';
import QuestDBPanel from './QuestDBPanel';
import ScadaDesigner from './ScadaDesigner';
import ScadaPanel from './ScadaPanel';
import { GRID_COLS, ROW_HEIGHT, DARK_COLORS } from './constants';

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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('miralys_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

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
    const saved = localStorage.getItem('miralys_dashboards');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setDashboards(parsed);
          const activeDashboardId = localStorage.getItem('miralys_active_dashboard');
          const activeDashboard = parsed.find(d => d.id === activeDashboardId) || parsed[0];
          setCurrentDashboard(activeDashboard);
        } else {
          createDefaultDashboard();
        }
      } catch (e) {
        console.error('Error loading dashboards:', e);
        createDefaultDashboard();
      }
    } else {
      createDefaultDashboard();
    }
  }, []);

  const createDefaultDashboard = () => {
    const defaultDashboard = {
      id: `dashboard_${Date.now()}`,
      name: 'Default Dashboard',
      panels: []
    };
    setDashboards([defaultDashboard]);
    setCurrentDashboard(defaultDashboard);
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
    bg: DARK_COLORS.bg.main,
    card: DARK_COLORS.bg.card,
    hover: DARK_COLORS.bg.hover,
    text: DARK_COLORS.text.primary,
    textSecondary: DARK_COLORS.text.secondary,
    textMuted: DARK_COLORS.text.muted,
    border: DARK_COLORS.border.main,
    borderLight: DARK_COLORS.border.light,
    accent: DARK_COLORS.primary
  } : {
    bg: '#f3f4f6',
    card: 'white',
    hover: '#f9fafb',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    borderLight: '#d1d5db',
    accent: '#667eea'
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

  const handleSavePanel = (config) => {
  try {
    if (!config || !config.id) {
      console.error('Invalid panel config:', config);
      return;
    }

    const updatedDashboard = {
      ...currentDashboard,
      panels: [...(currentDashboard.panels || [])],
    };

    const panelExists = updatedDashboard.panels.some(
      p => p.id === config.id
    );

    if (panelExists) {
      updatedDashboard.panels = updatedDashboard.panels.map(p =>
        p.id === config.id ? config : p
      );
    } else {
      const newPanel = {
        ...config,
        x: 0,
        y: getNextAvailableY(),
        width: 12,  // Use config width or default to 4
        height: 6
      };
      updatedDashboard.panels.push(newPanel);
    }

    // Update states in the correct order
    setDashboards(prevDashboards =>
      prevDashboards.map(d =>
        d.id === updatedDashboard.id ? updatedDashboard : d
      )
    );
    
    setCurrentDashboard(updatedDashboard);
    
    // Close modals after state updates
    setTimeout(() => {
      setShowConfigModal(false);
      setShowScadaModal(false);
      setEditingPanel(null);
      setEditingScadaDiagram(null);
    }, 0);
  } catch (error) {
    console.error('Error saving panel:', error);
    alert('Failed to save panel. Please try again.');
  }
};


  const getNextAvailableY = () => {
    if (!currentDashboard?.panels || currentDashboard.panels.length === 0) return 0;
    const maxY = Math.max(...currentDashboard.panels.map(p => (p.y || 0) + (p.height || 1)));
    return maxY;
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
    if (window.confirm('Are you sure you want to delete this panel?')) {
      const updatedDashboard = {
        ...currentDashboard,
        panels: currentDashboard.panels.filter(p => p.id !== panelId)
      };
      setCurrentDashboard(updatedDashboard);
      setDashboards(dashboards.map(d => 
        d.id === updatedDashboard.id ? updatedDashboard : d
      ));
    }
  };

  const handleDuplicate = (panel) => {
    const newPanel = {
      ...panel,
      id: `panel_${Date.now()}`,
      title: `${panel.title} (Copy)`,
      y: getNextAvailableY()
    };
    const updatedDashboard = {
      ...currentDashboard,
      panels: [...(currentDashboard.panels || []), newPanel]
    };
    setCurrentDashboard(updatedDashboard);
    setDashboards(dashboards.map(d => 
      d.id === updatedDashboard.id ? updatedDashboard : d
    ));
  };

  const handleResize = (panelId, newWidth, newHeight) => {
    const updatedDashboard = {
      ...currentDashboard,
      panels: currentDashboard.panels.map(p =>
        p.id === panelId ? { ...p, width: newWidth, height: newHeight } : p
      )
    };
    setCurrentDashboard(updatedDashboard);
    setDashboards(dashboards.map(d =>
      d.id === updatedDashboard.id ? updatedDashboard : d
    ));
  };

  const handleCreateDashboard = (name) => {
    const newDashboard = {
      id: `dashboard_${Date.now()}`,
      name,
      panels: []
    };
    setDashboards([...dashboards, newDashboard]);
    setCurrentDashboard(newDashboard);
  };

  const handleSelectDashboard = (dashboardId) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      setCurrentDashboard(dashboard);
      setShowDashboardModal(false);
    }
  };

  const handleRenameDashboard = (dashboardId, newName) => {
    const updatedDashboards = dashboards.map(d =>
      d.id === dashboardId ? { ...d, name: newName } : d
    );
    setDashboards(updatedDashboards);
    if (currentDashboard?.id === dashboardId) {
      setCurrentDashboard({ ...currentDashboard, name: newName });
    }
  };

  const handleDeleteDashboard = (dashboardId) => {
    const updatedDashboards = dashboards.filter(d => d.id !== dashboardId);
    setDashboards(updatedDashboards);
    if (currentDashboard?.id === dashboardId) {
      setCurrentDashboard(updatedDashboards[0] || null);
    }
  };

  const handleExportDashboard = () => {
    if (!currentDashboard) return;
    
    const dataStr = JSON.stringify(currentDashboard, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDashboard.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDashboard = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        const newDashboard = {
          ...imported,
          id: `dashboard_${Date.now()}`,
          name: `${imported.name} (Imported)`
        };
        setDashboards([...dashboards, newDashboard]);
        setCurrentDashboard(newDashboard);
      } catch (error) {
        alert('Failed to import dashboard. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Drag and drop handlers
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
    if (!draggingPanel || draggingPanel.id === targetPanel.id) {
      setDraggingPanel(null);
      return;
    }

    const updatedPanels = [...currentDashboard.panels];
    const dragIndex = updatedPanels.findIndex(p => p.id === draggingPanel.id);
    const targetIndex = updatedPanels.findIndex(p => p.id === targetPanel.id);

    if (dragIndex !== -1 && targetIndex !== -1) {
      // Swap positions
      [updatedPanels[dragIndex], updatedPanels[targetIndex]] = 
      [updatedPanels[targetIndex], updatedPanels[dragIndex]];

      const updatedDashboard = {
        ...currentDashboard,
        panels: updatedPanels
      };
      setCurrentDashboard(updatedDashboard);
      setDashboards(dashboards.map(d => 
        d.id === updatedDashboard.id ? updatedDashboard : d
      ));
    }
    setDraggingPanel(null);
  };

  const calculatePanelStyle = (panel) => {
    const width = panel.width || 1;
    const height = panel.height || 1;
    
    return {
      gridColumn: `span ${Math.min(width, GRID_COLS)}`,
      gridRow: `span ${height}`,
      minHeight: `${height * ROW_HEIGHT}px`
    };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg,
      transition: 'background 0.3s ease'
    }}>
      <div style={{
        background: theme.card,
        borderBottom: `2px solid ${theme.border}`,
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: darkMode ? '0 4px 12px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <Zap size={24} color="white" />
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: '700', 
              color: theme.text,
              transition: 'color 0.3s ease'
            }}>
              Miralys
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '12px', 
              color: theme.textMuted,
              transition: 'color 0.3s ease'
            }}>
              {currentDashboard?.name || 'Real-Time Data Intelligence'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: '10px',
              background: darkMode ? DARK_COLORS.bg.hover : '#f9fafb',
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.transform = 'translateY(0)';
            }}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setShowDashboardModal(true)}
            style={{
              padding: '10px 16px',
              background: theme.card,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = theme.accent;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = theme.border;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Folder size={16} />
            Dashboards ({dashboards.length})
          </button>

          <button
            onClick={handleExportDashboard}
            disabled={!currentDashboard}
            style={{
              padding: '10px 16px',
              background: theme.card,
              border: `2px solid ${theme.border}`,
              borderRadius: '8px',
              color: theme.textSecondary,
              cursor: currentDashboard ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              opacity: currentDashboard ? 1 : 0.5,
              transition: 'all 0.3s ease',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}
            title="Export Dashboard"
            onMouseEnter={(e) => currentDashboard && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            <Download size={16} />
          </button>

          <label style={{
            padding: '10px 16px',
            background: theme.card,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            color: theme.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Upload size={16} />
            <input
              type="file"
              accept=".json"
              onChange={handleImportDashboard}
              style={{ display: 'none' }}
            />
          </label>
          
          <button
            onClick={handleAddScada}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: darkMode ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = darkMode ? '0 6px 16px rgba(16, 185, 129, 0.5)' : '0 4px 12px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = darkMode ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(16, 185, 129, 0.3)';
            }}
          >
            <Settings size={16} />
            SCADA Designer
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
              transition: 'all 0.3s ease',
              boxShadow: darkMode ? '0 4px 12px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = darkMode ? '0 6px 16px rgba(102, 126, 234, 0.5)' : '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = darkMode ? '0 4px 12px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Plus size={16} />
            Add Panel
          </button>
          
          <div style={{
            padding: '8px 16px',
            background: theme.hover,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: theme.text,
                transition: 'color 0.3s ease'
              }}>
                {user?.name}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.textMuted,
                transition: 'color 0.3s ease'
              }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: theme.textMuted,
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = darkMode ? DARK_COLORS.bg.hover : '#e5e7eb';
                e.target.style.color = DARK_COLORS.danger;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = theme.textMuted;
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {!currentDashboard || currentDashboard.panels?.length === 0 ? (
          <div style={{
            background: theme.card,
            border: `2px dashed ${theme.borderLight}`,
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '60px auto',
            transition: 'all 0.3s ease',
            boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: darkMode ? '0 8px 24px rgba(102, 126, 234, 0.5)' : '0 4px 16px rgba(102, 126, 234, 0.3)',
              animation: 'pulse 2s infinite'
            }}>
              <Database size={40} color="white" />
            </div>
            <h3 style={{ 
              margin: '0 0 12px', 
              color: theme.text, 
              fontSize: '24px', 
              fontWeight: '700',
              transition: 'color 0.3s ease'
            }}>
              {currentDashboard ? 'Add Your First Panel' : 'Create Your First Dashboard'}
            </h3>
            <p style={{ 
              margin: '0 0 32px', 
              color: theme.textMuted, 
              fontSize: '15px', 
              lineHeight: '1.6',
              transition: 'color 0.3s ease'
            }}>
              {currentDashboard
                ? 'Build powerful visualizations from your QuestDB data or create SCADA diagrams. Drag panels to reorder them.'
                : 'Create a dashboard to organize your data visualizations and start monitoring in real-time.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={currentDashboard ? handleAddPanel : () => setShowDashboardModal(true)}
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
                  transition: 'all 0.3s ease',
                  boxShadow: darkMode ? '0 8px 24px rgba(102, 126, 234, 0.5)' : '0 4px 16px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = darkMode ? '0 12px 32px rgba(102, 126, 234, 0.6)' : '0 6px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = darkMode ? '0 8px 24px rgba(102, 126, 234, 0.5)' : '0 4px 16px rgba(102, 126, 234, 0.3)';
                }}
              >
                <Plus size={20} />
                {currentDashboard ? 'Add Data Panel' : 'Create Dashboard'}
              </button>
              {currentDashboard && (
                <button
                  onClick={handleAddScada}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: darkMode ? '0 8px 24px rgba(16, 185, 129, 0.5)' : '0 4px 16px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = darkMode ? '0 12px 32px rgba(16, 185, 129, 0.6)' : '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = darkMode ? '0 8px 24px rgba(16, 185, 129, 0.5)' : '0 4px 16px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  <Settings size={20} />
                  Add SCADA Diagram
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: '20px',
            maxWidth: '1600px',
            margin: '0 auto',
            gridAutoRows: `${ROW_HEIGHT}px`
          }}>
            {currentDashboard.panels.map((panel) => (
              <div 
                key={panel.id} 
                style={{
                  ...calculatePanelStyle(panel),
                  cursor: 'move',
                  opacity: draggingPanel?.id === panel.id ? 0.5 : 1,
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  animation: 'fadeIn 0.5s ease'
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
                    borderRadius: '12px',
                    border: `2px solid ${theme.border}`,
                    overflow: 'hidden',
                    boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                    position: 'relative'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${theme.border}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: theme.hover
                    }}>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: theme.text }}>
                        {panel.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(panel)}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(panel)}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: theme.textSecondary,
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(panel.id)}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <ScadaPanel config={panel} darkMode={darkMode} />
                  </div>
                ) : (
                  <QuestDBPanel
                    config={panel}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onResize={handleResize}
                    darkMode={darkMode}
                  />
                )}
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
