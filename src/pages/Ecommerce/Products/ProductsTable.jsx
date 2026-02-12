import { useRef, useState } from "react";
import { products } from "../../../constants/products";
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

const ProductsTable = () => {
  const searchItem = useOutletContext();
  const [productsData, setProductsData] = useState(products);

  const [productToView, setProductToView] = useState(null);

  const [productToEdit, setProductToEdit] = useState(null);
  const [recentlyEditedId, setRecentlyEditedId] = useState(null);

  const [productToDelete, setProductToDelete] = useState(null);

  const [selectionMode, setSelectionMode] = useState(false);

  const [productsToDelete, setProductsToDelete] = useState([]);

  const tableContainerRef = useRef(null);

  const {
    selectedIds: selectedProductIds,
    toggleSelection,
    setSelectedIds: setSelectedProductIds,
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
    setSelectedProductIds,
    "tbody tr", // selector for the rows that should be selectable (default: "tbody tr")
    "id", // attribute on the row that contains the unique ID (default: "data-id")
  );

  const { handleSort, SortIcon, sortedData } = useSort(
    productsData,
    searchItem,
    ["name", "category", "status"],
  );
  const filteredProducts = sortedData;

  const { openMenuId, menuPosition, toggleMenu, closeMenu } = useDropdownMenu();

  const handleSaveProduct = (updatedProduct) => {
    setProductsData((prev) =>
      prev.map((u) => (u.id === updatedProduct.id ? updatedProduct : u)),
    );
    setRecentlyEditedId(updatedProduct.id);

    setTimeout(() => setRecentlyEditedId(null), 800);
    setProductToEdit(null);
  };

  const confirmDeleteProduct = () => {
    setProductsData((prev) =>
      prev.filter((product) => product.id !== productToDelete.id),
    );

    setProductToDelete(null);
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
            Products
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage all products
          </p>
        </div>
        <div className="flex items-center">
          {selectionMode && selectedProductIds.size > 0 && (
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

              if (selectedProductIds.size === 0) {
                setSelectionMode(false);
                return;
              }

              setProductsToDelete([...selectedProductIds]);
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

              {selectionMode && selectedProductIds.size === 0 && (
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

              {selectionMode && selectedProductIds.size > 0 && (
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
                    ({selectedProductIds.size})
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
                  onClick={() => handleSort("name")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Product
                    <SortIcon column="name" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("category")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer"
                >
                  <div className="flex items-center">
                    Category
                    <SortIcon column="category" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("price")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer text-right"
                >
                  <div className="flex items-center ">
                    Price
                    <SortIcon column="price" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("stock")}
                  className="p-4 px-6 text-sm font-semibold dark:text-slate-400 cursor-pointer text-right"
                >
                  <div className="flex items-center ">
                    Stock
                    <SortIcon column="stock" />
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
                    Created
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
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      data-id={product.id}
                      //layout - (keeping in case its needed in the future)
                      initial={{ opacity: 0, y: -10 }} // starting state
                      animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor:
                          recentlyEditedId === product.id
                            ? "rgba(16, 185, 129, 0.2)"
                            : "transparent",
                      }}
                      exit={{ opacity: 0, y: -10 }} // state when removed
                      transition={{ duration: 0.15 }}
                      className="relative border-b border-slate-200/50 dark:border-slate-700/50
                  hover:bg-slate-100 dark:hover:bg-slate-800/50 transition"
                    >
                      {/* Product Details */}
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
                                toggleSelection(product.id);
                              }}
                              whileTap={{ scale: 0.9 }}
                              animate={{
                                backgroundColor: selectedProductIds.has(
                                  product.id,
                                )
                                  ? "#ef4444"
                                  : "transparent",
                                borderColor: selectedProductIds.has(product.id)
                                  ? "#ef4444"
                                  : "#94a3b8",
                                scale: selectedProductIds.has(product.id)
                                  ? 1.1
                                  : 1,
                              }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="w-5 h-5 mr-4 flex items-center justify-center rounded border cursor-pointer"
                            >
                              <AnimatePresence>
                                {selectedProductIds.has(product.id) && (
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
                          {/* Image */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-6 h-6 rounded-full"
                          />
                          {/* Name */}
                          <div className="ml-2 max-w-40">
                            {" "}
                            <span className="block truncate">
                              {product.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-40">
                        <span className="block truncate">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 max-w-10">
                        <span className="block truncate">
                          ${product.price.toLocaleString()}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-10">
                        <span className="block truncate">{product.stock}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "Active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : product.status === "Out of Stock"
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {product.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          id={`menu-btn-${product.id}`}
                          onClick={() => toggleMenu(product.id)}
                          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4 dark:text-white" />
                        </button>

                        {openMenuId === product.id && menuPosition && (
                          <DropdownMenu
                            product={product}
                            position={menuPosition}
                            onClose={closeMenu}
                            onView={() => setProductToView(product)}
                            onEdit={() => setProductToEdit(product)}
                            onDelete={() => setProductToDelete(product)}
                          />
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="w-full flex items-center justify-center py-10 text-slate-500 dark:text-slate-200">
                        No products found.
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
        item={productToView}
        fields={[
          { name: "name", label: "Product Name" },
          { name: "category", label: "Category" },
          { name: "price", label: "Price ($)" },
          { name: "stock", label: "Stock" },
          { name: "status", label: "Status" },
          { name: "createdAt", label: "Created At" },
        ]}
        onClose={() => setProductToView(null)}
      />
      <EditItemModal
        item={productToEdit}
        fields={[
          { name: "name", label: "Product Name", type: "text" },
          { name: "category", label: "Category", type: "text" },
          { name: "price", label: "Price ($)", type: "number" },
          { name: "stock", label: "Stock", type: "number" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Out of Stock", "Pending"],
          },
        ]}
        onSave={handleSaveProduct}
        onCancel={() => setProductToEdit(null)}
      />
      <ConfirmDeleteModal
        item={productToDelete}
        itemType="Product"
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
      {productsToDelete.length > 0 && (
        <ConfirmDeleteModal
          items={productsData.filter((p) => productsToDelete.includes(p.id))}
          itemType="Product"
          onConfirm={() => {
            setProductsData((prev) =>
              prev.filter((p) => !productsToDelete.includes(p.id)),
            );
            setProductsToDelete([]);
            setSelectionMode(false);
            setSelectedProductIds(new Set());
          }}
          onCancel={() => setProductsToDelete([])}
        />
      )}
    </div>
  );
};

export default ProductsTable;
