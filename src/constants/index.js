import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";

export const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    badge: "New",
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Analytics",
    submenu: [
      { id: "overview", label: "Overview" },
      { id: "reports", label: "Reports" },
      { id: "insights", label: "Insights" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    count: "1k",
    submenu: [
      { id: "all_users", label: "All Users" },
      { id: "roles", label: "Roles & Permissions" },
      { id: "activity", label: "User Activity" },
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    label: "E-commerce",
    submenu: [
      { id: "products", label: "Products" },
      { id: "orders", label: "Orders" },
      { id: "customers", label: "Customers" },
    ],
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    count: 800,
  },
  {
    id: "transactions",
    icon: CreditCard,
    label: "Transactions",
  },
  {
    id: "messages",
    icon: MessageSquare,
    label: "Messages",
    badge: 12,
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Calendar",
  },
  {
    id: "reports",
    icon: FileText,
    label: "Reports",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
  },
];

export const stats = [
  {
    title: "Total Revenue",
    value: "$124,563",
    change: "+12%",
    trend: "up",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Active Users",
    value: "8,455",
    change: "+30%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Total Orders",
    value: "543",
    change: "+25%",
    trend: "up",
    icon: ShoppingCart,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Page Views",
    value: "45,786",
    change: "-2.1%",
    trend: "down",
    icon: Eye,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    textColor: "text-orange-600 dark:text-orange-400",
  },
];

export const revenueDataChart = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 54000, expenses: 31368 },
  { month: "Mar", revenue: 32112, expenses: 71046 },
  { month: "Apr", revenue: 74233, expenses: 77389 },
  { month: "May", revenue: 59203, expenses: 85800 },
  { month: "Jun", revenue: 94388, expenses: 17368 },
  { month: "Jul", revenue: 11323, expenses: 93971 },
  { month: "Aug", revenue: 54323, expenses: 81988 },
  { month: "Sep", revenue: 34004, expenses: 46739 },
  { month: "Oct", revenue: 58392, expenses: 13290 },
  { month: "Nov", revenue: 69330, expenses: 18259 },
  { month: "Dec", revenue: 21842, expenses: 42907 },
];

export const salesDataChart = [
  { name: "Eletronics", value: 45, color: "#3b82f6" },
  { name: "Clothing", value: 30, color: "#8b5cf6" },
  { name: "Books", value: 15, color: "#10b981" },
  { name: "Other", value: 10, color: "#f59e0b" },
];

export const orders = [
  {
    id: 3487,
    customer: "John Smith",
    product: "Macbook Pro 16",
    amount: "2399",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: 3488,
    customer: "Sara Adams",
    product: "Iphone 14",
    amount: "900",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: 3489,
    customer: "Mike Silver",
    product: "Sony Cable",
    amount: "15",
    status: "cancelled",
    date: "2024-01-15",
  },
  {
    id: 3490,
    customer: "Melanie Louis",
    product: "Gaming Chair",
    amount: "150",
    status: "cancelled",
    date: "2024-01-14",
  },
];

export const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-emerald-400";
    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  }
};
