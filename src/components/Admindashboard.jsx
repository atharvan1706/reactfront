import { useState, useEffect } from 'react';
import {
  Users,
  Ticket,
  Copy,
  Check,
  X,
  RefreshCw,
  UserPlus,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Ban
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://13.232.81.24:3001/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('invitations');
  const [invitations, setInvitations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [newInvite, setNewInvite] = useState({
    plantId: 'plantA',
    role: 'operator',
    expiresInDays: 7,
    maxUses: 1
  });

  useEffect(() => {
    if (activeTab === 'invitations') {
      fetchInvitations();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/invitations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInvitations(data.invitations);
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateInvitation = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newInvite)
      });
      const data = await res.json();
      if (data.success) {
        fetchInvitations();
        // Copy code to clipboard
        navigator.clipboard.writeText(data.code);
        alert(`Invitation created: ${data.code}\n\nCopied to clipboard!`);
      }
    } catch (err) {
      console.error('Error generating invitation:', err);
    }
  };

  const revokeInvitation = async (code) => {
    if (!confirm('Revoke this invitation code?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/invitations/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchInvitations();
      }
    } catch (err) {
      console.error('Error revoking invitation:', err);
    }
  };

  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
        alert('User approved successfully!');
      }
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  const suspendUser = async (userId) => {
    if (!confirm('Suspend this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error suspending user:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'invitations' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('invitations')}
          >
            <Ticket size={18} />
            Invitations
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'users' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            Users
          </button>
        </div>
      </div>

      {activeTab === 'invitations' && (
        <div style={styles.content}>
          {/* Generate New Invitation */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <UserPlus size={20} />
              Generate New Invitation
            </h2>
            <div style={styles.form}>
              <div style={styles.formRow}>
                <label style={styles.label}>Plant</label>
                <select
                  style={styles.select}
                  value={newInvite.plantId}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, plantId: e.target.value })
                  }
                >
                  <option value="plantA">Plant A</option>
                  <option value="plantB">Plant B</option>
                  <option value="plantC">Plant C</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>Role</label>
                <select
                  style={styles.select}
                  value={newInvite.role}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, role: e.target.value })
                  }
                >
                  <option value="operator">Operator</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>Expires In (Days)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={newInvite.expiresInDays}
                  onChange={(e) =>
                    setNewInvite({
                      ...newInvite,
                      expiresInDays: parseInt(e.target.value)
                    })
                  }
                />
              </div>

              <button style={styles.primaryBtn} onClick={generateInvitation}>
                <Ticket size={18} />
                Generate Code
              </button>
            </div>
          </div>

          {/* Invitations List */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <Ticket size={20} />
                Active Invitations
              </h2>
              <button style={styles.iconBtn} onClick={fetchInvitations}>
                <RefreshCw size={18} />
              </button>
            </div>

            {loading ? (
              <div style={styles.loading}>Loading...</div>
            ) : (
              <div style={styles.table}>
                {invitations.map((inv) => (
                  <div
                    key={inv.code}
                    style={{
                      ...styles.row,
                      opacity: !inv.isValid ? 0.5 : 1
                    }}
                  >
                    <div style={styles.rowMain}>
                      <div style={styles.code}>
                        <code>{inv.code}</code>
                        <button
                          style={styles.copyBtn}
                          onClick={() => copyToClipboard(inv.code)}
                        >
                          {copiedCode === inv.code ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                      <div style={styles.badge}>
                        {inv.plantId} • {inv.role}
                      </div>
                    </div>

                    <div style={styles.rowDetails}>
                      <div style={styles.detail}>
                        <Clock size={14} />
                        {new Date(inv.expiresAt).toLocaleDateString()}
                      </div>
                      {inv.usedBy && (
                        <div style={styles.detail}>
                          <CheckCircle size={14} />
                          Used by {inv.usedBy}
                        </div>
                      )}
                      {!inv.isValid && (
                        <div style={{ ...styles.detail, color: '#ef4444' }}>
                          <XCircle size={14} />
                          Invalid
                        </div>
                      )}
                    </div>

                    {inv.isActive && (
                      <button
                        style={styles.dangerBtn}
                        onClick={() => revokeInvitation(inv.code)}
                      >
                        <Ban size={16} />
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={styles.content}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <Users size={20} />
                All Users
              </h2>
              <button style={styles.iconBtn} onClick={fetchUsers}>
                <RefreshCw size={18} />
              </button>
            </div>

            {loading ? (
              <div style={styles.loading}>Loading...</div>
            ) : (
              <div style={styles.table}>
                {users.map((user) => (
                  <div key={user.id} style={styles.row}>
                    <div style={styles.rowMain}>
                      <div>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                      </div>
                      <div style={styles.badge}>
                        {user.status === 'active' && (
                          <span style={{ color: '#22c55e' }}>Active</span>
                        )}
                        {user.status === 'pending' && (
                          <span style={{ color: '#eab308' }}>Pending</span>
                        )}
                        {user.status === 'suspended' && (
                          <span style={{ color: '#ef4444' }}>Suspended</span>
                        )}
                      </div>
                    </div>

                    <div style={styles.rowDetails}>
                      {user.plantAccess.map((pa, idx) => (
                        <div key={idx} style={styles.detail}>
                          <Shield size={14} />
                          {pa.plantId} ({pa.role})
                        </div>
                      ))}
                      <div style={styles.detail}>
                        <Clock size={14} />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={styles.actions}>
                      {user.status === 'pending' && (
                        <button
                          style={styles.successBtn}
                          onClick={() => approveUser(user.id)}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button
                          style={styles.dangerBtn}
                          onClick={() => suspendUser(user.id)}
                        >
                          <Ban size={16} />
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0b0f19',
    color: '#e5e7eb',
    padding: '40px'
  },

  header: {
    marginBottom: 40
  },

  title: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 24
  },

  tabs: {
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid #1e293b'
  },

  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: 16,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s'
  },

  tabActive: {
    color: '#a78bfa',
    borderBottomColor: '#a78bfa'
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },

  card: {
    background: 'rgba(15,23,42,0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid #1e293b'
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },

  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginTop: 20
  },

  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },

  label: {
    fontSize: 14,
    color: '#9ca3af'
  },

  input: {
    padding: 12,
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 8,
    color: '#e5e7eb',
    fontSize: 15
  },

  select: {
    padding: 12,
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 8,
    color: '#e5e7eb',
    fontSize: 15
  },

  primaryBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(90deg,#7c3aed,#22d3ee)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    gridColumn: 'span 2'
  },

  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },

  row: {
    padding: 16,
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },

  rowMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  code: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#22d3ee'
  },

  copyBtn: {
    padding: 4,
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer'
  },

  badge: {
    padding: '4px 12px',
    background: '#1e293b',
    borderRadius: 12,
    fontSize: 13,
    color: '#9ca3af'
  },

  rowDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 13,
    color: '#6b7280'
  },

  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },

  userName: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 4
  },

  userEmail: {
    fontSize: 14,
    color: '#9ca3af'
  },

  actions: {
    display: 'flex',
    gap: 8,
    marginTop: 8
  },

  successBtn: {
    padding: '8px 16px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: 6,
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },

  dangerBtn: {
    padding: '8px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 6,
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },

  iconBtn: {
    padding: 8,
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer'
  },

  loading: {
    padding: 40,
    textAlign: 'center',
    color: '#9ca3af'
  }
};
