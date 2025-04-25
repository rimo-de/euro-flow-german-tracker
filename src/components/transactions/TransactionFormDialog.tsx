
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import { Transaction, CategoryType } from "@/types/finance";

interface TransactionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  categories: CategoryType[];
  onSubmit: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

export const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  isOpen,
  onOpenChange,
  transaction,
  categories,
  onSubmit,
  onCancel,
  mode,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Transaction" : "Edit Transaction"}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
