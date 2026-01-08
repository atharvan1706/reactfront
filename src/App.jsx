import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [showAdmin, setShowAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage when authenticated
    if (isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAdmin(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Check if user is admin
  const isAdmin = user?.globalRole === 'admin' || user?.globalRole === 'superadmin';

  if (!isAuthenticated) {
    return <AuthPage onAuth={() => setIsAuthenticated(true)} />;
  }

  // Show admin dashboard
  if (showAdmin && isAdmin) {
    return (
      <>
        <AdminNavBar 
          user={user} 
          onDashboard={() => setShowAdmin(false)} 
          onLogout={handleLogout}
          currentView="admin"
        />
        <AdminDashboard />
      </>
    );
  }

  // Show regular dashboard
  return (
    <>
      {isAdmin && (
        <AdminNavBar 
          user={user} 
          onAdmin={() => setShowAdmin(true)} 
          onLogout={handleLogout}
          currentView="dashboard"
        />
      )}
      <Dashboard onLogout={handleLogout} />
    </>
  );
}

// Simple navigation bar component
function AdminNavBar({ user, onDashboard, onAdmin, onLogout, currentView }) {
  return (
    <div style={styles.navbar}>
      <div style={styles.navContent}>
        <div style={styles.navLeft}>
          <h1 style={styles.logo}>Miralys</h1>
          <div style={styles.navLinks}>
            {currentView === 'admin' && (
              <button onClick={onDashboard} style={styles.navLink}>
                ← Back to Dashboard
              </button>
            )}
            {currentView === 'dashboard' && (
              <button onClick={onAdmin} style={styles.navLinkActive}>
                Admin Panel
              </button>
            )}
          </div>
        </div>
        <div style={styles.navRight}>
          <span style={styles.userName}>{user?.name || user?.email}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    background: 'rgba(15,23,42,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1e293b',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },

  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    maxWidth: '1400px',
    margin: '0 auto'
  },

  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 32
  },

  logo: {
    fontSize: 24,
    fontWeight: 800,
    background: 'linear-gradient(90deg,#a78bfa,#22d3ee)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },

  navLinks: {
    display: 'flex',
    gap: 8
  },

  navLink: {
    padding: '8px 16px',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 8,
    transition: 'all 0.2s'
  },

  navLinkActive: {
    padding: '8px 16px',
    background: 'linear-gradient(90deg,#7c3aed,#22d3ee)',
    border: 'none',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: 8,
    transition: 'all 0.2s'
  },

  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },

  userName: {
    color: '#9ca3af',
    fontSize: 14
  },

  logoutBtn: {
    padding: '8px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default App;
