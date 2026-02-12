import { useRef, useState } from "react";
import { orders } from "../../../constants/orders";
import { useOutletContext } from "react-router-dom";
import { MoreVertical, Trash2 } from "lucide-react";
import DropdownMenu from "./DropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDeleteModal from "../../../modals/ConfirmDeleteModal";
import EditItemModal from "../../../modals/EditItemModal";
import ViewItemModal from "../../../modals/ViewItemModal";
import { useSelectionDrag } from "../../../hooks/useSelectionDrag";
import { useSort } from "../../../hooks/useSort";
import { useDropdownMenu } from "../../../hooks/useDropDownMenu";
import { useSelection } from "../../../hooks/useSelection";

const OrdersTable = () => {
  const searchItem = useOutletContext();
  const [ordersData, setOrdersData] = useState(orders);

  const [orderToView, setOrderToView] = useState(null);

  const [orderToEdit, setOrderToEdit] = useState(null);
  const [recentlyEditedId, setRecentlyEditedId] = useState(null);

  const [orderToDelete, setOrderToDelete] = useState(null);

  const [selectionMode, setSelectionMode] = useState(false);

  const [ordersToDelete, setOrdersToDelete] = useState([]);

  const tableContainerRef = useRef(null);

  const {
    selectedIds: selectedOrderIds,
    toggleSelection,
    setSelectedIds: setSelectedOrderIds,
    clearSelection,
  } = useSelection(selectionMode);

  const {
    isDragging,
    dragStart,
    dragCurrent,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useSelectionDrag(
    tableContainerRef,
    selectionMode,
    setSelectedOrderIds,
    "tbody tr", // selector for the rows that should be selectable (default: "tbody tr")
    "id", // attribute on the row that contains the unique ID (default: "data-id")
  );

  const { handleSort, SortIcon, sortedData } = useSort(ordersData, searchItem, [
    "id",
    "customer",
    "email",
  ]);
  const filteedOrders = sortedData;

  const { openMenuId, menuPosition, toggleMenu, closeMenu } = useDropdownMenu();

  const handleSaveOrder = (updatedOrder) => {
    setOrdersData((prev) =>
      prev.map((u) => (u.id === updatedOrder.id ? updatedOrder : u)),
    );
    setRecentlyEditedId(updatedOrder.id);

    setTimeout(() => setRecentlyEditedId(null), 800);
    setOrderToEdit(null);
  };

  const confirmDeleteOrder = () => {
    setOrdersData((prev) =>
      prev.filter((order) => order.id !== orderToDelete.id),
    );

    setOrderToDelete(null);
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
            Orders
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and track all orders
          </p>
        </div>
        <div className="flex items-center">
          {selectionMode && selectedOrderIds.size > 0 && (
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

              if (selectedOrderIds.size === 0) {
                setSelectionMode(false);
                return;
              }

              setOrdersToDelete([...selectedOrderIds]);
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

              {selectionMode && selectedOrderIds.size === 0 && (
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

              {selectionMode && selectedOrderIds.size > 0 && (
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
                    ({selectedOrderIds.size})
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
                  onClick={() => handleSort("id")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Order ID
                    <SortIcon column="id" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("customer")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Customer
                    <SortIcon column="customer" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("email")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer text-right"
                >
                  <div className="flex items-center ">
                    Email
                    <SortIcon column="email" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("items")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer text-right"
                >
                  <div className="flex items-center ">
                    Items
                    <SortIcon column="items" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("total")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Total
                    <SortIcon column="total" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("paymentMethod")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Payment
                    <SortIcon column="paymentMethod" />
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
                  onClick={() => handleSort("createdAt")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon column="createdAt" />
                  </div>
                </th>

                <th className="p-4 text-sm font-semibold dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {filteedOrders.length > 0 ? (
                  filteedOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      data-id={order.id}
                      //layout - (keeping in case its needed in the future)
                      initial={{ opacity: 0, y: -10 }} // starting state
                      animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor:
                          recentlyEditedId === order.id
                            ? "rgba(16, 185, 129, 0.2)"
                            : "transparent",
                      }}
                      exit={{ opacity: 0, y: -10 }} // state when removed
                      transition={{ duration: 0.15 }}
                      className="relative border-b border-slate-200/50 dark:border-slate-700/50
                  hover:bg-slate-100 dark:hover:bg-slate-800/50 transition"
                    >
                      {/* Order */}
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
                                toggleSelection(order.id);
                              }}
                              whileTap={{ scale: 0.9 }}
                              animate={{
                                backgroundColor: selectedOrderIds.has(order.id)
                                  ? "#ef4444"
                                  : "transparent",
                                borderColor: selectedOrderIds.has(order.id)
                                  ? "#ef4444"
                                  : "#94a3b8",
                                scale: selectedOrderIds.has(order.id) ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="w-5 h-5 mr-4 flex items-center justify-center rounded border cursor-pointer"
                            >
                              <AnimatePresence>
                                {selectedOrderIds.has(order.id) && (
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

                          <div className="ml-2 text-sm font-medium text-blue-600">
                            #{order.id}
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {order.customer}
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {order.email}
                      </td>

                      {/* Items */}
                      <td className="px-6 py-4 text-sm  text-slate-600 dark:text-slate-400">
                        {order.items}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        ${order.total.toLocaleString()}
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4 text-sm  text-slate-600 dark:text-slate-400">
                        {order.paymentMethod}
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                                  : order.status === "Processing"
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                                    : order.status === "Paid"
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {order.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          id={`menu-btn-${order.id}`}
                          onClick={() => toggleMenu(order.id)}
                          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4 dark:text-white" />
                        </button>

                        {openMenuId === order.id && menuPosition && (
                          <DropdownMenu
                            order={order}
                            position={menuPosition}
                            onClose={closeMenu}
                            onView={() => setOrderToView(order)}
                            onEdit={() => setOrderToEdit(order)}
                            onDelete={() => setOrderToDelete(order)}
                          />
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="w-full flex items-center justify-center py-10 text-slate-500 dark:text-slate-200">
                        No orders found.
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      <ViewItemModal
        item={orderToView}
        fields={[
          { name: "id", label: "Order ID" },
          { name: "customer", label: "Customer" },
          { name: "email", label: "Email" },
          { name: "items", label: "Items" },
          { name: "total", label: "Total ($)" },
          { name: "paymentMethod", label: "Payment Method" },
          { name: "status", label: "Status" },
          { name: "createdAt", label: "Created At" },
        ]}
        onClose={() => setOrderToView(null)}
      />
      <EditItemModal
        item={orderToEdit}
        fields={[
          { name: "customer", label: "Customer", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "items", label: "Items", type: "number" },
          { name: "total", label: "Total ($)", type: "number" },
          {
            name: "paymentMethod",
            label: "Payment Method",
            type: "select",
            options: ["Credit Card", "PayPal", "Apple Pay", "Google Pay"],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              "Pending",
              "Paid",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ],
          },
        ]}
        onSave={handleSaveOrder}
        onCancel={() => setOrderToEdit(null)}
      />
      <ConfirmDeleteModal
        item={orderToDelete}
        itemType="Order"
        onConfirm={confirmDeleteOrder}
        onCancel={() => setOrderToDelete(null)}
      />
      {ordersToDelete.length > 0 && (
        <ConfirmDeleteModal
          items={ordersData.filter((p) => ordersToDelete.includes(p.id))}
          itemType="Order"
          onConfirm={() => {
            setOrdersData((prev) =>
              prev.filter((p) => !ordersToDelete.includes(p.id)),
            );
            setOrdersToDelete([]);
            setSelectionMode(false);
            setSelectedOrderIds(new Set());
          }}
          onCancel={() => setOrdersToDelete([])}
        />
      )}
    </div>
  );
};

export default OrdersTable;
