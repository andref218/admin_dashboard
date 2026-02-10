import { useEffect, useState } from "react";

/**
 * Generic hook to manage selection in a table or list.
 * Works with any items (users, products, orders, etc.).
 *
 * @param {boolean} selectionMode - whether selection is active
 * @param {function} getId - optional function to get the unique ID of an item (default: item => item.id)
 */
export const useSelection = (selectionMode, getId = (item) => item.id) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Toggle selection of an item by ID
  const toggleSelection = (itemOrId) => {
    const id = typeof itemOrId === "object" ? getId(itemOrId) : itemOrId;

    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Clear selection
  const clearSelection = () => setSelectedIds(new Set());

  // Automatically clear selection if selection mode is disabled
  useEffect(() => {
    if (!selectionMode) clearSelection();
  }, [selectionMode]);

  return {
    selectedIds,
    toggleSelection,
    setSelectedIds,
    clearSelection,
  };
};
