import React, { useEffect, useState } from "react";
import { users } from "../../constants/users";
import { MoreVertical } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-600",
  Suspended: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

const UsersTable = () => {
  const searchItem = useOutletContext();
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const lastActiveToMinutes = (value) => {
    // If the value is null, undefined, or empty, return Infinity
    // This ensures unknown values are treated as "very far in the past" for sorting
    if (!value) return Infinity;

    // Split the string into two parts: the number and the unit
    const [amount, unit] = value.split(" ");

    // Convert the amount from string to number
    const n = Number(amount);

    //convert all values to minutes
    if (unit.startsWith("minute")) return n;
    if (unit.startsWith("hour")) return n * 60;
    if (unit.startsWith("day")) return n * 1440;

    // If the unit is unrecognized, return Infinity as a fallback
    return Infinity;
  };

  const sortUsers = (usersToSort, key) => {
    if (!key) return usersToSort;

    return [...usersToSort].sort((a, b) => {
      // Get the values for the given key
      let aValue = a[key];
      let bValue = b[key];

      if (key === "lastActive") {
        aValue = lastActiveToMinutes(aValue);
        bValue = lastActiveToMinutes(bValue);
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const searchUser = (query) => {
    const trimmedQuery = query.trim().toLowerCase();
    const queryWords = trimmedQuery.split(/\s+/);

    const filteredUsers = users.filter((user) => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      const role = user.role.toLowerCase();

      return queryWords.every(
        (word) =>
          name.includes(word) || email.includes(word) || role.includes(word),
      );
    });
    const sorted = sortUsers(filteredUsers, sortConfig.key);

    setFilteredUsers(sorted);
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  useEffect(() => {
    searchUser(searchItem);
  }, [searchItem, sortConfig]);

  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border
     border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between ">
        <div className="p-6 border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Users
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and monitor all registered users
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
              >
                <div className="flex items-center">
                  User
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                onClick={() => handleSort("email")}
                className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
              >
                <div className="flex items-center">
                  Email
                  <SortIcon column="email" />
                </div>
              </th>
              <th
                onClick={() => handleSort("role")}
                className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
              >
                <div className="flex items-center">
                  Role
                  <SortIcon column="role" />
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
              >
                <div className="flex items-center">
                  Status
                  <SortIcon column="status" />
                </div>
              </th>
              <th
                onClick={() => handleSort("lastActive")}
                className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
              >
                <div className="flex items-center">
                  Last Active
                  <SortIcon column="lastActive" />
                </div>
              </th>
              <th className="p-4 text-sm font-semibold dark:text-slate-400 ">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="w-full flex items-center justify-center py-10 text-slate-500 dark:text-slate-200">
                    No users found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
