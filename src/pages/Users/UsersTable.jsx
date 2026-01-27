import React, { useEffect, useState } from "react";
import { users } from "../../constants/users";
import { useOutletContext } from "react-router-dom";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Mail,
  MoreVertical,
} from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  // Converts a "lastActive" string into minutes
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

  // Sorts an array of users by the given key, handling "lastActive" specially and
  // respecting the current sort direction
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

  // Toggles sorting direction for a column and updates the sort configuration
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filters users by search query and updates the state with the sorted results
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

  // Displays the appropriate sort arrow for a column based on the current sort direction
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };

  // Calculates and sets the dropdown menu position so it stays within the viewport boundaries
  const calculateMenuPosition = (buttonId) => {
    const button = document.getElementById(`menu-btn-${buttonId}`);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 160;

    // Vertical position: below the button
    let top = rect.bottom + window.scrollY;

    // If it exceeds the bottom of the viewport, display above the button
    if (top + menuHeight > window.scrollY + window.innerHeight) {
      top = rect.top - menuHeight + window.scrollY;
    }

    // Horizontal position: aligned to the left of the button
    let left = rect.left + window.scrollX;

    // Adjust if it exceeds the right edge of the viewport
    if (left + menuWidth > window.scrollX + window.innerWidth) {
      left = window.scrollX + window.innerWidth - menuWidth - 8; // 8px margin
    }

    // Adjust if it exceeds the left edge of the viewport
    if (left < window.scrollX + 8) {
      left = window.scrollX + 8; // 8px margin
    }

    setMenuPosition({ top, left });
  };

  // Re-filters and sorts users whenever the search query or sort configuration changes
  useEffect(() => {
    searchUser(searchItem);
  }, [searchItem, sortConfig]);

  // Updates the dropdown menu position on scroll or resize when it's open
  useEffect(() => {
    if (!openMenuId) return;

    const handleScrollResize = () => calculateMenuPosition(openMenuId);

    window.addEventListener("scroll", handleScrollResize, true);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      window.removeEventListener("scroll", handleScrollResize, true);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [openMenuId]);

  // Closes the dropdown menu when clicking outside of it or its button
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event) => {
      const menu = document.getElementById(`menu-dropdown-${openMenuId}`);
      const button = document.getElementById(`menu-btn-${openMenuId}`);
      if (
        menu &&
        !menu.contains(event.target) &&
        button &&
        !button.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

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
                  className="relative border-b border-slate-200/50 dark:border-slate-700/50
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
                      id={`menu-btn-${user.id}`}
                      onClick={() => {
                        setOpenMenuId(openMenuId === user.id ? null : user.id);
                        calculateMenuPosition(user.id);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer"
                      title=""
                    >
                      <MoreVertical className="w-4 h-4 dark:text-white" />
                    </button>
                    {/* Actions Dropdown using React Portal */}
                    {openMenuId === user.id &&
                      menuPosition &&
                      createPortal(
                        <AnimatePresence>
                          <motion.div
                            key={user.id}
                            id={`menu-dropdown-${user.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            style={{
                              position: "fixed",
                              top: menuPosition.top,
                              left: menuPosition.left,
                              width: "10rem",
                              zIndex: 50,
                            }}
                            className="bg-white dark:bg-slate-800 border border-slate-200 
                            dark:border-slate-700 rounded-lg shadow-lg"
                          >
                            {/* View details */}
                            <button
                              onClick={() => setOpenMenuId(null)} // close menu on click
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm
                          hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"
                            >
                              <Eye className="w-4 h-4" />
                              View details
                            </button>

                            {/* Edit user */}
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm
                          hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit user
                            </button>

                            {/* Copy email */}
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm
                          hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white"
                            >
                              <Mail className="w-4 h-4" />
                              Copy email
                            </button>

                            {/* Delete user */}
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm
                          hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete user
                            </button>
                          </motion.div>
                        </AnimatePresence>,
                        document.body,
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div
                    className="w-full flex items-center justify-center py-10 text-slate-500 
                  dark:text-slate-200"
                  >
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
