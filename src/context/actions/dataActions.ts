
import { loadTransactions } from "./transactionActions";
import { loadCategories } from "./categoryActions";
import { Transaction, CategoryType } from "@/types/finance";

type ToastFunction = (args: { title: string; description?: string; variant?: "default" | "destructive" }) => void;

export const loadFinanceData = async (
  userId: string,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>,
  toast: ToastFunction
) => {
  await Promise.all([
    loadCategories(userId, setCategories, toast),
    loadTransactions(userId, setTransactions, toast),
  ]);
};
