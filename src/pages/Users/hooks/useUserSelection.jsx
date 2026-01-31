import { useEffect, useState } from "react";

/**
 * Custom hook to manage user selection in a table.
 * Provides selected user IDs, a function to toggle selection,
 * and automatically clears selection when selection mode is disabled.
 */

export const useUserSelection = (selectionMode) => {
  const [selectedUsersIds, setSelectedUsersIds] = useState(new Set());

  const toggleSelection = (userId) => {
    setSelectedUsersIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const clearSelection = () => setSelectedUsersIds(new Set());

  useEffect(() => {
    if (!selectionMode) {
      clearSelection();
    }
  }, [selectionMode]);

  return {
    selectedUsersIds,
    toggleSelection,
    setSelectedUsersIds,
    clearSelection,
  };
};
