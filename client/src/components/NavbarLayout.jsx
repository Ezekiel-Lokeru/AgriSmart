import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function NavbarLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
