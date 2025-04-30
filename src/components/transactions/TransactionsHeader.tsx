
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

interface TransactionsHeaderProps {
  transactionCount: number;
  onAddClick: () => void;
  onExportClick: () => void;
}

export const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  transactionCount,
  onAddClick,
  onExportClick,
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <p className="text-gray-500">
          Total Transactions: <strong>{transactionCount}</strong>
        </p>
        <Button
          variant="outline"
          onClick={onExportClick}
          className="flex items-center gap-2 hover-scale"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      <Button onClick={onAddClick} className="finance-button">
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  );
};
