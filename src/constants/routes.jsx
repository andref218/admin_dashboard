import { Navigate } from "react-router-dom";
import DashBoard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Analytics from "../pages/Analytics/Analytics";
import ProductsTable from "../pages/Ecommerce/Products/ProductsTable";
import OrdersTable from "../pages/Ecommerce/Orders/OrdersTable";
import CustomersTable from "../pages/Ecommerce/Customers/CustomersTable";
import DashboardCalendar from "../pages/Calendar/Calendar";

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
  { path: "/e-commerce/customers", element: <CustomersTable /> },
  //Left here for future implementation { path: "/inventory" },
  //Left here for future implementation{ path: "/transactions" },
  //Left here for future implementation{ path: "/messages" },
  { path: "/calendar", element: <DashboardCalendar /> },
  //Left here for future implementation{ path: "/reports" },
  //Left here for future implementation{ path: "/settings" },
];
