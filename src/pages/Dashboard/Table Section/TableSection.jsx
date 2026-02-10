import { MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { getStatusColor, topProducts } from "../../../constants";
import OrdersTable from "./OrdersTable";
import ProductsTable from "./ProductsTable";

const TableSection = ({ tables }) => {
  return (
    <div className="space-y-6">
      {tables.map((table, index) => {
        const TableComponent = table.component;

        return (
          <div key={index}>
            <TableComponent />
          </div>
        );
      })}
    </div>
  );
};

export default TableSection;
