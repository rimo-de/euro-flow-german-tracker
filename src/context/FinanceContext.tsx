
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { CategoryType, Transaction } from "@/types/finance";
import * as categoryActions from "./actions/categoryActions";
import * as transactionActions from "./actions/transactionActions";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

type FinanceContextType = {
  categories: CategoryType[];
  transactions: Transaction[];
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<CategoryType, "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<CategoryType>) => Promise<void>;
  deleteCategory: (id: string, categoryName?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCategories();
      loadTransactions();
    }
  }, [user]);

  const loadCategories = useCallback(async () => {
    if (user) {
      await categoryActions.loadCategories(user.id, setCategories, toast);
    }
  }, [user]);

  const addCategory = async (category: Omit<CategoryType, "id">) => {
    if (user) {
      await categoryActions.addCategory(category, user.id, setCategories, toast);
    }
  };

  const updateCategory = async (id: string, category: Partial<CategoryType>) => {
    await categoryActions.updateCategory(id, category, setCategories, toast);
  };

  const deleteCategory = async (id: string, categoryName?: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    const name = categoryName || categoryToDelete?.name || "Unknown Category";
    await categoryActions.deleteCategory(id, name, setCategories, toast);
  };

  const loadTransactions = useCallback(async () => {
    if (user) {
      await transactionActions.loadTransactions(user.id, setTransactions, toast);
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (user) {
      await transactionActions.addTransaction(transaction, user.id, setTransactions, toast);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    await transactionActions.updateTransaction(id, transaction, setTransactions, toast);
  };

  const deleteTransaction = async (id: string) => {
    await transactionActions.deleteTransaction(id, setTransactions, toast);
  };

  const value: FinanceContextType = {
    categories,
    transactions,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
