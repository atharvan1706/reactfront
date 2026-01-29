import { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  Ticket,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://13.232.81.24:3001/api';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    invitationCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState(null);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check for invitation code in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setForm(prev => ({ ...prev, invitationCode: code }));
      setMode('register');
      verifyInvitationCode(code);
    }
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const verifyInvitationCode = async (code) => {
    if (!code || code.length < 8) {
      setInvitationStatus(null);
      return;
    }

    setVerifyingCode(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-invitation?code=${code}`);
      const data = await res.json();

      if (data.success && data.valid) {
        setInvitationStatus({
          valid: true,
          plantId: data.plantId,
          role: data.role,
          expiresAt: data.expiresAt
        });
      } else {
        setInvitationStatus({
          valid: false,
          message: data.message || 'Invalid code'
        });
      }
    } catch (err) {
      setInvitationStatus({
        valid: false,
        message: 'Unable to verify code'
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleCodeChange = (e) => {
    const code = e.target.value.toUpperCase();
    setForm({ ...form, invitationCode: code });
    
    // Auto-verify as user types
    if (code.length >= 8) {
      verifyInvitationCode(code);
    } else {
      setInvitationStatus(null);
    }
  };

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
      
      if (!data.success) {
        // Handle pending approval case
        if (data.requiresApproval) {
          setError('Account created but requires admin approval. You will be notified when approved.');
          setTimeout(() => {
            setMode('login');
            setForm({ email: form.email, password: '', name: '', invitationCode: '' });
            setError('');
          }, 3000);
          return;
        }
        throw new Error(data.message);
      }

      // Check if registration successful but pending
      if (mode === 'register' && data.requiresApproval) {
        setError('Account created! Awaiting admin approval. You will be notified via email.');
        setTimeout(() => {
          setMode('login');
          setForm({ email: form.email, password: '', name: '', invitationCode: '' });
          setError('');
        }, 3000);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderInvitationStatus = () => {
    if (!invitationStatus) return null;

    if (verifyingCode) {
      return (
        <div style={styles.statusBox}>
          <AlertCircle size={18} />
          <span>Verifying code...</span>
        </div>
      );
    }

    if (invitationStatus.valid) {
      return (
        <div style={{ ...styles.statusBox, ...styles.statusValid }}>
          <CheckCircle size={18} />
          <div>
            <strong>Valid Code</strong>
            <div style={styles.statusDetail}>
              Plant: {invitationStatus.plantId} • Role: {invitationStatus.role}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ ...styles.statusBox, ...styles.statusInvalid }}>
          <XCircle size={18} />
          <span>{invitationStatus.message}</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* GLOBAL ANIMATIONS */}
      <style>{globalStyles}</style>

      <div style={{
        ...styles.container,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* BRAND PANEL - Simplified for mobile */}
        <div style={{
          ...styles.leftPanel,
          padding: isMobile ? '40px 20px' : '80px',
          minHeight: isMobile ? 'auto' : '100vh',
          flex: isMobile ? '0 0 auto' : 1
        }}>
          <div style={styles.glowOrb1} />
          <div style={styles.glowOrb2} />

          <div style={{
            ...styles.brandContent,
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <div style={{
              ...styles.logo,
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <img 
                src="/vite.svg" 
                alt="Miralys Logo" 
                style={{
                  width: isMobile ? '24px' : '32px',
                  height: isMobile ? '24px' : '32px',
                  objectFit: 'contain'
                }}
              />
              <span>Miralys</span>
            </div>

            <h1 style={{
              ...styles.heroTitle,
              fontSize: isMobile ? 32 : 52
            }}>
              Smart Manufacturing
              <span style={styles.gradientText}> Reimagined</span>
            </h1>

            <p style={{
              ...styles.heroDesc,
              fontSize: isMobile ? 16 : 18
            }}>
              Real-time plant intelligence, AI-powered analytics, and seamless
              operations — all in one platform.
            </p>

            {!isMobile && (
              <>
                <div style={styles.feature}>
                  <Zap /> Ultra-fast real-time dashboards
                </div>
                <div style={styles.feature}>
                  <Shield /> Enterprise-grade security
                </div>
                <div style={styles.feature}>
                  <img 
                    src="/vite.svg" 
                    alt="" 
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain'
                    }}
                  />
                  AI-driven insights
                </div>
              </>
            )}
          </div>
        </div>

        {/* AUTH PANEL */}
        <div style={{
          ...styles.rightPanel,
          padding: isMobile ? '20px' : '40px'
        }}>
          <div style={{
            ...styles.card,
            padding: isMobile ? 24 : 40
          }}>
            <h2 style={{
              ...styles.cardTitle,
              fontSize: isMobile ? 24 : 32
            }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={styles.cardSubtitle}>
              {mode === 'login'
                ? 'Sign in to continue'
                : 'Register with your invitation code'}
            </p>

            {error && <div style={styles.error}>{error}</div>}

            {mode === 'register' && (
              <>
                <div style={styles.inputGroup}>
                  <Ticket size={isMobile ? 18 : 20} />
                  <input
                    name="invitationCode"
                    placeholder="Invitation Code"
                    value={form.invitationCode}
                    onChange={handleCodeChange}
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                {renderInvitationStatus()}

                <div style={styles.inputGroup}>
                  <User size={isMobile ? 18 : 20} />
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div style={styles.inputGroup}>
              <Mail size={isMobile ? 18 : 20} />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputGroup}>
              <Lock size={isMobile ? 18 : 20} />
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
                {showPassword ? <EyeOff size={isMobile ? 18 : 20} /> : <Eye size={isMobile ? 18 : 20} />}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (mode === 'register' && (!invitationStatus?.valid))}
              style={{
                ...styles.primaryBtn,
                padding: isMobile ? 14 : 16,
                fontSize: isMobile ? 15 : 16,
                opacity: loading || (mode === 'register' && !invitationStatus?.valid) ? 0.5 : 1,
                cursor: loading || (mode === 'register' && !invitationStatus?.valid) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing…' : mode === 'login' ? 'Sign In' : 'Register'}
              <ArrowRight size={isMobile ? 18 : 20} />
            </button>

            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setInvitationStatus(null);
              }}
              style={{
                ...styles.switchBtn,
                fontSize: isMobile ? 14 : 15
              }}
            >
              {mode === 'login'
                ? 'Create new account'
                : 'Already have an account?'}
            </button>

            {mode === 'register' && (
              <p style={styles.helpText}>
                Don't have an invitation code? Contact your administrator.
              </p>
            )}
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
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'slideLeft 1s ease'
  },

  glowOrb1: {
    position: 'absolute',
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, #7c3aed, transparent)',
    top: '-10%',
    left: '-10%',
    filter: 'blur(80px)',
    pointerEvents: 'none'
  },

  glowOrb2: {
    position: 'absolute',
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, #22d3ee, transparent)',
    bottom: '-10%',
    right: '-10%',
    filter: 'blur(80px)',
    pointerEvents: 'none'
  },

  brandContent: {
    maxWidth: 520,
    zIndex: 2,
    width: '100%'
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
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 16
  },

  gradientText: {
    background: 'linear-gradient(90deg,#a78bfa,#22d3ee)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  },

  heroDesc: {
    marginTop: 24,
    color: '#9ca3af',
    lineHeight: 1.6,
    marginBottom: 24
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
    boxShadow: '0 0 60px rgba(124,58,237,0.25)'
  },

  cardTitle: {
    fontWeight: 700,
    marginBottom: 4
  },

  cardSubtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: '#9ca3af',
    fontSize: 14
  },

  error: {
    background: '#7f1d1d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14
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

  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    background: '#1e293b',
    color: '#9ca3af'
  },

  statusValid: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: '#86efac'
  },

  statusInvalid: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5'
  },

  statusDetail: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8
  },

  eyeBtn: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  primaryBtn: {
    marginTop: 24,
    width: '100%',
    borderRadius: 14,
    background: 'linear-gradient(90deg,#7c3aed,#22d3ee)',
    color: '#fff',
    fontWeight: 700,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    cursor: 'pointer',
    padding: '8px 0'
  },

  helpText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7280'
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

input::placeholder {
  color: #64748b;
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

/* Touch device hover fix */
@media (hover: none) {
  button:hover {
    transform: none !important;
  }
}
`;
