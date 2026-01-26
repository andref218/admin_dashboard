import React from "react";
import { users } from "../../constants/users";
import { MoreVertical } from "lucide-react";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-600",
  Suspended: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

const UsersTable = () => {
  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border
     border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Users
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage and monitor all registered users
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-4 px-6 text-sm font-semibold dark:text-slate-400">
                User
              </th>
              <th className="p-4 px-6 text-sm font-semibold dark:text-slate-400">
                Email
              </th>
              <th className="p-4 px-6 text-sm font-semibold dark:text-slate-400">
                Role
              </th>
              <th className="p-4 px-6 text-sm font-semibold dark:text-slate-400">
                Status
              </th>
              <th className="p-4 px-6 text-sm font-semibold dark:text-slate-400">
                Last active
              </th>
              <th className="p-4 text-sm font-semibold dark:text-slate-400 ">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-200/50 dark:border-slate-700/50
                hover:bg-slate-100 dark:hover:bg-slate-800/50 transition cursor-pointer"
              >
                {/* User */}
                <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">
                  <div className="flex items-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="ml-2">{user.name}</div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-sm  text-slate-600 dark:text-slate-400">
                  {user.email}
                </td>

                {/* Role */}
                <td className="px-6 py-4 text-sm  text-slate-700 dark:text-slate-300">
                  {user.role}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[user.status]}`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* Last Active */}
                <td className="px-6 py-4 text-sm  text-slate-500">
                  {user.lastActive}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <button
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer"
                    title="Copy User ID"
                  >
                    <MoreVertical className="w-4 h-4 dark:text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
