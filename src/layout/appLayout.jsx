import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AppLayout = ({
  sideBarCollapsed,
  darkMode,
  setDarkMode,
  toggleSidebar,
}) => {
  const [searchItem, setSearchItem] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSearchItem("");
  }, [location.pathname]);
  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500"
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sideBarCollapsed} toggleSidebar={toggleSidebar} />

        {/* Header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSideBar={toggleSidebar}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode((prev) => !prev)}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
          />
          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <Outlet context={searchItem} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
