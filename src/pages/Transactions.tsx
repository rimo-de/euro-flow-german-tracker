import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import TransactionTable from "@/components/transactions/TransactionTable";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/types/finance";
import { exportTransactions, downloadInvoice } from "@/utils/fileUtils";
import { DeleteTransactionDialog } from "@/components/transactions/DeleteTransactionDialog";
import { ExportTransactionsDialog } from "@/components/transactions/ExportTransactionsDialog";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { TransactionsHeader } from "@/components/transactions/TransactionsHeader";

const Transactions = () => {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [includeInvoices, setIncludeInvoices] = useState(false);

  const handleOpenAddDialog = () => setIsAddDialogOpen(true);
  const handleCloseAddDialog = () => setIsAddDialogOpen(false);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
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

  const handleUpdateTransaction = (transaction: Omit<Transaction, "id">) => {
    if (currentTransaction) {
      updateTransaction(currentTransaction.id, transaction);
      handleCloseEditDialog();
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
      handleCloseDeleteDialog();
    }
  };

  const handleExport = async (startDate?: Date, endDate?: Date) => {
    try {
      await exportTransactions(transactions, includeInvoices, startDate, endDate);
      setShowExportDialog(false);
    } catch (error) {
      console.error("Error exporting transactions:", error);
      // You could add a toast notification here to inform the user of the error
    }
  };

  return (
    <PageLayout 
      title="Transactions" 
      subtitle="Manage your business transactions"
    >
      <TransactionsHeader
        transactionCount={transactions.length}
        onAddClick={handleOpenAddDialog}
        onExportClick={() => setShowExportDialog(true)}
      />

      <TransactionTable
        transactions={transactions}
        categories={categories}
        onEdit={handleOpenEditDialog}
        onDelete={handleOpenDeleteDialog}
        onViewInvoice={downloadInvoice}
      />

      <TransactionFormDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        categories={categories}
        onSubmit={handleAddTransaction}
        onCancel={handleCloseAddDialog}
        mode="add"
      />

      <TransactionFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        transaction={currentTransaction ?? undefined}
        categories={categories}
        onSubmit={handleUpdateTransaction}
        onCancel={handleCloseEditDialog}
        mode="edit"
      />

      <DeleteTransactionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTransaction}
        onCancel={handleCloseDeleteDialog}
      />

      <ExportTransactionsDialog
        isOpen={showExportDialog}
        onOpenChange={setShowExportDialog}
        includeInvoices={includeInvoices}
        onIncludeInvoicesChange={setIncludeInvoices}
        onExport={handleExport}
      />
    </PageLayout>
  );
};

export default Transactions;
