import React from "react";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";

const DashBoard = () => {
  return (
    <div className="space-y-6">
      {/*Stats Grid */}
      <StatsGrid />
      {/*Chart Section */}
      <ChartSection />
      {/*Table Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSection />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
