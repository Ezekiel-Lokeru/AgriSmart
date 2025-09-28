import React, { useState, useEffect } from 'react';
import useProfile from '../hooks/useProfile';
import api from '../services/api';

export default function Profile() {
  const { profile, loading, error } = useProfile();
  const [form, setForm] = useState({ name: '', email: '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name || '', email: profile.email || '' });
    }
  }, [profile]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setEditError('');
    setEditSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setEditError('');
    setEditSuccess('');
    if (profile) {
      setForm({ name: profile.name || '', email: profile.email || '' });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      await api.patch('/v1/profile/edit', {
        name: form.name,
        email: form.email
      });
      setEditSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Profile</h1>
      {loading ? (
        <div className="text-green-800">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-md flex flex-col items-center">
          <div className="mb-6 w-full">
            <label className="block text-green-700 mb-1">Name</label>
            {editing ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            ) : (
              <div className="text-green-900 font-semibold">{profile?.name}</div>
            )}
          </div>
          <div className="mb-6 w-full">
            <label className="block text-green-700 mb-1">Email</label>
            {editing ? (
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            ) : (
              <div className="text-green-900 font-semibold">{profile?.email}</div>
            )}
          </div>
          {editError && <div className="mb-4 text-red-600">{editError}</div>}
          {editSuccess && <div className="mb-4 text-green-700">{editSuccess}</div>}
          <div className="flex gap-4 w-full justify-center">
            {editing ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >Save</button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-green-800 rounded hover:bg-gray-400 transition"
                >Cancel</button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >Edit</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
