import React from "react";

export default function UsersTable({ users = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 w-full">
      <h2 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-400">
        Recent Users
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-t border-gray-200 dark:border-gray-700">
          <thead className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                >
                  <td className="p-3 text-gray-900 dark:text-gray-100">{u.name}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{u.email}</td>
                  <td className="p-3 capitalize text-gray-700 dark:text-gray-300">{u.role}</td>
                  <td className="p-3 text-center">{u.active ? "✅" : "❌"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 dark:text-gray-400 italic"
                >
                  No users found or still loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {users.length > 0 ? (
          users.map((u) => (
            <div
              key={u.id}
              className="p-4 border border-green-100 dark:border-green-800 rounded-xl shadow-sm bg-green-50/50 dark:bg-green-900/20"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-green-700 dark:text-green-300">{u.name}</h3>
                <span>{u.active ? "✅" : "❌"}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {u.email}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                <strong>Role:</strong> {u.role}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            No users found or still loading...
          </p>
        )}
      </div>
    </div>
  );
}
