
import React, { useState } from 'react';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      await api.put('/v1/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      // Handle successful registration (e.g., redirect, show message, etc.)
      alert('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Register</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-green-700 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-6">
          <label className="block text-green-700 mb-1">Confirm Password</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Register</button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-green-700 hover:underline">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
}
