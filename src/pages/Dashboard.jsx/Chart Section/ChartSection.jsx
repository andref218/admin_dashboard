import React from "react";
import RevenueChart from "./RevenueChart";
import SalesChart from "./SalesChart";

const ChartSection = ({ charts }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {charts.map((chart, index) => {
        const ChartComponent = chart.component;
        const colSpanClass =
          chart.name === "Revenue Chart" ? "xl:col-span-2" : "";

        return (
          <div key={index} className={colSpanClass}>
            <ChartComponent />
          </div>
        );
      })}
    </div>
  );
};

export default ChartSection;
