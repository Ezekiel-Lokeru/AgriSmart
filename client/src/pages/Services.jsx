import React from "react";
import { Leaf, CloudSun, User, Search, BarChart3, Bug } from "lucide-react"; // icons

const services = [
  {
    title: "Crop Management",
    description:
      "Track, add, and manage your crops with detailed records and analytics.",
    icon: <Leaf className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Disease & Pest Diagnosis",
    description:
      "Upload crop images for instant AI-powered disease and pest analysis.",
    icon: <Bug className="w-10 h-10 text-red-500" />,
  },
  {
    title: "Weather Forecasts",
    description:
      "Get location-based weather updates and farming advisories.",
    icon: <CloudSun className="w-10 h-10 text-yellow-500" />,
  },
  {
    title: "Profile & Farm Records",
    description:
      "Maintain your farmer profile and keep all farm records organized.",
    icon: <User className="w-10 h-10 text-blue-500" />,
  },
  {
    title: "Smart Search",
    description:
      "Find crops, weather, and farming info using our intelligent search tools.",
    icon: <Search className="w-10 h-10 text-purple-500" />,
  },
  {
    title: "Admin Dashboard",
    description:
      "Advanced tools for farm managers and admins to oversee operations.",
    icon: <BarChart3 className="w-10 h-10 text-orange-500" />,
  },
];

export default function Services() {
  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-16" id="services">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Our Services</h1>
        <p className="text-black mb-12 max-w-2xl mx-auto">
          AgriSmart offers a suite of digital tools to empower farmers, improve productivity, 
          and simplify farm management.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center 
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
