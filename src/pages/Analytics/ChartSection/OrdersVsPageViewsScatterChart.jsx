import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { scatterData } from "../../../constants";

const OrdersVsPageViewsScatter = () => {
  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl
      border border-slate-200/50 dark:border-slate-700/50 p-6 flex flex-col h-169"
    >
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
        Orders vs Page Views
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Compare product categories by page views and orders
      </p>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 0, left: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={
                document.documentElement.classList.contains("dark")
                  ? "#334155"
                  : "#cbd5e1"
              }
              opacity={
                document.documentElement.classList.contains("dark") ? 0.8 : 0.6
              }
            />
            <XAxis
              type="number"
              dataKey="pageViews"
              name="Page Views"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              type="number"
              dataKey="orders"
              name="Orders"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-900/90 p-3 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white">
                      <p className="font-bold" style={{ color: data.color }}>
                        {data.product}
                      </p>
                      <p>Page Views: {data.pageViews}</p>
                      <p>Orders: {data.orders}</p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {scatterData.map((entry) => (
              <Scatter
                key={entry.product}
                name={entry.product}
                data={[entry]}
                fill={entry.color}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="min-w-full bg-white/80 dark:bg-slate-900/80 rounded-2xl dark:border-slate-700/50">
          <thead>
            <tr className="text-left text-sm font-semibold text-slate-600 dark:text-slate-400 dark:border-slate-700/50">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Page Views</th>
              <th className="px-4 py-2">Orders</th>
            </tr>
          </thead>
          <tbody>
            {scatterData.map((entry) => (
              <tr
                key={entry.product}
                className="border-b border-slate-200/50 dark:border-slate-700/50"
              >
                {/* Produto com bolinha colorida */}
                <td className="px-4 py-2 flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-slate-800 dark:text-white">
                    {entry.product}
                  </span>
                </td>

                {/* Page Views */}
                <td className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-white">
                  {entry.pageViews}
                </td>

                {/* Orders */}
                <td className="px-4 py-2 text-sm font-semibold text-slate-800 dark:text-white">
                  {entry.orders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersVsPageViewsScatter;
