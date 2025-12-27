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
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
              <Sparkles className="text-white" size={28} />
            </div>
            <span className="text-5xl font-bold text-white tracking-tight">Miralys</span>
          </div>

          {/* Hero Content */}
          <div className="mt-20">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Manufacturing Operations
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-16 leading-relaxed max-w-xl">
              Real-time insights, seamless collaboration, and intelligent automation for modern plants.
            </p>

            {/* Feature Pills */}
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Lightning Fast</div>
                  <div className="text-purple-200 text-sm">Real-time data sync across all plants</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Enterprise Security</div>
                  <div className="text-purple-200 text-sm">Bank-level encryption & compliance</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">AI-Powered Insights</div>
                  <div className="text-purple-200 text-sm">Smart predictions and recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Brand Text */}
        <div className="relative z-10 text-purple-200 text-sm">
          © 2024 Miralys. Trusted by leading manufacturers worldwide.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Miralys</span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-5 shadow-2xl shadow-purple-500/30">
                <Lock className="text-white" size={36} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-gray-600 text-lg">
                {mode === 'login'
                  ? 'Enter your credentials to continue'
                  : 'Join thousands of smart manufacturers'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {mode === 'register' && (
                <div className="relative">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                    focusedField === 'name' ? 'text-violet-600 scale-110' : 'text-gray-400'
                  }`}>
                    <User size={22} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    className={`w-full pl-14 pr-5 py-4 border-2 rounded-xl transition-all outline-none text-base font-medium ${
                      focusedField === 'name'
                        ? 'border-violet-500 bg-violet-50/50 shadow-lg shadow-violet-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              )}

              <div className="relative">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                  focusedField === 'email' ? 'text-violet-600 scale-110' : 'text-gray-400'
                }`}>
                  <Mail size={22} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  className={`w-full pl-14 pr-5 py-4 border-2 rounded-xl transition-all outline-none text-base font-medium ${
                    focusedField === 'email'
                      ? 'border-violet-500 bg-violet-50/50 shadow-lg shadow-violet-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="relative">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                  focusedField === 'password' ? 'text-violet-600 scale-110' : 'text-gray-400'
                }`}>
                  <Lock size={22} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  className={`w-full pl-14 pr-14 py-4 border-2 rounded-xl transition-all outline-none text-base font-medium ${
                    focusedField === 'password'
                      ? 'border-violet-500 bg-violet-50/50 shadow-lg shadow-violet-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-all hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {mode === 'register' && (
                <div className="relative">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                    focusedField === 'plantId' ? 'text-violet-600 scale-110' : 'text-gray-400'
                  }`}>
                    <Building2 size={22} />
                  </div>
                  <select
                    name="plantId"
                    value={form.plantId}
                    className={`w-full pl-14 pr-5 py-4 border-2 rounded-xl transition-all outline-none appearance-none cursor-pointer text-base font-medium ${
                      focusedField === 'plantId'
                        ? 'border-violet-500 bg-violet-50/50 shadow-lg shadow-violet-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
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
                className={`w-full py-5 rounded-xl font-bold text-white text-lg transition-all transform shadow-2xl mt-8 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 active:translate-y-0'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={22} />
                  </span>
                )}
              </button>
            </div>

            {mode === 'login' && (
              <div className="mt-6 text-center">
                <button className="text-sm text-violet-600 hover:text-violet-700 font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="mt-10 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  {mode === 'login' ? 'New to Miralys?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full py-4 rounded-xl font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 transition-all border-2 border-violet-200 hover:border-violet-300 text-base"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Sign in instead'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            By continuing, you agree to Miralys's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
