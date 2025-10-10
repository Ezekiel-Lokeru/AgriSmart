import React, { useContext } from "react";
import { Sun, Moon, Bell, Search, User } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const AdminNavbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm px-6 py-3 rounded-xl mb-6">
      {/* Left section - Logo & Search */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-green-700 dark:text-green-400">
          🌿 AgriAdmin
        </h1>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Right section - icons */}
      <div className="flex items-center gap-4">
        <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {theme === "light" ? (
          <Moon className="text-gray-700" />
        ) : (
          <Sun className="text-yellow-400" />
        )}
      </button>

        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:shadow-sm">
          <User size={16} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Admin
          </span>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;