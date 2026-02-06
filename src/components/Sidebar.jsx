import { ChevronDown, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { menuItems } from "../constants";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ collapsed }) => {
  // State for tracking which submenu is currently open
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // State for storing the floating submenu positions {top, left}
  const [submenuPositions, setSubmenuPositions] = useState({});

  // State to control whether the floating submenu should be visible
  const [showFloatingSubmenu, setShowFloatingSubmenu] = useState(false);
  const sidebarRef = useRef(null);

  // Closes any open submenu and hides the floating submenu
  const closeFloatingSubmenu = () => {
    setOpenSubmenu(null);
    setShowFloatingSubmenu(false);
  };

  // Toggles a submenu open/closed and calculates floating position if collapsed
  const toggleSubmenu = (id, event) => {
    if (openSubmenu === id) {
      setOpenSubmenu(null);
      setShowFloatingSubmenu(false);
    } else {
      setOpenSubmenu(id);

      if (collapsed) {
        setShowFloatingSubmenu(true);
        const rect = event.currentTarget.getBoundingClientRect();
        const submenuHeight = 200;
        const submenuWidth = 180;

        let top = rect.top + window.scrollY;
        let left = rect.right;

        const viewportHeight = window.innerHeight;
        if (top + submenuHeight > viewportHeight)
          top = viewportHeight - submenuHeight - 10;
        const viewportWidth = window.innerWidth;
        if (left + submenuWidth > viewportWidth)
          left = viewportWidth - submenuWidth - 10;

        setSubmenuPositions((prev) => ({
          ...prev,
          [id]: { top, left },
        }));
      }
    }
  };
  // Close floating submenu when clicking outside the sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (collapsed && openSubmenu) {
        if (!sidebarRef.current.contains(e.target)) {
          setOpenSubmenu(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed, openSubmenu]);

  // Hide floating submenu whenever the sidebar is collapsed/expanded
  useEffect(() => {
    if (collapsed) {
      setShowFloatingSubmenu(false);
    }
  }, [collapsed]);

  return (
    <div
      ref={sidebarRef}
      className={`${
        collapsed ? "w-23" : "w-72"
      } transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80
      backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col
      relative z-10  `}
    >
      {/*Logo*/}
      <Link to="/dashboard">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center">
          {/* Fixed Logo */}
          <div
            className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl
      flex items-center justify-center shadow-lg shrink-0"
          >
            <Zap className="w-6 h-6 text-white" />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ml-3 flex-1`}
          >
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
        ${collapsed ? "max-h-0 opacity-0" : "max-h-20 opacity-100"}
      `}
            >
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Dash
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/*Navigation Bar*/}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          return (
            <div key={item.id} className="relative">
              {item.submenu ? (
                <button
                  id={`menu-btn-${item.id}`}
                  type="button"
                  onClick={(e) => toggleSubmenu(item.id, e)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out
                    cursor-pointer ${
                      collapsed ? "justify-center w-10" : "justify-start"
                    } text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 dark:text-white transition-colors duration-300" />
                    {!collapsed && (
                      <div className="flex items-center gap-2 ml-2">
                        <span className="font-medium dark:text-white text-sm">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.count && (
                          <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}

                    {!collapsed && item.submenu && (
                      <ChevronDown
                        className={`absolute right-8 w-4 h-4 transition-transform duration-300 ${
                          openSubmenu === item.id ? "rotate-180" : ""
                        } dark:text-white`}
                      />
                    )}
                  </div>
                </button>
              ) : (
                <NavLink
                  key={item.id}
                  onClick={closeFloatingSubmenu}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer ${
                      // Sets button styles based on active state and collapsed sidebar:
                      // active items get gradient; collapsed items center the icon; expanded items align left
                      isActive
                        ? collapsed
                          ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/15 w-10 justify-center"
                          : "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/15 justify-start"
                        : collapsed
                          ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 w-10 justify-center"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 justify-start"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 dark:text-white transition-colors duration-300" />
                    {!collapsed && (
                      <div className="flex items-center gap-2 ml-2">
                        <span className="font-medium dark:text-white text-sm">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.count && (
                          <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </NavLink>
              )}
              {/* Sub Menus */}
              {item.submenu && openSubmenu === item.id && (
                <>
                  {!collapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={sub.path}
                          className={({ isActive }) =>
                            `w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out ${
                              isActive
                                ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/15"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            } ${collapsed ? "justify-center w-10" : "justify-start"}`
                          }
                        >
                          <div className="flex items-center space-x-3 w-full">
                            {sub.icon && (
                              <sub.icon className="w-5 h-5 dark:text-white" />
                            )}

                            {!collapsed && (
                              <span className=" font-medium dark:text-white text-xs ml-2">
                                {sub.label}
                              </span>
                            )}
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                  {/* Collapsed */}
                  <AnimatePresence>
                    {item.submenu &&
                      openSubmenu === item.id &&
                      collapsed &&
                      showFloatingSubmenu &&
                      submenuPositions[item.id] && (
                        <motion.div
                          id={`submenu-${item.id}`}
                          className="fixed flex flex-col bg-white dark:bg-slate-900 p-2 rounded shadow-lg z-50"
                          style={{
                            top: submenuPositions[item.id].top,
                            left: submenuPositions[item.id].left,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.submenu.map((sub) => (
                            <NavLink
                              key={sub.id}
                              to={sub.path}
                              onClick={() => {
                                setTimeout(() => {
                                  closeFloatingSubmenu();
                                }, 800);
                              }}
                              className={({ isActive }) =>
                                `w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out ${
                                  isActive
                                    ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/15"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                } ${collapsed ? "justify-center w-10" : "justify-start"}`
                              }
                            >
                              {sub.icon ? (
                                <sub.icon className="w-5 h-5 dark:text-white" />
                              ) : (
                                <span className="w-5 h-5" />
                              )}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/*User Profile*/}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src="./images/profile_pic_cartoon.png"
              alt="user"
              className="w-10 h-10 rounded-full ring-2 ring-blue-500/40 hover:ring-blue-500/80 cursor-pointer duration-300"
            />
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  André Fonseca
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
