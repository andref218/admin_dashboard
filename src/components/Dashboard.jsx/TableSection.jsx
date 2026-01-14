import { MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { getStatusColor, topProducts } from "../../constants";
import OrdersTable from "./OrdersTable";
import ProductsTable from "./ProductsTable";

const TableSection = () => {
  return (
    <div className="space-y-6">
      <div>
        {/*Recent Orders Table*/}
        <OrdersTable />
      </div>
    </div>
  );
};

export default TableSection;
