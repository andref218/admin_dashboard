import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage dropdown menus dynamically positioned
 * Handles open/close, click outside, scroll & resize.
 */

export const useDropdownMenu = () => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  // Calculates and sets the dropdown menu position so it stays within the viewport boundaries
  const calculateMenuPosition = (buttonId) => {
    const button = document.getElementById(`menu-btn-${buttonId}`);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 160;

    // Vertical position: below the button
    let top = rect.bottom + window.scrollY;

    // If it exceeds the bottom of the viewport, display above the button
    if (top + menuHeight > window.scrollY + window.innerHeight) {
      top = rect.top - menuHeight + window.scrollY;
    }

    // Horizontal position: aligned to the left of the button
    let left = rect.left + window.scrollX;

    // Adjust if it exceeds the right edge of the viewport
    if (left + menuWidth > window.scrollX + window.innerWidth) {
      left = window.scrollX + window.innerWidth - menuWidth - 8; // 8px margin
    }

    // Adjust if it exceeds the left edge of the viewport
    if (left < window.scrollX + 8) {
      left = window.scrollX + 8; // 8px margin
    }

    setMenuPosition({ top, left });
  };

  // Opens a menu by ID
  const openMenu = (id) => setOpenMenuId(id);

  // Closes any open menu
  const closeMenu = () => setOpenMenuId(null);

  // Toggles menu open/close for a given ID
  const toggleMenu = (id) => {
    if (openMenuId === id) {
      closeMenu();
    } else {
      openMenu(id);
      calculateMenuPosition(id);
    }
  };

  // Updates the dropdown menu position on scroll or resize when it's open
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

  // Closes the dropdown menu when clicking outside of it or its button
  useEffect(() => {
    if (!openMenuId) return;

    const handleClickOutside = (event) => {
      const menu = document.getElementById(`menu-dropdown-${openMenuId}`);
      const button = document.getElementById(`menu-btn-${openMenuId}`);
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
