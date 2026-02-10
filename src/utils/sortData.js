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

// Normalizes different value types to allow reliable and consistent sorting
const normalizeValue = (value, key) => {
  if (value == null) return null;

  if (key === "lastActive") {
    return lastActiveToMinutes(value);
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (!isNaN(value)) {
    return Number(value);
  }

  return String(value).toLowerCase();
};

// Sorts users by a key and direction
export const sortData = (data, key, direction = "asc") => {
  if (!key) return data;

  return [...data].sort((a, b) => {
    const aVal = normalizeValue(a[key], key);
    const bVal = normalizeValue(b[key], key);

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
