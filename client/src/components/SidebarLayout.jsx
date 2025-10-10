import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SidebarLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fixed width */}
      <aside className="w-64 bg-green-700 text-white">
        <Sidebar />
      </aside>
      <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
