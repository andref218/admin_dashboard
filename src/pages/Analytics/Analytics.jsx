import { useOutletContext } from "react-router-dom";
import { analyticsStats, analyticsCharts } from "../../constants/index";
import AnalyticsGrid from "./AnalyticsGrid";
import RevenueVSTargetChart from "./ChartSection/RevenueVSTargetChart";
import TopCountriesChart from "./ChartSection/TopCountriesChart";
import UserActivityAreaChart from "./ChartSection/UserActivityAreaChart";
import ProductsRadarChart from "./ChartSection/ProductsRadarChart";
import OrdersVsPageViewsScatter from "./ChartSection/OrdersVsPageViewsScatterChart";
import ChartSection from "./ChartSection/ChartSection";

const Analytics = () => {
  //Receive text from header input
  const searchItem = useOutletContext()?.toLowerCase() || "";

  if (!searchItem) {
    return (
      <div id="analytics" className="space-y-6">
        <AnalyticsGrid stats={analyticsStats} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RevenueVSTargetChart />
          <div>
            <TopCountriesChart />
          </div>
          <div>
            <UserActivityAreaChart />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ProductsRadarChart />
          </div>
          <div>
            <OrdersVsPageViewsScatter />
          </div>
        </div>
      </div>
    );
  }
  // Global Search: Filter every type of data
  const matchesSearch = (text, search) => {
    const words = search.trim().toLowerCase().split(/\s+/);
    const target = text.toLowerCase();

    return words.every((word) => target.includes(word));
  };

  // Fiter Stats Cards by title of the cards
  const filteredStats = analyticsStats.filter((stat) =>
    matchesSearch(stat.title, searchItem),
  );

  // Filter charts in Chart Section
  const filteredCharts = analyticsCharts.filter((chart) =>
    matchesSearch(chart.name, searchItem),
  );

  const noResults =
    searchItem && filteredStats.length === 0 && filteredCharts.length === 0;

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
    <div id="analytics" className="flex flex-col">
      {filteredStats.length > 0 && (
        <div className="mb-6">
          <AnalyticsGrid stats={filteredStats} />
        </div>
      )}

      {filteredCharts.length > 0 && (
        <div className="mb-6">
          <ChartSection charts={filteredCharts} />
        </div>
      )}
    </div>
  );
};

export default Analytics;
