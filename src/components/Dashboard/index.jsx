import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, LogOut, Database, Zap, Folder, Save, Download, Upload
} from 'lucide-react';
import authService from '../../services/auth';
import questdbService from '../../services/questdb';
import DashboardModal from './DashboardModal';
import PanelConfigModal from './PanelConfigModal';
import QuestDBPanel from './QuestDBPanel';
import { GRID_COLS, ROW_HEIGHT } from './constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [dashboards, setDashboards] = useState([]);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [draggingPanel, setDraggingPanel] = useState(null);

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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleAddPanel = () => {
    setEditingPanel(null);
    setShowConfigModal(true);
  };

  const handleSavePanel = (config) => {
    const updatedDashboard = { ...currentDashboard };
    const panelExists = updatedDashboard.panels?.some(p => p.id === config.id);
    
    if (panelExists) {
      updatedDashboard.panels = updatedDashboard.panels.map(p => 
        p.id === config.id ? config : p
      );
    } else {
      // Add position data for new panels
      const newPanel = {
        ...config,
        x: 0,
        y: getNextAvailableY()
      };
      updatedDashboard.panels = [...(updatedDashboard.panels || []), newPanel];
    }
    
    setCurrentDashboard(updatedDashboard);
    setDashboards(dashboards.map(d => 
      d.id === updatedDashboard.id ? updatedDashboard : d
    ));
    setShowConfigModal(false);
    setEditingPanel(null);
  };

  const getNextAvailableY = () => {
    if (!currentDashboard?.panels || currentDashboard.panels.length === 0) return 0;
    const maxY = Math.max(...currentDashboard.panels.map(p => (p.y || 0) + (p.height || 1)));
    return maxY;
  };

  const handleEdit = (panel) => {
    setEditingPanel(panel);
    setShowConfigModal(true);
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
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e5e7eb',
        padding: '12px 24px',
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
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>
              Miralys
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              {currentDashboard?.name || 'Real-Time Data Intelligence'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowDashboardModal(true)}
            style={{
              padding: '10px 16px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
            onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <Folder size={16} />
            Dashboards ({dashboards.length})
          </button>

          <button
            onClick={handleExportDashboard}
            disabled={!currentDashboard}
            style={{
              padding: '10px 16px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              color: '#374151',
              cursor: currentDashboard ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              opacity: currentDashboard ? 1 : 0.5
            }}
            title="Export Dashboard"
          >
            <Download size={16} />
          </button>

          <label style={{
            padding: '10px 16px',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            color: '#374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            <Upload size={16} />
            <input
              type="file"
              accept=".json"
              onChange={handleImportDashboard}
              style={{ display: 'none' }}
            />
          </label>
          
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
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                borderRadius: '6px'
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
            background: 'white',
            border: '2px dashed #d1d5db',
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
            <h3 style={{ margin: '0 0 12px', color: '#111827', fontSize: '24px', fontWeight: '700' }}>
              {currentDashboard ? 'Add Your First Panel' : 'Create Your First Dashboard'}
            </h3>
            <p style={{ margin: '0 0 32px', color: '#6b7280', fontSize: '15px', lineHeight: '1.6' }}>
              {currentDashboard
                ? 'Build powerful visualizations from your QuestDB data. Drag panels to reorder them and resize by editing panel settings.'
                : 'Create a dashboard to organize your data visualizations and start monitoring in real-time.'}
            </p>
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
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Plus size={20} />
              {currentDashboard ? 'Add Your First Panel' : 'Create Dashboard'}
            </button>
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
                  transition: 'opacity 0.2s'
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, panel)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, panel)}
              >
                <QuestDBPanel
                  config={panel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onResize={handleResize}
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

      {showDashboardModal && (
        <DashboardModal
          currentDashboard={currentDashboard}
          dashboards={dashboards}
          onSelect={handleSelectDashboard}
          onCreate={handleCreateDashboard}
          onRename={handleRenameDashboard}
          onDelete={handleDeleteDashboard}
          onClose={() => setShowDashboardModal(false)}
        />
      )}
    </div>
  );
}
