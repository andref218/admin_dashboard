import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil, Trash2, Mail } from "lucide-react";

const DropdownMenu = ({
  order,
  position,
  onClose,
  onView,
  onEdit,
  onDelete,
}) => {
  if (!position) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={order.id}
        id={`menu-dropdown-${order.id}`}
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
            (onClose(), onEdit(order.id));
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100 
          dark:hover:bg-slate-700 dark:text-white cursor-pointer"
        >
          <Pencil className="w-4 h-4" /> Edit Order
        </button>

        <button
          onClick={() => {
            (onClose(), onDelete(order.id));
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-100 
          dark:hover:bg-red-500/20 text-red-600 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Delete Order
        </button>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default DropdownMenu;
