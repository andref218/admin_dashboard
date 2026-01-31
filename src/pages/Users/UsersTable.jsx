import { useRef, useState } from "react";
import { users } from "../../constants/users";
import { useOutletContext } from "react-router-dom";
import { MoreVertical, Trash2 } from "lucide-react";
import DropdownMenu from "./DropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import EditUserModal from "./modals/EditUserModal";
import ViewUserModal from "./modals/ViewUserModal";
import { useSelectionDrag } from "./hooks/useSelectionDrag";
import { useSort } from "./hooks/useSort";
import { useDropdownMenu } from "./hooks/useDropdownMenu";
import { useUserSelection } from "./hooks/useUserSelection";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-600",
  Suspended: "bg-red-100 text-red-600",
  Pending: "bg-yellow-100 text-yellow-700",
};

const UsersTable = () => {
  const searchItem = useOutletContext();
  const [usersData, setUsersData] = useState(users);

  const [userToView, setUserToView] = useState(null);

  const [userToEdit, setUserToEdit] = useState(null);
  const [recentlyEditedId, setRecentlyEditedId] = useState(null);

  const [copiedId, setCopiedId] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);

  const [selectionMode, setSelectionMode] = useState(false);

  const [usersToDelete, setUsersToDelete] = useState([]);

  const tableContainerRef = useRef(null);

  const {
    selectedUsersIds,
    toggleSelection,
    setSelectedUsersIds,
    clearSelection,
  } = useUserSelection(selectionMode);

  const {
    isDragging,
    dragStart,
    dragCurrent,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useSelectionDrag(tableContainerRef, selectionMode, setSelectedUsersIds);

  const { handleSort, SortIcon, sortedUsers } = useSort(usersData, searchItem);
  const filteredUsers = sortedUsers;

  const { openMenuId, menuPosition, toggleMenu, closeMenu } = useDropdownMenu();

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
    closeMenu();
  };

  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border
     border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-slate-50200/50
       dark:border-slate-700/50 gap-4 sm:gap-0"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Users
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and monitor all registered users
          </p>
        </div>
        <div className="flex items-center">
          {selectionMode && selectedUsersIds.size > 0 && (
            <button
              onClick={clearSelection}
              className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 rounded-lg border border-slate-300 
          dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 sm:mr-4 dark:hover:bg-slate-800 
          transition"
            >
              <motion.span
                key="deselect"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1"
              >
                Deselect all
              </motion.span>
            </button>
          )}
          <button
            onClick={() => {
              if (!selectionMode) {
                setSelectionMode(true);
                return;
              }

              if (selectedUsersIds.size === 0) {
                setSelectionMode(false);
                return;
              }

              setUsersToDelete([...selectedUsersIds]);
            }}
            className="flex items-center gap-2 text-sm cursor-pointer px-4 py-2 rounded-lg border border-slate-300 
          dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 sm:mr-4 dark:hover:bg-slate-800 
          transition"
          >
            <AnimatePresence mode="wait">
              {!selectionMode && (
                <motion.span
                  key="select"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  Select
                </motion.span>
              )}

              {selectionMode && selectedUsersIds.size === 0 && (
                <motion.span
                  key="cancel"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  Cancel
                </motion.span>
              )}

              {selectionMode && selectedUsersIds.size > 0 && (
                <motion.span
                  key="delete"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                  <span className="text-red-500 font-semibold">
                    ({selectedUsersIds.size})
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
      <div className="relative">
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute z-50 pointer-events-none border border-blue-500 bg-blue-500/20 rounded"
              style={{
                left: Math.min(dragStart.x, dragCurrent.x),
                top: Math.min(dragStart.y, dragCurrent.y),
                width: Math.abs(dragStart.x - dragCurrent.x),
                height: Math.abs(dragStart.y - dragCurrent.y),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        {/* Table */}
        <div
          ref={tableContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`overflow-x-auto relative ${
            selectionMode ? "select-none" : ""
          }`}
        >
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
                      data-userid={user.id}
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
                  hover:bg-slate-100 dark:hover:bg-slate-800/50 transition"
                    >
                      {/* User */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">
                        <div className="flex items-center">
                          {selectionMode && (
                            <motion.button
                              type="button"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelection(user.id);
                              }}
                              whileTap={{ scale: 0.9 }}
                              animate={{
                                backgroundColor: selectedUsersIds.has(user.id)
                                  ? "#ef4444"
                                  : "transparent",
                                borderColor: selectedUsersIds.has(user.id)
                                  ? "#ef4444"
                                  : "#94a3b8",
                                scale: selectedUsersIds.has(user.id) ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="w-5 h-5 mr-4 flex items-center justify-center rounded border cursor-pointer"
                            >
                              <AnimatePresence>
                                {selectedUsersIds.has(user.id) && (
                                  <motion.span
                                    key="x"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-xs font-bold text-white pointer-events-none"
                                  >
                                    ✕
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          )}

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
                            toggleMenu(user.id);
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
                            onClose={closeMenu}
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
      {usersToDelete.length > 0 && (
        <ConfirmDeleteModal
          users={usersData.filter((u) => usersToDelete.includes(u.id))}
          onConfirm={() => {
            setUsersData((prev) =>
              prev.filter((u) => !usersToDelete.includes(u.id)),
            );
            setUsersToDelete([]);
            setSelectionMode(false);
            setSelectedUsersIds(new Set());
          }}
          onCancel={() => setUsersToDelete([])}
        />
      )}
    </div>
  );
};

export default UsersTable;
