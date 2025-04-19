
import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

type FinanceContextType = {
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

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData);

    } catch (error: any) {
      console.error('Error loading finance data:', error.message);
      toast({
        title: "Error loading data",
        description: "There was a problem loading your financial data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      
      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully added.",
      });
    } catch (error: any) {
      console.error('Error adding transaction:', error.message);
      toast({
        title: "Error adding transaction",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => 
        prev.map(t => t.id === id ? { ...t, ...data } : t)
      );

      toast({
        title: "Transaction updated",
        description: "Your transaction has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating transaction:', error.message);
      toast({
        title: "Error updating transaction",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Transaction deleted",
        description: "Your transaction has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting transaction:', error.message);
      toast({
        title: "Error deleting transaction",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addCategory = async (category: Omit<CategoryType, "id">) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...category,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      
      toast({
        title: "Category added",
        description: "Your category has been successfully added.",
      });
    } catch (error: any) {
      console.error('Error adding category:', error.message);
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Partial<CategoryType>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => 
        prev.map(c => c.id === id ? { ...c, ...data } : c)
      );

      toast({
        title: "Category updated",
        description: "Your category has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Category deleted",
        description: "Your category has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting category:', error.message);
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
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
