import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { supabase } from "../../services/supabaseClient";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear(); // Clear stored tokens if you use them
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onLogout={handleLogout} // 👈 pass logout handler
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 md:p-6">
        <AdminNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
