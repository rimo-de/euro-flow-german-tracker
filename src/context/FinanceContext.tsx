
import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { mockCategories, mockTransactions } from "@/data/mockData";
import { generateId } from "@/utils/financeUtils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type FinanceContextType = {
  transactions: Transaction[];
  categories: CategoryType[];
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<CategoryType, "id">) => void;
  updateCategory: (id: string, category: Partial<CategoryType>) => void;
  deleteCategory: (id: string) => void;
  loading: boolean;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load data when user changes
  useEffect(() => {
    console.log("FinanceContext: User state changed", user?.email);
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    
    try {
      if (user) {
        console.log("FinanceContext: Loading real data for user", user.email);
        // Here you would fetch data from Supabase
        // Since we don't have the tables set up yet, we'll use mock data
        // In a real app, you would replace this with Supabase queries
        
        // For now we'll simulate data persistence by using mock data
        setTransactions(mockTransactions);
        setCategories(mockCategories);
      } else {
        console.log("FinanceContext: No user, using empty data");
        setTransactions([]);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error loading finance data:", error);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your financial data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In a real app, you would save to Supabase here
    // For example:
    // await supabase.from('transactions').insert(newTransaction)
    
    setTransactions((prev) => [newTransaction, ...prev]);
    
    toast({
      title: "Transaction added",
      description: "Your transaction has been successfully added.",
    });
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    // In a real app, you would update in Supabase here
    // For example:
    // await supabase.from('transactions').update(transaction).eq('id', id)
    
    setTransactions((prev) => 
      prev.map((t) => 
        t.id === id 
          ? { ...t, ...transaction, updatedAt: new Date() } 
          : t
      )
    );
    
    toast({
      title: "Transaction updated",
      description: "Your transaction has been successfully updated.",
    });
  };

  const deleteTransaction = (id: string) => {
    // In a real app, you would delete from Supabase here
    // For example:
    // await supabase.from('transactions').delete().eq('id', id)
    
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted.",
    });
  };

  const addCategory = (category: Omit<CategoryType, "id">) => {
    const newCategory: CategoryType = {
      ...category,
      id: generateId(),
    };
    
    // In a real app, you would save to Supabase here
    // For example:
    // await supabase.from('categories').insert(newCategory)
    
    setCategories((prev) => [...prev, newCategory]);
    
    toast({
      title: "Category added",
      description: "Your category has been successfully added.",
    });
  };

  const updateCategory = (id: string, category: Partial<CategoryType>) => {
    // In a real app, you would update in Supabase here
    // For example:
    // await supabase.from('categories').update(category).eq('id', id)
    
    setCategories((prev) => 
      prev.map((c) => 
        c.id === id 
          ? { ...c, ...category } 
          : c
      )
    );
    
    toast({
      title: "Category updated",
      description: "Your category has been successfully updated.",
    });
  };

  const deleteCategory = (id: string) => {
    // In a real app, you would delete from Supabase here
    // For example:
    // await supabase.from('categories').delete().eq('id', id)
    
    setCategories((prev) => prev.filter((c) => c.id !== id));
    
    toast({
      title: "Category deleted",
      description: "Your category has been successfully deleted.",
    });
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
        loading,
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
