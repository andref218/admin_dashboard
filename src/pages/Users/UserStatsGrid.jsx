import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { userStats } from "../../constants/users";

const UserStatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={stat.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-5
            border border-slate-200/60 dark:border-slate-700/60
            transition hover:shadow-md text-center"
          >
            {/*Icon*/}
            <div className={`inline-flex p-3 rounded-lg mb-4 ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            {/*Title */}
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.title}
            </p>
            {/* Value */}
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
              {stat.value}
            </p>
            <div className="flex items-center justify-center gap-1 mt-3">
              <TrendIcon
                className={`w-4 h-4 ${
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-slate-400 ml-1">
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStatsGrid;
