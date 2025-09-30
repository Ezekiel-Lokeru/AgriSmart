import React from "react";
import { Sprout } from "lucide-react";

export default function About() {
  return (
    <section className="bg-white py-20" id="about">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left side - Image/Illustration */}
        <div className="relative flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1590556409324-6e4d54d0f486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Farmers in the field"
            className="rounded-2xl shadow-lg object-cover w-full h-[400px]"
          />
          <div className="absolute -bottom-6 -left-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-md flex items-center space-x-2">
            <Sprout className="w-5 h-5" />
            <span className="text-sm font-medium">Empowering Farmers</span>
          </div>
        </div>

        {/* Right side - Text */}
        <div>
          <h2 className="text-4xl font-bold text-green-800 mb-6">About AgriSmart</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            AgriSmart is a digital farming assistant designed to simplify farm 
            management and boost productivity. We bring together modern 
            technologies like AI-driven diagnosis, real-time weather updates, 
            and crop tracking into one simple and accessible platform.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our mission is to empower farmers with tools that are easy to use, 
            affordable, and impactful — making smart farming accessible for 
            everyone, from smallholder farmers to large-scale farm managers.
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
