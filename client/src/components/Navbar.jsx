import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  { title: "Crop Management", path: "/services#crop" },
  { title: "Disease & Pest Diagnosis", path: "/services#diagnosis" },
  { title: "Weather Forecasts", path: "/services#weather" },
  { title: "Profile & Farm Records", path: "/services#profile" },
  { title: "Smart Search", path: "/services#smart" },
  { title: "Admin Dashboard", path: "/services#admin" },
  { title: "About", path: "/about" },
];

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Find a matching service or page
    const match = services.find((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      navigate(match.path);
    } else {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
    setQuery("");
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left side: Logo */}
      <div className="text-2xl font-bold tracking-wide cursor-pointer">AgriSmart</div>

       <form
        onSubmit={handleSearch}
        className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services..."
          className="px-4 py-2 text-sm text-green-700 focus:outline-none w-40 md:w-56"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition p-2 rounded-r-full"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </form>

      <div className="hidden md:flex space-x-6 font-medium">
        <a href="/" className="hover:text-green-200 transition">Home</a>
        <a href="/about" className="hover:text-green-200 transition">About</a>
        <a href="/services" className="hover:text-green-200 transition">Services</a>
        <a href="/login" className="hover:text-green-200 transition">Login</a>
      </div>
    </nav>
  );
}
