import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil, Trash2, Mail } from "lucide-react";

const DropdownMenu = ({
  user,
  position,
  onClose,
  onView,
  onEdit,
  onDelete,
  onCopyEmail,
  copiedId,
}) => {
  if (!position) return null;

  return createPortal(
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
          top: position.top,
          left: position.left,
          width: "10rem",
          zIndex: 50,
        }}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
        rounded-lg shadow-lg"
      >
        <button
          onClick={() => {
            onView();
            onClose();
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100 
          dark:hover:bg-slate-700 dark:text-white cursor-pointer"
        >
          <Eye className="w-4 h-4" /> View details
        </button>
        <button
          onClick={() => {
            (onClose(), onEdit(user.id));
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100 
          dark:hover:bg-slate-700 dark:text-white cursor-pointer"
        >
          <Pencil className="w-4 h-4" /> Edit user
        </button>
        <button
          onClick={() => onCopyEmail(user.id, user.email)}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm
        hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {copiedId === user.id ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Copy email
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={() => {
            (onClose(), onDelete(user.id));
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-100 
          dark:hover:bg-red-500/20 text-red-600 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Delete user
        </button>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default DropdownMenu;
