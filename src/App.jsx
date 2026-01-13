import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DashBoard from "./components/Dashboard.jsx/DashBoard";

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

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
            sideBarCollapsed={sideBarCollapsed}
            onToggleSideBar={() => setSideBarCollapsed(!sideBarCollapsed)}
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
