import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const ViewUserModal = ({ user, onClose }) => {
  if (!user) return null;

  return createPortal(
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
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
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              User Details
            </h3>

            <div className="flex flex-col gap-3 text-slate-700 dark:text-slate-300">
              <div>
                <strong>Name:</strong> {user.name}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
              <div>
                <strong>Status:</strong> {user.status}
              </div>
              <div>
                <strong>Last Active:</strong> {user.lastActive}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root"),
  );
};

export default ViewUserModal;
