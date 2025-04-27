
import { useState, useEffect } from "react";
import { Transaction, CategoryType } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseTransactionToTransaction, mapSupabaseCategoryToCategory } from "@/utils/supabaseMappers";
import { toast } from "@/components/ui/use-toast";

export function useFinanceData(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadData();
    } else {
      setTransactions([]);
      setCategories([]);
      setLoading(false);
    }
  }, [userId]);

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

  return {
    transactions,
    setTransactions,
    categories,
    setCategories,
    loading,
  };
}
