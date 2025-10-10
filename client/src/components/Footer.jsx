// src/components/Footer.jsx
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-3">Agri Smart</h2>
          <p className="text-lg">
            Empowering farmers with AI-driven crop health diagnosis and insights for a better yield.
            </p>
        <Link
          to="/register"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Join Now
        </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
            <li><a href="/dashboard" className="hover:text-green-400 transition">Dashboard</a></li>
            <li><a href="/services" className="hover:text-green-400 transition">Services</a></li>
            <li><a href="/about" className="hover:text-green-400 transition">About</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2 text-lg">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@agrismart.co.ke
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +254 712 345 678
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Nairobi, Kenya
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white mt-10 pt-4 text-center text-lg text-white">
        © {new Date().getFullYear()} Agri Smart. All rights reserved.
      </div>
    </footer>
  );
}
