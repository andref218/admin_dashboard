import React from "react";
import { orders } from "../../../constants/orders";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersTable = () => {
  const previewOrders = orders.slice(0, 4);

  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border
      border-slate-200/50 dark:border-slate-700/50 overflow-hidden "
    >
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Recent Orders
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Latest customer orders
            </p>
          </div>
          <Link
            className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
            to="/e-commerce/orders"
          >
            View all
          </Link>
        </div>
      </div>
      {/*Orders Table*/}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-4 text-sm text-slate-500 dark:text-slate-400">
                Order
              </th>
              <th className="text-left p-4  text-sm text-slate-500 dark:text-slate-400">
                Customer
              </th>
              <th className="text-left p-4  text-sm text-slate-500 dark:text-slate-400">
                Total
              </th>
              <th className="text-left p-4  text-sm text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="text-left p-4  text-sm text-slate-500 dark:text-slate-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {previewOrders.map((order, index) => {
              return (
                <tr
                  className="border-b border-slate-200/50 dark:border-slate-700/50
                hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors
                "
                >
                  <td className="p-4" key={index}>
                    <span className="text-sm font-medium text-blue-600">
                      #{order.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      {order.customer}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      ${order.total}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                            : order.status === "Shipped"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400"
                              : order.status === "Processing"
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
                                : order.status === "Paid"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      {order.createdAt}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
