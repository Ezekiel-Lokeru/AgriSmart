
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/v1/auth/login', {
        email: form.email,
        password: form.password
      });
      // Save access token to localStorage
      const token = res.data?.session?.access_token || res.data?.user?.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
        // Fetch user profile to check role
        try {
          const profileRes = await api.get('/v1/profile/get', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const role = profileRes.data?.data?.role;
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } catch {
          // fallback if profile fetch fails
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Show full backend error details if available
      let backendError = 'Login failed';
      if (err.response?.data) {
        if (err.response.data.error) {
          backendError = err.response.data.error;
        } else if (err.response.data.message) {
          backendError = err.response.data.message;
        } else {
          backendError = JSON.stringify(err.response.data);
        }
      }
      if (!backendError || backendError === '{}') {
        backendError = 'Login failed. Please check your credentials or try again.';
      }
      setError(backendError);
      // Log error for debugging
      console.error('Login error:', err, err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-green-700 mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-6">
          <label className="block text-green-700 mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Login</button>
        <div className="mt-4 text-center">
          <a href="/register" className="text-green-700 hover:underline">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
}
