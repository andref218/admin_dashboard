import { Navigate } from "react-router-dom";
import DashBoard from "../pages/Dashboard/DashBoard";
import Users from "../pages/Users/Users";
import Analytics from "../pages/Analytics/Analytics";
import ProductsTable from "../pages/Ecommerce/Products/ProductsTable";
import OrdersTable from "../pages/Ecommerce/Orders/OrdersTable";

export const appRoutes = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/dashboard", element: <DashBoard /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/users", element: <Users /> },
  {
    path: "/e-commerce",
    element: <Navigate to="/e-commerce/products" replace />,
  },
  { path: "/e-commerce/products", element: <ProductsTable /> },
  { path: "/e-commerce/orders", element: <OrdersTable /> },
  { path: "/e-commerce/customers" },
  { path: "/inventory" },
  { path: "/transactions" },
  { path: "/messages" },
  { path: "/calendar" },
  { path: "/reports" },
  { path: "/settings" },
];
