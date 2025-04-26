
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Transaction } from "@/types/finance";

interface TransactionTableHeaderProps {
  sortField: keyof Transaction;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Transaction) => void;
}

export const TransactionTableHeader: React.FC<TransactionTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  const renderSortIndicator = (field: keyof Transaction) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="inline-block ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="inline-block ml-1 h-4 w-4" />
    );
  };

  const headerClass = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100";

  return (
    <thead className="bg-gray-50">
      <tr>
        <th onClick={() => onSort("date")} className={headerClass}>
          Date {renderSortIndicator("date")}
        </th>
        <th onClick={() => onSort("type")} className={headerClass}>
          Type {renderSortIndicator("type")}
        </th>
        <th className={headerClass}>Category</th>
        <th onClick={() => onSort("description")} className={headerClass}>
          Description {renderSortIndicator("description")}
        </th>
        <th onClick={() => onSort("amount")} className={headerClass}>
          Amount (Net) {renderSortIndicator("amount")}
        </th>
        <th onClick={() => onSort("vat")} className={headerClass}>
          VAT (19%) {renderSortIndicator("vat")}
        </th>
        <th onClick={() => onSort("totalAmount")} className={headerClass}>
          Total (Gross) {renderSortIndicator("totalAmount")}
        </th>
        <th className={headerClass}>Actions</th>
      </tr>
    </thead>
  );
};
