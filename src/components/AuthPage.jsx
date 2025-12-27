import { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://reactback-production-6cd8.up.railway.app/api';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    plantId: 'plantA'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const url =
        mode === 'login'
          ? `${API_URL}/auth/login`
          : `${API_URL}/auth/register`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* GLOBAL ANIMATIONS */}
      <style>{globalStyles}</style>

      <div style={styles.container}>
        {/* LEFT BRAND PANEL */}
        <div style={styles.leftPanel}>
          <div style={styles.glowOrb1} />
          <div style={styles.glowOrb2} />

          <div style={styles.brandContent}>
            <div style={styles.logo}>
              <Sparkles size={32} />
              <span>Miralys</span>
            </div>

            <h1 style={styles.heroTitle}>
              Smart Manufacturing
              <span style={styles.gradientText}> Reimagined</span>
            </h1>

            <p style={styles.heroDesc}>
              Real-time plant intelligence, AI-powered analytics, and seamless
              operations — all in one platform.
            </p>

            <div style={styles.feature}>
              <Zap /> Ultra-fast real-time dashboards
            </div>
            <div style={styles.feature}>
              <Shield /> Enterprise-grade security
            </div>
            <div style={styles.feature}>
              <Sparkles /> AI-driven insights
            </div>
          </div>
        </div>

        {/* RIGHT AUTH PANEL */}
        <div style={styles.rightPanel}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={styles.cardSubtitle}>
              {mode === 'login'
                ? 'Sign in to continue'
                : 'Start optimizing your plant today'}
            </p>

            {error && <div style={styles.error}>{error}</div>}

            {mode === 'register' && (
              <div style={styles.inputGroup}>
                <User />
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <Mail />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <Lock />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {mode === 'register' && (
              <div style={styles.inputGroup}>
                <Building2 />
                <select
                  name="plantId"
                  value={form.plantId}
                  onChange={handleChange}
                >
                  <option value="plantA">Plant A</option>
                  <option value="plantB">Plant B</option>
                  <option value="plantC">Plant C</option>
                </select>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={styles.primaryBtn}
            >
              {loading ? 'Processing…' : mode === 'login' ? 'Sign In' : 'Register'}
              <ArrowRight />
            </button>

            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              style={styles.switchBtn}
            >
              {mode === 'login'
                ? 'Create new account'
                : 'Already have an account?'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0b0f19',
    color: '#e5e7eb'
  },

  leftPanel: {
    flex: 1,
    position: 'relative',
    padding: '80px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    animation: 'slideLeft 1s ease'
  },

  glowOrb1: {
    position: 'absolute',
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, #7c3aed, transparent)',
    top: '-10%',
    left: '-10%',
    filter: 'blur(80px)'
  },

  glowOrb2: {
    position: 'absolute',
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, #22d3ee, transparent)',
    bottom: '-10%',
    right: '-10%',
    filter: 'blur(80px)'
  },

  brandContent: {
    maxWidth: 520,
    zIndex: 2
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 40
  },

  heroTitle: {
    fontSize: 52,
    fontWeight: 800,
    lineHeight: 1.1
  },

  gradientText: {
    background: 'linear-gradient(90deg,#a78bfa,#22d3ee)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },

  heroDesc: {
    marginTop: 24,
    color: '#9ca3af',
    fontSize: 18
  },

  feature: {
    marginTop: 20,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    fontSize: 16
  },

  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'slideRight 1s ease'
  },

  card: {
    width: '100%',
    maxWidth: 420,
    background: 'rgba(15,23,42,0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    padding: 40,
    boxShadow: '0 0 60px rgba(124,58,237,0.25)'
  },

  cardTitle: {
    fontSize: 32,
    fontWeight: 700
  },

  cardSubtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: '#9ca3af'
  },

  error: {
    background: '#7f1d1d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },

 inputGroup: {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 16,
  background: '#020617',
  borderRadius: 12,
  padding: '14px 16px',
  border: '1px solid #1e293b',
  color: '#e5e7eb'
},


  eyeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer'
  },

  primaryBtn: {
    marginTop: 24,
    width: '100%',
    padding: 16,
    borderRadius: 14,
    background:
      'linear-gradient(90deg,#7c3aed,#22d3ee)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },

  switchBtn: {
    marginTop: 16,
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#a78bfa',
    cursor: 'pointer'
  }
};

/* =========================
   GLOBAL KEYFRAMES
========================= */

const globalStyles = `
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Inputs */
input {
  background: transparent;
  border: none;
  outline: none;
  color: #e5e7eb;
  width: 100%;
  font-size: 15px;
}

/* Select dropdown */
select {
  background-color: #020617;
  color: #e5e7eb;
  border: none;
  outline: none;
  width: 100%;
  font-size: 15px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* Dropdown options */
option {
  background-color: #020617;
  color: #e5e7eb;
}
`;
