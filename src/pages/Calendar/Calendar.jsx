import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { initialEvents } from "../../constants/events";
import ConfirmDeleteModal from "../../modals/ConfirmDeleteModal";
import DropdownMenu from "./DropdownMenu";
import ViewItemModal from "../../modals/ViewItemModal";
import EditItemModal from "../../modals/EditItemModal";

const DashboardCalendar = () => {
  const [events, setEvents] = useState(
    //Dates are converted to Date objects to ensure FullCalendar compatibility
    initialEvents.map((e) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    })),
  );

  //Available colors used when creating new events.
  const eventColors = initialEvents.map((e) => e.color);

  //Reference to the dropdown menu, used to detect outside clicks
  const dropdownRef = useRef(null);

  //Currently selected event
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Dropdown
  const [dropdownPosition, setDropdownPosition] = useState(null);

  // Modals
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // Closes the dropdown menu when clicking outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownPosition &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownPosition]);

  // Observes changes to the document class to react to dark mode toggles
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  //Opens the custom context dropdown when the user right-clicks an event
  const handleEventRightClick = (event, jsEvent) => {
    jsEvent.preventDefault();
    setSelectedEvent(event);
    setDropdownPosition({ top: jsEvent.clientY, left: jsEvent.clientX });
  };

  //Opens the view modal with the selected event details.
  const handleView = () => {
    if (!selectedEvent) return;
    setViewItem(selectedEvent);
    setDropdownPosition(null);
  };

  //Prepares the selected event data and opens the edit modal.
  //Always reads from the React state to ensure the latest data
  //(important after drag & drop).
  const handleEdit = () => {
    if (!selectedEvent) return;

    const currentEvent = events.find((e) => e.id === selectedEvent.id);
    if (!currentEvent) return;

    const startDate =
      currentEvent.start instanceof Date
        ? currentEvent.start
        : new Date(currentEvent.start);
    const endDate =
      currentEvent.end instanceof Date
        ? currentEvent.end
        : new Date(currentEvent.end);

    setEditItem({
      id: currentEvent.id,
      title: currentEvent.title || "",
      start: startDate.toTimeString().slice(0, 5),
      end: endDate.toTimeString().slice(0, 5),
      date: startDate.toISOString().split("T")[0],
      color: currentEvent.color || "#22c55e",
      isNew: false,
      _originalStart: startDate,
      _originalEnd: endDate,
    });

    setDropdownPosition(null);
  };

  //Opens the delete confirmation modal for the selected event.
  const handleDelete = () => {
    if (!selectedEvent) return;

    setDeleteItem({
      id: selectedEvent.id,
      title: selectedEvent.title,
    });

    setDropdownPosition(null);
  };

  // One normal click, see event details
  const handleEventClick = (info) => {
    const eventObj = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    };

    setViewItem(eventObj);
  };

  // Normal day click, Opens the edit modal to create a new event on the selected day
  const handleDayClick = (info) => {
    setEditItem({
      id: Math.random(),
      title: "",
      date: info.dateStr,
      start: "09:00",
      end: "10:00",
      isNew: true,
    });
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 transition-all duration-300">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Dashboard Calendar
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Manage and track all your scheduled events
      </p>
      <FullCalendar
        eventDidMount={(info) => {
          info.el.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            handleEventRightClick(info.event, e);
          });
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        //Keeps React state in sync when an event is dragged.
        //* Without this, changes would be lost when editing.
        eventDrop={(info) => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === info.event.id
                ? {
                    ...e,
                    start: info.event.start,
                    end: info.event.end,
                  }
                : e,
            ),
          );
        }}
        events={events}
        editable={true}
        selectable={true}
        height="700px"
        dayCellClassNames={() =>
          darkMode ? ["text-white"] : ["text-gray-700"]
        }
        eventContent={(arg) => (
          <div
            className="px-2 py-1 rounded-lg text-xs md:text-sm shadow-sm cursor-pointer"
            style={{
              backgroundColor: arg.event.backgroundColor || arg.event.color,
              color: "white",
            }}
          >
            {arg.event.title}
          </div>
        )}
        eventBackgroundColor={(arg) =>
          arg.event.backgroundColor || arg.event.color
        }
        eventBorderColor={(arg) => arg.event.backgroundColor || arg.event.color}
        dayHeaderClassNames={() =>
          darkMode ? ["text-white font-medium"] : ["text-gray-700 font-medium"]
        }
        dateClick={handleDayClick}
        eventClick={handleEventClick}
      />
      <DropdownMenu
        item={selectedEvent}
        ref={dropdownRef}
        position={dropdownPosition}
        onClose={() => setDropdownPosition(null)}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ViewItemModal
        item={viewItem}
        onClose={() => setViewItem(null)}
        fields={[
          { name: "title", label: "Title" },
          {
            name: "date",
            label: "Date",
            value:
              viewItem?.start instanceof Date
                ? viewItem.start.toISOString().split("T")[0]
                : "",
          },
          {
            name: "start",
            label: "Start",
            value:
              viewItem?.start instanceof Date
                ? viewItem.start.toTimeString().slice(0, 5)
                : "",
          },
          {
            name: "end",
            label: "End",
            value:
              viewItem?.end instanceof Date
                ? viewItem.end.toTimeString().slice(0, 5)
                : "",
          },
        ]}
      />

      <EditItemModal
        item={editItem}
        fields={[
          { name: "title", label: "Title", type: "text" },
          { name: "start", label: "Start Time", type: "time" },
          { name: "end", label: "End Time", type: "time" },
        ]}
        onCancel={() => setEditItem(null)}
        onSave={(updatedItem) => {
          let baseDate;

          if (updatedItem.isNew) {
            // New event → use the selected day from the calendar
            const [year, month, day] = updatedItem.date.split("-").map(Number);

            baseDate = new Date(year, month - 1, day);
          } else {
            // Existing event → keep the original dragged date
            baseDate = new Date(updatedItem._originalStart);
          }

          const [startHour, startMin] = (updatedItem.start || "09:00")
            .split(":")
            .map(Number);
          const [endHour, endMin] = (updatedItem.end || "10:00")
            .split(":")
            .map(Number);

          const newStart = new Date(baseDate);
          newStart.setHours(startHour, startMin);

          const newEnd = new Date(baseDate);
          newEnd.setHours(endHour, endMin);

          const finalEvent = {
            id: updatedItem.id,
            title: updatedItem.title || "Untitled",
            start: newStart,
            end: newEnd,
            color: updatedItem.isNew
              ? eventColors[Math.floor(Math.random() * eventColors.length)] // random existing color
              : updatedItem.color || "#22c55e",
          };

          setEvents((prev) => {
            if (updatedItem.isNew) {
              return [...prev, finalEvent];
            }

            return prev.map((e) => (e.id === finalEvent.id ? finalEvent : e));
          });

          setSelectedEvent(finalEvent);
          setEditItem(null);
        }}
      />
      <ConfirmDeleteModal
        item={
          deleteItem ? { id: deleteItem.id, title: deleteItem.title } : null
        }
        itemType="Event"
        onCancel={() => setDeleteItem(null)}
        onConfirm={() => {
          setEvents((prev) =>
            prev.filter((e) => e.id !== Number(deleteItem.id)),
          );
          setDeleteItem(null);
        }}
      />
    </div>
  );
};

export default DashboardCalendar;
