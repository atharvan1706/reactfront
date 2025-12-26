import { useState } from 'react';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://reactback-production-6cd8.up.railway.app/api';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    plantId: 'plantA'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border rounded"
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />

          {mode === 'register' && (
            <select
              name="plantId"
              className="w-full p-3 border rounded"
              onChange={handleChange}
            >
              <option value="plantA">Plant A</option>
              <option value="plantB">Plant B</option>
              <option value="plantC">Plant C</option>
            </select>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Login'
              : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                className="text-blue-600 font-semibold"
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className="text-blue-600 font-semibold"
                onClick={() => setMode('login')}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
