
import React from "react";
import { formatCurrency } from "@/utils/financeUtils";

interface TransactionAmountProps {
  amount: number;
  type: "expense" | "revenue";
}

export const TransactionAmount: React.FC<TransactionAmountProps> = ({ amount, type }) => {
  return (
    <span className={type === "expense" ? "text-finance-negative" : "text-finance-positive"}>
      {formatCurrency(amount)}
    </span>
  );
};
