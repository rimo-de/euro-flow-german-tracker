
import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { mockCategories, mockTransactions } from "@/data/mockData";
import { generateId } from "@/utils/financeUtils";

type FinanceContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, "id">) => void;
  updateCategory: (id: string, category: Partial<CategoryType>) => void;
  deleteCategory: (id: string) => void;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Load mock data on mount
  useEffect(() => {
    setTransactions(mockTransactions);
    setCategories(mockCategories);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions((prev) => 
      prev.map((t) => 
        t.id === id 
          ? { ...t, ...transaction, updatedAt: new Date() } 
          : t
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory = (category: Omit<CategoryType, "id">) => {
    const newCategory: CategoryType = {
      ...category,
      id: generateId(),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<CategoryType>) => {
    setCategories((prev) => 
      prev.map((c) => 
        c.id === id 
          ? { ...c, ...category } 
          : c
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
