import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, Settings, HelpCircle, LogOut } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-700 text-white transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={() => setSidebarOpen(false)}>✖</button>
      </div>

      {/* Brand */}
      <div className="p-4 text-2xl font-bold border-b border-green-600">
        AgriSmart
      </div>

      {/* Nav Links */}
      <nav className="mt-5 space-y-2">
        <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-green-600">
          <Home className="w-5 h-5 mr-3" /> Dashboard
        </Link>
        <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-green-600">
          <User className="w-5 h-5 mr-3" /> Profile
        </Link>
        <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-green-600">
          <Settings className="w-5 h-5 mr-3" /> Settings
        </Link>
        <Link to="/support" className="flex items-center px-4 py-2 hover:bg-green-600">
          <HelpCircle className="w-5 h-5 mr-3" /> Support
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 hover:bg-red-600 mt-5"
        >
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
}
