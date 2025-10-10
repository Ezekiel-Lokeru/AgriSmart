import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavbarLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="absolute top-20 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
