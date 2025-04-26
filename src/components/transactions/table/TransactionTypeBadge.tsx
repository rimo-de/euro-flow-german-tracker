
import React from "react";
import { cn } from "@/lib/utils";

interface TransactionTypeBadgeProps {
  type: "expense" | "revenue";
}

export const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({ type }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full",
        type === "expense" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
      )}
    >
      {type === "expense" ? "Expense" : "Revenue"}
    </span>
  );
};
