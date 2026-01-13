import { ChevronDown, Zap } from "lucide-react";
import React, { useState } from "react";
import { menuItems } from "../constants";

const Sidebar = ({ collapsed, onToggle, currentPage, onPageChange }) => {
  return (
    <div
      className={`${
        collapsed ? "w-23" : "w-72"
      } transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80
      backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col
      relative z-10  `}
    >
      {/*Logo*/}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center">
        {/* Fixed Logo */}
        <div
          className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl
      flex items-center justify-center shadow-lg flex-shrink-0"
        >
          <Zap className="w-6 h-6 text-white" />
        </div>

        <div className={`transition-all duration-300 ease-in-out ml-3 flex-1`}>
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

      {/*Navigation Bar*/}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, itemIndex) => {
          return (
            <div key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out cursor-pointer
                ${
                  // Sets button styles based on active state and collapsed sidebar:
                  // active items get gradient; collapsed items center the icon; expanded items align left
                  currentPage === item.id
                    ? collapsed
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/15 w-10 justify-center"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/15 justify-start"
                    : collapsed
                    ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 w-10 justify-center"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 justify-start"
                }
              `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 dark:text-white transition-colors duration-300" />
                  <>
                    {!collapsed && (
                      <div
                        className={`flex items-center gap-2 ml-2 transition-all duration-300 ease-in-out
                    ${
                      collapsed
                        ? "max-w-0 opacity-0 overflow-hidden"
                        : "max-w-50 opacity-100"
                    }
                    `}
                      >
                        <span className="font-medium ml-2 dark:text-white">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.count && (
                          <span
                            className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600
                      dark:text-slate-300 rounded-full "
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                </div>
                {/* Keeping this code to use in the future
                {item.submenu && (
                  <ChevronDown className="w-4 h-4 transition-transformm dark:text-white" />
                )}
                  */}
              </button>
              {/* Sub Menus */}
              <div className="ml-8 mt-2 space-y-1">
                {/* Keeping this code to use in the future
                 {item.submenu?.map((item, itemIndex) => {
                  return (
                    <ul>
                      <li></li>
                      <div className="dark:text-white ml-6 text-sm">
                        {item.label}
                      </div>
                    </ul>
                  );
                })} */}
              </div>
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
