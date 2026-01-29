// Converts "lastActive" string into minutes
export const lastActiveToMinutes = (value) => {
  if (!value) return Infinity;
  const [amount, unit] = value.split(" ");
  const n = Number(amount);
  if (unit.startsWith("minute")) return n;
  if (unit.startsWith("hour")) return n * 60;
  if (unit.startsWith("day")) return n * 1440;
  return Infinity;
};

// Sorts users by a key and direction
export const sortUsers = (usersToSort, key, direction = "asc") => {
  if (!key) return usersToSort;

  return [...usersToSort].sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    if (key === "lastActive") {
      aValue = lastActiveToMinutes(aValue);
      bValue = lastActiveToMinutes(bValue);
    } else {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
