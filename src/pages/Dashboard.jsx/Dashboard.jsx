import React from "react";
import StatsGrid from "./StatsGrid";
import ChartSection from "./Chart Section/ChartSection";
import TableSection from "./Table Section/TableSection";
import ActivityFeed from "./ActivityFeed";
import { useOutletContext } from "react-router-dom";
import {
  activities,
  activitiesComponent,
  dashboardCharts,
  dashboardTables,
  stats,
} from "../../constants";

const DashBoard = () => {
  //Receive text from header input
  const searchItem = useOutletContext()?.toLowerCase() || "";

  //If there's no value in input field, shows everything
  if (!searchItem) {
    return (
      <div id="dashboard" className="space-y-6">
        <StatsGrid stats={stats} />
        <ChartSection charts={dashboardCharts} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TableSection tables={dashboardTables} />
          </div>
          <div>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    );
  }

  // Global Search: Filter every type of data

  // Fiter Stats Cards by title of the cards
  const filteredStats = stats.filter((stat) =>
    stat.title.toLowerCase().includes(searchItem.trim().toLowerCase()),
  );

  // Filter charts in Chart Section
  const filteredCharts = dashboardCharts.filter((chart) =>
    chart.name.toLowerCase().includes(searchItem.trim().toLowerCase()),
  );

  // Filter tables in Table Section
  const filteredTables = dashboardTables.filter((table) =>
    table.name.toLowerCase().includes(searchItem.trim().toLowerCase()),
  );

  //Filter Activity Section
  const filteredActivitySection = activitiesComponent.filter((activity) =>
    activity.name.toLowerCase().includes(searchItem.trim().toLowerCase()),
  );

  const noResults =
    searchItem &&
    filteredStats.length === 0 &&
    filteredCharts.length === 0 &&
    filteredTables.length === 0 &&
    filteredActivitySection.length === 0;

  if (noResults) {
    return (
      <div
        className="flex items-center justify-center p-10 bg-white/80 dark:bg-slate-900/80
        rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-slate-500 dark:text-slate-400"
      >
        No stats found
      </div>
    );
  }
  return (
    <div id="dashboard" className="flex flex-col">
      {filteredStats.length > 0 && (
        <div className="mb-6">
          <StatsGrid stats={filteredStats} />
        </div>
      )}

      {filteredCharts.length > 0 && (
        <div className="mb-6">
          <ChartSection charts={filteredCharts} />
        </div>
      )}

      {filteredTables.length > 0 && (
        <div className="mb-6">
          <TableSection tables={filteredTables} />
        </div>
      )}

      {filteredActivitySection.length > 0 && (
        <ActivityFeed activities={activities} />
      )}
    </div>
  );
};

export default DashBoard;
