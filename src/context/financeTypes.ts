
import { Transaction, CategoryType } from "@/types/finance";

export type FinanceContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<CategoryType, "id"> & { vatApplicable?: boolean }) => Promise<void>;
  updateCategory: (id: string, category: Partial<CategoryType> & { vatApplicable?: boolean }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  loading: boolean;
};
