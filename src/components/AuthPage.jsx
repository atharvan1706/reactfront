import { useState } from 'react';
import { Lock, Mail, User, Building2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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

  const InputField = ({ icon: Icon, type = "text", name, placeholder, required = false }) => (
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
        focusedField === name ? 'text-blue-600' : 'text-gray-400'
      }`}>
        <Icon size={20} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-lg transition-all outline-none ${
          focusedField === name
            ? 'border-blue-600 bg-blue-50/30'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onChange={handleChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField('')}
        onKeyPress={handleKeyPress}
        required={required}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Welcome Back!' : 'Get Started'}
          </h2>
          <p className="text-blue-100 text-sm">
            {mode === 'login'
              ? 'Sign in to access your dashboard'
              : 'Create your account in seconds'}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            {mode === 'register' && (
              <InputField
                icon={User}
                name="name"
                placeholder="Full Name"
                required
              />
            )}

            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />

            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-lg transition-all outline-none ${
                  focusedField === 'password'
                    ? 'border-blue-600 bg-blue-50/30'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                onKeyPress={handleKeyPress}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {mode === 'register' && (
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  focusedField === 'plantId' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <Building2 size={20} />
                </div>
                <select
                  name="plantId"
                  value={form.plantId}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-lg transition-all outline-none appearance-none cursor-pointer ${
                    focusedField === 'plantId'
                      ? 'border-blue-600 bg-blue-50/30'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('plantId')}
                  onBlur={() => setFocusedField('')}
                >
                  <option value="plantA">Plant A - Manufacturing</option>
                  <option value="plantB">Plant B - Processing</option>
                  <option value="plantC">Plant C - Distribution</option>
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all transform ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {mode === 'register' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">Quick Setup</p>
                  <p className="text-xs text-gray-600">
                    Your account will be ready in seconds. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {mode === 'login' ? 'New here?' : 'Already have an account?'}
                </span>
              </div>
            </div>
            
            <button
              type="button"
              className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Sign in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
