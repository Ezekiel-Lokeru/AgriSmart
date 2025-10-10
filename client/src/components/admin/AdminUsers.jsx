import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Search, Filter, Trash2, Shield, ShieldOff, ToggleLeft, ToggleRight } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [processing, setProcessing] = useState(null);

  // 🧠 Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("farmer_profiles")
          .select("id, name, email, role, active, created_at");
        if (error) throw error;
        setUsers(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🔍 Filter logic
  useEffect(() => {
    let result = users;

    if (search.trim() !== "") {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role !== "all") {
      result = result.filter((u) => u.role === role);
    }

    setFiltered(result);
  }, [search, role, users]);

  // ⚙️ Helper functions for admin actions
  const updateUser = async (id, updates) => {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from("farmer_profiles")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
      );
    } catch (err) {
      console.error("Error updating user:", err.message);
      alert("Action failed: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setProcessing(id);
    try {
      const { error } = await supabase.from("farmer_profiles").delete().eq("id", id);
      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err.message);
      alert("Failed to delete user: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-green-700 font-semibold animate-pulse">
          Loading users...
        </div>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
          Manage Users
        </h2>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Role filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-800 dark:text-gray-100"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-t border-gray-200 dark:border-gray-700">
          <thead className="bg-green-50 dark:bg-gray-700 text-green-700 dark:text-green-300">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Active</th>
              <th className="text-left p-3">Created</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-t dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">{u.active ? "✅" : "❌"}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    {/* Activate/Deactivate */}
                    <button
                      disabled={processing === u.id}
                      onClick={() => updateUser(u.id, { active: !u.active })}
                      className="p-2 rounded-md bg-gray-100 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-green-800 transition"
                      title={u.active ? "Deactivate" : "Activate"}
                    >
                      {u.active ? (
                        <ToggleLeft className="text-red-500" size={18} />
                      ) : (
                        <ToggleRight className="text-green-600" size={18} />
                      )}
                    </button>

                    {/* Promote/Demote */}
                    <button
                      disabled={processing === u.id}
                      onClick={() =>
                        updateUser(u.id, {
                          role: u.role === "admin" ? "farmer" : "admin",
                        })
                      }
                      className="p-2 rounded-md bg-gray-100 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-green-800 transition"
                      title={u.role === "admin" ? "Demote to Farmer" : "Promote to Admin"}
                    >
                      {u.role === "admin" ? (
                        <ShieldOff className="text-red-500" size={18} />
                      ) : (
                        <Shield className="text-green-600" size={18} />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      disabled={processing === u.id}
                      onClick={() => deleteUser(u.id)}
                      className="p-2 rounded-md bg-gray-100 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-800 transition"
                      title="Delete User"
                    >
                      <Trash2 className="text-red-500" size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
