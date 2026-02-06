import { Navigate } from "react-router-dom";
import DashBoard from "../pages/Dashboard.jsx/DashBoard";
import Users from "../pages/Users/Users";
import Analytics from "../pages/Analytics/Analytics";

export const appRoutes = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/dashboard", element: <DashBoard /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/users", element: <Users /> },
  {
    path: "/e-commerce",
    element: <Navigate to="/e-commerce/products" replace />,
  },
  { path: "/e-commerce/products" },
  { path: "/e-commerce/orders" },
  { path: "/e-commerce/customers" },
  { path: "/inventory" },
  { path: "/transactions" },
  { path: "/messages" },
  { path: "/calendar" },
  { path: "/reports" },
  { path: "/settings" },
];
