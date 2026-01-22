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
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .dashboard-modal-container {
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .dashboard-card {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .dashboard-card:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(99, 102, 241, 0.4) !important;
        }
        
        .dashboard-card.active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
        }
        
        .action-btn {
          transition: all 0.15s ease;
        }
        
        .action-btn:hover {
          transform: scale(1.05);
          opacity: 1 !important;
        }
        
        .action-btn:active {
          transform: scale(0.95);
        }
        
        .input-field {
          transition: all 0.2s ease;
        }
        
        .input-field:focus {
          border-color: rgba(99, 102, 241, 0.6);
          background: rgba(255, 255, 255, 0.06);
        }
        
        .create-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important;
        }
        
        .create-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
      
      <div className="dashboard-modal-container" style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b2e 100%)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '82vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(99, 102, 241, 0.2) inset',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        position: 'relative'
      }}>
        {/* Title and Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '22px', 
              fontWeight: '700',
              letterSpacing: '-0.02em',
              color: '#f1f5f9',
              marginBottom: '6px'
            }}>
              Dashboards
            </h2>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: 'rgba(241, 245, 249, 0.5)',
              fontWeight: '400'
            }}>
              {dashboards.length} workspace{dashboards.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Close Button - Inside Container */}
          <button 
            onClick={onClose} 
            className="action-btn" 
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(241, 245, 249, 0.5)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Create New - Compact Inline */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="New dashboard name..."
            className="input-field"
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              color: '#f1f5f9',
              fontSize: '14px',
              fontWeight: '400',
              outline: 'none'
            }}
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="create-btn"
            style={{
              padding: '12px 20px',
              background: newName.trim() 
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                : 'rgba(255, 255, 255, 0.04)',
              border: 'none',
              borderRadius: '10px',
              color: newName.trim() ? 'white' : 'rgba(241, 245, 249, 0.3)',
              cursor: newName.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: newName.trim() ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <FolderPlus size={16} strokeWidth={2.5} />
            Create
          </button>
        </div>

        {/* Dashboards List - Full Space Utilization */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginRight: '-6px',
          paddingRight: '6px'
        }}>
          {dashboards.map((dashboard, index) => (
            <div
              key={dashboard.id}
              onClick={() => currentDashboard?.id !== dashboard.id && onSelect(dashboard)}
              className={`dashboard-card ${currentDashboard?.id === dashboard.id ? 'active' : ''}`}
              style={{
                padding: '14px 16px',
                background: currentDashboard?.id === dashboard.id 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid',
                borderColor: currentDashboard?.id === dashboard.id 
                  ? 'rgba(99, 102, 241, 0.3)' 
                  : 'rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
              }}
            >
              {/* Active Indicator */}
              {currentDashboard?.id === dashboard.id && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)'
                }} />
              )}

              {/* Icon */}
              <div style={{
                padding: '8px',
                background: currentDashboard?.id === dashboard.id 
                  ? 'rgba(99, 102, 241, 0.15)' 
                  : 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Folder 
                  size={18} 
                  color={currentDashboard?.id === dashboard.id ? '#a78bfa' : 'rgba(241, 245, 249, 0.4)'} 
                  strokeWidth={2}
                />
              </div>

              {/* Content */}
              {editingId === dashboard.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleRename(dashboard.id);
                    if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="input-field"
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    borderRadius: '6px',
                    color: '#f1f5f9',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: currentDashboard?.id === dashboard.id 
                      ? '#e0e7ff' 
                      : 'rgba(241, 245, 249, 0.85)',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {dashboard.name}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'rgba(241, 245, 249, 0.35)',
                    marginTop: '2px',
                    fontWeight: '500'
                  }}>
                    {dashboard.panels?.length || 0} panel{dashboard.panels?.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  alignItems: 'center',
                  flexShrink: 0
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {editingId === dashboard.id ? (
                  <>
                    <button
                      onClick={() => handleRename(dashboard.id)}
                      className="action-btn"
                      style={{
                        padding: '6px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: 'none',
                        color: '#10b981',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditName(''); }}
                      className="action-btn"
                      style={{
                        padding: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: 'rgba(241, 245, 249, 0.5)',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(dashboard.id);
                        setEditName(dashboard.name);
                      }}
                      className="action-btn"
                      style={{
                        padding: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(241, 245, 249, 0.4)',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7
                      }}
                    >
                      <Edit2 size={14} strokeWidth={2} />
                    </button>
                    {dashboards.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${dashboard.name}"?`)) {
                            onDelete(dashboard.id);
                          }
                        }}
                        className="action-btn"
                        style={{
                          padding: '6px',
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(239, 68, 68, 0.6)',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.7
                        }}
                      >
                        <Trash2 size={14} strokeWidth={2} />
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
  );
}

export default DashboardModal;
