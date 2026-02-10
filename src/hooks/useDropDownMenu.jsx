import { useState, useEffect } from "react";

/**
 * Generic hook to manage dropdown menus dynamically positioned.
 * Works for any list of items (users, products, orders, etc.)
 *
 * @param {string} buttonPrefix - prefix for button IDs (default: "menu-btn-")
 * @param {string} menuPrefix - prefix for dropdown IDs (default: "menu-dropdown-")
 */
export const useDropdownMenu = (
  buttonPrefix = "menu-btn-",
  menuPrefix = "menu-dropdown-",
) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const calculateMenuPosition = (id) => {
    const button = document.getElementById(`${buttonPrefix}${id}`);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 180; // default menu size, can be adjusted
    const menuHeight = 160;

    let top = rect.bottom + window.scrollY;
    if (top + menuHeight > window.scrollY + window.innerHeight) {
      top = rect.top - menuHeight + window.scrollY;
    }

    let left = rect.left + window.scrollX;
    if (left + menuWidth > window.scrollX + window.innerWidth) {
      left = window.scrollX + window.innerWidth - menuWidth - 8;
    }
    if (left < window.scrollX + 8) {
      left = window.scrollX + 8;
    }

    setMenuPosition({ top, left });
  };

  const openMenu = (id) => setOpenMenuId(id);
  const closeMenu = () => setOpenMenuId(null);

  const toggleMenu = (id) => {
    if (openMenuId === id) {
      closeMenu();
    } else {
      openMenu(id);
      calculateMenuPosition(id);
    }
  };

  // Update position on scroll/resize
  useEffect(() => {
    if (!openMenuId) return;
    const handleScrollResize = () => calculateMenuPosition(openMenuId);
    window.addEventListener("scroll", handleScrollResize, true);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      window.removeEventListener("scroll", handleScrollResize, true);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [openMenuId]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event) => {
      const menu = document.getElementById(`${menuPrefix}${openMenuId}`);
      const button = document.getElementById(`${buttonPrefix}${openMenuId}`);
      if (
        menu &&
        !menu.contains(event.target) &&
        button &&
        !button.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  return {
    openMenuId,
    menuPosition,
    openMenu,
    closeMenu,
    toggleMenu,
    calculateMenuPosition,
  };
};
