import React from 'react';
import { Navigate } from 'react-router-dom';
import useProfile from '../hooks/useProfile';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { profile, loading } = useProfile();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-green-800">Loading...</div>;
  }

  if (!profile) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile.role !== 'admin') {
    // Not an admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
