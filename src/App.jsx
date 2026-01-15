import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DashBoard from "./components/Dashboard.jsx/DashBoard";

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Initialize darkMode state from localStorage, defaulting to false if not set
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme === "true" ? true : false;
  });

  // Apply or remove the 'dark' class on <html> and save preference to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handlePageChange = (id) => {
    setCurrentPage(id);
  };
  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500"
    >
      {/* that line makes the content aligned horizontally*/}
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSideBar={() => setSideBarCollapsed(!sideBarCollapsed)}
            onToggleTheme={() => setDarkMode((prev) => !prev)}
            darkMode={darkMode}
          />
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="p-6 space-y-6">
              {currentPage === "dashboard" && <DashBoard />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
