import React, { useEffect, useState } from "react";
import StatsCard from "../StatsCard";
import ActivityChart from "../ActivityChart";
import UsersTable from "../UsersTable";
import api from "../../services/api";

export default function AdminDashboard() {
  // ✅ initialize as objects, not arrays
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCrops: 0,
    totalDiagnoses: 0,
    recentUsers: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ✅ Fetch both stats & users in parallel for speed
        const [statsRes, usersRes] = await Promise.all([
          api.get("/v1/admin/analytics"),
          api.get("/v1/admin/users"),
        ]);

        // ✅ Safely extract data
        const statsData = statsRes.data?.data || {
          userCount: 0,
          cropsCount: 0,
          apiUsage: 0,
          recentUsers: [],
        };

        const usersData = usersRes.data?.data || [];

        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error("❌ Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-green-700 text-lg font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of user activity, diagnostics, and system stats
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.userCount || 0}
          icon="👥"
          color="bg-green-100 text-green-700"
        />
        <StatsCard
          title="Crop Records"
          value={stats.cropsCount || 0}
          icon="🌾"
          color="bg-yellow-100 text-yellow-700"
        />
        <StatsCard
          title="Diagnoses Made"
          value={stats.apiUsage || 0}
          icon="🩺"
          color="bg-blue-100 text-blue-700"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4">
            User Activity Overview
          </h2>
          <ActivityChart />
        </div>

        {/* Users Table */}
        <div className="col-span-1">
          <UsersTable
            users={stats.recentUsers?.length ? stats.recentUsers : users}
          />
        </div>
      </div>
    </div>
  );
}
