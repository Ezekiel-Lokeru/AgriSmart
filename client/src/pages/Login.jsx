import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; // modern icons
import api from "../services/api";
import loginImg from "../assets/login.jpg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/v1/auth/login", {
        email: form.email,
        password: form.password,
      });
      const token =
        res.data?.session?.access_token || res.data?.user?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
        try {
          const profileRes = await api.get("/v1/profile/get", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const role = profileRes.data?.data?.role;
          if (role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } catch {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      let backendError = "Login failed";
      if (err.response?.data) {
        if (err.response.data.error) {
          backendError = err.response.data.error;
        } else if (err.response.data.message) {
          backendError = err.response.data.message;
        } else {
          backendError = JSON.stringify(err.response.data);
        }
      }
      if (!backendError || backendError === "{}") {
        backendError =
          "Login failed. Please check your credentials or try again.";
      }
      setError(backendError);
      console.error("Login error:", err, err.response?.data);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Image Section */}
      <div className="md:flex">
        <img
          src={loginImg}
          alt="Farming"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center bg-gray-50 p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Login
          </h2>
          {error && <div className="mb-4 text-red-600">{error}</div>}

          {/* Email */}
          <div className="mb-4 relative">
            <label className="block text-green-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-green-500 w-5 h-5" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-green-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-green-500 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-green-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Login
          </button>

          <div className="mt-4 text-center">
            <a href="/register" className="text-green-700 hover:underline">
              Don't have an account? Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
