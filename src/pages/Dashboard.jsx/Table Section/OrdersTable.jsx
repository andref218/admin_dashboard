import React from "react";
import { getStatusColor, orders } from "../../../constants";
import { MoreHorizontal } from "lucide-react";

const OrdersTable = () => {
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
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
            View all
          </button>
        </div>
      </div>
      {/*Orders Table*/}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">
                Order ID
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">
                Customer
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">
                Product
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-slate-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              return (
                <tr
                  className="border-b border-slate-200/50 dark:border-slate-700/50
                hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer
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
                      {order.product}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      ${order.amount}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-slate-400 dark:text-white ${getStatusColor(
                        order.status
                      )} font-medium text-xs px-3 py-1 rounded-full`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                      {order.date}
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
