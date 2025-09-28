
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import About from './pages/About';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddCrop from './pages/AddCrop';
import Services from './pages/Services';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import Navbar from './components/Navbar';
import Layout from './components/Layout';


function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
       <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <div className="p-6 text-green-700">Support Page (coming soon)</div>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/crops/add" element={
          <ProtectedRoute>
            <AddCrop />
          </ProtectedRoute>
        } />
     </Routes>
   </Router>
  );
}

export default App;
