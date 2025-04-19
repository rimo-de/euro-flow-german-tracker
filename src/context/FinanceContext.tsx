
import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define types that match Supabase schema for easier data handling
type SupabaseTransaction = {
  id: string;
  date: string;
  type: "expense" | "revenue";
  category_id: string;
  description: string;
  amount: number;
  vat: number;
  total_amount: number;
  notes?: string | null;
  invoice_path?: string | null;
  recurring?: boolean | null;
  recurring_frequency?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  category?: SupabaseCategory;
};

type SupabaseCategory = {
  id: string;
  name: string;
  type: "expense" | "revenue" | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

// Helper functions to convert between Supabase and app models
const mapSupabaseTransactionToTransaction = (st: SupabaseTransaction): Transaction => {
  return {
    id: st.id,
    date: new Date(st.date),
    type: st.type,
    categoryId: st.category_id,
    description: st.description,
    amount: st.amount,
    vat: st.vat,
    totalAmount: st.total_amount,
    notes: st.notes || undefined,
    invoicePath: st.invoice_path || undefined,
    recurring: st.recurring || false,
    recurringFrequency: st.recurring_frequency as "daily" | "weekly" | "monthly" | "yearly" | undefined,
    createdAt: new Date(st.created_at),
    updatedAt: new Date(st.updated_at)
  };
};

const mapSupabaseCategoryToCategory = (sc: SupabaseCategory): CategoryType => {
  return {
    id: sc.id,
    name: sc.name,
    type: sc.type === "expense" || sc.type === "revenue" ? sc.type : "both",
    color: sc.color || undefined
  };
};

const mapTransactionToSupabase = (t: Omit<Transaction, "id" | "createdAt" | "updatedAt">, userId: string): Omit<SupabaseTransaction, "id" | "created_at" | "updated_at"> => {
  return {
    date: t.date.toISOString(),
    type: t.type,
    category_id: t.categoryId,
    description: t.description,
    amount: t.amount,
    vat: t.vat,
    total_amount: t.totalAmount,
    notes: t.notes || null,
    invoice_path: t.invoicePath || null,
    recurring: t.recurring || false,
    recurring_frequency: t.recurringFrequency || null,
    user_id: userId
  };
};

const mapCategoryToSupabase = (c: Omit<CategoryType, "id">, userId: string): Omit<SupabaseCategory, "id" | "created_at" | "updated_at"> => {
  // Handle "both" by setting to null - our RLS policy will allow this
  const dbType = c.type === "both" ? null : c.type;
  
  return {
    name: c.name,
    type: dbType,
    color: c.color || null,
    user_id: userId
  };
};

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
      
      const mappedCategories = categoriesData.map(mapSupabaseCategoryToCategory);
      setCategories(mappedCategories);

      // Fetch transactions
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
      
      // Convert partial Transaction to partial SupabaseTransaction
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
      
      // Convert partial CategoryType to partial SupabaseCategory
      const updates: Record<string, any> = {};
      
      if (category.name !== undefined) updates.name = category.name;
      if (category.color !== undefined) updates.color = category.color;
      if (category.type !== undefined) {
        // Handle "both" by setting to null in the database
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

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
