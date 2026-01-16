import { Navigate } from "react-router-dom";
import DashBoard from "../pages/Dashboard.jsx/DashBoard";

export const appRoutes = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/dashboard", element: <DashBoard /> },
  { path: "/analytics" },
  { path: "/users" },
  { path: "/e-commerce" },
  { path: "/inventory" },
  { path: "/transactions" },
  { path: "/messages" },
  { path: "/calendar" },
  { path: "/reports" },
  { path: "/settings" },
];
