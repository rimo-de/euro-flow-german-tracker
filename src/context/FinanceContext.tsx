
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { FinanceContext } from "@/hooks/useFinanceContext";
import { useFinanceData } from "@/hooks/useFinanceData";
import { transactionService } from "@/services/transactionService";
import { categoryService } from "@/services/categoryService";
import type { Transaction, CategoryType } from "@/types/finance";

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { 
    transactions, 
    setTransactions, 
    categories, 
    setCategories, 
    loading 
  } = useFinanceData(user?.id);

  if (!user) {
    return (
      <FinanceContext.Provider
        value={{
          transactions,
          categories,
          addTransaction: async () => {},
          updateTransaction: async () => {},
          deleteTransaction: async () => {},
          addCategory: async () => {},
          updateCategory: async () => {},
          deleteCategory: async () => {},
          loading,
        }}
      >
        {children}
      </FinanceContext.Provider>
    );
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        addTransaction: (transaction) => 
          transactionService.add(transaction, user.id, setTransactions),
        updateTransaction: (id, transaction) =>
          transactionService.update(id, transaction, user.id, setTransactions),
        deleteTransaction: (id) => 
          transactionService.delete(id, setTransactions),
        addCategory: (category) =>
          categoryService.add(category, user.id, setCategories),
        updateCategory: (id, category) =>
          categoryService.update(id, category, setCategories),
        deleteCategory: (id) =>
          categoryService.delete(id, setCategories),
        loading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export { useFinance } from "@/hooks/useFinanceContext";
