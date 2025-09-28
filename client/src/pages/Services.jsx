import React from 'react';

const services = [
  {
    title: 'Crop Management',
    description: 'Track, add, and manage your crops with detailed records and analytics.'
  },
  {
    title: 'Disease & Pest Diagnosis',
    description: 'Upload crop images for instant AI-powered disease and pest analysis.'
  },
  {
    title: 'Weather Forecasts',
    description: 'Get location-based weather updates and farming advisories.'
  },
  {
    title: 'Profile & Farm Records',
    description: 'Maintain your farmer profile and keep all farm records organized.'
  },
  {
    title: 'Smart Search',
    description: 'Find crops, weather, and farming info using our intelligent search tools.'
  },
  {
    title: 'Admin Dashboard',
    description: 'Advanced tools for farm managers and admins to oversee operations.'
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Our Services</h1>
      <p className="text-green-700 mb-8 text-center max-w-2xl">AgriSmart offers a suite of digital tools to empower farmers, improve productivity, and simplify farm management.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">{service.title}</h2>
            <p className="text-green-600 text-center">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
