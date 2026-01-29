import React, { useEffect, useMemo, useState } from "react";
import { users } from "../../constants/users";
import { useOutletContext } from "react-router-dom";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react";
import { sortUsers } from "../../utils/users";
import DropdownMenu from "./DropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditUserModal from "./EditUserModal";
import ViewUserModal from "./ViewUserModal";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-600",
  Suspended: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

const UsersTable = () => {
  const searchItem = useOutletContext();
  const [usersData, setUsersData] = useState(users);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const [userToView, setUserToView] = useState(null);

  const [userToEdit, setUserToEdit] = useState(null);
  const [recentlyEditedId, setRecentlyEditedId] = useState(null);

  const [copiedId, setCopiedId] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);

  const handleSaveUser = (updatedUser) => {
    setUsersData((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setRecentlyEditedId(updatedUser.id);

    setTimeout(() => setRecentlyEditedId(null), 800);
    setUserToEdit(null);
  };

  const handleCopyEmail = (userId, email) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          setCopiedId(userId);
          setTimeout(() => setCopiedId(null), 1500);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const confirmDeleteUser = () => {
    setUsersData((prev) => prev.filter((user) => user.id !== userToDelete.id));

    setUserToDelete(null);
    setOpenMenuId(null);
  };

  // Memoized calculation of filtered and sorted users
  // This prevents unnecessary recalculations on each render unless
  // usersData, searchItem, or sortConfig change
  const filteredUsers = useMemo(() => {
    const trimmedQuery = searchItem.trim().toLowerCase();
    const queryWords = trimmedQuery.split(/\s+/);

    // Filter users
    const filtered = usersData.filter((user) => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      const role = user.role.toLowerCase();
      return queryWords.every(
        (word) =>
          name.includes(word) || email.includes(word) || role.includes(word),
      );
    });

    // Sort using your existing sortUsers function
    return sortUsers(filtered, sortConfig.key, sortConfig.direction);
  }, [usersData, searchItem, sortConfig]);

  // Toggles sorting direction for a column and updates the sort configuration
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
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
      <div className="flex items-center justify-between">
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
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    //layout - (keeping in case its needed in the future)
                    initial={{ opacity: 0, y: -10 }} // starting state
                    animate={{
                      opacity: 1,
                      y: 0,
                      backgroundColor:
                        recentlyEditedId === user.id
                          ? "rgba(16, 185, 129, 0.2)"
                          : "transparent",
                    }}
                    exit={{ opacity: 0, y: -10 }} // state when removed
                    transition={{ duration: 0.15 }}
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
                          setOpenMenuId(
                            openMenuId === user.id ? null : user.id,
                          );
                          calculateMenuPosition(user.id);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer"
                        title=""
                      >
                        <MoreVertical className="w-4 h-4 dark:text-white" />
                      </button>
                      {/* Actions Dropdown using React Portal */}
                      {openMenuId === user.id && menuPosition && (
                        <DropdownMenu
                          user={user}
                          position={menuPosition}
                          onClose={() => setOpenMenuId(null)}
                          onView={() => setUserToView(user)}
                          onEdit={() => setUserToEdit(user)}
                          onDelete={() => setUserToDelete(user)}
                          onCopyEmail={handleCopyEmail}
                          copiedId={copiedId}
                        />
                      )}
                    </td>
                  </motion.tr>
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
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <ViewUserModal user={userToView} onClose={() => setUserToView(null)} />
      <EditUserModal
        user={userToEdit}
        onSave={handleSaveUser}
        onCancel={() => setUserToEdit(null)}
      />
      <ConfirmDeleteModal
        user={userToDelete}
        onConfirm={confirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
};

export default UsersTable;
