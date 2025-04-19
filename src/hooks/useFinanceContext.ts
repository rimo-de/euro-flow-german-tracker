
import { createContext, useContext } from "react";
import { Transaction, CategoryType } from "@/types/finance";

export type FinanceContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<CategoryType, "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<CategoryType>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  loading: boolean;
};

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
