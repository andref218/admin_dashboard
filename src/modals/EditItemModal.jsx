import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Generic edit modal for users, products, or any other entity.
 *
 * Props:
 * - item: object to edit
 * - fields: array of field configs: { name, label, type, options? }
 * - onSave: function(updatedItem)
 * - onCancel: function()
 */
const EditItemModal = ({ item, fields = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      const initialData = {};
      fields.forEach((field) => {
        initialData[field.name] = item[field.name] ?? "";
      });
      setFormData(initialData);
    }
  }, [item, fields]);

  if (!item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...item, ...formData });
  };

  return createPortal(
    <AnimatePresence>
      {item && (
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
            className="relative z-10 bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-xl
            max-h-[90vh] overflow-hidden overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <h3
              className="text-lg font-bold text-slate-800 dark:text-white mb-4 wrap-break-word 
            whitespace-pre-wrap"
            >
              {item?.isNew
                ? "Create Event"
                : `Edit ${item?.name || item?.title || "Item"}`}
            </h3>

            <div className="flex flex-col gap-3">
              {fields.map((field) => {
                if (field.type === "select") {
                  return (
                    <label
                      key={field.name}
                      className="text-sm text-slate-600 dark:text-slate-400"
                    >
                      {field.label}
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 pr-8 py-3 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                return (
                  <label
                    key={field.name}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    {field.label}
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
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

export default EditItemModal;
