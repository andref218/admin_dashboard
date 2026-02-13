import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ConfirmDeleteModal
 * Generic confirmation modal for deleting a single item or multiple items.
 *
 * Props:
 * - item: single item to delete
 * - items: array of items to delete
 * - onConfirm: function to call when confirmed
 * - onCancel: function to call when canceled
 */
const ConfirmDeleteModal = ({
  item,
  items,
  itemType = "Item",
  onConfirm,
  onCancel,
}) => {
  // If there's nothing to delete, don't render
  if (!item && (!items || items.length === 0)) return null;

  // Determine how many items are being deleted
  const isMultiple = items && items.length > 0;
  const count = isMultiple ? items.length : 1;

  let itemLabel;
  let itemDisplayName;

  if (isMultiple) {
    itemLabel = `${count} ${itemType}s`;
  } else {
    if (itemType === "Order") {
      itemLabel = "Order";
      itemDisplayName = `#${item.id}`;
    } else if (itemType === "User") {
      itemLabel = "User";
      itemDisplayName = item.name || item.id;
    } else if (itemType === "Product") {
      itemLabel = "Product";
      itemDisplayName = item.name || item.id;
    } else if (itemType === "Customer") {
      itemLabel = "Customer";
      itemDisplayName = item.name || item.id;
    } else if (itemType === "Event") {
      itemLabel = "Event";
      itemDisplayName = item.title;
    } else {
      itemLabel = itemType;
      itemDisplayName = item.id || "item";
    }
  }

  return createPortal(
    <AnimatePresence>
      {(item || isMultiple) && (
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
            w-full max-w-md shadow-xl max-h-[90vh] overflow-hidden overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h3
              className="text-lg font-bold text-slate-800 dark:text-white
            wrap-break-word whitespace-pre-wrap"
            >
              Delete{" "}
              {isMultiple ? itemLabel : `${itemLabel} "${itemDisplayName}"`}
            </h3>

            <p
              className="mt-2 text-sm text-slate-600 dark:text-slate-400
            wrap-break-word whitespace-pre-wrap"
            >
              Are you sure you want to delete{" "}
              <span className="font-extrabold">
                {isMultiple ? itemLabel : itemDisplayName}
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
