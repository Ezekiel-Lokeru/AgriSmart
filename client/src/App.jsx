import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AddCrop from "./pages/AddCrop";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import SidebarLayout from "./components/SidebarLayout";
import NavbarLayout from "./components/NavbarLayout";
import "./i18n";
import AdminUsers from "./components/admin/AdminUsers";

function App() {

  return (
    <Router>
      <Routes>
        {/* ---------------- Public Routes ---------------- */}
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
        </Route>

        {/* ---------------- Farmer Routes ---------------- */}
        <Route element={<SidebarLayout />}>
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
          <Route
            path="/crops/add"
            element={
              <ProtectedRoute>
                <AddCrop />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ---------------- Admin Routes ---------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
            </ProtectedRoute>
          }
        />
    
      </Routes>
    </Router>
  );
}

export default App;
