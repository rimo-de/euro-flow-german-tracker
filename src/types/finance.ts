
export type TransactionType = "expense" | "revenue";

export type CategoryType = {
  id: string;
  name: string;
  type: TransactionType | "both";
  color?: string;
};

export type Transaction = {
  id: string;
  date: Date;
  type: TransactionType;
  categoryId: string;
  description: string;
  amount: number;
  vat: number;
  totalAmount: number;
  notes?: string;
  invoicePath?: string;
  recurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  vatExempt?: boolean;  // New field to mark a transaction as VAT exempt
  createdAt: Date;
  updatedAt: Date;
};

export type ChartData = {
  name: string;
  revenue?: number;
  expense?: number;
  balance?: number;
};

export type UserRole = "admin" | "accountant" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
