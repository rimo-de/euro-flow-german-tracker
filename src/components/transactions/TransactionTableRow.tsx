
import React from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { formatCurrency, formatDate } from "@/utils/financeUtils";
import { Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionTableRowProps {
  transaction: Transaction;
  getCategoryName: (categoryId: string) => string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewInvoice?: (path: string) => void;
}

export const TransactionTableRow: React.FC<TransactionTableRowProps> = ({
  transaction,
  getCategoryName,
  onEdit,
  onDelete,
  onViewInvoice,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            transaction.type === "expense"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {transaction.type === "expense" ? "Expense" : "Revenue"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getCategoryName(transaction.categoryId)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {transaction.description}
        {transaction.recurring && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
            Recurring
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <span
          className={
            transaction.type === "expense"
              ? "text-finance-negative"
              : "text-finance-positive"
          }
        >
          {formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatCurrency(transaction.vat)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <span
          className={
            transaction.type === "expense"
              ? "text-finance-negative"
              : "text-finance-positive"
          }
        >
          {formatCurrency(transaction.totalAmount)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-blue-700"
          onClick={() => onEdit(transaction.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-red-700"
          onClick={() => onDelete(transaction.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        {transaction.invoicePath && onViewInvoice && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-purple-700"
            onClick={() => onViewInvoice(transaction.invoicePath!)}
          >
            <FileText className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );
};
