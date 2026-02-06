import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

import { appRoutes } from "./constants/routes";
import AppLayout from "./Layout/AppLayout";

function App() {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(
    () => window.innerWidth < 768,
  );
  // State to track if the user manually toggled the sidebar
  const [userToggledSidebar, setUserToggledSidebar] = useState(false);

  // Function to toggle the sidebar manually
  const toggleSidebar = () => {
    setSideBarCollapsed((prev) => !prev);
    setUserToggledSidebar(true);
  };

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

  // Effect to handle window resize and collapse sidebar automatically
  useEffect(() => {
    const handleResize = () => {
      if (!userToggledSidebar) {
        setSideBarCollapsed(window.innerWidth < 768);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userToggledSidebar]);

  return (
    <Router>
      <Routes>
        {/*Routes with the App Layout (Header & Sidebar)*/}
        <Route
          element={
            <AppLayout
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              sideBarCollapsed={sideBarCollapsed}
              setSideBarCollapsed={setSideBarCollapsed}
              toggleSidebar={toggleSidebar}
            />
          }
        >
          {appRoutes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
        {/*Routes without the App Layout*/}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
