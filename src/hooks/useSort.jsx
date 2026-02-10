import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { sortData } from "../utils/sortData";

/**
 * Generic hook to filter and sort tabular data.
 * Works with users, products, orders, etc.
 *
 * @param {Array} data - Array of objects to sort/filter
 * @param {String} search - Search query
 * @param {Array} searchKeys - Object keys to search against
 */
export const useSort = (data = [], search = "", searchKeys = []) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const filteredData = useMemo(() => {
    if (!data.length) return [];

    const trimmedQuery = search.trim().toLowerCase();
    const queryWords = trimmedQuery.split(/\s+/);

    // 🔍 Filter
    const filtered = data.filter((item) =>
      queryWords.every((word) =>
        searchKeys.some((key) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(word),
        ),
      ),
    );

    // ↕️ Sort (delegated to sortData util)
    return sortData(filtered, sortConfig.key, sortConfig.direction);
  }, [data, search, searchKeys, sortConfig]);

  // 🔁 Toggle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 🔼🔽 Sort icon helper
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;

    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 inline" />
    );
  };

  return {
    filteredData,
    sortConfig,
    handleSort,
    SortIcon,
    sortedData: filteredData,
  };
};
