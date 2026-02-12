import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Generic view modal for users, products, or any entity.
 *
 * Props:
 * - item: object to view
 * - fields: array of field configs: { name, label }
 * - onClose: function()
 */
const ViewItemModal = ({ item, fields = [], onClose }) => {
  if (!item) return null;

  return createPortal(
    <AnimatePresence>
      {item && (
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
            className="relative z-10 bg-white dark:bg-slate-900 rounded-xl p-6 w-full 
            max-w-md shadow-xl max-h-[90vh] overflow-hidden overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <h3
              className="text-lg font-bold text-slate-800 dark:text-white mb-4 wrap-break-word 
            whitespace-pre-wrap"
            >
              {item.name || item.title || "Item Details"}
            </h3>

            <div
              className="flex flex-col gap-3 text-slate-700 dark:text-slate-300
          "
            >
              {fields.map((field) => (
                <div key={field.name}>
                  <strong>{field.label}:</strong>
                  <span className="text-sm wrap-break-word whitespace-pre-wrap">
                    {" "}
                    {item[field.name] ?? "-"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 
                hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white cursor-pointer"
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

export default ViewItemModal;
