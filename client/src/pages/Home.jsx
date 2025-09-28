import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-bold text-green-800 mb-4 drop-shadow-lg">Welcome to AgriSmart</h1>
      <p className="text-lg text-green-700 mb-8 max-w-xl text-center">
        Empowering farmers and agriculturalists with smart tools, crop management, and weather insights. Grow better, together.
      </p>
      <div className="flex gap-4">
        <a href="/login" className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">Login</a>
        <a href="/register" className="px-6 py-2 bg-white text-green-700 border border-green-600 rounded-lg shadow hover:bg-green-50 transition">Register</a>
      </div>
    </div>
  );
}
