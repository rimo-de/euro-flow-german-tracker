
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useFinance } from "@/context/FinanceContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction } from "@/types/finance";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Transactions = () => {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleAddTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    addTransaction(transaction);
    setIsAddDialogOpen(false);
  };

  const handleOpenEditDialog = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setCurrentTransaction(transaction);
      setIsEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentTransaction(null);
  };

  const handleUpdateTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    if (currentTransaction) {
      updateTransaction(currentTransaction.id, transaction);
      setIsEditDialogOpen(false);
      setCurrentTransaction(null);
    }
  };

  const handleOpenDeleteDialog = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setCurrentTransaction(transaction);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentTransaction(null);
  };

  const handleDeleteTransaction = () => {
    if (currentTransaction) {
      deleteTransaction(currentTransaction.id);
      setIsDeleteDialogOpen(false);
      setCurrentTransaction(null);
    }
  };

  const handleViewInvoice = (path: string) => {
    // This is a placeholder for invoice viewing functionality
    alert("Invoice viewing will be implemented in a future update");
  };

  return (
    <PageLayout 
      title="Transactions" 
      subtitle="Manage your business transactions"
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-500">
            Total Transactions: <strong>{transactions.length}</strong>
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-finance-highlight hover:bg-finance-highlight/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <TransactionTable
        transactions={transactions}
        categories={categories}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onViewInvoice={handleViewInvoice}
      />

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            categories={categories}
            onSubmit={handleAddTransaction}
            onCancel={handleCloseAddDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {currentTransaction && (
            <TransactionForm
              transaction={currentTransaction}
              categories={categories}
              onSubmit={handleUpdateTransaction}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTransaction}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Transactions;
