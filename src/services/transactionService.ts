
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";
import { mapTransactionToSupabase, mapSupabaseTransactionToTransaction } from "@/utils/supabaseMappers";
import { toast } from "@/components/ui/use-toast";

export const transactionService = {
  async add(
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
    userId: string,
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  ) {
    try {
      const supabaseTransaction = mapTransactionToSupabase(transaction, userId);
      
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
  },

  async update(
    id: string,
    transaction: Partial<Transaction>,
    userId: string,
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  ) {
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
      if (transaction.vatExempt !== undefined) updates.vat_exempt = transaction.vatExempt;

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
  },

  async delete(
    id: string,
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  ) {
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
  }
};
