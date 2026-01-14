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
    </div>
  );
};

export default DashBoard;
