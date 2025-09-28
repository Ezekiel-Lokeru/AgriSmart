import React, { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      setError('');
      try {
        // Fetch users
        const usersRes = await api.get('/v1/admin/users');
        setUsers(usersRes.data.data || []);
        // Fetch analytics
        const analyticsRes = await api.get('/v1/admin/analytics');
        setAnalytics(analyticsRes.data.data || {});
      } catch {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const handleDeactivate = async (userId) => {
    try {
      await api.patch(`/v1/admin/users/${userId}/deactivate`);
      setUsers(users => users.map(u => u.id === userId ? { ...u, active: false } : u));
    } catch (err) {
      console.error('Failed to deactivate user:', err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.patch(`/v1/admin/users/${userId}/role`, { role: newRole });
      setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Failed to change user role:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6">
      <h1 className="text-4xl font-bold text-green-900 mb-4">Admin Dashboard</h1>
      <p className="text-green-800 mb-8">Manage users, view analytics, and optimize system performance.</p>
      {loading && <div className="text-green-900">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          {/* User Management Section */}
          <div className="bg-white rounded-xl shadow p-6 mb-8 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">User Management</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-green-50">
                    <td className="py-2">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={e => handleChangeRole(user.id, e.target.value)} className="border rounded px-2 py-1">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{user.active ? 'Active' : 'Inactive'}</td>
                    <td>
                      <button onClick={() => handleDeactivate(user.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">System Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-100 rounded p-4 text-center">
                <div className="text-3xl font-bold text-green-800">{analytics?.userCount ?? '-'}</div>
                <div className="text-green-700">Total Users</div>
              </div>
              <div className="bg-green-100 rounded p-4 text-center">
                <div className="text-3xl font-bold text-green-800">{analytics?.cropsCount ?? '-'}</div>
                <div className="text-green-700">Total Crops</div>
              </div>
              <div className="bg-green-100 rounded p-4 text-center">
                <div className="text-3xl font-bold text-green-800">{analytics?.apiUsage ?? '-'}</div>
                <div className="text-green-700">API Usage</div>
              </div>
            </div>
            <button className="px-6 py-2 bg-green-700 text-white rounded font-semibold hover:bg-green-800 transition">Generate Report</button>
          </div>
        </>
      )}
      <div className="text-green-900 font-medium mt-8">Tip: Only admins can access this dashboard.</div>
    </div>
  );
}

export default AdminDashboard;
