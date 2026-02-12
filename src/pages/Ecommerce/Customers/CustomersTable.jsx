import { useRef, useState } from "react";
import { customers } from "../../../constants/customers";
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

const CustomersTable = () => {
  const searchItem = useOutletContext();
  const [customersData, setCustomersData] = useState(customers);

  const [customerToView, setCustomerToView] = useState(null);

  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [recentlyEditedId, setRecentlyEditedId] = useState(null);

  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [selectionMode, setSelectionMode] = useState(false);

  const [customersToDelete, setCustomersToDelete] = useState([]);

  const tableContainerRef = useRef(null);

  const {
    selectedIds: selectedCustomerIds,
    toggleSelection,
    setSelectedIds: setSelectedCustomerIds,
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
    setSelectedCustomerIds,
    "tbody tr", // selector for the rows that should be selectable (default: "tbody tr")
    "id", // attribute on the row that contains the unique ID (default: "data-id")
  );

  const { handleSort, SortIcon, sortedData } = useSort(
    customersData,
    searchItem,
    ["id", "name", "email", "phone", "status"],
  );
  const filteredCustomers = sortedData;

  const { openMenuId, menuPosition, toggleMenu, closeMenu } = useDropdownMenu();

  const handleSaveCustomer = (updatedCustomer) => {
    setCustomersData((prev) =>
      prev.map((u) => (u.id === updatedCustomer.id ? updatedCustomer : u)),
    );
    setRecentlyEditedId(updatedCustomer.id);

    setTimeout(() => setRecentlyEditedId(null), 800);
    setCustomerToEdit(null);
  };

  const confirmDeleteCustomer = () => {
    setCustomersData((prev) =>
      prev.filter((customer) => customer.id !== customerToDelete.id),
    );

    setCustomerToDelete(null);
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
            Customers
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage all customers
          </p>
        </div>
        <div className="flex items-center">
          {selectionMode && selectedCustomerIds.size > 0 && (
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

              if (selectedCustomerIds.size === 0) {
                setSelectionMode(false);
                return;
              }

              setCustomersToDelete([...selectedCustomerIds]);
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

              {selectionMode && selectedCustomerIds.size === 0 && (
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

              {selectionMode && selectedCustomerIds.size > 0 && (
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
                    ({selectedCustomerIds.size})
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
                    Customer ID
                    <SortIcon column="id" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("name")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon column="name" />
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
                  onClick={() => handleSort("phone")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer text-right"
                >
                  <div className="flex items-center ">
                    Phone
                    <SortIcon column="phone" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("totalOrders")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Total Orders
                    <SortIcon column="totalOrders" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("totalSpent")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Total Spent
                    <SortIcon column="totalSpent" />
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
                <th
                  onClick={() => handleSort("lastOrder")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Last Order
                    <SortIcon column="lastOrder" />
                  </div>
                </th>

                <th className="p-4 text-sm font-semibold dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <motion.tr
                      key={customer.id}
                      data-id={customer.id}
                      //layout - (keeping in case its needed in the future)
                      initial={{ opacity: 0, y: -10 }} // starting state
                      animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor:
                          recentlyEditedId === customer.id
                            ? "rgba(16, 185, 129, 0.2)"
                            : "transparent",
                      }}
                      exit={{ opacity: 0, y: -10 }} // state when removed
                      transition={{ duration: 0.15 }}
                      className="relative border-b border-slate-200/50 dark:border-slate-700/50
                  hover:bg-slate-100 dark:hover:bg-slate-800/50 transition"
                    >
                      {/* Customer Details */}
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
                                toggleSelection(customer.id);
                              }}
                              whileTap={{ scale: 0.9 }}
                              animate={{
                                backgroundColor: selectedCustomerIds.has(
                                  customer.id,
                                )
                                  ? "#ef4444"
                                  : "transparent",
                                borderColor: selectedCustomerIds.has(
                                  customer.id,
                                )
                                  ? "#ef4444"
                                  : "#94a3b8",
                                scale: selectedCustomerIds.has(customer.id)
                                  ? 1.1
                                  : 1,
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="w-5 h-5 mr-4 flex items-center justify-center rounded border cursor-pointer"
                            >
                              <AnimatePresence>
                                {selectedCustomerIds.has(customer.id) && (
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
                          {/*Id */}
                          <div className="ml-2 text-sm font-medium text-blue-600">
                            #{customer.id}
                          </div>
                        </div>
                      </td>

                      {/* Image and Name */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 max-w-xs">
                        <div className="flex items-center">
                          {/* Image */}
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-6 h-6 rounded-full"
                          />
                          {/* Name */}
                          <div className="ml-2 max-w-30">
                            <span className="block truncate">
                              {customer.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 max-w-xs">
                        <span className="block truncate">{customer.email}</span>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                        <span className="block truncate">{customer.phone}</span>
                      </td>

                      {/* Total Orders */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 max-w-xs">
                        <span className="block truncate">
                          {customer.totalOrders}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="px-6 py-4 text-sm  text-slate-600 dark:text-slate-400 max-w-xs">
                        <span className="block truncate">
                          ${customer.totalSpent}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            customer.status === "Active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : customer.status === "Inactive"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                                : customer.status === "Suspended"
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {customer.createdAt}
                      </td>

                      {/* Last Order */}
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {customer.lastOrder}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          id={`menu-btn-${customer.id}`}
                          onClick={() => toggleMenu(customer.id)}
                          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4 dark:text-white" />
                        </button>

                        {openMenuId === customer.id && menuPosition && (
                          <DropdownMenu
                            customer={customer}
                            position={menuPosition}
                            onClose={closeMenu}
                            onView={() => setCustomerToView(customer)}
                            onEdit={() => setCustomerToEdit(customer)}
                            onDelete={() => setCustomerToDelete(customer)}
                          />
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <div className="w-full flex items-center justify-center py-10 text-slate-500 dark:text-slate-200">
                        No customers found.
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
        item={customerToView}
        fields={[
          { name: "id", label: "Customer ID" },
          { name: "name", label: "Customer" },
          { name: "email", label: "Email" },
          { name: "phone", label: "Items" },
          { name: "totalOrders", label: "Items" },
          { name: "totalSpent", label: "Total ($)" },
          { name: "status", label: "Status" },
          { name: "createdAt", label: "Created At" },
          { name: "lastOrder", label: "Last Order" },
        ]}
        onClose={() => setCustomerToView(null)}
      />
      <EditItemModal
        item={customerToEdit}
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone", type: "text" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Inactive", "Suspended"],
          },
        ]}
        onSave={handleSaveCustomer}
        onCancel={() => setCustomerToEdit(null)}
      />
      <ConfirmDeleteModal
        item={customerToDelete}
        itemType="Customer"
        onConfirm={confirmDeleteCustomer}
        onCancel={() => setCustomerToDelete(null)}
      />
      {customersToDelete.length > 0 && (
        <ConfirmDeleteModal
          items={customersData.filter((p) => customersToDelete.includes(p.id))}
          itemType="Customer"
          onConfirm={() => {
            setCustomersData((prev) =>
              prev.filter((p) => !customersToDelete.includes(p.id)),
            );
            setCustomersToDelete([]);
            setSelectionMode(false);
            setSelectedCustomerIds(new Set());
          }}
          onCancel={() => setCustomersToDelete([])}
        />
      )}
    </div>
  );
};

export default CustomersTable;
