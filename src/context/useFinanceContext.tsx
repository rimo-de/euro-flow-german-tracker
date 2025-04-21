
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { FinanceContextType } from "./financeTypes";
import * as financeActions from "./financeActions";

export const FinanceContext = createContext<FinanceContextType | undefined>(
  undefined
);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(true);
      financeActions
        .loadFinanceData(user.id, setTransactions, setCategories, toast)
        .finally(() => {
          setLoading(false);
        });
    } else {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

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
          financeActions.addTransaction(transaction, user.id, setTransactions, toast),
        updateTransaction: (id, transaction) =>
          financeActions.updateTransaction(id, transaction, user.id, setTransactions, toast),
        deleteTransaction: (id) =>
          financeActions.deleteTransaction(id, setTransactions, toast),
        addCategory: (category) =>
          financeActions.addCategory(category, user.id, setCategories, toast),
        updateCategory: (id, category) =>
          financeActions.updateCategory(id, category, setCategories, toast),
        deleteCategory: (id) =>
          financeActions.deleteCategory(id, setCategories, toast),
        loading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
