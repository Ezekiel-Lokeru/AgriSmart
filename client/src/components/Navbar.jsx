import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-green-200 transition">AgriSmart</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white text-lg font-medium hover:text-green-200 transition">Home</Link>
            <Link to="/about" className="text-white text-lg font-medium hover:text-green-200 transition">About</Link>
            <Link to="/search" className="text-white text-lg font-medium hover:text-green-200 transition">Search</Link>
            <Link to="/services" className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 transition">Services</Link>
            <Link to="/login" className="bg-white text-green-700 px-4 py-2 rounded font-semibold shadow hover:bg-green-100 transition">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
