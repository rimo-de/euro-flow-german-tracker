
import React from "react";
import { Transaction } from "@/types/finance";
import { formatDate } from "@/utils/financeUtils";
import { TransactionTypeBadge } from "./table/TransactionTypeBadge";
import { RecurringBadge } from "./table/RecurringBadge";
import { TransactionAmount } from "./table/TransactionAmount";
import { TransactionRowActions } from "./table/TransactionRowActions";

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
        <TransactionTypeBadge type={transaction.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getCategoryName(transaction.categoryId)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {transaction.description}
        {transaction.recurring && <RecurringBadge />}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <TransactionAmount amount={transaction.amount} type={transaction.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <TransactionAmount amount={transaction.vat} type={transaction.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <TransactionAmount amount={transaction.totalAmount} type={transaction.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <TransactionRowActions
          onEdit={() => onEdit(transaction.id)}
          onDelete={() => onDelete(transaction.id)}
          onViewInvoice={transaction.invoicePath && onViewInvoice ? () => onViewInvoice(transaction.invoicePath!) : undefined}
          hasInvoice={!!transaction.invoicePath}
        />
      </td>
    </tr>
  );
};
