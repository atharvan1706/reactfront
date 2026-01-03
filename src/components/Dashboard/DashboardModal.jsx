import React, { useState } from 'react';
import {
  X as LucideX, FolderPlus, Folder, Edit2, Check, Trash2
} from 'lucide-react';
const X = LucideX;
function DashboardModal({ 
  currentDashboard, 
  dashboards, 
  onSelect, 
  onCreate, 
  onRename, 
  onDelete, 
  onClose 
}) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim());
      setNewName('');
    }
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
      setEditingId(null);
      setEditName('');
    }
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
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f9fafb'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#111827', fontWeight: '700' }}>
              Manage Dashboards
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
              Create, edit, or switch between dashboards
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* Create New Dashboard */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
              Create New Dashboard
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Enter dashboard name..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                style={{
                  padding: '10px 16px',
                  background: newName.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: newName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FolderPlus size={16} />
                Create
              </button>
            </div>
          </div>

          {/* Existing Dashboards */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '13px', color: '#374151', fontWeight: '600' }}>
              Your Dashboards ({dashboards.length})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dashboards.map(dashboard => (
                <div
                  key={dashboard.id}
                  style={{
                    padding: '12px',
                    background: currentDashboard?.id === dashboard.id ? '#f0f4ff' : '#f9fafb',
                    border: '2px solid',
                    borderColor: currentDashboard?.id === dashboard.id ? '#667eea' : '#e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Folder size={18} color={currentDashboard?.id === dashboard.id ? '#667eea' : '#6b7280'} />
                    {editingId === dashboard.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleRename(dashboard.id);
                          if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                        }}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          background: 'white',
                          border: '2px solid #667eea',
                          borderRadius: '6px',
                          color: '#111827',
                          fontSize: '14px'
                        }}
                      />
                    ) : (
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: currentDashboard?.id === dashboard.id ? '#667eea' : '#111827' 
                        }}>
                          {dashboard.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {dashboard.panels?.length || 0} panels
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {editingId === dashboard.id ? (
                      <>
                        <button
                          onClick={() => handleRename(dashboard.id)}
                          style={{
                            padding: '6px',
                            background: '#10b981',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditName(''); }}
                          style={{
                            padding: '6px',
                            background: '#6b7280',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        {currentDashboard?.id !== dashboard.id && (
                          <button
                            onClick={() => onSelect(dashboard.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#667eea',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            Open
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingId(dashboard.id);
                            setEditName(dashboard.name);
                          }}
                          style={{
                            padding: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        {dashboards.length > 1 && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete dashboard "${dashboard.name}"?`)) {
                                onDelete(dashboard.id);
                              }
                            }}
                            style={{
                              padding: '6px',
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#f9fafb'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardModal;
