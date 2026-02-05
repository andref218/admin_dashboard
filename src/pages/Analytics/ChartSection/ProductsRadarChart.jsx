import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { radarDataProducts } from "../../../constants";

const ProductsRadarChart = () => {
  const bestCategory = radarDataProducts.reduce((prev, current) =>
    current.value > prev.value ? current : prev,
  );
  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl
      border border-slate-200/50 dark:border-slate-700/50 p-6 flex flex-col h-169"
    >
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
        Product Performance
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Performance score of different product categories
      </p>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={radarDataProducts}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="category" stroke="#64748b" fontSize={14} />

            <Radar
              name="Performance"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {radarDataProducts.length > 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-200 mt-4">
          Top Performing Category:
          <span className=" ml-1 font-semibold">
            {bestCategory.category}&nbsp;(${bestCategory.value.toLocaleString()}
            )
          </span>
        </p>
      )}
    </div>
  );
};

export default ProductsRadarChart;
