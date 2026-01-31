import { useState } from "react";

/**
 * Hook to handle drag selection on a table
 * Allows selecting multiple rows by dragging a rectangle
 */

export const useSelectionDrag = (
  tableContainerRef,
  selectionMode,
  setSelectedUsersIds,
) => {
  // State to track if the user is currently dragging
  const [isDragging, setIsDragging] = useState(false);

  // Starting point of the drag
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Current point of the drag
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });

  //Handles mouse down event
  //Starts the drag selection
  const handleMouseDown = (e) => {
    if (!selectionMode) return; // do nothing if selection mode is off
    if (e.button !== 0) return; // only respond to left mouse button
    if (!tableContainerRef.current) return;

    const rect = tableContainerRef.current.getBoundingClientRect();

    setIsDragging(true);

    // Account for scroll position
    const scrollTop = tableContainerRef.current.scrollTop;
    const scrollLeft = tableContainerRef.current.scrollLeft;

    // Set the starting drag position
    setDragStart({
      x: e.clientX - rect.left + scrollLeft,
      y: e.clientY - rect.top + scrollTop,
    });

    // Initialize current drag position as same as start
    setDragCurrent({
      x: e.clientX - rect.left + scrollLeft,
      y: e.clientY - rect.top + scrollTop,
    });
  };

  //Handles mouse move event
  //Updates the selection rectangle and selected rows
  const handleMouseMove = (e) => {
    if (!isDragging || !tableContainerRef.current) return;

    const rect = tableContainerRef.current.getBoundingClientRect();

    // Current mouse position relative to table container
    const current = {
      x: e.clientX - rect.left + tableContainerRef.current.scrollLeft,
      y: e.clientY - rect.top + tableContainerRef.current.scrollTop,
    };

    setDragCurrent(current);

    // Define the selection rectangle
    const selectionRect = {
      left: Math.min(dragStart.x, current.x),
      right: Math.max(dragStart.x, current.x),
      top: Math.min(dragStart.y, current.y),
      bottom: Math.max(dragStart.y, current.y),
    };

    // Loop through all table rows and check if they intersect with selection rectangle
    document.querySelectorAll("tbody tr[data-userid]").forEach((row) => {
      const rowRect = row.getBoundingClientRect();
      const containerRect = tableContainerRef.current.getBoundingClientRect();

      // Calculate row's position relative to the container
      const relativeRect = {
        left:
          rowRect.left -
          containerRect.left +
          tableContainerRef.current.scrollLeft,
        right:
          rowRect.right -
          containerRect.left +
          tableContainerRef.current.scrollLeft,
        top:
          rowRect.top - containerRect.top + tableContainerRef.current.scrollTop,
        bottom:
          rowRect.bottom -
          containerRect.top +
          tableContainerRef.current.scrollTop,
      };

      // Check if row intersects with the selection rectangle
      const intersects =
        relativeRect.left < selectionRect.right &&
        relativeRect.right > selectionRect.left &&
        relativeRect.top < selectionRect.bottom &&
        relativeRect.bottom > selectionRect.top;

      // If it intersects, add the row's user ID to selected IDs
      if (intersects) {
        setSelectedUsersIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(row.dataset.userid);
          return newSet;
        });
      }
    });
  };

  //Handles mouse up event
  //Stops the drag selection
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    isDragging, // boolean: whether drag is active
    dragStart, // coordinates of drag start
    dragCurrent, // coordinates of current drag
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
