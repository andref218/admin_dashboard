import React from "react";
import { topProducts } from "../../../constants";
import { TrendingDown, TrendingUp } from "lucide-react";

const ProductsTable = () => {
  return (
    <div
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border
          border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Top Products
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Best performing products
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
            View all
          </button>
        </div>
      </div>
      {/*Dynamic Data*/}
      <div className="p-6 space-y-4">
        {topProducts.map((product, index) => {
          return (
            <div
              className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-100 
                dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                  {product.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {product.sales} sales
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {product.revenue}
                </p>
                <div className="flex items-center space-x-1 ">
                  {product.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      product.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {product.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsTable;
