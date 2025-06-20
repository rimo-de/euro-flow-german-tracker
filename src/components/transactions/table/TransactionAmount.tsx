
import React from "react";
import { useAmountFormatter } from "@/hooks/useAmountFormatter";

interface TransactionAmountProps {
  amount: number;
  type: "expense" | "revenue";
}

export const TransactionAmount: React.FC<TransactionAmountProps> = ({ amount, type }) => {
  const { formatAmountWithSettings } = useAmountFormatter();
  
  return (
    <span className={type === "expense" ? "text-finance-negative" : "text-finance-positive"}>
      {formatAmountWithSettings(amount)}
    </span>
  );
};
