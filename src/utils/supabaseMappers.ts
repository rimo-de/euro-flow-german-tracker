
import { Transaction, CategoryType, TransactionType } from "@/types/finance";
import { Database } from "@/integrations/supabase/types";

type SupabaseTransaction = Database['public']['Tables']['transactions']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row'];
};

type SupabaseCategory = Database['public']['Tables']['categories']['Row'];

export const mapSupabaseTransactionToTransaction = (st: SupabaseTransaction): Transaction => {
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

export const mapSupabaseCategoryToCategory = (sc: SupabaseCategory): CategoryType => {
  return {
    id: sc.id,
    name: sc.name,
    type: sc.type === "expense" || sc.type === "revenue" ? sc.type : "both",
    color: sc.color || undefined
  };
};

export const mapTransactionToSupabase = (
  t: Omit<Transaction, "id" | "createdAt" | "updatedAt">, 
  userId: string
): Omit<SupabaseTransaction, "id" | "created_at" | "updated_at"> => {
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

export const mapCategoryToSupabase = (
  c: Omit<CategoryType, "id">, 
  userId: string
): Omit<SupabaseCategory, "id" | "created_at" | "updated_at"> => {
  const dbType = c.type === "both" ? null : c.type;
  
  return {
    name: c.name,
    type: dbType,
    color: c.color || null,
    user_id: userId
  };
};
