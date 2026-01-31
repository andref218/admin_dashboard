import { useState, useMemo } from "react";
import { sortUsers } from "../../../utils/users";
import { ArrowUp, ArrowDown } from "lucide-react";

/**
 * Custom hook to manage filtering and sorting of users.
 * Filters users based on a search query and sorts them by the specified column and direction.
 */

export const useSort = (usersData, searchItem) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // Memoized calculation of filtered and sorted users
  // This prevents unnecessary recalculations on each render unless
  // usersData, searchItem, or sortConfig change
  const filteredUsers = useMemo(() => {
    const trimmedQuery = searchItem.trim().toLowerCase();
    const queryWords = trimmedQuery.split(/\s+/);

    // Filter users
    const filtered = usersData.filter((user) => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      const role = user.role.toLowerCase();
      return queryWords.every(
        (word) =>
          name.includes(word) || email.includes(word) || role.includes(word),
      );
    });

    // Sort using your existing sortUsers function
    return sortUsers(filtered, sortConfig.key, sortConfig.direction);
  }, [usersData, searchItem, sortConfig]);

  // Toggles sorting direction for a column and updates the sort configuration
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Displays the appropriate sort arrow for a column based on the current sort direction
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1" />
    );
  };
  return { sortConfig, handleSort, SortIcon, sortedUsers: filteredUsers };
};
