import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ full_name: "", email: "", phone: "" });
  const [prefs, setPrefs] = useState({
    language: "English",
    theme: "Light",
    units: "Celsius",
    alerts: { weather: true, cropHealth: true, updates: false }
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchProfileAndSettings();
  }, []);

  async function fetchProfileAndSettings() {
    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userErr || !user) {
        console.error("No active session or error:", userErr);
        setLoading(false);
        return;
      }

      const { data: profileRow } = await supabase
        .from("farmers_profiles")
        .select("full_name, email, phone")
        .eq("id", user.id)
        .single();

      setProfile({
        full_name: profileRow?.full_name || user.user_metadata?.full_name || "",
        email: profileRow?.email || user.email || "",
        phone: profileRow?.phone || ""
      });
    } catch (err) {
      console.error("fetchProfileAndSettings error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handlePrefsChange = (field, value) => {
    setPrefs(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleAlert = (key) => {
    setPrefs(prev => ({
      ...prev,
      alerts: { ...prev.alerts, [key]: !prev.alerts[key] }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        alert("No active session.");
        return;
      }

      const payload = {
        id: user.id,
        full_name: profile.full_name || null,
        email: profile.email || user.email,
        phone: profile.phone || null
      };

      const { error: upsertErr } = await supabase
        .from("farmers_profiles")
        .upsert(payload, { onConflict: "id" });

      if (upsertErr) {
        console.error("Failed to upsert profile:", upsertErr);
        alert("Failed to save profile.");
        return;
      }

      alert("Profile saved successfully ✅");
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error("Password update failed:", error);
        alert("Failed to change password.");
      } else {
        alert("Password updated successfully ✅");
        setShowPasswordModal(false);
        setNewPassword("");
      }
    } catch (err) {
      console.error("handlePasswordUpdate error:", err);
      alert("Error changing password.");
    }
  };

  if (loading) {
    return <div className="p-6 text-green-700">Loading...</div>;
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Profile */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">👤 Profile</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => handleProfileChange("full_name", e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          />
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleProfileChange("email", e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          />
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleProfileChange("phone", e.target.value)}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">🌍 Preferences</h2>
        <div className="space-y-3">
          <label className="block text-green-800 font-medium">Language</label>
          <select
            value={prefs.language}
            onChange={(e) => handlePrefsChange("language", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          >
            <option>English</option>
            <option>Swahili</option>
            <option>French</option>
          </select>

          <label className="block text-green-800 font-medium mt-3">Theme</label>
          <select
            value={prefs.theme}
            onChange={(e) => handlePrefsChange("theme", e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">🔔 Notifications</h2>
        <div className="space-y-3">
          {Object.keys(prefs.alerts).map((k) => (
            <div key={k} className="flex items-center justify-between">
              <span className="capitalize text-green-800">{k}</span>
              <button
                onClick={() => handleToggleAlert(k)}
                className={`w-12 h-6 rounded-full transition ${
                  prefs.alerts[k] ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition ${
                    prefs.alerts[k] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">🔒 Security</h2>
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save Settings
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow p-6 w-96">
            <h3 className="text-lg font-semibold text-green-700 mb-4">🔑 Change Password</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
