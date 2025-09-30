import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import diagnoseImg from "../assets/diagnoseCrop.jpg";
import weatherImg from "../assets/weather.jpg";
import advisoryImg from "../assets/diagnose.jpg";
import recordsImg from "../assets/records.jpg";
import servicesImg from "../assets/farmServices.jpg";

// Demo images for services (replace with your own later)
const services = [
  {
    title: "Weather Updates",
    description: "Real-time weather forecasts tailored for your location.",
    image: weatherImg
  },
  {
    title: "Crop Advisory",
    description: "AI-driven insights to boost crop health and yields.",
    image: advisoryImg
  },
  {
    title: "Farm Services",
    description: "Access essential farming support and tools.",
    image: servicesImg
  },
  {
    title: "Pest & Disease Diagnosis",
    description: "Upload crop images for instant AI-powered analysis.",
    image: diagnoseImg
  },
  {
    title: "Smart Records",
    description: "Maintain farm records and farmer profiles seamlessly.",
    image: recordsImg
  },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Empowering Farmers with Smart Tools
        </h1>
        <p className="text-lg sm:text-xl mb-6 max-w-2xl mx-auto">
          Get real-time weather insights, crop advisory, and reliable support —
          all in one platform tailored for farmers.
        </p>
        <Link
          to="/register"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Services Preview with Auto Scroll */}
      <section className="py-16 px-6 bg-gray-50 overflow-hidden">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-10">
          Our Services
        </h2>
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              ease: "linear",
              duration: 20,
              repeat: Infinity,
            }}
          >
            {[...services, ...services].map((service, idx) => (
              <div
                key={idx}
                className="min-w-[280px] max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-green-700">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/services"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Explore All Services
          </Link>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-6">About Us</h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed mb-6">
          Our mission is to make modern farming tools accessible to every
          farmer. We provide real-time data, AI-powered advisory, and strong
          support systems to help farmers thrive in changing conditions.
        </p>
        <Link
          to="/about"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Learn More
        </Link>
      </section>

      {/* Weather Preview Widget (Demo Placeholder) */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-10">
          Quick Weather Preview
        </h2>
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 p-6 rounded-xl shadow text-center">
          <p className="text-lg font-semibold text-green-700">📍 Nairobi, KE</p>
          <p className="text-green-800 mt-2">
            Current Temp: <span className="font-bold">25°C</span>
          </p>
          <p className="capitalize text-green-600">sunny</p>
          <Link
            to="/dashboard"
            className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition"
          >
            See Full Weather
          </Link>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-green-600 text-white py-12 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to take your farming to the next level?
        </h2>
        <Link
          to="/register"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
