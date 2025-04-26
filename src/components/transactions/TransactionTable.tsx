
import React, { useState } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { TransactionSearch } from "./TransactionSearch";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: CategoryType[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewInvoice?: (path: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  onViewInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        getCategoryName(transaction.categoryId).toLowerCase().includes(searchLower) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <TransactionSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TransactionTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionTableRow
                  key={transaction.id}
                  transaction={transaction}
                  getCategoryName={getCategoryName}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewInvoice={onViewInvoice}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
