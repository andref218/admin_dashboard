import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDeleteModal = ({ user, users, onConfirm, onCancel }) => {
  if (!user && (!users || users.length === 0)) return null;

  return createPortal(
    <AnimatePresence>
      {(user || (users && users.length > 0)) && (
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
            className="relative z-10 bg-white dark:bg-slate-900 rounded-xl p-6
            w-full max-w-md shadow-xl"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Delete {users ? "users" : "user"}
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this{" "}
              <span className=" font-extrabold">
                {users ? `${users.length} users` : user.name}
              </span>
              ?
            </p>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              This action cannot be undone.
            </p>

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
                onClick={onConfirm}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white
                hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root"),
  );
};

export default ConfirmDeleteModal;
