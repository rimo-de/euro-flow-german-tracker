
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";
import { mapSupabaseTransactionToTransaction, mapTransactionToSupabase } from "@/utils/supabaseMappers";
import { ToastActionElement } from "@/components/ui/toast";

type ToastFunction = (args: { title: string; description?: string; variant?: "default" | "destructive" }) => void;

export const loadTransactions = async (
  userId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  toast: ToastFunction
) => {
  try {
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (transactionsError) throw transactionsError;

    const mappedTransactions = transactionsData.map((tx) => {
      const tr = mapSupabaseTransactionToTransaction(tx);
      if (tx.category && tx.category.vat_applicable === false) {
        return {
          ...tr,
          vat: 0,
          totalAmount: tr.amount,
        };
      }
      return tr;
    });

    setTransactions(mappedTransactions);
  } catch (error: any) {
    console.error("Error loading transactions:", error.message);
    toast({
      title: "Error loading data",
      description: "There was a problem loading your transactions.",
      variant: "destructive",
    });
    setTransactions([]);
  }
};

export const addTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  userId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  toast: ToastFunction
) => {
  try {
    const supabaseTransaction = mapTransactionToSupabase(transaction, userId);
    const { data, error } = await supabase
      .from("transactions")
      .insert(supabaseTransaction)
      .select()
      .single();

    if (error) throw error;

    let newTransaction = mapSupabaseTransactionToTransaction(data);

    const { data: categoryData, error: catError } = await supabase
      .from("categories")
      .select("vat_applicable")
      .eq("id", newTransaction.categoryId)
      .single();

    if (catError) throw catError;

    if (categoryData?.vat_applicable === false) {
      newTransaction = {
        ...newTransaction,
        vat: 0,
        totalAmount: newTransaction.amount,
      };
    }

    setTransactions((prev) => [newTransaction, ...prev]);
    toast({
      title: "Transaction added",
      description: "Your transaction has been successfully added.",
    });
  } catch (error: any) {
    console.error("Error adding transaction:", error.message);
    toast({
      title: "Error adding transaction",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateTransaction = async (
  id: string,
  transaction: Partial<Transaction>,
  userId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  toast: ToastFunction
) => {
  try {
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
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    let updatedTransaction = mapSupabaseTransactionToTransaction(data);

    const { data: categoryData, error: catError } = await supabase
      .from("categories")
      .select("vat_applicable")
      .eq("id", updatedTransaction.categoryId)
      .single();

    if (catError) throw catError;

    if (categoryData?.vat_applicable === false) {
      updatedTransaction = {
        ...updatedTransaction,
        vat: 0,
        totalAmount: updatedTransaction.amount,
      };
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updatedTransaction : t))
    );

    toast({
      title: "Transaction updated",
      description: "Your transaction has been successfully updated.",
    });
  } catch (error: any) {
    console.error("Error updating transaction:", error.message);
    toast({
      title: "Error updating transaction",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteTransaction = async (
  id: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  toast: ToastFunction
) => {
  try {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) throw error;

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted.",
    });
  } catch (error: any) {
    console.error("Error deleting transaction:", error.message);
    toast({
      title: "Error deleting transaction",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};
