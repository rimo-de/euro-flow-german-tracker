
import React from "react";
import { Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewInvoice?: () => void;
  hasInvoice: boolean;
}

export const TransactionRowActions: React.FC<TransactionRowActionsProps> = ({
  onEdit,
  onDelete,
  onViewInvoice,
  hasInvoice,
}) => {
  return (
    <div className="space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-blue-700"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-red-700"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {hasInvoice && onViewInvoice && (
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-purple-700"
          onClick={onViewInvoice}
        >
          <FileText className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
