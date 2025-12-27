import { useState } from 'react';
import { Lock, Mail, User, Building2, Eye, EyeOff, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';

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
  const [focusedField, setFocusedField] = useState('');

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={{...styles.bgOrb, ...styles.orb1}}></div>
        <div style={{...styles.bgOrb, ...styles.orb2}}></div>
        <div style={{...styles.bgOrb, ...styles.orb3}}></div>

        <div style={styles.content}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Sparkles style={styles.logoIconSvg} />
            </div>
            <span style={styles.logoText}>Miralys</span>
          </div>

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Transform Your
              <span style={styles.heroGradient}>
                Manufacturing Operations
              </span>
            </h1>
            <p style={styles.heroSubtitle}>
              Real-time insights, seamless collaboration, and intelligent automation for modern plants.
            </p>

            <div style={styles.featureList}>
              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, ...styles.iconYellow}}>
                  <Zap style={styles.featureIconSvg} />
                </div>
                <div>
                  <div style={styles.featureTitle}>Lightning Fast</div>
                  <div style={styles.featureDesc}>Real-time data sync across all plants</div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, ...styles.iconGreen}}>
                  <Shield style={styles.featureIconSvg} />
                </div>
                <div>
                  <div style={styles.featureTitle}>Enterprise Security</div>
                  <div style={styles.featureDesc}>Bank-level encryption & compliance</div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={{...styles.featureIcon, ...styles.iconBlue}}>
                  <Sparkles style={styles.featureIconSvg} />
                </div>
                <div>
                  <div style={styles.featureTitle}>AI-Powered Insights</div>
                  <div style={styles.featureDesc}>Smart predictions and recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footerText}>
          © 2024 Miralys. Trusted by leading manufacturers worldwide.
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.mobileLogoContainer}>
            <div style={styles.mobileLogoIcon}>
              <Sparkles style={styles.mobileLogoSvg} />
            </div>
            <span style={styles.mobileLogoText}>Miralys</span>
          </div>

          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.formIcon}>
                <Lock style={styles.formIconSvg} />
              </div>
              <h2 style={styles.formTitle}>
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={styles.formSubtitle}>
                {mode === 'login'
                  ? 'Enter your credentials to continue'
                  : 'Join thousands of smart manufacturers'}
              </p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            <div style={styles.formFields}>
              {mode === 'register' && (
                <div style={styles.inputGroup}>
                  <div style={{
                    ...styles.inputIcon,
                    color: focusedField === 'name' ? '#8b5cf6' : '#9ca3af',
                    transform: focusedField === 'name' ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)'
                  }}>
                    <User size={22} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    style={{
                      ...styles.inputField,
                      ...(focusedField === 'name' ? styles.inputFieldFocused : {})
                    }}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              )}

              <div style={styles.inputGroup}>
                <div style={{
                  ...styles.inputIcon,
                  color: focusedField === 'email' ? '#8b5cf6' : '#9ca3af',
                  transform: focusedField === 'email' ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)'
                }}>
                  <Mail size={22} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  style={{
                    ...styles.inputField,
                    ...(focusedField === 'email' ? styles.inputFieldFocused : {})
                  }}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div style={styles.inputGroup}>
                <div style={{
                  ...styles.inputIcon,
                  color: focusedField === 'password' ? '#8b5cf6' : '#9ca3af',
                  transform: focusedField === 'password' ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)'
                }}>
                  <Lock size={22} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  style={{
                    ...styles.inputField,
                    paddingRight: '56px',
                    ...(focusedField === 'password' ? styles.inputFieldFocused : {})
                  }}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {mode === 'register' && (
                <div style={styles.inputGroup}>
                  <div style={{
                    ...styles.inputIcon,
                    color: focusedField === 'plantId' ? '#8b5cf6' : '#9ca3af',
                    transform: focusedField === 'plantId' ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)'
                  }}>
                    <Building2 size={22} />
                  </div>
                  <select
                    name="plantId"
                    value={form.plantId}
                    style={{
                      ...styles.inputField,
                      ...(focusedField === 'plantId' ? styles.inputFieldFocused : {})
                    }}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('plantId')}
                    onBlur={() => setFocusedField('')}
                  >
                    <option value="plantA">🏭 Plant A - Manufacturing Hub</option>
                    <option value="plantB">⚙️ Plant B - Processing Center</option>
                    <option value="plantC">📦 Plant C - Distribution</option>
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  ...(loading ? styles.submitBtnDisabled : {})
                }}
              >
                {loading ? (
                  <span style={styles.submitBtnContent}>
                    <div style={styles.spinner}></div>
                    Processing...
                  </span>
                ) : (
                  <span style={styles.submitBtnContent}>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={22} />
                  </span>
                )}
              </button>
            </div>

            {mode === 'login' && (
              <div style={styles.forgotPassword}>
                <button style={styles.forgotLink}>Forgot password?</button>
              </div>
            )}

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>
                {mode === 'login' ? 'New to Miralys?' : 'Already have an account?'}
              </span>
            </div>

            <button
              type="button"
              style={styles.switchBtn}
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Sign in instead'}
            </button>
          </div>

          <p style={styles.termsText}>
            By continuing, you agree to Miralys's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  leftPanel: {
    width: '50%',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden'
  },
  bgOrb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.3,
    animation: 'pulse 3s ease-in-out infinite'
  },
  orb1: {
    top: 0,
    left: 0,
    width: '384px',
    height: '384px',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  orb2: {
    bottom: 0,
    right: 0,
    width: '384px',
    height: '384px',
    background: 'rgba(244, 114, 182, 0.2)',
    animationDelay: '1s'
  },
  orb3: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '288px',
    height: '288px',
    background: 'rgba(196, 181, 253, 0.1)',
    animationDelay: '2s'
  },
  content: {
    position: 'relative',
    zIndex: 10
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '48px'
  },
  logoIcon: {
    width: '56px',
    height: '56px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
  },
  logoIconSvg: {
    color: 'white',
    width: '28px',
    height: '28px'
  },
  logoText: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: '-0.02em'
  },
  heroContent: {
    marginTop: '80px'
  },
  heroTitle: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: '1.1',
    marginBottom: '24px'
  },
  heroGradient: {
    display: 'block',
    marginTop: '8px',
    background: 'linear-gradient(90deg, #fef08a 0%, #fbcfe8 50%, #e9d5ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#e9d5ff',
    lineHeight: '1.6',
    maxWidth: '560px',
    marginBottom: '64px'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  iconYellow: {
    background: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)'
  },
  iconGreen: {
    background: 'linear-gradient(135deg, #34d399 0%, #14b8a6 100%)'
  },
  iconBlue: {
    background: 'linear-gradient(135deg, #60a5fa 0%, #6366f1 100%)'
  },
  featureIconSvg: {
    color: 'white',
    width: '24px',
    height: '24px'
  },
  featureTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  featureDesc: {
    color: '#e9d5ff',
    fontSize: '14px'
  },
  footerText: {
    position: 'relative',
    zIndex: 10,
    color: '#e9d5ff',
    fontSize: '14px'
  },
  rightPanel: {
    width: '50%',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px'
  },
  formContainer: {
    width: '100%',
    maxWidth: '512px'
  },
  mobileLogoContainer: {
    display: 'none'
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    border: '1px solid #f1f5f9'
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  formIcon: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
  },
  formIconSvg: {
    color: 'white',
    width: '36px',
    height: '36px'
  },
  formTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '12px'
  },
  formSubtitle: {
    fontSize: '18px',
    color: '#6b7280'
  },
  errorBox: {
    background: '#fef2f2',
    borderLeft: '4px solid #ef4444',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px'
  },
  errorText: {
    color: '#b91c1c',
    fontSize: '14px',
    fontWeight: '500'
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'all 0.2s ease',
    pointerEvents: 'none'
  },
  inputField: {
    width: '100%',
    padding: '16px 20px 16px 56px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: 'white'
  },
  inputFieldFocused: {
    borderColor: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.05)',
    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)'
  },
  passwordToggle: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center'
  },
  submitBtn: {
    width: '100%',
    padding: '20px',
    background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '32px',
    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
    transition: 'all 0.3s ease'
  },
  submitBtnDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  submitBtnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: '24px'
  },
  forgotLink: {
    color: '#8b5cf6',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none'
  },
  divider: {
    position: 'relative',
    marginTop: '40px'
  },
  dividerLine: {
    borderTop: '1px solid #d1d5db'
  },
  dividerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '0 16px',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  },
  switchBtn: {
    width: '100%',
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
    border: '2px solid #ddd6fe',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  termsText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '32px'
  }
};
