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
import { useOutletContext } from "react-router-dom";

const DashboardCalendar = () => {
  const searchItem = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const calendarRef = useRef(null);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    const currentEvent = events.find((e) => String(e.id) === String(event.id));
    if (!currentEvent) return;
    const normalizedEvent = {
      id: event.id,
      title: event.title,
      start: event.start ? new Date(event.start) : new Date(),
      end: event.end ? new Date(event.end) : new Date(event.start),
      color: event.backgroundColor || event.color,
    };
    setSelectedEvent(normalizedEvent);
    setDropdownPosition({ top: jsEvent.clientY, left: jsEvent.clientX });
  };

  //Opens the view modal with the selected event details.
  const handleView = () => {
    if (!selectedEvent) return;

    const currentEvent = events.find(
      (e) => String(e.id) === String(selectedEvent.id),
    );
    if (!currentEvent) return;

    setViewItem(currentEvent);
    setDropdownPosition(null);
  };

  //Prepares the selected event data and opens the edit modal.
  //Always reads from the React state to ensure the latest data
  //(important after drag & drop).
  const handleEdit = () => {
    if (!selectedEvent) return;

    const currentEvent = events.find(
      (e) => String(e.id) === String(selectedEvent.id),
    );
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

    setSelectedEvent(currentEvent);
    setDropdownPosition(null);
  };

  //Opens the delete confirmation modal for the selected event.
  const handleDelete = () => {
    if (!selectedEvent) return;

    const currentEvent = events.find(
      (e) => String(e.id) === String(selectedEvent.id),
    );
    if (!currentEvent) return;

    setDeleteItem(currentEvent);
    setDropdownPosition(null);
  };

  // One normal click, see event details
  const handleEventClick = (info) => {
    const currentEvent = events.find(
      (e) => String(e.id) === String(info.event.id),
    );
    if (!currentEvent) return;
    const eventObj = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start ? new Date(info.event.start) : new Date(),
      end: info.event.end
        ? new Date(info.event.end)
        : new Date(info.event.start),
      color: info.event.backgroundColor || info.event.color,
    };
    setSelectedEvent(eventObj);

    setViewItem(eventObj);
  };

  // Normal day click, Opens the edit modal to create a new event on the selected day
  const handleDayClick = (info) => {
    const startDate = new Date(info.date);
    const endDate = new Date(info.date);
    if (info.allDay) {
      startDate.setHours(9, 0, 0, 0);
      endDate.setHours(10, 0, 0, 0);
    } else {
      const hour = startDate.getHours();
      const minute = startDate.getMinutes();
      startDate.setHours(hour, minute, 0, 0);
      endDate.setHours(hour + 1, minute, 0, 0);
    }

    const tempEvent = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: "New Event",
      start: startDate,
      end: endDate,
      color: eventColors[Math.floor(Math.random() * eventColors.length)],
      isNew: true,
      _originalStart: startDate,
      _originalEnd: endDate,
    };

    setEditItem({
      ...tempEvent,
      start: startDate.toTimeString().slice(0, 5),
      end: endDate.toTimeString().slice(0, 5),
      date: startDate.toISOString().split("T")[0],
    });
    setSelectedEvent(tempEvent);
  };

  return (
    <div
      className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-6 
    transition-all duration-300 w-full min-w-0 overflow-x-auto"
    >
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
        Dashboard Calendar
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Manage and track all your scheduled events
      </p>
      {isMobile && (
        <div className="flex justify-center gap-2 mb-3">
          {["dayGridMonth", "timeGridWeek", "timeGridDay"].map((view) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                onClick={() => {
                  calendarRef.current.getApi().changeView(view);
                  setCurrentView(view);
                }}
                className={`px-3 py-1 text-sm rounded-md transition-colors
            ${
              isActive
                ? "bg-sky-400/25 text-sky-800 dark:bg-sky-400/25 dark:text-white"
                : "bg-slate-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
              >
                {view === "dayGridMonth"
                  ? "Month"
                  : view === "timeGridWeek"
                    ? "Week"
                    : "Day"}
              </button>
            );
          })}
        </div>
      )}
      <div className="relative ">
        <FullCalendar
          ref={calendarRef}
          eventDidMount={(info) => {
            info.el.addEventListener("contextmenu", (e) => {
              e.preventDefault();
              handleEventRightClick(info.event, e);
            });
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={
            isMobile
              ? {
                  left: "prev,next",
                  center: "title",
                  right: "",
                }
              : {
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }
          }
          //Keeps React state in sync when an event is dragged.
          //* Without this, changes would be lost when editing.
          eventDrop={(info) => {
            const updatedEvent = {
              id: info.event.id,
              title: info.event.title,
              start: info.event.start,
              end: info.event.end,
              color: info.event.backgroundColor || info.event.color,
              extendedProps: {
                ...info.event.extendedProps,
                _originalStart: info.event.start,
                _originalEnd: info.event.end,
              },
            };

            setEvents((prev) =>
              prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
            );
            setSelectedEvent(updatedEvent);
          }}
          events={events.filter((event) =>
            event.title.toLowerCase().includes(searchItem.trim().toLowerCase()),
          )}
          editable={true}
          selectable={true}
          height="700px"
          dayCellClassNames={() =>
            darkMode ? ["text-white"] : ["text-gray-700"]
          }
          eventContent={(arg) => (
            <div
              className="px-2 py-1 rounded-lg text-xs md:text-sm shadow-sm cursor-pointer truncate"
              style={{
                backgroundColor: arg.event.backgroundColor || arg.event.color,
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {arg.event.title}
            </div>
          )}
          eventBackgroundColor={(arg) =>
            arg.event.backgroundColor || arg.event.color
          }
          eventBorderColor={(arg) =>
            arg.event.backgroundColor || arg.event.color
          }
          dayHeaderClassNames={() =>
            darkMode
              ? ["text-white font-medium"]
              : ["text-gray-700 font-medium"]
          }
          dateClick={handleDayClick}
          eventClick={handleEventClick}
        />
        {events.filter(
          (event) =>
            !searchItem ||
            event.title.toLowerCase().includes(searchItem.trim().toLowerCase()),
        ).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg pointer-events-none">
            No events found.
          </div>
        )}
      </div>
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
        onCancel={() => {
          if (editItem?.isTemp) {
            setEvents((prev) => prev.filter((e) => e.id !== editItem.id));
          }
          setEditItem(null);
        }}
        onSave={(updatedItem) => {
          const [startHour, startMin] = (updatedItem.start || "09:00")
            .split(":")
            .map(Number);
          const [endHour, endMin] = (updatedItem.end || "10:00")
            .split(":")
            .map(Number);

          const newStart = new Date(updatedItem._originalStart);
          newStart.setHours(startHour, startMin);

          const newEnd = new Date(updatedItem._originalStart);
          newEnd.setHours(endHour, endMin);

          const finalEvent = {
            id: updatedItem.id,
            title: updatedItem.title || "Untitled",
            start: newStart,
            end: newEnd,
            color: updatedItem.color || "#22c55e",
            extendedProps: {
              _originalStart: newStart,
              _originalEnd: newEnd,
            },
          };

          setEvents((prev) => {
            if (updatedItem.isNew) {
              return [...prev, finalEvent];
            } else {
              return prev.map((e) => (e.id === finalEvent.id ? finalEvent : e));
            }
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
            prev.filter((e) => String(e.id) !== String(deleteItem.id)),
          );
          setDeleteItem(null);
        }}
      />
    </div>
  );
};

export default DashboardCalendar;
