
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
      try {
        await categoryActions.loadCategories(user.id, setCategories, toast);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast({
          title: "Error loading categories",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [user]);

  const addCategory = async (category: Omit<CategoryType, "id">) => {
    if (user) {
      try {
        await categoryActions.addCategory(category, user.id, setCategories, toast);
      } catch (error) {
        console.error("Error adding category:", error);
        toast({
          title: "Error adding category",
          description: "Failed to add category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const updateCategory = async (id: string, category: Partial<CategoryType>) => {
    if (user) {
      try {
        await categoryActions.updateCategory(id, category, setCategories, toast);
      } catch (error) {
        console.error("Error updating category:", error);
        toast({
          title: "Error updating category",
          description: "Failed to update category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const deleteCategory = async (id: string, categoryName?: string) => {
    if (user) {
      try {
        const categoryToDelete = categories.find(c => c.id === id);
        const name = categoryName || categoryToDelete?.name || "Unknown Category";
        await categoryActions.deleteCategory(id, name, setCategories, toast);
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error deleting category",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const loadTransactions = useCallback(async () => {
    if (user) {
      try {
        await transactionActions.loadTransactions(user.id, setTransactions, toast);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast({
          title: "Error loading transactions",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (user) {
      try {
        await transactionActions.addTransaction(transaction, user.id, setTransactions, toast);
      } catch (error) {
        console.error("Error adding transaction:", error);
        toast({
          title: "Error adding transaction",
          description: "Failed to add transaction. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    if (user) {
      try {
        await transactionActions.updateTransaction(id, transaction, user.id, setTransactions, toast);
      } catch (error) {
        console.error("Error updating transaction:", error);
        toast({
          title: "Error updating transaction",
          description: "Failed to update transaction. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete transactions.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate that transaction exists
      const transactionExists = transactions.find(t => t.id === id);
      if (!transactionExists) {
        toast({
          title: "Transaction not found",
          description: "The transaction you're trying to delete doesn't exist.",
          variant: "destructive",
        });
        return;
      }

      await transactionActions.deleteTransaction(id, setTransactions, toast);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error deleting transaction",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
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
