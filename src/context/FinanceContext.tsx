import React, { useState, useEffect } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { 
  mapSupabaseTransactionToTransaction,
  mapSupabaseCategoryToCategory,
  mapTransactionToSupabase,
  mapCategoryToSupabase 
} from "@/utils/supabaseMappers";
import { FinanceContext, FinanceContextType } from "@/hooks/useFinanceContext";

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
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (categoriesError) throw categoriesError;
      
      const mappedCategories = categoriesData.map(mapSupabaseCategoryToCategory);
      setCategories(mappedCategories);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;
      
      const mappedTransactions = transactionsData.map(mapSupabaseTransactionToTransaction);
      setTransactions(mappedTransactions);

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
      if (!user) throw new Error("User not authenticated");
      
      const supabaseTransaction = mapTransactionToSupabase(transaction, user.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(supabaseTransaction)
        .select()
        .single();

      if (error) throw error;

      const newTransaction = mapSupabaseTransactionToTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      
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
      if (!user) throw new Error("User not authenticated");
      
      const updates: Record<string, any> = {};
      
      if (transaction.date !== undefined) updates.date = transaction.date.toISOString();
      if (transaction.type !== undefined) updates.type = transaction.type;
      if (transaction.categoryId !== undefined) updates.category_id = transaction.categoryId;
      if (transaction.description !== undefined) updates.description = transaction.description;
      if (transaction.amount !== undefined) updates.amount = transaction.amount;
      if (transaction.vat !== undefined) updates.vat = transaction.vat;
      if (transaction.totalAmount !== undefined) updates.total_amount = transaction.totalAmount;
      if (transaction.notes !== undefined) updates.notes = transaction.notes;
      if (transaction.invoicePath !== undefined) updates.invoice_path = transaction.invoicePath;
      if (transaction.recurring !== undefined) updates.recurring = transaction.recurring;
      if (transaction.recurringFrequency !== undefined) updates.recurring_frequency = transaction.recurringFrequency;

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedTransaction = mapSupabaseTransactionToTransaction(data);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
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
      if (!user) throw new Error("User not authenticated");
      
      const supabaseCategory = mapCategoryToSupabase(category, user.id);
      
      const { data, error } = await supabase
        .from('categories')
        .insert(supabaseCategory)
        .select()
        .single();

      if (error) throw error;

      const newCategory = mapSupabaseCategoryToCategory(data);
      setCategories(prev => [...prev, newCategory]);
      
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
      if (!user) throw new Error("User not authenticated");
      
      const updates: Record<string, any> = {};
      
      if (category.name !== undefined) updates.name = category.name;
      if (category.color !== undefined) updates.color = category.color;
      if (category.type !== undefined) {
        updates.type = category.type === "both" ? null : category.type;
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedCategory = mapSupabaseCategoryToCategory(data);
      setCategories(prev => 
        prev.map(c => c.id === id ? updatedCategory : c)
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

export { useFinance } from "@/hooks/useFinanceContext";
