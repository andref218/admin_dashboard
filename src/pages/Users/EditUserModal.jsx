import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const statusOptions = ["Active", "Suspended", "Pending"];
const roleOptions = ["Admin", "User", "Moderator"];

const EditUserModal = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...user, ...formData });
  };
  return createPortal(
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Edit User
            </h3>

            <div className="flex flex-col gap-3">
              <label className="text-sm text-slate-600 dark:text-slate-400">
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </label>

              <label className="text-sm text-slate-600 dark:text-slate-400">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </label>

              <label className="text-sm text-slate-600 dark:text-slate-400">
                Role
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-600 dark:text-slate-400">
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300
                dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800
                dark:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white
                hover:bg-blue-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root"),
  );
};

export default EditUserModal;
