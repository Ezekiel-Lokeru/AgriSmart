import { LayoutDashboard, Users, Settings, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSidebar({ collapsed, onToggle, onLogout }) {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/admin" },
    { name: "Users", icon: <Users size={18} />, to: "/admin/users" },
    { name: "Settings", icon: <Settings size={18} />, to: "/admin/settings" },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-60"
      } bg-white dark:bg-gray-800 h-screen p-5 shadow-sm transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-green-700 dark:text-green-400 font-bold text-lg transition-opacity duration-300 ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          Admin
        </h2>
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-200 py-2 px-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition"
          >
            {item.icon}
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 text-red-600 mt-auto py-2 px-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition"
      >
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

