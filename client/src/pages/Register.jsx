import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import registerImg from "../assets/register.jpg";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      await api.put("/v1/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert("Registration successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left side image */}
      <div>
        <img
          src={registerImg}
          alt="Register illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side form */}
      <div className="flex items-start justify-center bg-white p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mt-20"
        >
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Register
          </h2>
          {error && <div className="mb-4 text-red-600">{error}</div>}

          {/* Name */}
          <div className="mb-4 relative">
            <User className="absolute left-3 top-3 text-green-600" size={20} />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <Mail className="absolute left-3 top-3 text-green-600" size={20} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <Lock className="absolute left-3 top-3 text-green-600" size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-green-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <Lock className="absolute left-3 top-3 text-green-600" size={20} />
            <input
              name="confirm"
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-green-600"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Register
          </button>

          {/* Link */}
          <div className="mt-4 text-center">
            <a href="/login" className="text-green-700 hover:underline">
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
