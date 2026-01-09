import React, { useState } from 'react';
import {
  X as LucideX, FolderPlus, Folder, Edit2, Check, Trash2, Sparkles
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
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .dashboard-modal-container {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }
        
        .create-btn:active {
          transform: translateY(0);
        }
        
        .dashboard-card {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .dashboard-card:hover {
          transform: translateX(4px);
        }
        
        .action-btn {
          transition: all 0.15s ease;
          position: relative;
          overflow: hidden;
        }
        
        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s;
        }
        
        .action-btn:active::before {
          width: 100px;
          height: 100px;
        }
        
        .action-btn:hover {
          transform: scale(1.1);
        }
        
        .input-field {
          transition: all 0.2s ease;
        }
        
        .input-field:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      
      <div className="dashboard-modal-container" style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1) inset',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Header with gradient accent */}
        <div style={{
          padding: '28px 32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #d946ef, transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <Sparkles size={24} color="#8b5cf6" strokeWidth={2.5} />
              <h2 style={{ 
                margin: 0, 
                fontSize: '26px', 
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '700',
                letterSpacing: '-0.02em',
                color: '#f1f5f9'
              }}>
                Dashboard <span className="gradient-text">Manager</span>
              </h2>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: 'rgba(241, 245, 249, 0.6)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '300',
              letterSpacing: '0.01em'
            }}>
              Create, organize, and switch between your workspaces
            </p>
          </div>
          <button onClick={onClose} className="action-btn" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(241, 245, 249, 0.7)',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.02) 100%)'
        }}>
          {/* Create New Dashboard */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px', 
              fontSize: '13px', 
              color: 'rgba(241, 245, 249, 0.8)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              <div style={{
                width: '3px',
                height: '14px',
                background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                borderRadius: '2px'
              }} />
              Create New
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Enter dashboard name..."
                className="input-field"
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '15px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '400',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="create-btn"
                style={{
                  padding: '14px 24px',
                  background: newName.trim() 
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '12px',
                  color: newName.trim() ? 'white' : 'rgba(241, 245, 249, 0.3)',
                  cursor: newName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: newName.trim() ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                <FolderPlus size={18} strokeWidth={2.5} />
                Create
              </button>
            </div>
          </div>

          {/* Existing Dashboards */}
          <div>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px', 
              fontSize: '13px', 
              color: 'rgba(241, 245, 249, 0.8)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              <div style={{
                width: '3px',
                height: '14px',
                background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                borderRadius: '2px'
              }} />
              Your Dashboards
              <span style={{
                marginLeft: '4px',
                padding: '2px 8px',
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#a5b4fc',
                fontWeight: '500'
              }}>
                {dashboards.length}
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dashboards.map((dashboard, index) => (
                <div
                  key={dashboard.id}
                  className="dashboard-card"
                  style={{
                    padding: '16px 18px',
                    background: currentDashboard?.id === dashboard.id 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: currentDashboard?.id === dashboard.id 
                      ? 'rgba(99, 102, 241, 0.3)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    animationDelay: `${index * 0.05}s`,
                    animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards'
                  }}
                >
                  {currentDashboard?.id === dashboard.id && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                      boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)'
                    }} />
                  )}
                  
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      padding: '10px',
                      background: currentDashboard?.id === dashboard.id 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: currentDashboard?.id === dashboard.id 
                        ? 'rgba(99, 102, 241, 0.3)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Folder 
                        size={20} 
                        color={currentDashboard?.id === dashboard.id ? '#8b5cf6' : 'rgba(241, 245, 249, 0.5)'} 
                        strokeWidth={2}
                      />
                    </div>
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
                        className="input-field"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          borderRadius: '8px',
                          color: '#f1f5f9',
                          fontSize: '15px',
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: '500',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '15px', 
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: '600', 
                          color: currentDashboard?.id === dashboard.id 
                            ? '#e0e7ff' 
                            : 'rgba(241, 245, 249, 0.9)',
                          letterSpacing: '-0.01em'
                        }}>
                          {dashboard.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(241, 245, 249, 0.4)',
                          marginTop: '3px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: '400'
                        }}>
                          {dashboard.panels?.length || 0} {dashboard.panels?.length === 1 ? 'panel' : 'panels'}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {editingId === dashboard.id ? (
                      <>
                        <button
                          onClick={() => handleRename(dashboard.id)}
                          className="action-btn"
                          style={{
                            padding: '8px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditName(''); }}
                          className="action-btn"
                          style={{
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(241, 245, 249, 0.6)',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <X size={16} strokeWidth={2.5} />
                        </button>
                      </>
                    ) : (
                      <>
                        {currentDashboard?.id !== dashboard.id && (
                          <button
                            onClick={() => onSelect(dashboard.id)}
                            className="action-btn"
                            style={{
                              padding: '8px 16px',
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)'
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
                          className="action-btn"
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(241, 245, 249, 0.5)',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit2 size={16} strokeWidth={2} />
                        </button>
                        {dashboards.length > 1 && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete dashboard "${dashboard.name}"?`)) {
                                onDelete(dashboard.id);
                              }
                            }}
                            className="action-btn"
                            style={{
                              padding: '8px',
                              background: 'transparent',
                              border: 'none',
                              color: 'rgba(239, 68, 68, 0.7)',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={16} strokeWidth={2} />
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
          padding: '20px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <button
            onClick={onClose}
            className="action-btn"
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '600',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
              transition: 'all 0.2s ease'
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
