import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueDataChart } from "../../../constants";

const RevenueChart = () => {
  const bestMonth = revenueDataChart.reduce((prev, current) =>
    current.revenue > prev.revenue ? current : prev,
  );

  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl
    border border-slate-200/50 dark:border-slate-700/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Revenue Chart
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly revenue and expenses
          </p>
        </div>
        <div className="flex items-center space-x-4 ">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span>Revenue</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-linear-to-r from-slate-400 to-slate-500 rounded-full"></div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span>Expenses</span>
            </div>
          </div>
        </div>
      </div>
      <div className=" h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueDataChart}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              opacity={0.1}
            />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, ""]}
            />
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expenses"
              fill="url(#expensesGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {revenueDataChart.length > 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-200 mt-4">
          Best month for revenue:
          <span className=" ml-1 font-semibold">
            {bestMonth.month}&nbsp;(${bestMonth.revenue.toLocaleString()})
          </span>
        </p>
      )}
    </div>
  );
};

export default RevenueChart;
