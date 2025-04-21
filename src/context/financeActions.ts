
import { supabase } from "@/integrations/supabase/client";
import {
  mapSupabaseTransactionToTransaction,
  mapSupabaseCategoryToCategory,
  mapTransactionToSupabase,
  mapCategoryToSupabase,
} from "@/utils/supabaseMappers";
import { Transaction, CategoryType, TransactionType } from "@/types/finance";

type FinanceContextActions = {
  userId: string;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  categories: CategoryType[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>;
  toast: (args: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
};

export const loadFinanceData = async (
  userId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: FinanceContextActions["toast"]
) => {
  try {
    // Load categories with vat_applicable
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (categoriesError) throw categoriesError;

    const mappedCategories = categoriesData.map((cat) => {
      // Include vatApplicable from vat_applicable column
      return {
        ...mapSupabaseCategoryToCategory(cat),
        vatApplicable: cat.vat_applicable,
      };
    });
    setCategories(mappedCategories);

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
      // Override VAT to 0 if category vat_applicable is false
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
    console.error("Error loading finance data:", error.message);
    toast({
      title: "Error loading data",
      description: "There was a problem loading your financial data.",
      variant: "destructive",
    });
    // To be safe clear on error
    setTransactions([]);
    setCategories([]);
  }
};

export const addTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  userId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  toast: FinanceContextActions["toast"]
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

    // Check VAT applicable for category
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
  toast: FinanceContextActions["toast"]
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

    // Check VAT applicable for category on update
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
  toast: FinanceContextActions["toast"]
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

export const addCategory = async (
  category: Omit<CategoryType, "id"> & { vatApplicable?: boolean },
  userId: string,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: FinanceContextActions["toast"]
) => {
  try {
    const categoryToInsert = { ...category };
    // Map vatApplicable to vat_applicable in DB
    const supabaseCategory = mapCategoryToSupabase(categoryToInsert, userId);
    // Explicitly add vat_applicable column 
    (supabaseCategory as any).vat_applicable = category.vatApplicable ?? true;

    const { data, error } = await supabase
      .from("categories")
      .insert(supabaseCategory)
      .select()
      .single();

    if (error) throw error;

    const newCategoryData = data;
    const newCategory = {
      ...mapSupabaseCategoryToCategory(newCategoryData),
      vatApplicable: newCategoryData.vat_applicable,
    };
    setCategories((prev) => [...prev, newCategory]);

    toast({
      title: "Category added",
      description: "Your category has been successfully added.",
    });
  } catch (error: any) {
    console.error("Error adding category:", error.message);
    toast({
      title: "Error adding category",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  category: Partial<CategoryType> & { vatApplicable?: boolean },
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: FinanceContextActions["toast"]
) => {
  try {
    const updates: Record<string, any> = {};
    if (category.name !== undefined) updates.name = category.name;
    if (category.color !== undefined) updates.color = category.color;
    if (category.type !== undefined) {
      updates.type = category.type === "both" ? null : category.type;
    }
    if (category.vatApplicable !== undefined) {
      updates.vat_applicable = category.vatApplicable;
    }

    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const updatedCategoryData = data;
    const updatedCategory = {
      ...mapSupabaseCategoryToCategory(updatedCategoryData),
      vatApplicable: updatedCategoryData.vat_applicable,
    };
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? updatedCategory : c))
    );

    toast({
      title: "Category updated",
      description: "Your category has been successfully updated.",
    });
  } catch (error: any) {
    console.error("Error updating category:", error.message);
    toast({
      title: "Error updating category",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteCategory = async (
  id: string,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: FinanceContextActions["toast"]
) => {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;

    setCategories((prev) => prev.filter((c) => c.id !== id));

    toast({
      title: "Category deleted",
      description: "Your category has been successfully deleted.",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error.message);
    toast({
      title: "Error deleting category",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

